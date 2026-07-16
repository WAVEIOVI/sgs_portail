// Wave VI Supplier Portal - Main Application

import {
  loadPortalData,
  saveProduct as dbSaveProduct,
  deleteProduct as dbDeleteProduct,
  savePurchaseOrder,
  saveDelivery as dbSaveDelivery,
  savePayment as dbSavePayment,
  saveDocument as dbSaveDocument,
  saveSettings as dbSaveSettings,
  exportData,
  importData,
  getNextId,
  getNextPONumber,
  peekNextPONumber,
  downloadJSON,
  downloadAllDataFiles,
  isLocalDevPersistence
} from './dataService.js';
import {
  login,
  logout,
  getSession,
  isAuthenticated,
  isAdmin,
  canWrite,
  canAccessPage
} from './auth.js';

// Application State
const App = {
  data: {
    products: [],
    purchaseOrders: [],
    deliveries: [],
    payments: [],
    documents: [],
    categories: [],
    settings: {}
  },
  currentPage: 'dashboard',
  charts: {},
  theme: 'light'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initializeAuth();
});

function initializeAuth() {
  const loginForm = document.getElementById('loginForm');
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;
    const errorEl = document.getElementById('loginError');

    const session = login(username, password);
    if (!session) {
      errorEl.textContent = 'Invalid username or password.';
      errorEl.classList.remove('d-none');
      // Shake animation
      const card = document.querySelector('.login-card');
      if (card) { card.style.animation = 'none'; card.offsetHeight; card.style.animation = ''; }
      return;
    }

    errorEl.classList.add('d-none');
    bootApp();
  });

  // Both topnav profile and sidebar footer trigger logout
  const logoutAction = () => {
    if (confirm('Sign out?')) {
      logout();
      location.reload();
    }
  };
  document.getElementById('logoutBtn')?.addEventListener('click', logoutAction);
  document.getElementById('logoutTrigger')?.addEventListener('click', logoutAction);

  if (isAuthenticated()) {
    bootApp();
  }
}

async function bootApp() {
  document.getElementById('loginScreen')?.classList.add('d-none');
  document.getElementById('appShell')?.classList.remove('d-none');
  applyRoleUI();

  await loadAllData();
  initializeTheme();
  initializeRouter();
  initializeCommandPalette();
  initializeEventListeners();
  updateLastUpdate();
  updateBreadcrumb(App.currentPage);

  const page = window.location.hash.slice(1) || 'dashboard';
  navigateTo(canAccessPage(page) ? page : 'dashboard');
}

function applyRoleUI() {
  const session = getSession();
  if (!session) return;

  document.getElementById('profileName').textContent = session.displayName;
  document.getElementById('profileRole').textContent = session.roleLabel;
  document.getElementById('profileInitials').textContent = session.initials;
  document.getElementById('sidebarUserName').textContent = session.displayName;
  document.getElementById('sidebarUserRole').textContent = session.roleLabel;

  document.querySelectorAll('.admin-only').forEach(el => {
    el.classList.toggle('hidden-role', !isAdmin());
  });
}

function getLocalDevBanner() {
  if (!isLocalDevPersistence) return '';
  return `<div class="readonly-banner"><i class="fa-solid fa-floppy-disk"></i> Local development — changes save automatically.</div>`;
}

function getReadOnlyBanner() {
  if (canWrite()) return getLocalDevBanner();
  return `<div class="readonly-banner"><i class="fa-solid fa-eye"></i> Read-only access — contact WAVE VI admin to make changes.</div>`;
}

const PAGE_TITLES = {
  dashboard: { icon: 'fa-gauge-high', label: 'Dashboard' },
  products: { icon: 'fa-box-open', label: 'Product Catalog' },
  'purchase-orders': { icon: 'fa-file-invoice', label: 'Purchase Orders' },
  deliveries: { icon: 'fa-truck', label: 'Deliveries' },
  payments: { icon: 'fa-credit-card', label: 'Payments' },
  documents: { icon: 'fa-folder-open', label: 'Documents' },
  settings: { icon: 'fa-gear', label: 'Settings' }
};

function updateBreadcrumb(page) {
  const meta = PAGE_TITLES[page] || PAGE_TITLES.dashboard;
  const el = document.getElementById('topnavBreadcrumb');
  if (el) {
    el.innerHTML = `<i class="fa-solid ${meta.icon} me-2 text-primary-brand"></i><span>${meta.label}</span>`;
  }
}

function normalizeDeliveryStatus(status) {
  if (status === 'preparing') return 'pending';
  if (status === 'partially-delivered') return 'partial';
  return status;
}

function normalizeOrderStatus(status) {
  if (!status) return 'Unknown';
  const s = String(status).toLowerCase().trim();
  if (s === 'draft' || s === 'created') return 'Draft';
  if (s === 'pending' || s === 'preparing') return 'Pending';
  if (s === 'approved') return 'Approved';
  if (s === 'in_production' || s === 'in production' || s === 'in-production' || s === 'production') return 'In Production';
  if (s === 'completed' || s === 'delivered' || s === 'done') return 'Completed';
  if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
  // Fallback: title-case the status string
  return s.split(/[-_ ]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function migratePOFulfillment() {
  for (const po of App.data.purchaseOrders) {
    for (const line of po.lines) {
      if (line.received_qty == null) line.received_qty = 0;
    }
  }

  for (const po of App.data.purchaseOrders) {
    const hasReceived = po.lines.some(l => l.received_qty > 0);
    if (hasReceived) continue;

    const confirmed = App.data.deliveries.filter(d =>
      d.related_po === po.id && ['partial', 'delivered'].includes(normalizeDeliveryStatus(d.status))
    );
    for (const delivery of confirmed) {
      for (const dl of delivery.lines) {
        const pl = po.lines.find(l => l.product_id === dl.product_id);
        if (pl) pl.received_qty = (pl.received_qty || 0) + (dl.delivered_qty || dl.receive_qty || 0);
      }
    }
  }

  for (const payment of App.data.payments) {
    if (payment.amount_paid == null) {
      payment.amount_paid = payment.status === 'paid' ? payment.amount : 0;
    }
  }
}

function getPOFulfillment(po) {
  const lines = po.lines.map(l => {
    const ordered = l.quantity;
    const received = l.received_qty || 0;
    const remaining = Math.max(0, ordered - received);
    return {
      product_id: l.product_id,
      product_name: l.product_name,
      ordered,
      received,
      remaining,
      unit_price_ht: l.unit_price_ht,
      surface_mm2: l.surface_mm2
    };
  });
  const totalOrdered = lines.reduce((s, l) => s + l.ordered, 0);
  const totalReceived = lines.reduce((s, l) => s + l.received, 0);
  const totalRemaining = lines.reduce((s, l) => s + l.remaining, 0);
  const receivedAmount = po.lines.reduce((s, l) => s + (l.received_qty || 0) * l.unit_price_ht, 0);
  const orderedAmount = po.total_ht || 0;
  return {
    lines,
    totalOrdered,
    totalReceived,
    totalRemaining,
    receivedAmount,
    orderedAmount,
    pct: totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0,
    isComplete: totalRemaining === 0,
    hasPartial: totalReceived > 0 && totalRemaining > 0
  };
}

function getLineDeliveryAmount(line) {
  const qty = line.delivered_qty || line.receive_qty || 0;
  return qty * (line.unit_price_ht || 0);
}

function getDeliveryAmount(delivery) {
  if (['partial', 'delivered'].includes(normalizeDeliveryStatus(delivery.status))) {
    if (delivery.amount != null) return delivery.amount;
    return (delivery.lines || []).reduce((sum, l) => sum + getLineDeliveryAmount(l), 0);
  }
  return (delivery.lines || []).reduce((sum, l) => sum + getLineDeliveryAmount(l), 0);
}

function getPaymentRemaining(payment) {
  return Math.max(0, (payment.amount || 0) - (payment.amount_paid || 0));
}

function renderFulfillmentBar(pct, label = 'Fulfillment') {
  return `
    <div class="fulfillment-block">
      <div class="d-flex justify-content-between mb-1">
        <small class="text-muted">${label}</small>
        <small class="fw-semibold">${pct}%</small>
      </div>
      <div class="progress-custom">
        <div class="progress-bar-custom" style="width:${pct}%;background:var(--brand-primary)"></div>
      </div>
    </div>
  `;
}

function createDeliveryFromPO(po) {
  const pending = App.data.deliveries.find(d =>
    d.related_po === po.id && normalizeDeliveryStatus(d.status) === 'pending'
  );
  if (pending) return pending;

  const fulfillment = getPOFulfillment(po);
  if (fulfillment.totalRemaining === 0) return null;

  const deliveryCount = App.data.deliveries.filter(d => d.related_po === po.id).length + 1;
  const suffix = deliveryCount > 1 ? `-${String(deliveryCount).padStart(2, '0')}` : '';

  const lines = fulfillment.lines
    .filter(l => l.remaining > 0)
    .map(l => ({
      product_id: l.product_id,
      product_name: l.product_name,
      ordered_qty: l.ordered,
      remaining_qty: l.remaining,
      receive_qty: l.remaining,
      delivered_qty: 0,
      unit_price_ht: l.unit_price_ht,
      surface_mm2: l.surface_mm2 || 0,
      line_total: l.remaining * l.unit_price_ht
    }));

  return {
    id: getNextId('DEL', 'delivery'),
    delivery_number: `DEL-${po.po_number}${suffix}`,
    related_po: po.id,
    po_number: po.po_number,
    status: 'pending',
    delivery_date: null,
    amount: 0,
    lines,
    documents: [],
    notes: `Auto-created from ${po.po_number}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

async function createPaymentFromDelivery(delivery) {
  const existing = App.data.payments.find(p => p.related_delivery === delivery.id);
  if (existing) return existing;

  const amount = getDeliveryAmount(delivery);
  const payment = {
    id: getNextId('PAY', 'payment'),
    payment_reference: `PAY-${delivery.delivery_number}`,
    related_po: delivery.related_po,
    related_delivery: delivery.id,
    delivery_number: delivery.delivery_number,
    po_number: delivery.po_number,
    payment_method: 'bank-transfer',
    amount,
    amount_paid: 0,
    payment_date: null,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  await dbSavePayment(payment);
  return payment;
}

async function closePOPartial(poId) {
  if (!canWrite()) return;
  const po = App.data.purchaseOrders.find(p => p.id === poId);
  if (!po) return;

  const fulfillment = getPOFulfillment(po);
  if (fulfillment.totalReceived === 0) {
    showToast('Receive at least one delivery before closing partially', 'warning');
    return;
  }

  if (!confirm(`Close PO ${po.po_number} with ${fulfillment.pct}% received? Remaining qty will not be delivered.`)) {
    return;
  }

  po.status = 'completed-partial';
  po.updated_at = new Date().toISOString();
  po.actual_delivery_date = new Date().toISOString().split('T')[0];

  for (const delivery of App.data.deliveries.filter(d =>
    d.related_po === poId && normalizeDeliveryStatus(d.status) === 'pending'
  )) {
    delivery.status = 'cancelled';
    delivery.updated_at = new Date().toISOString();
    await dbSaveDelivery(delivery);
  }

  await savePurchaseOrder(po);
  updateNotifications();
  bootstrap.Modal.getInstance(document.getElementById('poModal'))?.hide();
  renderPage('purchase-orders');
  showToast('PO closed with partial fulfillment', 'success');
}

function updateDeliveryPreviewAmount(deliveryId) {
  const delivery = App.data.deliveries.find(d => d.id === deliveryId);
  if (!delivery) return 0;

  let total = 0;
  delivery.lines.forEach((line, idx) => {
    const input = document.getElementById(`receiveQty_${deliveryId}_${idx}`);
    const qty = parseInt(input?.value) || 0;
    total += qty * (line.unit_price_ht || 0);
    const lineEl = document.getElementById(`lineAmount_${deliveryId}_${idx}`);
    if (lineEl) lineEl.textContent = formatCurrency(qty * (line.unit_price_ht || 0));
  });

  const totalEl = document.getElementById(`deliveryPreviewTotal_${deliveryId}`);
  if (totalEl) totalEl.textContent = formatCurrency(total);
  return total;
}

// Load all data from hosted JSON files
async function loadAllData() {
  try {
    const data = await loadPortalData();
    App.data.products = data.products;
    App.data.purchaseOrders = data.purchaseOrders;
    App.data.deliveries = data.deliveries;
    App.data.payments = data.payments;
    App.data.documents = data.documents;
    App.data.categories = data.categories;
    App.data.settings = data.settings;
    if (App.data.settings.currency === 'MAD') {
      App.data.settings.currency = 'TND';
    }
    App.theme = data.settings.theme || 'light';
    migratePOFulfillment();
    updateNotifications();
    updateSupplierDisplay();
  } catch (error) {
    console.error('Error loading data:', error);
    showToast('Error loading data. Please refresh the page.', 'danger');
  }
}

// Theme Management
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', App.theme);
  updateThemeIcon();
}

async function toggleTheme() {
  App.theme = App.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', App.theme);
  if (isAdmin()) {
    App.data.settings.theme = App.theme;
    await dbSaveSettings(App.data.settings);
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById('themeIcon') || document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = App.theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
}

// Router
function initializeRouter() {
  window.addEventListener('hashchange', () => {
    navigateTo(window.location.hash.slice(1) || 'dashboard');
  });
}

function navigateTo(page) {
  if (!canAccessPage(page)) {
    showToast('You do not have access to this page.', 'warning');
    page = 'dashboard';
  }

  App.currentPage = page;
  window.location.hash = page;

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  updateBreadcrumb(page);
  renderPage(page);
}

// Event Listeners
function initializeEventListeners() {
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    sidebar?.classList.add('mobile-open');
    overlay?.classList.add('show');
  });

  document.getElementById('sidebarClose')?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  document.getElementById('notificationBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notifDropdown')?.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#notificationBtn') && !e.target.closest('#notifDropdown')) {
      document.getElementById('notifDropdown')?.classList.remove('show');
    }
  });

  document.getElementById('refreshData')?.addEventListener('click', async () => {
    showToast('Refreshing data...', 'info');
    await loadAllData();
    renderPage(App.currentPage);
    showToast('Data refreshed successfully', 'success');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) {
        navigateTo(page);
        closeSidebar();
      }
    });
  });
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('mobile-open', 'active');
  document.getElementById('sidebarOverlay')?.classList.remove('show');
}

// Command Palette logic
function initializeCommandPalette() {
  const overlay = document.getElementById('commandPaletteOverlay');
  const input = document.getElementById('commandInput');
  const resultsContainer = document.getElementById('commandResults');

  if (!overlay || !input || !resultsContainer) return;

  let searchResults = [];
  let selectedIndex = -1;

  const togglePalette = (show) => {
    if (show) {
      overlay.classList.remove('d-none');
      // small delay to allow display block before opacity transition
      setTimeout(() => {
        overlay.classList.add('active');
        input.value = '';
        renderResults('');
        input.focus();
      }, 10);
    } else {
      overlay.classList.remove('active');
      setTimeout(() => overlay.classList.add('d-none'), 200);
    }
  };

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      togglePalette(!overlay.classList.contains('active'));
    }
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      togglePalette(false);
    }
  });

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) togglePalette(false);
  });

  const navigateToResult = (index) => {
    if (index < 0 || index >= searchResults.length) return;
    const item = searchResults[index];
    togglePalette(false);
    
    if (item.action === 'page') {
      navigateTo(item.target);
    } else if (item.action === 'product') {
      navigateTo('products');
      setTimeout(() => showProductModal(item.id), 100); // Or select it in the split pane later
    } else if (item.action === 'po') {
      navigateTo('purchase-orders');
      setTimeout(() => showPOModal(item.id), 100);
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % searchResults.length;
      updateSelectionUI();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + searchResults.length) % searchResults.length;
      updateSelectionUI();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      navigateToResult(selectedIndex);
    }
  });

  input.addEventListener('input', (e) => {
    renderResults(e.target.value.toLowerCase().trim());
  });

  const updateSelectionUI = () => {
    const items = resultsContainer.querySelectorAll('.command-item');
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  };

  const renderResults = (query) => {
    searchResults = [];
    selectedIndex = 0;

    // Static commands
    const pages = [
      { name: 'Go to Dashboard', target: 'dashboard', icon: 'fa-gauge-high' },
      { name: 'Go to Products', target: 'products', icon: 'fa-box-open' },
      { name: 'Go to Purchase Orders', target: 'purchase-orders', icon: 'fa-file-invoice' },
      { name: 'Go to Deliveries', target: 'deliveries', icon: 'fa-truck' }
    ];

    pages.forEach(p => {
      if (!query || p.name.toLowerCase().includes(query)) {
        searchResults.push({ ...p, action: 'page' });
      }
    });

    if (query.length >= 2) {
      App.data.products.forEach(p => {
        if (p.name.toLowerCase().includes(query) || p.reference.toLowerCase().includes(query)) {
          searchResults.push({ name: `Product: ${p.name}`, target: p.reference, icon: 'fa-box', action: 'product', id: p.id });
        }
      });
      App.data.purchaseOrders.forEach(po => {
        if (po.po_number.toLowerCase().includes(query) || po.status.includes(query)) {
          searchResults.push({ name: `PO: ${po.po_number}`, target: po.status, icon: 'fa-file-invoice', action: 'po', id: p.id });
        }
      });
    }

    if (searchResults.length === 0) {
      resultsContainer.innerHTML = '<div class="p-4 text-center text-muted">No matching results</div>';
      return;
    }

    resultsContainer.innerHTML = searchResults.map((r, idx) => `
      <div class="command-item ${idx === 0 ? 'selected' : ''}" data-index="${idx}">
        <i class="fas ${r.icon}"></i>
        <div>
          <div class="fw-medium">${r.name}</div>
          ${r.target !== r.name && !r.target.startsWith('dashboard') && !r.target.startsWith('products') ? `<div class="small text-muted">${r.target}</div>` : ''}
        </div>
      </div>
    `).join('');

    resultsContainer.querySelectorAll('.command-item').forEach(item => {
      item.addEventListener('mouseover', () => {
        selectedIndex = parseInt(item.dataset.index, 10);
        updateSelectionUI();
      });
      item.addEventListener('click', () => {
        navigateToResult(parseInt(item.dataset.index, 10));
      });
    });
  };
}

  // Replaced by Command Palette

// Update Last Update Time
function updateLastUpdate() {
  const el = document.getElementById('lastUpdate');
  if (el) {
    el.textContent = new Date().toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Page Rendering
async function renderPage(page) {
  const content = document.getElementById('mainContent');
  if (!content) return;

  // Show skeleton loader
  content.innerHTML = `
    <div class="skeleton-container" style="padding: var(--sp-8); display: flex; flex-direction: column; gap: var(--sp-4); opacity: 0; animation: fadeIn 0.2s ease forwards;">
      <div class="skeleton" style="height: 40px; width: 30%; border-radius: var(--radius);"></div>
      <div class="skeleton" style="height: 20px; width: 50%; border-radius: var(--radius); margin-bottom: var(--sp-4);"></div>
      <div style="display: flex; gap: var(--sp-4);">
        <div class="skeleton" style="height: 120px; flex: 1; border-radius: var(--radius-lg);"></div>
        <div class="skeleton" style="height: 120px; flex: 1; border-radius: var(--radius-lg);"></div>
        <div class="skeleton" style="height: 120px; flex: 1; border-radius: var(--radius-lg);"></div>
      </div>
      <div class="skeleton" style="height: 400px; width: 100%; border-radius: var(--radius-lg); margin-top: var(--sp-2);"></div>
    </div>
  `;

  // Simulate minimal async delay for premium transition
  await new Promise(r => setTimeout(r, 120));

  content.style.opacity = '0';
  
  setTimeout(() => {
    switch(page) {
      case 'dashboard':
        renderDashboard(content);
        break;
      case 'products':
        renderProducts(content);
        break;
      case 'purchase-orders':
        renderPurchaseOrders(content);
        break;
      case 'deliveries':
        renderDeliveries(content);
        break;
      case 'payments':
        renderPayments(content);
        break;
      case 'documents':
        renderDocuments(content);
        break;
      case 'settings':
        renderSettings(content);
        break;
      default:
        renderDashboard(content);
    }
    
    // Fade in
    content.style.transition = 'opacity 0.15s ease-in-out';
    content.style.opacity = '1';
  }, 50);
}

// ============================================
// DASHBOARD PAGE
// ============================================
function renderDashboard(container) {
  const stats = calculateDashboardStats();

  container.innerHTML = `
    ${getReadOnlyBanner()}
    <div class="split-pane-layout">
      
      <!-- Left Pane: Operational Activity Stream -->
      <div class="split-pane-detail" style="border-right: 1px solid var(--border-color); max-width: 65%;">
        <div style="padding: var(--sp-6) var(--sp-8) var(--sp-4);">
          <h1 class="page-title" style="font-size: var(--text-2xl); margin-bottom: 4px;">Activity Stream</h1>
          <p style="font-size: var(--text-sm); color: var(--text-secondary); margin: 0;">Recent events across your supply chain</p>
        </div>
        
        <div class="activity-stream">
          ${generateActivityStream()}
        </div>
      </div>

      <!-- Right Pane: Command Panel -->
      <div class="split-pane-list" style="width: 35%; flex: auto; background: var(--bg-page);">
        <div class="split-pane-list-header" style="border-bottom: 1px solid var(--border-color); background: var(--bg-page);">
          <div class="split-pane-list-title" style="margin-bottom: 0;">Overview</div>
        </div>
        <div class="split-pane-list-content" style="padding: var(--sp-4);">
          
          <!-- Key Metrics -->
          <div style="display: flex; flex-direction: column; gap: var(--sp-2); margin-bottom: var(--sp-5);">
            <div class="command-panel-tile" onclick="navigateTo('deliveries')" style="cursor:pointer;">
              <div>
                <div class="cpt-label">Pending Deliveries</div>
                <div class="cpt-value" style="color: var(--c-amber-500);">${stats.pendingDeliveries}</div>
              </div>
              <div style="color: var(--text-muted); font-size: 20px;"><i class="fa-solid fa-truck"></i></div>
            </div>
            <div class="command-panel-tile" onclick="navigateTo('payments')" style="cursor:pointer;">
              <div>
                <div class="cpt-label">Outstanding Balance</div>
                <div class="cpt-value metric-value-md" style="color: var(--c-rose-500);">${formatCurrency(stats.remainingBalance)}</div>
              </div>
              <div style="color: var(--text-muted); font-size: 20px;"><i class="fa-solid fa-credit-card"></i></div>
            </div>
            <div class="command-panel-tile" onclick="navigateTo('purchase-orders')" style="cursor:pointer;">
              <div>
                <div class="cpt-label">Total Orders</div>
                <div class="cpt-value">${stats.totalPOs}</div>
              </div>
              <div style="color: var(--text-muted); font-size: 20px;"><i class="fa-solid fa-file-invoice"></i></div>
            </div>
          </div>

          <!-- Order Status Breakdown -->
          <div class="card" style="margin-bottom: var(--sp-4);">
            <div class="card-header">
              <span class="section-title" style="margin: 0;">Order Status</span>
            </div>
            <div class="card-body" style="padding: var(--sp-4);">
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${stats.orderStatusItems.map(item => `
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="status-indicator ${item.colorClass}"></span>
                      <span style="font-size: var(--text-sm); font-weight: 500; color: var(--text-primary);">${item.label}</span>
                    </div>
                    <span style="font-size: var(--text-sm); font-weight: 700; color: var(--text-primary);">${item.count}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Payment Progress -->
          <div class="card">
            <div class="card-header">
              <span class="section-title" style="margin: 0;">Payment Collection</span>
              <span style="font-size: var(--text-xs); font-weight: 700; color: var(--c-emerald-500);">${stats.paymentProgress}%</span>
            </div>
            <div class="card-body" style="padding: var(--sp-4);">
              <div class="progress-custom">
                <div class="progress-bar-custom" style="width: ${stats.paymentProgress}%; background: var(--c-emerald-500);"></div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: var(--sp-3); font-size: var(--text-xs); color: var(--text-muted);">
                <span>Collected</span>
                <span style="color: var(--text-primary); font-weight: 600;">${stats.paymentProgress}% of delivered value</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  `;
}

function calculateDashboardStats() {
  const pos = App.data.purchaseOrders.filter(po => po.status !== 'cancelled');
  const totalHT = pos.reduce((sum, po) => sum + (po.total_ht || 0), 0);

  const confirmedDeliveries = App.data.deliveries.filter(d =>
    ['partial', 'delivered'].includes(normalizeDeliveryStatus(d.status))
  );
  const pendingDeliveries = App.data.deliveries.filter(d => normalizeDeliveryStatus(d.status) === 'pending');
  const totalDeliveredAmount = confirmedDeliveries.reduce((sum, d) => sum + getDeliveryAmount(d), 0);
  const totalPaid = App.data.payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
  const statusCounts = pos.reduce((counts, po) => {
    const status = normalizeOrderStatus(po.status) || 'Unknown';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  const statusOrder = ['Draft', 'Pending', 'Approved', 'In Production', 'Completed', 'Cancelled'];
  const orderStatusItems = statusOrder.map(status => ({
    label: status,
    count: statusCounts[status] || 0,
    colorClass: status === 'Draft' ? 'status-secondary'
      : status === 'Pending' ? 'status-warning'
      : status === 'Approved' ? 'status-info'
      : status === 'In Production' ? 'status-primary'
      : status === 'Completed' ? 'status-success'
      : status === 'Cancelled' ? 'status-danger'
      : 'status-secondary'
  }));

  return {
    totalPOs: pos.length,
    totalHT,
    totalPaid,
    remainingBalance: Math.max(0, totalDeliveredAmount - totalPaid),
    pendingDeliveries: pendingDeliveries.length,
    deliveredOrders: confirmedDeliveries.length,
    paymentProgress: totalDeliveredAmount > 0 ? Math.round((totalPaid / totalDeliveredAmount) * 100) : 0,
    partialPayments: 0,
    orderStatusItems
  };
}

function initializeDashboardCharts(stats) {
  // Monthly Purchases Chart
  const monthlyCtx = document.getElementById('monthlyPurchasesChart');
  if (monthlyCtx) {
    if (App.charts.monthly) App.charts.monthly.destroy();

    const monthsToShow = 6;
    const labels = [];
    const monthIndexMap = new Map();
    const monthlyTotals = [];
    const today = new Date();

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      labels.push(date.toLocaleString('en-US', { month: 'short' }));
      monthIndexMap.set(key, monthlyTotals.length);
      monthlyTotals.push(0);
    }

    App.data.purchaseOrders
      .filter(po => po.status !== 'cancelled')
      .forEach(po => {
        const date = new Date(po.created_at || po.date || po.order_date);
        if (isNaN(date)) return;
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const idx = monthIndexMap.get(key);
        if (typeof idx === 'number') {
          monthlyTotals[idx] += po.total_ht || 0;
        }
      });

    App.charts.monthly = new Chart(monthlyCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `Purchases (${App.data.settings.currency || 'TND'})`,
          data: monthlyTotals,
          backgroundColor: 'rgba(37, 99, 235, 0.8)',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: context => `${App.data.settings.currency || 'TND'} ${context.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              callback: value => `${App.data.settings.currency || 'TND'} ${value.toLocaleString()}`
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // Delivery Status Chart
  const deliveryCtx = document.getElementById('deliveryStatusChart');
  if (deliveryCtx) {
    if (App.charts.delivery) App.charts.delivery.destroy();

    App.charts.delivery = new Chart(deliveryCtx, {
      type: 'doughnut',
      data: {
        labels: ['Delivered', 'Partial', 'Pending', 'Cancelled'],
        datasets: [{
          data: [
            App.data.deliveries.filter(d => normalizeDeliveryStatus(d.status) === 'delivered').length,
            App.data.deliveries.filter(d => normalizeDeliveryStatus(d.status) === 'partial').length,
            App.data.deliveries.filter(d => normalizeDeliveryStatus(d.status) === 'pending').length,
            App.data.deliveries.filter(d => normalizeDeliveryStatus(d.status) === 'cancelled').length
          ],
          backgroundColor: ['#10b981', '#8B5CF6', '#f59e0b', '#94a3b8']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // Payment Progress Chart
  const paymentCtx = document.getElementById('paymentProgressChart');
  if (paymentCtx) {
    if (App.charts.payment) App.charts.payment.destroy();

    App.charts.payment = new Chart(paymentCtx, {
      type: 'doughnut',
      data: {
        labels: ['Paid', 'Pending'],
        datasets: [{
          data: [stats.totalPaid, stats.remainingBalance],
          backgroundColor: ['#10b981', '#ef4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        cutout: '70%'
      }
    });
  }
}

function generateActivityStream() {
  const activities = [];

  const statusIconMap = {
    draft: { icon: 'fa-file', color: 'var(--c-slate-400)', bg: 'rgba(100,116,139,.12)' },
    pending: { icon: 'fa-hourglass-half', color: 'var(--c-amber-500)', bg: 'rgba(245,158,11,.12)' },
    approved: { icon: 'fa-circle-check', color: 'var(--c-blue-500)', bg: 'rgba(59,130,246,.12)' },
    'in-production': { icon: 'fa-gear', color: 'var(--c-violet-500)', bg: 'rgba(139,92,246,.12)' },
    completed: { icon: 'fa-check-double', color: 'var(--c-emerald-500)', bg: 'rgba(16,185,129,.12)' },
    'completed-partial': { icon: 'fa-flag-checkered', color: 'var(--c-cyan-500)', bg: 'rgba(6,182,212,.12)' },
    cancelled: { icon: 'fa-xmark', color: 'var(--c-rose-500)', bg: 'rgba(239,68,68,.12)' },
    delivered: { icon: 'fa-truck-ramp-box', color: 'var(--c-emerald-500)', bg: 'rgba(16,185,129,.12)' },
    partial: { icon: 'fa-truck', color: 'var(--c-violet-500)', bg: 'rgba(139,92,246,.12)' },
    payment: { icon: 'fa-credit-card', color: 'var(--c-cyan-500)', bg: 'rgba(6,182,212,.12)' }
  };

  App.data.purchaseOrders.slice().sort((a,b) => new Date(b.created_at||0) - new Date(a.created_at||0)).slice(0, 4).forEach(po => {
    activities.push({
      date: po.updated_at || po.created_at,
      action: 'Purchase Order',
      subAction: formatStatus(po.status),
      reference: po.po_number,
      detail: formatCurrency(po.total_ht),
      type: po.status,
      page: 'purchase-orders',
      id: po.id
    });
  });

  App.data.deliveries.slice().sort((a,b) => new Date(b.updated_at||0) - new Date(a.updated_at||0)).slice(0, 3).forEach(d => {
    const st = normalizeDeliveryStatus(d.status);
    activities.push({
      date: d.updated_at || d.created_at,
      action: 'Delivery',
      subAction: formatStatus(st),
      reference: d.delivery_number,
      detail: formatCurrency(getDeliveryAmount(d)),
      type: st === 'delivered' ? 'delivered' : st === 'partial' ? 'partial' : 'pending',
      page: 'deliveries',
      id: d.id
    });
  });

  App.data.payments.slice().sort((a,b) => new Date(b.updated_at||0) - new Date(a.updated_at||0)).slice(0, 2).forEach(p => {
    if (p.amount_paid > 0) {
      activities.push({
        date: p.updated_at || p.payment_date,
        action: 'Payment',
        subAction: formatStatus(p.status),
        reference: p.payment_reference,
        detail: formatCurrency(p.amount_paid),
        type: 'payment',
        page: 'payments',
        id: p.id
      });
    }
  });

  activities.sort((a, b) => new Date(b.date||0) - new Date(a.date||0));
  const visible = activities.slice(0, 8);

  if (visible.length === 0) {
    return `<div class="empty-state">
      <div class="empty-state-icon"><i class="fa-solid fa-bolt-lightning"></i></div>
      <h3>No activity yet</h3>
      <p>Create your first purchase order to get started</p>
    </div>`;
  }

  return visible.map((a, idx) => {
    const meta = statusIconMap[a.type] || statusIconMap.draft;
    return `
    <div class="activity-item" style="animation-delay: ${idx * 40}ms;">
      <div style="padding-top: 2px; flex-shrink: 0;">
        <div style="width: 32px; height: 32px; border-radius: var(--radius); background: ${meta.bg}; display: flex; align-items: center; justify-content: center; color: ${meta.color}; font-size: 13px; flex-shrink: 0;">
          <i class="fa-solid ${meta.icon}"></i>
        </div>
      </div>
      <div class="activity-body">
        <div class="activity-action">${a.action} <span style="color: var(--text-secondary); font-weight: 500;">·</span> <span style="color: ${meta.color}; font-weight: 600; font-size: var(--text-xs);">${a.subAction}</span></div>
        <div style="display: flex; align-items: center; gap: var(--sp-3); margin-top: 2px;">
          <span class="activity-ref" onclick="navigateTo('${a.page}')">${a.reference}</span>
          <span style="font-size: var(--text-xs); color: var(--text-secondary); font-weight: 600;">${a.detail}</span>
        </div>
        <div class="activity-time" style="margin-top: 2px;">${formatDate(a.date)}</div>
      </div>
    </div>
  `}).join('');
}

// ============================================
// PRODUCTS PAGE
// ============================================
function renderProducts(container) {
  const products = App.data.products;

  container.innerHTML = `
    <div class="split-pane-layout">
      
      <!-- List Pane -->
      <div class="split-pane-list" style="width: 340px;">
        <div class="split-pane-list-header">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-3);">
            <h1 class="split-pane-list-title" style="margin: 0;">Product Catalog</h1>
            ${canWrite() ? `<button class="btn-primary-custom" onclick="showProductModal()" title="New Product" style="padding: 6px 12px; font-size: 12px;"><i class="fas fa-plus"></i> New</button>` : ''}
          </div>
          
          <div style="display: flex; gap: var(--sp-2);">
            <input type="text" class="filter-search" id="productSearch" placeholder="Search products…" oninput="filterProductList()" style="padding-left: 12px;">
            <select class="filter-select" id="categoryFilter" onchange="filterProductList()" style="min-width: 120px;">
              <option value="">All Categories</option>
              ${App.data.categories.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="split-pane-list-content" id="productListContainer">
          ${generateProductListItems(products)}
        </div>
      </div>

      <!-- Detail Pane -->
      <div class="split-pane-detail" id="productDetailContainer">
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-box-open"></i></div>
          <h3>No product selected</h3>
          <p>Select a product from the list to view details</p>
        </div>
      </div>
      
    </div>
  `;

  window.filterProductList = filterProductList;
  window.renderProductDetails = renderProductDetails;
  window.showProductModal = showProductModal; // Used for creation

  // Auto-select first product if available
  if (products.length > 0) {
    setTimeout(() => renderProductDetails(products[0].id), 80);
  }
}

function generateProductListItems(products) {
  if (products.length === 0) return `<div class="empty-state" style="padding: var(--sp-8);"><div class="empty-state-icon"><i class="fa-solid fa-box-open"></i></div><h3>No products</h3><p>No products match your filter</p></div>`;
  
  return products.map(p => `
    <div class="list-item-card" id="product-list-item-${p.id}" onclick="renderProductDetails('${p.id}')">
      <div class="list-item-title">
        <span class="list-item-ref" style="color: var(--text-primary); font-size: var(--text-md);">${p.name}</span>
        <span class="list-item-amount">${formatCurrency(p.price_ht, 3)}</span>
      </div>
      <div class="list-item-sub">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">${p.reference}</span>
        <span style="font-size: 10px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: .3px;">${p.category}</span>
      </div>
    </div>
  `).join('');
}

function filterProductList() {
  const category = document.getElementById('categoryFilter')?.value || '';
  const search = document.getElementById('productSearch')?.value.toLowerCase() || '';
  
  let filtered = App.data.products;

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.reference.toLowerCase().includes(search)
    );
  }

  const container = document.getElementById('productListContainer');
  if (container) {
    container.innerHTML = generateProductListItems(filtered);
  }
}

function renderProductDetails(productId) {
  // Update active state in list
  document.querySelectorAll('#productListContainer .list-item-card').forEach(el => el.classList.remove('active'));
  const activeItem = document.getElementById(`product-list-item-${productId}`);
  if (activeItem) activeItem.classList.add('active');

  const p = App.data.products.find(p => p.id === productId);
  const container = document.getElementById('productDetailContainer');
  if (!p || !container) return;

  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div class="d-flex gap-4 w-100">
        <div class="product-detail-img-box" style="width: 120px; height: 120px;">
          ${p.product_image ? `<img src="${p.product_image}" style="width:100%; height:100%; object-fit:contain; border-radius:var(--radius-md);">` : `<i class="fa-solid fa-image fs-1 text-muted opacity-25"></i>`}
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start w-100">
            <div>
              <span class="badge bg-primary text-white mb-2">${p.category}</span>
              <h2 class="m-0 fs-3 fw-bold lh-sm mb-1">${p.name}</h2>
              <p class="text-muted m-0 font-monospace small">${p.reference}</p>
            </div>
            <div class="d-flex gap-2">
              ${canWrite() ? `<button class="btn btn-primary-custom btn-sm" onclick="showProductModal('${p.id}', 'view')"><i class="fas fa-eye me-1"></i> Full Details</button>` : ''}
              ${canWrite() ? `<button class="btn btn-outline-secondary btn-sm" onclick="showProductModal('${p.id}', 'edit')"><i class="fas fa-pen me-1"></i> Edit</button>` : ''}
              ${canWrite() ? `<button class="btn btn-outline-danger btn-sm" onclick="deleteProduct('${p.id}')"><i class="fas fa-trash me-1"></i> Delete</button>` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>

    ${p.description ? `
      <div class="mb-5 text-secondary">${p.description}</div>
    ` : ''}

    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Pricing & Units</h6>
          <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
            <span class="text-secondary">Base Price (HT)</span>
            <span class="fw-bold text-primary fs-5">${formatCurrency(p.price_ht, 3)}</span>
          </div>
          <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
            <span class="text-secondary">Unit of Measure</span>
            <span class="fw-medium text-body text-capitalize">${p.unit}</span>
          </div>
          ${p.surface_mm2 ? `
            <div class="d-flex justify-content-between">
              <span class="text-secondary">Surface Area</span>
              <span class="fw-medium font-monospace small">${formatSurfaceMm2(p.surface_mm2)}</span>
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Specifications</h6>
          
          <div class="row g-3">
            <div class="col-6">
              <small class="text-muted d-block mb-1">Print Support</small>
              <span class="fw-medium text-capitalize">${p.print_support || '-'}</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block mb-1">Print Method</small>
              <span class="fw-medium text-capitalize">${p.print_method || '-'}</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block mb-1">Material</small>
              <span class="fw-medium text-capitalize">${p.material || '-'}</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block mb-1">Finish</small>
              <span class="fw-medium text-capitalize">${p.finish || '-'}</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block mb-1">Format</small>
              <span class="fw-medium text-capitalize">${formatProductFormat(p.format)}</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block mb-1">Dimensions</small>
              <span class="fw-medium">${formatProductDimensions(p)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    ${p.source_file_id || p.delivery_image ? `
      <h6 class="fw-bold mb-3 mt-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Linked Resources</h6>
      <div class="row g-3">
        ${p.source_file_id ? `
          <div class="col-md-6">
            <div class="doc-card cursor-pointer" onclick="downloadDocument('${p.source_file_id}')">
              <div class="doc-icon doc-icon-pdf">
                <i class="fa-solid fa-file-pdf"></i>
              </div>
              <div class="doc-info">
                <div class="doc-name">Source Artwork</div>
                <div class="doc-meta text-primary">Download Source</div>
              </div>
            </div>
          </div>
        ` : ''}
        ${p.delivery_image ? `
          <div class="col-md-6">
            <div class="doc-card cursor-pointer" onclick="previewDataUrl('${p.delivery_image}', 'Delivery Guide')">
              <div class="doc-icon doc-icon-img" style="background: transparent; border: 1px solid var(--border-color); overflow: hidden; padding: 2px;">
                <img src="${p.delivery_image}" style="width:100%; height:100%; object-fit:cover; border-radius: var(--radius-sm);">
              </div>
              <div class="doc-info">
                <div class="doc-name">Delivery/Pack Guide</div>
                <div class="doc-meta text-primary">View Image</div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    ` : ''}
  `;
}

// filterProductList replaced filterProducts

function showProductModal(productId = null, mode = 'edit') {
  if (!productId && !canWrite()) {
    showToast('You have read-only access.', 'warning');
    return;
  }

  const product = productId ? App.data.products.find(p => p.id === productId) : null;
  const isView = mode === 'view' && !!product;
  const isEdit = mode === 'edit' && !!product;

  const modalHtml = `
    <div class="modal fade" id="productModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${isView ? 'Product Details' : (isEdit ? 'Edit Product' : 'New Product')}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${isView ? `
              <div class="row g-4 mb-4">
                ${product.product_image ? `
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Product Image</label>
                    <img src="${product.product_image}" alt="${product.name}" class="img-fluid rounded" style="max-height: 200px;">
                  </div>
                ` : ''}
                ${product.delivery_image ? `
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Delivery Image</label>
                    <img src="${product.delivery_image}" alt="Delivery format" class="img-fluid rounded" style="max-height: 200px;">
                  </div>
                ` : ''}
              </div>

              <div class="mb-4">
                <h6>Description</h6>
                <p class="text-secondary">${product.description}</p>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-md-4"><strong>Reference:</strong> ${product.reference}</div>
                <div class="col-md-4"><strong>Unit:</strong> ${product.unit}</div>
                <div class="col-md-4"><strong>Category:</strong> ${product.category}</div>
                  <div class="col-md-4"><strong>Price HT:</strong> ${formatCurrency(product.price_ht, 3)}</div>
                  <div class="col-md-4"><strong>Print Support:</strong> ${product.print_support || '-'}</div>
                  <div class="col-md-4"><strong>Print Method:</strong> ${product.print_method || '-'}</div>
                  <div class="col-md-4"><strong>Material:</strong> ${product.material || '-'}</div>
                  <div class="col-md-4"><strong>Finish:</strong> ${product.finish || '-'}</div>

              ${product.source_file ? `
                <h6 class="mb-2">Source Print File</h6>
                <div class="d-flex align-items-center gap-2 mb-4">
                  <span class="badge bg-primary-light text-primary">
                    <i class="fas fa-file me-1"></i>${product.source_file_name || 'Source file'}
                  </span>
                  <button type="button" class="btn btn-sm btn-primary" id="downloadSourceFileBtn">
                    <i class="fas fa-download me-1"></i>Download
                  </button>
                </div>
              ` : ''}
            ` : `
              <form id="productForm">
                <input type="hidden" id="productIdHidden">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Reference *</label>
                    <input type="text" class="form-control" id="productRef" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Name *</label>
                    <input type="text" class="form-control" id="productName" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Category *</label>
                    <select class="form-select" id="productCategory" required>
                      ${App.data.categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Unit</label>
                    <select class="form-select" id="productUnit">
                      <option value="piece">Piece</option>
                      <option value="pack">Pack</option>
                      <option value="set">Set</option>
                      <option value="unit">Unit</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="productDesc" rows="3"></textarea>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Price HT *</label>
                    <input type="number" step="0.001" class="form-control" id="productPrice" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Print Support</label>
                    <select class="form-select" id="productPrintSupport">
                      <option value="">Select support</option>
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="indoor-outdoor">Indoor / Outdoor</option>
                      <option value="vinyl">Vinyl</option>
                      <option value="paper">Paper</option>
                      <option value="film">Backlit Film</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Print Method</label>
                    <select class="form-select" id="productPrintMethod">
                      <option value="">Select method</option>
                      <option value="digital">Digital</option>
                      <option value="offset">Offset</option>
                      <option value="uv">UV</option>
                      <option value="screen">Screen Print</option>
                      <option value="flexo">Flexography</option>
                      <option value="sublimation">Sublimation</option>
                      <option value="letterpress">Letterpress</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Format</label>
                    <select class="form-select" id="productFormat" onchange="updateProductSurfacePreview()">
                      <option value="">Select format</option>
                      <option value="circle">Circle</option>
                      <option value="square">Square (Carré)</option>
                      <option value="rectangle">Rectangle</option>
                      <option value="oval">Oval</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div class="col-md-4" id="dimWidthGroup">
                    <label class="form-label" id="dimWidthLabel">Width / Diameter (mm)</label>
                    <input type="number" step="0.1" min="0" class="form-control" id="productDimWidth" oninput="updateProductSurfacePreview()">
                  </div>
                  <div class="col-md-4" id="dimHeightGroup" style="display:none">
                    <label class="form-label">Height (mm)</label>
                    <input type="number" step="0.1" min="0" class="form-control" id="productDimHeight" oninput="updateProductSurfacePreview()">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Surface (mm²)</label>
                    <input type="text" class="form-control" id="productSurface" readonly placeholder="Auto-calculated">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Material</label>
                    <select class="form-select" id="productMaterial">
                      <option value="">Select material</option>
                      <option value="paper">Paper</option>
                      <option value="vinyl">Vinyl</option>
                      <option value="polypropylene">Polypropylene</option>
                      <option value="cardboard">Cardboard</option>
                      <option value="pvc">PVC</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Finish</label>
                    <select class="form-select" id="productFinish">
                      <option value="">Select finish</option>
                      <option value="gloss">Gloss</option>
                      <option value="matte">Matte</option>
                      <option value="varnish">Varnish</option>
                      <option value="laminate">Lamination</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Product Image</label>
                    <input type="file" class="form-control" id="productImageFile" accept="image/*">
                    <small class="text-muted">Stored locally in this project</small>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Delivery Image</label>
                    <input type="file" class="form-control" id="deliveryImageFile" accept="image/*">
                    <small class="text-muted">Stored locally in this project</small>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Source Print File</label>
                    <input type="file" class="form-control" id="sourceFile" accept=".ai,.eps,.svg,.psd,.png,.pdf,.jpg,.jpeg,.webp">
                    <small class="text-muted">AI, EPS, SVG, PSD, PNG, PDF, etc. — stored locally</small>
                  </div>
                </div>
              </form>
            `}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            ${!isView ? `
              <button type="button" class="btn btn-primary" onclick="saveProduct()">
                <i class="fas fa-save me-1"></i>Save Product
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  // Remove existing modal
  document.getElementById('productModal')?.remove();

  // Add modal to DOM
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Pre-populate if editing
  if (isEdit && product) {
    document.getElementById('productIdHidden').value = product.id;
    document.getElementById('productRef').value = product.reference || '';
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productCategory').value = product.category || '';
    document.getElementById('productUnit').value = product.unit || '';
    document.getElementById('productDesc').value = product.description || '';
    document.getElementById('productPrice').value = product.price_ht || '';
    document.getElementById('productPrintSupport').value = product.print_support || '';
    document.getElementById('productPrintMethod').value = product.print_method || '';
    document.getElementById('productMaterial').value = product.material || '';
    document.getElementById('productFinish').value = product.finish || '';
    document.getElementById('productFormat').value = product.format || '';
    document.getElementById('productDimWidth').value = product.dimension_width || '';
    document.getElementById('productDimHeight').value = product.dimension_height || '';
    document.getElementById('productSurface').value = product.surface_mm2 || '';
    updateProductSurfacePreview();
  }

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  modal.show();

  const downloadSourceBtn = document.getElementById('downloadSourceFileBtn');
  if (downloadSourceBtn && product?.source_file) {
    downloadSourceBtn.addEventListener('click', () =>
      downloadDataUrl(product.source_file, product.source_file_name || 'source-file')
    );
  }

  // Cleanup on close
  document.getElementById('productModal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });

  window.saveProduct = saveProduct;
  window.updateProductSurfacePreview = updateProductSurfacePreview;
  window.previewDataUrl = previewDataUrl;
  window.deleteProduct = deleteProduct;
}

function updateProductSurfacePreview() {
  const format = document.getElementById('productFormat')?.value;
  const width = document.getElementById('productDimWidth')?.value;
  const height = document.getElementById('productDimHeight')?.value;
  const heightGroup = document.getElementById('dimHeightGroup');
  const widthLabel = document.getElementById('dimWidthLabel');
  const surfaceInput = document.getElementById('productSurface');

  if (heightGroup) {
    heightGroup.style.display = format === 'rectangle' ? '' : 'none';
  }
  if (widthLabel) {
    widthLabel.textContent = format === 'circle' ? 'Diameter (mm)' : format === 'square' ? 'Side (mm)' : 'Width (mm)';
  }
  if (surfaceInput) {
    const surface = calculateSurfaceMm2(format, width, height);
    surfaceInput.value = surface > 0 ? formatSurfaceMm2(surface) : '';
  }
}

async function saveProduct() {
  if (!canWrite()) return;
  const existingId = document.getElementById('productIdHidden')?.value;
  const existingProduct = existingId ? App.data.products.find(p => p.id === existingId) : null;

  const format = document.getElementById('productFormat').value;
  const dimWidth = parseFloat(document.getElementById('productDimWidth').value) || 0;
  const dimHeight = parseFloat(document.getElementById('productDimHeight').value) || 0;
  const surface = calculateSurfaceMm2(format, dimWidth, dimHeight);

  const productImageFile = document.getElementById('productImageFile').files[0];
  const deliveryImageFile = document.getElementById('deliveryImageFile').files[0];
  const sourceFile = document.getElementById('sourceFile').files[0];

  const product = {
    id: existingId || getNextId('PRD', 'product'),
    reference: document.getElementById('productRef').value,
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    unit: document.getElementById('productUnit').value,
    description: document.getElementById('productDesc').value,
    price_ht: parseFloat(document.getElementById('productPrice').value),
    print_support: document.getElementById('productPrintSupport').value,
    print_method: document.getElementById('productPrintMethod').value,
    material: document.getElementById('productMaterial')?.value || null,
    finish: document.getElementById('productFinish')?.value || null,
    format,
    dimension_width: dimWidth,
    dimension_height: format === 'rectangle' ? dimHeight : null,
    surface_mm2: surface,
    product_image: productImageFile ? await readFileAsDataURL(productImageFile) : (existingProduct ? existingProduct.product_image : null),
    delivery_image: deliveryImageFile ? await readFileAsDataURL(deliveryImageFile) : (existingProduct ? existingProduct.delivery_image : null),
    source_file: sourceFile ? await readFileAsDataURL(sourceFile) : (existingProduct ? existingProduct.source_file : null),
    source_file_name: sourceFile ? sourceFile.name : (existingProduct ? existingProduct.source_file_name : null),
    created_at: existingProduct ? existingProduct.created_at : new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  await dbSaveProduct(product);
  // dbSaveProduct already updates the in-memory portal data; avoid pushing again to prevent duplicates

  if (sourceFile) {
    const doc = {
      id: getNextId('DOC', 'document'),
      name: sourceFile.name,
      type: sourceFile.name.split('.').pop().toLowerCase(),
      category: 'artwork-files',
      size: formatFileSize(product.source_file),
      data: product.source_file,
      url: product.source_file,
      related_product: product.id,
      created_at: new Date().toISOString().split('T')[0]
    };
    await dbSaveDocument(doc);
    // dbSaveDocument persists the document into portal data; no need to push locally
  }

  bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
  renderPage('products');
  showToast('Product created successfully', 'success');
}

async function deleteProduct(productId) {
  if (!canWrite()) return;
  if (!confirm('Delete this product? This action cannot be undone.')) return;

  try {
    await dbDeleteProduct(productId);
    // Re-render products view to reflect deletion
    renderPage('products');
    showToast('Product deleted', 'success');
  } catch (err) {
    console.error('Delete product failed', err);
    showToast('Failed to delete product', 'danger');
  }
}

function formatProductFormat(format) {
  const labels = {
    circle: 'Circle',
    square: 'Square (Carré)',
    rectangle: 'Rectangle',
    oval: 'Oval',
    custom: 'Custom'
  };
  return labels[format] || '-';
}

function formatProductDimensions(product) {
  if (!product.format || !product.dimension_width) return '-';
  if (product.format === 'rectangle') {
    return `${product.dimension_width} × ${product.dimension_height || 0} mm`;
  }
  if (product.format === 'circle') {
    return `Ø ${product.dimension_width} mm`;
  }
  if (product.format === 'oval') {
    return `Oval ${product.dimension_width} x ${product.dimension_height || 'N/A'} mm`;
  }
  return `${product.dimension_width} mm`;
}

// ============================================
// PURCHASE ORDERS PAGE
// ============================================
function renderPurchaseOrders(container) {
  const orders = App.data.purchaseOrders;

  container.innerHTML = `
    <div class="split-pane-layout">
      
      <!-- List Pane -->
      <div class="split-pane-list" style="width: 340px;">
        <div class="split-pane-list-header">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-3);">
            <h1 class="split-pane-list-title" style="margin: 0;">Purchase Orders</h1>
            ${canWrite() ? `<button class="btn-primary-custom" onclick="showPOModal()" title="New PO" style="padding: 6px 12px; font-size: 12px;"><i class="fas fa-plus"></i> New</button>` : ''}
          </div>
          
          <div style="display: flex; gap: var(--sp-2);">
            <input type="text" class="filter-search" placeholder="Search POs…" oninput="filterPOList(this.value)" style="padding-left: 12px;">
            <select class="filter-select" id="poStatusFilter" onchange="filterPOList()" style="min-width: 100px;">
              <option value="">All</option>
              ${['draft', 'pending', 'approved', 'in-production', 'completed', 'cancelled'].map(s =>
                `<option value="${s}">${formatStatus(s)}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        
        <div class="split-pane-list-content" id="poListContainer">
          ${generatePOListItems(orders)}
        </div>
      </div>

      <!-- Detail Pane -->
      <div class="split-pane-detail" id="poDetailContainer">
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-file-invoice"></i></div>
          <h3>No order selected</h3>
          <p>Select a purchase order from the list to view details</p>
        </div>
      </div>
      
    </div>
  `;

  window.showPOModal = showPOModal;
  window.filterPOList = filterPOList;
  window.renderPODetails = renderPODetails;
  window.exportPOs = exportPOs;

  // Auto-select first PO if available
  if (orders.length > 0) {
    setTimeout(() => renderPODetails(orders[0].id), 50);
  }
}

function generatePOListItems(orders) {
  if (orders.length === 0) return `<div class="empty-state" style="padding: var(--sp-8);"><div class="empty-state-icon"><i class="fa-solid fa-file-invoice"></i></div><h3>No orders</h3><p>No purchase orders match your filter</p></div>`;
  
  return orders.sort((a,b) => new Date(b.date) - new Date(a.date)).map(po => {
    const statusDotClass = po.status === 'completed' || po.status === 'completed-partial' ? 'status-success'
      : po.status === 'cancelled' ? 'status-danger'
      : po.status === 'in-production' ? 'status-primary'
      : po.status === 'approved' ? 'status-info'
      : po.status === 'pending' ? 'status-warning'
      : 'status-secondary';
    return `
    <div class="list-item-card" id="po-list-item-${po.id}" onclick="renderPODetails('${po.id}')">
      <div class="list-item-title">
        <span class="list-item-ref">${po.po_number}</span>
        <span class="list-item-amount">${formatCurrency(po.total_ht, 0)}</span>
      </div>
      <div class="list-item-sub">
        <span>${formatDate(po.date)}</span>
        <span class="status-indicator ${statusDotClass}" title="${po.status}"></span>
      </div>
    </div>
  `}).join('');
}

function filterPOList(searchQuery = '') {
  const status = document.getElementById('poStatusFilter')?.value || '';
  let query = typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';
  
  let filtered = App.data.purchaseOrders;

  if (status) {
    filtered = filtered.filter(po => po.status === status);
  }
  if (query) {
    filtered = filtered.filter(po => po.po_number.toLowerCase().includes(query) || (po.supplier_reference || '').toLowerCase().includes(query));
  }

  const container = document.getElementById('poListContainer');
  if (container) {
    container.innerHTML = generatePOListItems(filtered);
  }
}

function renderPODetails(poId) {
  // Update active state in list
  document.querySelectorAll('#poListContainer .list-item-card').forEach(el => el.classList.remove('active'));
  const activeItem = document.getElementById(`po-list-item-${poId}`);
  if (activeItem) activeItem.classList.add('active');

  const po = App.data.purchaseOrders.find(p => p.id === poId);
  const container = document.getElementById('poDetailContainer');
  if (!po || !container) return;

  const deliveries = App.data.deliveries.filter(d => d.related_po === poId);
  const f = getPOFulfillment(po);

  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <div class="d-flex align-items-center gap-3 mb-2">
          <h2 class="m-0 fs-3 fw-bold">${po.po_number}</h2>
          <span class="badge rounded-pill border" style="background: var(--bg-page); color: var(--text-primary);">${formatStatus(po.status)}</span>
        </div>
        <p class="text-muted m-0">Ordered ${formatDate(po.date)} ${po.supplier_reference ? `• Ref: ${po.supplier_reference}` : ''}</p>
      </div>
      <div class="d-flex gap-2">
        ${canWrite() ? `<button class="btn btn-outline-secondary btn-sm" onclick="showPOModal('${po.id}', {editMode: true})"><i class="fas fa-pen me-1"></i> Edit</button>` : ''}
        <button class="btn btn-outline-secondary btn-sm" onclick="printPO('${po.id}')"><i class="fas fa-print me-1"></i> Print</button>
      </div>
    </div>

    ${renderStatusTimeline(po.status)}

    <div class="row g-4 mb-4 mt-2">
      <div class="col-md-6">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Financial Summary</h6>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-secondary">Total HT</span>
            <span class="fw-bold">${formatCurrency(po.total_ht)}</span>
          </div>
          <div class="d-flex justify-content-between mb-3">
            <span class="text-secondary">Received HT</span>
            <span class="fw-bold text-success">${formatCurrency(f.receivedAmount)}</span>
          </div>
          <hr class="border-light opacity-50">
          <div class="d-flex justify-content-between mt-2">
            <span class="fw-bold">Total TTC (estimated)</span>
            <span class="fw-bold">${formatCurrency(po.total_ht * 1.19)}</span>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Fulfillment Progress</h6>
          <div class="d-flex justify-content-between mb-2 small fw-bold">
            <span>${f.totalReceived} / ${f.totalOrdered} pcs</span>
            <span class="text-primary">${f.pct}%</span>
          </div>
          <div class="progress mb-3" style="height: 6px;">
            <div class="progress-bar bg-primary" style="width: ${f.pct}%"></div>
          </div>
          <div class="d-flex justify-content-between text-secondary small">
            <span>Expected Delivery:</span>
            <span class="fw-medium text-body">${po.expected_delivery_date ? formatDate(po.expected_delivery_date) : 'Not set'}</span>
          </div>
        </div>
      </div>
    </div>

    <h6 class="fw-bold mb-3 mt-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Order Lines (${po.lines?.length || 0})</h6>
    <div class="table-responsive rounded border mb-4 lines-scroll-container">
      <table class="data-table mb-0 align-middle">
        <thead style="background: var(--bg-page); border-bottom: 1px solid var(--border-color);">
          <tr>
            <th class="py-3 px-3 text-secondary small text-uppercase">Product</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-center">Ordered</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-center">Received</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-end">Line HT</th>
          </tr>
        </thead>
        <tbody>
          ${(po.lines || []).map(line => `
            <tr class="border-bottom">
              <td class="p-3">
                <a href="#" class="text-primary fw-medium text-decoration-none d-block mb-1" onclick="showProductModal('${line.product_id}', 'view'); return false;">${line.product_name}</a>
                <span class="badge border" style="background: var(--bg-page); color: var(--text-primary);">${formatCurrency(line.unit_price_ht, 3)} / u</span>
              </td>
              <td class="p-3 text-center fw-medium">${line.quantity}</td>
              <td class="p-3 text-center ${line.received_qty >= line.quantity ? 'text-success' : 'text-warning'} fw-medium">${line.received_qty || 0}</td>
              <td class="p-3 text-end fw-bold">${formatCurrency((line.quantity || 0) * (line.unit_price_ht || 0), 3)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${po.notes ? `
      <h6 class="fw-bold mb-2 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Notes</h6>
      <div class="p-3 rounded border mb-4 text-secondary" style="background: var(--bg-page);">${po.notes}</div>
    ` : ''}
    
    ${deliveries.length > 0 ? `
      <h6 class="fw-bold mb-3 mt-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Related Deliveries</h6>
      <div class="d-flex flex-column gap-2 mb-4">
        ${deliveries.map(d => `
          <div class="d-flex justify-content-between align-items-center p-3 rounded border shadow-sm cursor-pointer" style="background: var(--bg-card);" onclick="navigateTo('deliveries');setTimeout(()=>renderDeliveryDetails('${d.id}'),100);">
            <div>
              <div class="fw-bold text-primary mb-1">${d.delivery_number}</div>
              <small class="text-muted">${d.delivery_date ? formatDate(d.delivery_date) : 'Pending'}</small>
            </div>
            <div class="text-end">
              <div class="fw-bold">${formatCurrency(getDeliveryAmount(d))}</div>
              <span class="badge ${d.status === 'delivered' ? 'bg-success' : 'bg-warning'} mt-1">${formatStatus(normalizeDeliveryStatus(d.status))}</span>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}

function showPOModal(poId = null, options = {}) {
  if (!poId && !canWrite()) {
    showToast('You have read-only access.', 'warning');
    return;
  }

  const po = poId ? App.data.purchaseOrders.find(p => p.id === poId) : null;
  const isEditMode = po && options.editMode && canWrite();
  const showReadOnly = po && !isEditMode;

  if (!po && poId) return;

  const deliveries = po ? App.data.deliveries.filter(d => d.related_po === po.id) : [];
  const payments = po ? App.data.payments.filter(p => p.related_po === po.id) : [];

  const modalHtml = `
    <div class="modal fade" id="poModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${po ? (isEditMode ? `Edit ${po.po_number}` : po.po_number) : 'New Purchase Order'}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${po && !isEditMode ? `
              <!-- Status Timeline -->
              <div class="mb-4">
                <h6 class="mb-3">Order Status</h6>
                <div class="d-flex justify-content-between">
                  ${renderStatusTimeline(po.status)}
                </div>
              </div>

              <!-- PO Details -->
              <div class="row g-4 mb-4">
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header"><h6 class="mb-0">Order Information</h6></div>
                    <div class="card-body">
                      <div class="row g-3">
                        <div class="col-6">
                          <small class="text-muted">PO Number</small>
                          <div class="fw-medium">${po.po_number}</div>
                        </div>
                        <div class="col-6">
                          <small class="text-muted">Order Date</small>
                          <div class="fw-medium">${formatDate(po.date)}</div>
                        </div>
                        <div class="col-6">
                          <small class="text-muted">Expected Delivery</small>
                          <div class="fw-medium">${po.expected_delivery_date ? formatDate(po.expected_delivery_date) : '-'}</div>
                        </div>
                        <div class="col-6">
                          <small class="text-muted">Supplier Ref</small>
                          <div class="fw-medium">${po.supplier_reference || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header"><h6 class="mb-0">Financial Summary</h6></div>
                    <div class="card-body">
                      ${(() => {
                        const f = getPOFulfillment(po);
                        return `
                          <div class="d-flex justify-content-between mb-2">
                            <span>Ordered HT</span>
                            <span class="fw-medium">${formatCurrency(f.orderedAmount)}</span>
                          </div>
                          <div class="d-flex justify-content-between mb-3">
                            <span>Received HT</span>
                            <span class="fw-medium text-success">${formatCurrency(f.receivedAmount)}</span>
                          </div>
                          ${renderFulfillmentBar(f.pct, 'PO Fulfillment')}
                          <div class="small text-muted mt-2">${f.totalReceived} / ${f.totalOrdered} pcs received</div>
                        `;
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Lines -->
              <div class="mb-4">
                <h6 class="mb-3">Order Lines</h6>
                <div class="table-responsive lines-scroll-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Ordered</th>
                        <th>Received</th>
                        <th>Remaining</th>
                        <th>Unit Price</th>
                        <th>Line HT</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${getPOFulfillment(po).lines.map(line => `
                        <tr>
                          <td>
                            <a href="#" class="text-primary fw-medium" onclick="showProductModal('${line.product_id}', 'view'); return false;">
                              ${line.product_name}
                            </a>
                          </td>
                          <td>${line.ordered}</td>
                          <td class="text-success fw-medium">${line.received}</td>
                          <td>${line.remaining}</td>
                          <td>${formatCurrency(line.unit_price_ht, 3)}</td>
                          <td>${formatCurrency(line.ordered * line.unit_price_ht, 3)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="5" class="text-end fw-bold">Total HT</td>
                        <td class="fw-bold">${formatCurrency(po.total_ht, 3)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              ${po.notes ? `
                <div class="mb-4">
                  <h6 class="mb-2">Notes</h6>
                  <p class="text-secondary">${po.notes}</p>
                </div>
              ` : ''}

              ${deliveries.length > 0 ? `
                <div class="mb-4">
                  <h6 class="mb-3">Deliveries</h6>
                  ${deliveries.map(d => `
                    <div class="card mb-2">
                      <div class="card-body py-2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <a href="#" class="fw-medium text-primary" onclick="navigateToDeliveriesAndShow('${d.id}'); return false;">${d.delivery_number}</a>
                            <span class="status-badge ${normalizeDeliveryStatus(d.status)} ms-2">${formatStatus(normalizeDeliveryStatus(d.status))}</span>
                          </div>
                          <div class="text-end">
                            <div class="fw-medium">${formatCurrency(getDeliveryAmount(d))}</div>
                            <small class="text-muted">${d.delivery_date ? formatDate(d.delivery_date) : 'Pending'}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              ${payments.length > 0 ? `
                <div class="mb-4">
                  <h6 class="mb-3">Payments</h6>
                  ${payments.map(p => `
                    <div class="card mb-2">
                      <div class="card-body py-2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <span class="fw-medium">${p.payment_reference}</span>
                            <span class="status-badge ${p.status} ms-2">${formatStatus(p.status)}</span>
                          </div>
                          <div class="text-end">
                            <div class="fw-bold">${formatCurrency(p.amount_paid || 0)} / ${formatCurrency(p.amount)}</div>
                            <small class="text-muted">${p.payment_date ? formatDate(p.payment_date) : 'Pending'}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

            ` : `
              <form id="poForm">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">PO Number *</label>
                    <input type="text" class="form-control" id="poNumber" value="${po ? po.po_number : peekNextPONumber()}" readonly required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Order Date *</label>
                    <input type="date" class="form-control" id="poDate" value="${po ? po.date : new Date().toISOString().split('T')[0]}" required>
                  </div>
                  ${po ? `<input type="hidden" id="poId" value="${po.id}">` : ''}
                  <div class="col-md-6">
                    <label class="form-label">Supplier Reference</label>
                    <input type="text" class="form-control" id="poRef" value="${po?.supplier_reference || ''}">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Expected Delivery Date</label>
                    <input type="date" class="form-control" id="poDeliveryDate" value="${po?.expected_delivery_date || ''}">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <select class="form-select" id="poStatusEdit">
                      ${['draft', 'pending', 'approved', 'in-production', 'completed', 'completed-partial', 'cancelled'].map(s =>
                        `<option value="${s}" ${po && po.status === s ? 'selected' : (!po && s==='draft' ? 'selected' : '')}>${formatStatus(s)}</option>`
                      ).join('')}
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" id="poNotes" rows="2">${po?.notes || ''}</textarea>
                  </div>
                </div>

                <h6 class="mt-4 mb-3">Order Lines</h6>
                <div id="poLines">
                  ${po?.lines?.length ? po.lines.map((line, idx) => renderPOLine(line, idx)).join('') : renderPOLine(null, 0)}
                </div>
                <div class="d-flex justify-content-between align-items-center gap-3 mt-3">
                  <div>
                    <div class="text-muted small">Total Surface</div>
                    <div id="poLinesSurfaceTotal" class="fw-semibold">${po ? formatSurfaceMm2(calculatePOTotalSurface(po)) : '-'} </div>
                  </div>
                  <div>
                    <div class="text-muted small">Total Commande HT</div>
                    <div id="poLinesHTTotal" class="fw-semibold">${po ? formatCurrency(po.total_ht, 3) : formatCurrency(0, 3)}</div>
                  </div>
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm mt-2" onclick="addPOLine()">
                  <i class="fas fa-plus me-1"></i>Add Line
                </button>
              </form>
            `}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            ${showReadOnly ? `
              <button type="button" class="btn btn-outline-primary" onclick="printPO('${po.id}')">
                <i class="fas fa-print me-1"></i>Print PO
              </button>
              ${canWrite() ? `
                <button type="button" class="btn btn-outline-secondary" onclick="showPOModal('${po.id}', { editMode: true })">
                  <i class="fas fa-pen me-1"></i>Edit PO
                </button>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <select class="form-select form-select-sm" id="poStatusSelect" style="width: auto;">
                    ${['draft', 'pending', 'approved', 'in-production', 'completed', 'completed-partial', 'cancelled'].map(s =>
                      `<option value="${s}" ${po.status === s ? 'selected' : ''}>${formatStatus(s)}</option>`
                    ).join('')}
                  </select>
                  <button type="button" class="btn btn-primary" onclick="updatePOStatus('${po.id}')">
                    <i class="fas fa-save me-1"></i>Update Status
                  </button>
                  ${(() => {
                    const f = getPOFulfillment(po);
                    return f.hasPartial && !['completed', 'completed-partial', 'cancelled'].includes(po.status) ? `
                      <button type="button" class="btn btn-outline-warning" onclick="closePOPartial('${po.id}')">
                        <i class="fas fa-flag-checkered me-1"></i>Close PO (Partial)
                      </button>
                    ` : '';
                  })()}
                </div>
              ` : ''}
            ` : `
              <button type="button" class="btn btn-primary" onclick="savePO()">
                <i class="fas fa-save me-1"></i>${po ? 'Update PO' : 'Create PO'}
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('poModal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  poLineIndex = po && isEditMode ? (po.lines?.length || 0) : 1;

  const modal = new bootstrap.Modal(document.getElementById('poModal'));
  modal.show();
  updatePOTotals();

  document.getElementById('poModal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });

  window.savePO = savePO;
  window.addPOLine = addPOLine;
  window.updatePOLineTotal = updatePOLineTotal;
  window.viewPOLineProduct = viewPOLineProduct;
  window.removePOLine = removePOLine;
  window.printPO = printPO;
  window.updatePOStatus = updatePOStatus;
  window.editPO = (poId) => showPOModal(poId, { editMode: true });
  window.navigateToProductsAndShow = showProductModal;
  window.closePOPartial = closePOPartial;
  window.navigateToDeliveriesAndShow = (deliveryId) => {
    bootstrap.Modal.getInstance(document.getElementById('poModal')).hide();
    navigateTo('deliveries');
    setTimeout(() => showDeliveryModal(deliveryId), 200);
  };
}

function renderPOLine(line, index) {
  const selectedProductId = line?.product_id || '';
  const selectedProduct = App.data.products.find(p => p.id === selectedProductId);
  const qtyValue = line?.quantity || 1;
  const unitPriceValue = line?.unit_price_ht != null ? line.unit_price_ht.toFixed(3) : (selectedProduct?.price_ht || '').toString();
  const surfaceValue = line?.surface_mm2 != null ? formatSurfaceMm2(line.surface_mm2) : '';
  const totalValue = line ? (line.line_total_ht || (line.quantity * line.unit_price_ht)).toFixed(3) : '';

  return `
    <div class="row g-2 mb-2 align-items-end po-line" data-index="${index}">
      <div class="col-md-4">
        <label class="form-label small mb-1">Product</label>
        <div class="input-group">
          <select class="form-select" id="poProduct${index}" onchange="updatePOLineTotal(${index})" required>
            <option value="">Select Product</option>
            ${App.data.products.map(p => `
              <option value="${p.id}" data-price="${p.price_ht}" data-surface="${p.surface_mm2 || 0}" ${p.id === selectedProductId ? 'selected' : ''}>
                ${p.name} (${p.reference})
              </option>
            `).join('')}
          </select>
          <button type="button" class="btn btn-outline-secondary" id="poViewProduct${index}" onclick="viewPOLineProduct(${index})" title="View product" ${selectedProductId ? '' : 'disabled'}>
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="col-md-1">
        <label class="form-label small mb-1">Qty</label>
        <input type="number" class="form-control" id="poQty${index}" placeholder="Qty" min="1" value="${qtyValue}" oninput="updatePOLineTotal(${index})" required>
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Surface</label>
        <input type="text" class="form-control" id="poSurface${index}" placeholder="mm²" readonly value="${surfaceValue}">
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Unit Price</label>
        <input type="text" class="form-control" id="poUnitPrice${index}" placeholder="Price" readonly value="${unitPriceValue}">
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Total HT</label>
        <input type="text" class="form-control" id="poLineTotal${index}" placeholder="Total" readonly value="${totalValue}">
      </div>
      <div class="col-md-1">
        <label class="form-label small mb-1">&nbsp;</label>
        <button type="button" class="btn btn-outline-danger btn-sm w-100" onclick="removePOLine(${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `;
}

let poLineIndex = 1;

function addPOLine() {
  const container = document.getElementById('poLines');
  container.insertAdjacentHTML('beforeend', renderPOLine(null, poLineIndex));
  poLineIndex++;
  updatePOTotals();
}

function updatePOLineTotal(index) {
  const productSelect = document.getElementById(`poProduct${index}`);
  const qtyInput = document.getElementById(`poQty${index}`);
  const priceInput = document.getElementById(`poUnitPrice${index}`);
  const surfaceInput = document.getElementById(`poSurface${index}`);
  const totalInput = document.getElementById(`poLineTotal${index}`);
  const viewBtn = document.getElementById(`poViewProduct${index}`);

  if (productSelect && productSelect.value) {
    const option = productSelect.options[productSelect.selectedIndex];
    const price = parseFloat(option.dataset.price) || 0;
    const surface = parseFloat(option.dataset.surface) || 0;
    const qty = parseInt(qtyInput.value) || 0;

    priceInput.value = price.toFixed(3);
    surfaceInput.value = surface > 0 ? formatSurfaceMm2(surface) : '-';
    totalInput.value = (price * qty).toFixed(3);
    if (viewBtn) viewBtn.disabled = false;
  } else {
    if (priceInput) priceInput.value = '';
    if (surfaceInput) surfaceInput.value = '';
    if (totalInput) totalInput.value = '';
    if (viewBtn) viewBtn.disabled = true;
  }
  updatePOTotals();
}

function viewPOLineProduct(index) {
  const productId = document.getElementById(`poProduct${index}`)?.value;
  if (productId) {
    const poModal = bootstrap.Modal.getInstance(document.getElementById('poModal'));
    if (poModal) poModal.hide();
    showProductModal(productId);
  }
}

function calculatePOTotalSurface(po) {
  return (po.lines || []).reduce((sum, line) => {
    const surface = parseFloat(line.surface_mm2) || 0;
    const qty = parseInt(line.quantity) || 0;
    return sum + surface * qty;
  }, 0);
}

function getPOFormSurfaceTotal() {
  const lineElements = document.querySelectorAll('.po-line');
  let totalSurface = 0;
  lineElements.forEach(el => {
    const productSelect = document.getElementById(`poProduct${el.dataset.index}`);
    const qtyInput = document.getElementById(`poQty${el.dataset.index}`);
    const surfaceInput = document.getElementById(`poSurface${el.dataset.index}`);
    const qty = parseInt(qtyInput?.value) || 0;
    const surface = productSelect?.value ? parseFloat(productSelect.options[productSelect.selectedIndex].dataset.surface) || 0 : 0;
    totalSurface += surface * qty;
  });
  return totalSurface;
}

function getPOFormHTTotal() {
  const lineElements = document.querySelectorAll('.po-line');
  let total = 0;
  lineElements.forEach(el => {
    const totalInput = document.getElementById(`poLineTotal${el.dataset.index}`);
    const amount = parseFloat(totalInput?.value) || 0;
    total += amount;
  });
  return total;
}

function updatePOTotals() {
  const surfaceEl = document.getElementById('poLinesSurfaceTotal');
  const htEl = document.getElementById('poLinesHTTotal');
  if (surfaceEl) {
    surfaceEl.textContent = formatSurfaceMm2(getPOFormSurfaceTotal());
  }
  if (htEl) {
    htEl.textContent = formatCurrency(getPOFormHTTotal(), 3);
  }
}

function removePOLine(index) {
  const line = document.querySelector(`.po-line[data-index="${index}"]`);
  if (line) {
    line.remove();
    updatePOTotals();
  }
}

async function savePO() {
  if (!canWrite()) return;
  const lines = [];
  const lineElements = document.querySelectorAll('.po-line');

  lineElements.forEach(el => {
    const index = el.dataset.index;
    const productSelect = document.getElementById(`poProduct${index}`);
    const qtyInput = document.getElementById(`poQty${index}`);
    const priceInput = document.getElementById(`poUnitPrice${index}`);

    if (productSelect.value && qtyInput.value) {
      const product = App.data.products.find(p => p.id === productSelect.value);
      const surfaceInput = document.getElementById(`poSurface${index}`);
      const surface = product.surface_mm2 || parseFloat(surfaceInput?.dataset?.raw || 0) || 0;
      lines.push({
        product_id: productSelect.value,
        product_name: product.name,
        quantity: parseInt(qtyInput.value),
        unit_price_ht: parseFloat(priceInput.value),
        surface_mm2: surface,
        line_total_ht: parseFloat(priceInput.value) * parseInt(qtyInput.value),
        received_qty: 0
      });
    }
  });

  if (lines.length === 0) {
    showToast('Please add at least one product line', 'warning');
    return;
  }

  const poId = document.getElementById('poId')?.value;
  const existingPO = poId ? App.data.purchaseOrders.find(p => p.id === poId) : null;
  const totalHT = lines.reduce((sum, l) => sum + l.line_total_ht, 0);

  const newStatus = document.getElementById('poStatusEdit')?.value || 'draft';

  const po = existingPO ? {
    ...existingPO,
    status: newStatus,
    date: document.getElementById('poDate').value,
    supplier_reference: document.getElementById('poRef').value,
    expected_delivery_date: document.getElementById('poDeliveryDate').value,
    actual_delivery_date: existingPO.actual_delivery_date,
    lines: lines.map(line => ({
      ...line,
      received_qty: Math.min(
        existingPO.lines.find(l => l.product_id === line.product_id)?.received_qty || 0,
        line.quantity
      )
    })),
    total_ht: totalHT,
    total_ttc: totalHT,
    notes: document.getElementById('poNotes').value,
    updated_at: new Date().toISOString()
  } : {
    id: getNextId('PO', 'purchaseOrder'),
    po_number: getNextPONumber(),
    date: document.getElementById('poDate').value,
    status: newStatus,
    supplier_reference: document.getElementById('poRef').value,
    expected_delivery_date: document.getElementById('poDeliveryDate').value,
    actual_delivery_date: null,
    lines,
    total_ht: totalHT,
    total_ttc: totalHT,
    notes: document.getElementById('poNotes').value,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  await savePurchaseOrder(po);
  // savePurchaseOrder updates the in-memory portal data; App.data references that data so no manual push is required

  bootstrap.Modal.getInstance(document.getElementById('poModal')).hide();
  renderPage('purchase-orders');
  showToast(existingPO ? 'Purchase Order updated successfully' : 'Purchase Order created successfully', 'success');
}

function printPO(poId) {
  const po = App.data.purchaseOrders.find(p => p.id === poId);
  if (!po) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PO ${po.po_number}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; }
        .po-info { text-align: right; }
        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #f5f5f5; }
        .totals { margin-top: 20px; text-align: right; }
        .total-row { font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <img src="/logo-wave-vi.png" alt="WAVE VI" style="width: 90px; height: auto; margin-bottom: 12px; display: block;" />
          <div class="company-name">${App.data.settings.companyName}</div>
          <div>Supplier: SGS Printing Services</div>
        </div>
        <div class="po-info">
          <h1>PURCHASE ORDER</h1>
          <div><strong>${po.po_number}</strong></div>
          <div>Date: ${formatDate(po.date)}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${po.lines.map(l => `
            <tr>
              <td>${l.product_name}</td>
              <td>${l.quantity}</td>
              <td>${formatCurrency(l.unit_price_ht)}</td>
              <td>${formatCurrency((l.quantity || 0) * (l.unit_price_ht || 0))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <p class="total-row">Total HT: ${formatCurrency(po.total_ht, 3)}</p>

      ${po.notes ? `<p style="margin-top: 30px;"><strong>Notes:</strong> ${po.notes}</p>` : ''}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

async function updatePOStatus(poId) {
  if (!canWrite()) return;
  const po = App.data.purchaseOrders.find(p => p.id === poId);
  if (!po) return;

  const newStatus = document.getElementById('poStatusSelect')?.value;
  if (!newStatus || newStatus === po.status) {
    showToast('Please select a different status', 'warning');
    return;
  }

  if (newStatus === 'completed-partial') {
    await closePOPartial(poId);
    return;
  }

  if (newStatus === 'completed') {
    const fulfillment = getPOFulfillment(po);
    if (!fulfillment.isComplete) {
      showToast('PO is not fully received. Use Close PO (Partial) or receive remaining qty.', 'warning');
      return;
    }
  }

  po.status = newStatus;
  po.updated_at = new Date().toISOString();

  if (newStatus === 'in-production') {
    const delivery = createDeliveryFromPO(po);
    if (delivery) {
      const exists = App.data.deliveries.some(d => d.id === delivery.id);
      if (!exists) {
        await dbSaveDelivery(delivery);
        // dbSaveDelivery updated portal data; no need to push into App.data (shared reference)
        showToast(`Delivery ${delivery.delivery_number} created`, 'info');
      }
    }
  }

  if (newStatus === 'completed') {
    po.actual_delivery_date = po.actual_delivery_date || new Date().toISOString().split('T')[0];
  }

  await savePurchaseOrder(po);
  updateNotifications();

  bootstrap.Modal.getInstance(document.getElementById('poModal')).hide();
  renderPage('purchase-orders');
  showToast(`PO status updated to ${formatStatus(po.status)}`, 'success');
}

function exportPOs() {
  const csv = [
    ['PO Number', 'Date', 'Status', 'Amount HT', 'Delivery Date'].join(','),
    ...App.data.purchaseOrders.map(po => [
      po.po_number,
      po.date,
      po.status,
      po.total_ht,
      po.actual_delivery_date || po.expected_delivery_date || ''
    ].join(','))
  ].join('\n');

  downloadCSV(csv, 'purchase-orders.csv');
}

// ============================================
// DELIVERIES PAGE
// ============================================
function renderDeliveries(container) {
  const deliveries = App.data.deliveries;
  const pending = deliveries.filter(d => normalizeDeliveryStatus(d.status) === 'pending').length;
  const partial = deliveries.filter(d => normalizeDeliveryStatus(d.status) === 'partial').length;
  const delivered = deliveries.filter(d => normalizeDeliveryStatus(d.status) === 'delivered').length;
  const confirmedAmount = deliveries
    .filter(d => ['partial', 'delivered'].includes(normalizeDeliveryStatus(d.status)))
    .reduce((sum, d) => sum + getDeliveryAmount(d), 0);

  container.innerHTML = `
    <div class="split-pane-layout">
      
      <!-- List Pane -->
      <div class="split-pane-list" style="width: 340px;">
        <div class="split-pane-list-header">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-3);">
            <h1 class="split-pane-list-title" style="margin: 0;">Deliveries</h1>
          </div>
          
          <div style="display: flex; gap: var(--sp-2);">
            <input type="text" class="filter-search" placeholder="Search deliveries…" oninput="filterDeliveryList(this.value)" style="padding-left: 12px;">
            <select class="filter-select" id="deliveryStatusFilter" onchange="filterDeliveryList()" style="min-width: 100px;">
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div class="split-pane-list-content" id="deliveryListContainer">
          ${generateDeliveryListItems(deliveries)}
        </div>
      </div>

      <!-- Detail Pane -->
      <div class="split-pane-detail" id="deliveryDetailContainer">
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-truck"></i></div>
          <h3>No delivery selected</h3>
          <p>Select a delivery from the list to view details</p>
        </div>
      </div>
      
    </div>
  `;

  window.filterDeliveryList = filterDeliveryList;
  window.renderDeliveryDetails = renderDeliveryDetails;
  window.showDeliveryModal = showDeliveryModal;

  // Auto-select first delivery if available
  if (deliveries.length > 0) {
    setTimeout(() => renderDeliveryDetails(deliveries[0].id), 50);
  }
}

function generateDeliveryListItems(deliveries) {
  if (deliveries.length === 0) return `<div class="empty-state" style="padding: var(--sp-8);"><div class="empty-state-icon"><i class="fa-solid fa-truck"></i></div><h3>No deliveries</h3><p>No deliveries match your filter</p></div>`;
  
  return deliveries.sort((a,b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).map(d => {
    const status = normalizeDeliveryStatus(d.status);
    const statusDotClass = status === 'delivered' ? 'status-success'
      : status === 'cancelled' ? 'status-danger'
      : status === 'partial' ? 'status-primary'
      : 'status-warning';
    return `
    <div class="list-item-card" id="delivery-list-item-${d.id}" onclick="renderDeliveryDetails('${d.id}')">
      <div class="list-item-title">
        <span class="list-item-ref">${d.delivery_number}</span>
        <span class="list-item-amount">${formatCurrency(getDeliveryAmount(d), 0)}</span>
      </div>
      <div class="list-item-sub">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;" title="${d.po_number}">${d.po_number}</span>
        <span class="status-indicator ${statusDotClass}" title="${status}"></span>
      </div>
    </div>
  `}).join('');
}

function filterDeliveryList(searchQuery = '') {
  const status = document.getElementById('deliveryStatusFilter')?.value || '';
  let query = typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';
  
  let filtered = App.data.deliveries;

  if (status) {
    filtered = filtered.filter(d => normalizeDeliveryStatus(d.status) === status);
  }
  if (query) {
    filtered = filtered.filter(d => d.delivery_number.toLowerCase().includes(query) || d.po_number.toLowerCase().includes(query));
  }

  const container = document.getElementById('deliveryListContainer');
  if (container) {
    container.innerHTML = generateDeliveryListItems(filtered);
  }
}

function renderDeliveryDetails(deliveryId) {
  // Update active state in list
  document.querySelectorAll('#deliveryListContainer .list-item-card').forEach(el => el.classList.remove('active'));
  const activeItem = document.getElementById(`delivery-list-item-${deliveryId}`);
  if (activeItem) activeItem.classList.add('active');

  const delivery = App.data.deliveries.find(d => d.id === deliveryId);
  const container = document.getElementById('deliveryDetailContainer');
  if (!delivery || !container) return;

  const status = normalizeDeliveryStatus(delivery.status);
  const payment = App.data.payments.find(p => p.related_delivery === delivery.id);
  const canConfirm = canWrite() && status === 'pending';
  const po = App.data.purchaseOrders.find(p => p.id === delivery.related_po);
  const poFulfillment = po ? getPOFulfillment(po) : null;
  const amount = getDeliveryAmount(delivery);

  const totalRemaining = delivery.lines.reduce((s, l) => s + (l.remaining_qty ?? l.ordered_qty), 0);
  const totalReceiving = delivery.lines.reduce((s, l) => s + (l.delivered_qty || l.receive_qty || 0), 0);
  const qtyPct = totalRemaining > 0 ? Math.round((totalReceiving / totalRemaining) * 100) : (status !== 'pending' ? 100 : 0);

  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <div class="d-flex align-items-center gap-3 mb-2">
          <h2 class="m-0 fs-3 fw-bold">${delivery.delivery_number}</h2>
          <span class="badge rounded-pill border" style="background: var(--bg-page); color: var(--text-primary);">${formatStatus(status)}</span>
        </div>
        <p class="text-muted m-0">PO: <a href="#" class="text-primary text-decoration-none" onclick="navigateTo('purchase-orders');setTimeout(()=>renderPODetails('${po?.id}'),100);return false;">${delivery.po_number}</a></p>
      </div>
      <div class="d-flex gap-2">
        ${canConfirm ? `<button class="btn btn-primary btn-sm" onclick="showDeliveryModal('${delivery.id}')"><i class="fas fa-check me-1"></i> Confirm Receipt</button>` : ''}
      </div>
    </div>

    <div class="row g-4 mb-4 mt-2">
      <div class="col-md-4">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-3 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Delivery Value</h6>
          <div class="fs-4 fw-bold text-primary">${formatCurrency(amount)}</div>
          <div class="small text-muted mt-1">${delivery.delivery_date ? formatDate(delivery.delivery_date) : 'Pending Delivery Date'}</div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-3 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Fulfillment Progress</h6>
          <div class="d-flex justify-content-between mb-2 small fw-bold">
            <span>${totalReceiving} / ${totalRemaining} pcs</span>
            <span class="text-primary">${qtyPct}%</span>
          </div>
          <div class="progress mb-2" style="height: 6px;">
            <div class="progress-bar bg-primary" style="width: ${qtyPct}%"></div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-3 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Payment Status</h6>
          ${payment ? `
            <div class="d-flex justify-content-between mb-2 small fw-bold">
              <span>${formatCurrency(payment.amount_paid || 0)}</span>
              <span class="${payment.status === 'paid' ? 'text-success' : 'text-warning'}">${formatStatus(payment.status)}</span>
            </div>
            <div class="progress" style="height: 6px;">
              <div class="progress-bar ${payment.status === 'paid' ? 'bg-success' : 'bg-warning'}" style="width: ${Math.round(((payment.amount_paid||0) / payment.amount)*100)}%"></div>
            </div>
            <a href="#" class="small text-decoration-none mt-3 d-block" onclick="navigateTo('payments');setTimeout(()=>showPaymentModal('${payment.id}'),100);return false;">View Payment ${payment.payment_reference}</a>
          ` : `
            <div class="text-muted small">No payment record found.</div>
          `}
        </div>
      </div>
    </div>

    ${poFulfillment ? `
      <div class="alert alert-light border shadow-sm mb-4">
        <div class="d-flex justify-content-between mb-2 small fw-bold">
          <span class="text-muted"><i class="fa-solid fa-chart-pie me-2"></i>Overall PO Fulfillment</span>
          <span>${poFulfillment.pct}%</span>
        </div>
        <div class="progress" style="height: 4px;">
          <div class="progress-bar bg-secondary" style="width: ${poFulfillment.pct}%"></div>
        </div>
      </div>
    ` : ''}

    <h6 class="fw-bold mb-3 mt-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Delivery Lines (${delivery.lines?.length || 0})</h6>
    <div class="table-responsive rounded border mb-4 lines-scroll-container">
      <table class="table table-borderless table-hover mb-0 align-middle">
        <thead style="background: var(--bg-page); border-bottom: 1px solid var(--border-color);">
          <tr>
            <th class="py-3 px-3 text-secondary small text-uppercase">Product</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-center">Remaining</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-center">Received</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-end">Line Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(delivery.lines || []).map(line => `
            <tr class="border-bottom">
              <td class="p-3">
                <a href="#" class="text-primary fw-medium text-decoration-none d-block mb-1" onclick="showProductModal('${line.product_id}'); return false;">${line.product_name}</a>
                <span class="badge border" style="background: var(--bg-page); color: var(--text-primary);">${formatCurrency(line.unit_price_ht, 3)} / u</span>
              </td>
              <td class="p-3 text-center text-muted fw-medium">${line.remaining_qty ?? line.ordered_qty}</td>
              <td class="p-3 text-center ${(line.delivered_qty||0) >= (line.remaining_qty ?? line.ordered_qty) ? 'text-success' : 'text-primary'} fw-bold">${line.delivered_qty || line.receive_qty || 0}</td>
              <td class="p-3 text-end fw-bold">${formatCurrency((line.line_total || 0), 3)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${delivery.notes ? `
      <h6 class="fw-bold mb-2 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Notes</h6>
      <div class="p-3 rounded border mb-4 text-secondary" style="background: var(--bg-page);">${delivery.notes}</div>
    ` : ''}
  `;
}
// Legacy functions removed

// filterDeliveryList replaced filterDeliveries

function showDeliveryModal(deliveryId) {
  const delivery = App.data.deliveries.find(d => d.id === deliveryId);
  if (!delivery) return;

  const status = normalizeDeliveryStatus(delivery.status);
  const payment = App.data.payments.find(p => p.related_delivery === delivery.id);
  const canConfirm = canWrite() && status === 'pending';
  const po = App.data.purchaseOrders.find(p => p.id === delivery.related_po);
  const poFulfillment = po ? getPOFulfillment(po) : null;

  const modalHtml = `
    <div class="modal fade" id="deliveryModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fa-solid fa-truck me-2 text-primary-brand"></i>${delivery.delivery_number}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <div class="info-tile">
                  <small>Status</small>
                  <div><span class="status-badge ${status}">${formatStatus(status)}</span></div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="info-tile">
                  <small>PO</small>
                  <div class="fw-semibold">${delivery.po_number}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="info-tile">
                  <small>${canConfirm ? 'Preview Amount' : 'Confirmed Amount'}</small>
                  <div class="fw-bold text-primary-brand" id="deliveryPreviewTotal_${delivery.id}">${formatCurrency(getDeliveryAmount(delivery))}</div>
                </div>
              </div>
            </div>

            ${poFulfillment ? `
              <div class="card mb-4">
                <div class="card-body py-3">
                  ${renderFulfillmentBar(poFulfillment.pct, 'PO fulfillment')}
                  <div class="small text-muted mt-2">${poFulfillment.totalReceived} / ${poFulfillment.totalOrdered} pcs received on PO</div>
                </div>
              </div>
            ` : ''}

            ${canConfirm ? `
              <div class="alert alert-info py-2 small mb-4">
                <i class="fa-solid fa-info-circle me-2"></i>
                Enter received quantities (e.g. 80 of 100). Payment will be created only for received products.
              </div>
            ` : payment ? `
              <div class="alert alert-light border py-2 small mb-4">
                <i class="fa-solid fa-credit-card me-2"></i>
                Payment <strong>${payment.payment_reference}</strong> —
                ${formatCurrency(payment.amount_paid || 0)} / ${formatCurrency(payment.amount)}
                <span class="status-badge ${payment.status} ms-2">${formatStatus(payment.status)}</span>
              </div>
            ` : ''}

            <h6 class="section-title">Delivery Lines</h6>
            <div class="table-card mb-3">
              <div class="table-responsive lines-scroll-container">
                <table class="data-table mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Remaining</th>
                      <th>${canConfirm ? 'Receive Now' : 'Received'}</th>
                      <th>Unit Price</th>
                      <th>Line Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${delivery.lines.map((line, idx) => `
                      <tr>
                        <td>${line.product_name}</td>
                        <td>${line.remaining_qty ?? line.ordered_qty}</td>
                        <td>
                          ${canConfirm ? `
                            <input type="number" class="form-control form-control-sm" style="width:90px"
                              id="receiveQty_${delivery.id}_${idx}"
                              value="${line.receive_qty ?? line.remaining_qty ?? 0}"
                              min="0" max="${line.remaining_qty ?? line.ordered_qty}"
                              oninput="updateDeliveryPreviewAmount('${delivery.id}')">
                          ` : (line.delivered_qty || 0)}
                        </td>
                        <td>${formatCurrency(line.unit_price_ht)}</td>
                        <td id="lineAmount_${delivery.id}_${idx}">${formatCurrency(getLineDeliveryAmount(line))}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            ${canConfirm ? `
              ${poFulfillment?.hasPartial ? `
                <button type="button" class="btn btn-outline-warning" onclick="closePOPartial('${po?.id}')">
                  <i class="fas fa-flag-checkered me-1"></i>Close PO (Partial)
                </button>
              ` : ''}
              <button type="button" class="btn btn-outline-danger" onclick="cancelDelivery('${delivery.id}')">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="confirmDelivery('${delivery.id}')">
                <i class="fas fa-check me-1"></i>Confirm Receipt
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('deliveryModal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = new bootstrap.Modal(document.getElementById('deliveryModal'));
  modal.show();

  if (canConfirm) updateDeliveryPreviewAmount(delivery.id);

  document.getElementById('deliveryModal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });

  window.confirmDelivery = confirmDelivery;
  window.cancelDelivery = cancelDelivery;
  window.updateDeliveryPreviewAmount = updateDeliveryPreviewAmount;
  window.closePOPartial = closePOPartial;
  window.navigateToProductsAndShow = (productId) => {
    bootstrap.Modal.getInstance(document.getElementById('deliveryModal'))?.hide();
    navigateTo('products');
    setTimeout(() => showProductModal(productId), 200);
  };
}

async function confirmDelivery(deliveryId) {
  if (!canWrite()) return;

  const delivery = App.data.deliveries.find(d => d.id === deliveryId);
  if (!delivery || normalizeDeliveryStatus(delivery.status) !== 'pending') return;

  const po = App.data.purchaseOrders.find(p => p.id === delivery.related_po);
  if (!po) return;

  let totalReceivedNow = 0;

  for (let idx = 0; idx < delivery.lines.length; idx++) {
    const line = delivery.lines[idx];
    const input = document.getElementById(`receiveQty_${deliveryId}_${idx}`);
    const qty = parseInt(input?.value) || 0;
    const max = line.remaining_qty ?? line.ordered_qty;

    if (qty < 0 || qty > max) {
      showToast(`Invalid quantity for ${line.product_name} (max ${max})`, 'warning');
      return;
    }

    line.receive_qty = qty;
    line.delivered_qty = qty;
    line.line_total = qty * (line.unit_price_ht || 0);
    totalReceivedNow += qty;

    const poLine = po.lines.find(l => l.product_id === line.product_id);
    if (poLine && qty > 0) {
      poLine.received_qty = (poLine.received_qty || 0) + qty;
    }
  }

  if (totalReceivedNow === 0) {
    showToast('Enter at least one received quantity', 'warning');
    return;
  }

  delivery.amount = getDeliveryAmount(delivery);
  delivery.delivery_date = new Date().toISOString().split('T')[0];
  delivery.updated_at = new Date().toISOString();

  const fulfillment = getPOFulfillment(po);
  delivery.status = fulfillment.isComplete ? 'delivered' : 'partial';

  await dbSaveDelivery(delivery);
  await createPaymentFromDelivery(delivery);

  if (fulfillment.isComplete) {
    po.status = 'completed';
    po.actual_delivery_date = delivery.delivery_date;
  }

  po.updated_at = new Date().toISOString();
  await savePurchaseOrder(po);

  if (!fulfillment.isComplete && !['completed-partial', 'cancelled'].includes(po.status)) {
    const nextDelivery = createDeliveryFromPO(po);
    if (nextDelivery) {
      await dbSaveDelivery(nextDelivery);
      // dbSaveDelivery updates the shared portal data; no manual push required
    }
  }

  updateNotifications();
  bootstrap.Modal.getInstance(document.getElementById('deliveryModal')).hide();
  renderPage('deliveries');
  showToast(`Received ${totalReceivedNow} pcs — payment created for ${formatCurrency(delivery.amount)}`, 'success');
}

async function cancelDelivery(deliveryId) {
  if (!canWrite()) return;
  if (!confirm('Cancel this delivery?')) return;

  const delivery = App.data.deliveries.find(d => d.id === deliveryId);
  if (!delivery) return;

  delivery.status = 'cancelled';
  delivery.updated_at = new Date().toISOString();
  await dbSaveDelivery(delivery);

  bootstrap.Modal.getInstance(document.getElementById('deliveryModal')).hide();
  renderPage('deliveries');
  showToast('Delivery cancelled', 'info');
}

// ============================================
// PAYMENTS PAGE
// ============================================
function renderPayments(container) {
  const payments = App.data.payments;
  const totals = calculatePaymentTotals();
  const payPct = totals.totalInvoiced > 0 ? Math.round((totals.totalPaid / totals.totalInvoiced) * 100) : 0;

  container.innerHTML = `
    ${getReadOnlyBanner()}
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title"><i class="fa-solid fa-credit-card me-2 text-primary-brand"></i>Payments</h1>
        <p class="page-subtitle">Payments based on confirmed deliveries only</p>
      </div>
    </div>

    <div class="payment-summary mb-4">
      <div class="payment-summary-item">
        <div class="amount text-primary-brand">${formatCurrency(totals.totalInvoiced)}</div>
        <div class="label">To Pay (Delivered)</div>
      </div>
      <div class="payment-summary-item">
        <div class="amount text-success">${formatCurrency(totals.totalPaid)}</div>
        <div class="label">Paid</div>
      </div>
      <div class="payment-summary-item">
        <div class="amount text-warning">${formatCurrency(totals.remaining)}</div>
        <div class="label">Outstanding</div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-body py-4">
        <div class="d-flex justify-content-between mb-2">
          <span class="small text-muted">Collection progress</span>
          <span class="small fw-bold text-primary-brand">${payPct}%</span>
        </div>
        <div class="progress-custom" style="height:10px">
          <div class="progress-bar-custom" style="width:${payPct}%;background:#10B981"></div>
        </div>
      </div>
    </div>

    <div class="filter-bar">
      <select class="filter-select form-select form-select-sm" id="paymentStatusFilter" onchange="filterPayments()" style="width:160px">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="partial">Partial</option>
        <option value="paid">Paid</option>
      </select>
      <select class="filter-select form-select form-select-sm" id="paymentMethodFilter" onchange="filterPayments()" style="width:160px">
        <option value="">All Methods</option>
        <option value="bank-transfer">Bank Transfer</option>
        <option value="cheque">Cheque</option>
        <option value="cash">Cash</option>
      </select>
      <span class="ms-auto text-muted small">${payments.length} payments</span>
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table class="data-table mb-0">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Delivery</th>
              <th>PO</th>
              <th>Due</th>
              <th>Paid</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="paymentsTableBody">
            ${payments.length ? payments.map(p => renderPaymentRow(p)).join('') : `
              <tr><td colspan="7" class="text-center text-muted py-4">No payments yet</td></tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;

  window.filterPayments = filterPayments;
  window.showPaymentModal = showPaymentModal;
  window.showDeliveryModal = showDeliveryModal;
}

function calculatePaymentTotals() {
  const confirmedDeliveries = App.data.deliveries.filter(d =>
    ['partial', 'delivered'].includes(normalizeDeliveryStatus(d.status))
  );
  const totalInvoiced = confirmedDeliveries.reduce((sum, d) => sum + getDeliveryAmount(d), 0);
  const totalPaid = App.data.payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);

  return {
    totalInvoiced,
    totalPaid,
    remaining: Math.max(0, totalInvoiced - totalPaid)
  };
}

function renderPaymentRow(payment) {
  const remaining = getPaymentRemaining(payment);
  return `
    <tr data-status="${payment.status}" data-method="${payment.payment_method}">
      <td class="fw-medium">${payment.payment_reference}</td>
      <td>${payment.delivery_number ? `<a href="#" class="po-link" onclick="navigateTo('deliveries'); setTimeout(() => showDeliveryModal('${payment.related_delivery}'), 200); return false;">${payment.delivery_number}</a>` : '—'}</td>
      <td>${payment.po_number}</td>
      <td>${formatCurrency(payment.amount)}</td>
      <td class="text-success fw-medium">${formatCurrency(payment.amount_paid || 0)}</td>
      <td><span class="status-badge ${payment.status}">${formatStatus(payment.status)}</span></td>
      <td>
        ${canWrite() && payment.status !== 'paid' ? `
          <button class="btn-action btn-action-view" title="Record payment" onclick="showPaymentModal('${payment.id}')">
            <i class="fas fa-wallet"></i>
          </button>
        ` : '<span class="text-muted small">—</span>'}
      </td>
    </tr>
  `;
}

function showPaymentModal(paymentId) {
  if (!canWrite()) return;
  const payment = App.data.payments.find(p => p.id === paymentId);
  if (!payment || payment.status === 'paid') return;

  const remaining = getPaymentRemaining(payment);

  const modalHtml = `
    <div class="modal fade" id="paymentModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fa-solid fa-wallet me-2 text-primary-brand"></i>Record Payment</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <small class="text-muted">Reference</small>
              <div class="fw-semibold">${payment.payment_reference}</div>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-4"><small class="text-muted d-block">Due</small><strong>${formatCurrency(payment.amount)}</strong></div>
              <div class="col-4"><small class="text-muted d-block">Paid</small><strong class="text-success">${formatCurrency(payment.amount_paid || 0)}</strong></div>
              <div class="col-4"><small class="text-muted d-block">Remaining</small><strong class="text-warning">${formatCurrency(remaining)}</strong></div>
            </div>
            <label class="form-label">Payment Amount</label>
            <input type="number" step="0.01" min="0.01" max="${remaining}" class="form-control" id="payAmountInput" value="${remaining.toFixed(2)}">
            <small class="text-muted">Partial payments supported — pay only for received delivery amount.</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="recordPartialPayment('${payment.id}')">
              <i class="fas fa-check me-1"></i>Record Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('paymentModal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  new bootstrap.Modal(document.getElementById('paymentModal')).show();
  document.getElementById('paymentModal').addEventListener('hidden.bs.modal', function() { this.remove(); });

  window.recordPartialPayment = recordPartialPayment;
}

async function recordPartialPayment(paymentId) {
  if (!canWrite()) return;
  const payment = App.data.payments.find(p => p.id === paymentId);
  if (!payment) return;

  const remaining = getPaymentRemaining(payment);
  const amount = parseFloat(document.getElementById('payAmountInput')?.value) || 0;

  if (amount <= 0 || amount > remaining + 0.001) {
    showToast(`Enter an amount between 0.01 and ${formatCurrency(remaining)}`, 'warning');
    return;
  }

  payment.amount_paid = (payment.amount_paid || 0) + amount;
  payment.payment_date = new Date().toISOString().split('T')[0];
  payment.updated_at = new Date().toISOString();

  if (payment.amount_paid >= payment.amount - 0.001) {
    payment.amount_paid = payment.amount;
    payment.status = 'paid';
  } else {
    payment.status = 'partial';
  }

  await dbSavePayment(payment);
  bootstrap.Modal.getInstance(document.getElementById('paymentModal'))?.hide();
  renderPage('payments');
  showToast(`Payment recorded: ${formatCurrency(amount)}`, 'success');
}

function filterPayments() {
  const status = document.getElementById('paymentStatusFilter')?.value || '';
  const method = document.getElementById('paymentMethodFilter')?.value || '';

  let filtered = App.data.payments;

  if (status) {
    filtered = filtered.filter(p => p.status === status);
  }

  if (method) {
    filtered = filtered.filter(p => p.payment_method === method);
  }

  const tbody = document.getElementById('paymentsTableBody');
  if (tbody) {
    tbody.innerHTML = filtered.map(p => renderPaymentRow(p)).join('');
  }
}

// ============================================
// DOCUMENTS PAGE
// ============================================
function renderDocuments(container) {
  const documents = App.data.documents;

  container.innerHTML = `
    ${getReadOnlyBanner()}
    <div class="page-header">
      <h1 class="page-title">Document Center</h1>
      <p class="page-subtitle">${documents.length} documents available</p>
    </div>

    <!-- Category Filter -->
    <div class="filters-bar">
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn-primary-custom" onclick="filterDocumentsByCategory('')">
          All Documents
        </button>
        ${[
          { value: 'purchase-orders', label: 'Purchase Orders', icon: 'fa-file-invoice' },
          { value: 'invoices', label: 'Invoices', icon: 'fa-file-invoice-dollar' },
          { value: 'delivery-notes', label: 'Delivery Notes', icon: 'fa-file-export' },
          { value: 'technical-files', label: 'Technical Files', icon: 'fa-file-code' },
          { value: 'artwork-files', label: 'Artwork Files', icon: 'fa-palette' }
        ].map(cat => `
          <button class="btn-outline-custom" onclick="filterDocumentsByCategory('${cat.value}')">
            <i class="fas ${cat.icon}"></i> ${cat.label}
          </button>
        `).join('')}
      </div>
      <div class="filter-group ms-auto">
        <input type="text" class="form-control form-control-sm" id="docSearch" placeholder="Search documents..." oninput="searchDocuments()">
      </div>
    </div>

    <!-- Documents Grid -->
    <div class="row g-4" id="documentsGrid">
      ${documents.map(d => renderDocumentCard(d)).join('')}
    </div>
  `;

  window.filterDocumentsByCategory = filterDocumentsByCategory;
  window.searchDocuments = searchDocuments;
  window.previewDocument = previewDocument;
  window.downloadDocument = downloadDocument;
}

function previewDocument(docId) {
  const doc = App.data.documents.find(d => d.id === docId);
  if (doc) previewDataUrl(doc.data || doc.url, doc.name);
}

function downloadDocument(docId) {
  const doc = App.data.documents.find(d => d.id === docId);
  if (doc) downloadDataUrl(doc.data || doc.url, doc.name);
}

function renderDocumentCard(doc) {
  const iconMap = {
    pdf: 'fa-file-pdf text-danger',
    ai: 'fa-file-image text-warning',
    eps: 'fa-file-image text-info',
    psd: 'fa-file-image text-primary',
    svg: 'fa-file-image text-success'
  };
  const isPrintFile = doc.category === 'artwork-files' || doc.category === 'technical-files';
  const previewBtn = isPrintFile ? '' : `
    <button class="btn btn-outline-primary btn-sm flex-grow-1" onclick="previewDocument('${doc.id}')">
      <i class="fas fa-eye me-1"></i>Preview
    </button>`;

  return `
    <div class="col-md-6 col-lg-3">
      <div class="card h-100" data-category="${doc.category}" data-name="${doc.name.toLowerCase()}">
        <div class="card-body">
          <div class="d-flex align-items-start mb-3">
            <div class="me-3">
              <i class="fas ${iconMap[doc.type] || 'fa-file text-secondary'} fa-2x"></i>
            </div>
            <div class="flex-grow-1">
              <h6 class="mb-1">${doc.name}</h6>
              <small class="text-muted">${doc.size}</small>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span class="badge bg-primary-light text-primary">${formatCategory(doc.category)}</span>
            <small class="text-muted">${doc.created_at}</small>
          </div>
        </div>
        <div class="card-footer bg-transparent">
          <div class="d-flex gap-2">
            ${previewBtn}
            <button class="btn btn-primary btn-sm ${isPrintFile ? 'flex-grow-1' : ''}" onclick="downloadDocument('${doc.id}')">
              <i class="fas fa-download me-1"></i>Download
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function filterDocumentsByCategory(category) {
  const grid = document.getElementById('documentsGrid');
  const buttons = document.querySelectorAll('.filters-bar .btn');

  buttons.forEach(btn => {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline-secondary');
  });

  let filtered = App.data.documents;
  if (category) {
    filtered = filtered.filter(d => d.category === category);
  }

  grid.innerHTML = filtered.map(d => renderDocumentCard(d)).join('');
}

function searchDocuments() {
  const search = document.getElementById('docSearch')?.value.toLowerCase() || '';
  let filtered = App.data.documents;

  if (search) {
    filtered = filtered.filter(d => d.name.toLowerCase().includes(search));
  }

  const grid = document.getElementById('documentsGrid');
  grid.innerHTML = filtered.map(d => renderDocumentCard(d)).join('');
}

// ============================================
// SETTINGS PAGE
// ============================================
function renderSettings(container) {
  const settings = App.data.settings;

  container.innerHTML = `
    ${getReadOnlyBanner()}
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Configure your supplier portal</p>
    </div>

    <div class="row g-4">
      <!-- Company Info -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0"><i class="fas fa-building me-2"></i>Company Information</h6>
          </div>
          <div class="card-body">
            <form id="companyForm">
              <div class="mb-3">
                <label class="form-label">Company Name</label>
                <input type="text" class="form-control" id="companyName" value="${settings.companyName || 'WAVE VI'}">
              </div>
              <div class="mb-3">
                <label class="form-label">Supplier Name</label>
                <input type="text" class="form-control" id="supplierName" value="${settings.supplierName || 'SGS Printing Services'}">
              </div>
              <div class="mb-3">
                <label class="form-label">Currency</label>
                <select class="form-select" id="currency">
                  <option value="TND" ${settings.currency === 'TND' ? 'selected' : ''}>TND - Tunisian Dinar</option>
                  <option value="EUR" ${settings.currency === 'EUR' ? 'selected' : ''}>EUR - Euro</option>
                  <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>USD - US Dollar</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Default VAT Rate (%)</label>
                <input type="number" class="form-control" id="defaultVat" value="${settings.defaultVat || 20}">
              </div>
              <button type="button" class="btn btn-primary" onclick="saveSettings()">
                <i class="fas fa-save me-1"></i>Save Settings
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Theme -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0"><i class="fas fa-palette me-2"></i>Appearance</h6>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <label class="form-label">Theme</label>
              <div class="d-flex gap-3">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="theme" id="themeLight" value="light" ${App.theme === 'light' ? 'checked' : ''} onchange="toggleTheme()">
                  <label class="form-check-label" for="themeLight">
                    <i class="fas fa-sun text-warning me-1"></i>Light Mode
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="theme" id="themeDark" value="dark" ${App.theme === 'dark' ? 'checked' : ''} onchange="toggleTheme()">
                  <label class="form-check-label" for="themeDark">
                    <i class="fas fa-moon text-primary me-1"></i>Dark Mode
                  </label>
                </div>
              </div>
            </div>

            <hr>

            <div>
              <h6>Preview</h6>
              <div class="p-3 rounded border">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Sample Text</strong>
                    <p class="mb-0 text-muted small">This is how your portal will look</p>
                  </div>
                  <span class="badge bg-primary">Badge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data publishing -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0"><i class="fas fa-file-code me-2"></i>Publish Data (Admin)</h6>
          </div>
          <div class="card-body">
            <p class="text-muted small">
              ${isLocalDevPersistence
                ? 'On localhost, changes are saved automatically to <code>public/data/</code>. Commit those files when ready to publish.'
                : 'Changes made in the portal are kept in memory for this session only. Download JSON files and commit them to <code>public/data/</code> to publish updates on GitHub Pages.'}
            </p>
            <div class="d-flex flex-wrap gap-2">
              <button type="button" class="btn btn-outline-primary" onclick="exportDataFiles()">
                <i class="fas fa-download me-1"></i>Download JSON Files
              </button>
              <button type="button" class="btn btn-outline-secondary" onclick="exportBackup()">
                <i class="fas fa-file-archive me-1"></i>Combined Backup
              </button>
              <label class="btn btn-outline-secondary mb-0">
                <i class="fas fa-upload me-1"></i>Import to Session
                <input type="file" accept=".json,application/json" class="d-none" id="importBackupInput" onchange="importBackup(event)">
              </label>
            </div>
            <p class="text-muted small mt-3 mb-0">
              Migrating from IndexedDB?
              <a href="./admin-export.html" target="_blank" rel="noopener">Open the export utility</a>.
            </p>
          </div>
        </div>
      </div>

      <!-- Reload -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0"><i class="fas fa-arrows-rotate me-2"></i>Reload Hosted Data</h6>
          </div>
          <div class="card-body">
            <p class="text-muted small">Discard in-memory edits and reload the JSON files served from the repository.</p>
            <button class="btn btn-outline-secondary" onclick="reloadHostedData()">
              <i class="fas fa-sync me-1"></i>Reload from JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  window.saveSettings = saveSettings;
  window.exportBackup = exportBackup;
  window.exportDataFiles = exportDataFilesHandler;
  window.importBackup = importBackup;
  window.reloadHostedData = reloadHostedData;
}

async function saveSettings() {
  if (!canWrite()) return;
  App.data.settings = {
    companyName: document.getElementById('companyName').value,
    supplierName: document.getElementById('supplierName').value,
    currency: document.getElementById('currency').value,
    defaultVat: parseInt(document.getElementById('defaultVat').value) || 20,
    theme: App.theme
  };

  await dbSaveSettings(App.data.settings);
  updateSupplierDisplay();
  showToast('Settings saved successfully', 'success');
}

function exportDataFilesHandler() {
  try {
    downloadAllDataFiles();
    showToast('JSON files downloaded — commit them to public/data/', 'success');
  } catch (error) {
    console.error('Export failed:', error);
    showToast('Failed to export JSON files', 'danger');
  }
}

async function exportBackup() {
  try {
    const data = exportData();
    const date = new Date().toISOString().split('T')[0];
    downloadJSON(data, `wave-vi-backup-${date}.json`);
    showToast('Combined backup exported successfully', 'success');
  } catch (error) {
    console.error('Export failed:', error);
    showToast('Failed to export backup', 'danger');
  }
}

async function importBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    if (!confirm('Importing will replace in-memory data for this session. Continue?')) {
      event.target.value = '';
      return;
    }

    const data = importData(text);
    App.data.products = data.products;
    App.data.purchaseOrders = data.purchaseOrders;
    App.data.deliveries = data.deliveries;
    App.data.payments = data.payments;
    App.data.documents = data.documents;
    App.data.categories = data.categories;
    App.data.settings = data.settings;
    initializeTheme();
    renderPage(App.currentPage);
    showToast('Backup imported successfully', 'success');
  } catch (error) {
    console.error('Import failed:', error);
    showToast('Invalid backup file', 'danger');
  }

  event.target.value = '';
}

async function reloadHostedData() {
  if (!confirm('Reload data from hosted JSON files? Unsaved session changes will be lost.')) return;
  showToast('Reloading data...', 'info');
  await loadAllData();
  initializeTheme();
  renderPage(App.currentPage);
  showToast('Data reloaded from JSON files', 'success');
}

function updateSupplierDisplay() {
  // Profile names come from auth session; settings supplier name is edited in Settings page only.
}

function updateNotifications() {
  const badge = document.getElementById('notificationBadge');
  const list = document.getElementById('notificationsList');
  if (!badge || !list) return;

  const notifications = [];

  App.data.purchaseOrders
    .filter(po => po.status === 'pending' || po.status === 'draft')
    .slice(0, 3)
    .forEach(po => {
      notifications.push({
        icon: 'fa-file-invoice',
        iconClass: 'bg-info-soft text-info',
        text: `PO ${po.po_number} — ${formatStatus(po.status)}`,
        time: formatDate(po.created_at)
      });
    });

  App.data.deliveries
    .filter(d => normalizeDeliveryStatus(d.status) === 'pending')
    .slice(0, 2)
    .forEach(d => {
      notifications.push({
        icon: 'fa-truck',
        iconClass: 'bg-warning-soft text-warning',
        text: `Delivery ${d.delivery_number} awaiting confirmation`,
        time: 'Pending'
      });
    });

  App.data.payments
    .filter(p => p.status === 'pending')
    .slice(0, 2)
    .forEach(p => {
      notifications.push({
        icon: 'fa-credit-card',
        iconClass: 'bg-success-soft text-success',
        text: `Payment ${p.payment_reference} — ${formatCurrency(p.amount)}`,
        time: p.payment_date ? formatDate(p.payment_date) : 'Pending'
      });
    });

  badge.style.display = notifications.length > 0 ? '' : 'none';

  if (notifications.length === 0) {
    list.innerHTML = '<div class="notif-item"><div class="notif-content"><p class="text-muted mb-0">No notifications</p></div></div>';
  } else {
    list.innerHTML = notifications.map(n => `
      <div class="notif-item unread">
        <div class="notif-icon ${n.iconClass}"><i class="fa-solid ${n.icon}"></i></div>
        <div class="notif-content">
          <p>${n.text}</p>
          <span>${n.time}</span>
        </div>
      </div>
    `).join('');
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function renderStatusTimeline(currentStatus) {
  const statusOrder = ['draft', 'pending', 'approved', 'in-production', 'completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const items = statusOrder.map((s, i) => {
    const isActive = i <= currentIndex;
    const isCurrent = s === currentStatus;
    const statusClass = isCurrent ? s : (isActive ? 'completed' : 'draft');
    const icon = isActive ? '<i class="fas fa-check"></i>' : '<i class="fas fa-circle" style="font-size: 8px;"></i>';

    return `<div class="text-center" style="flex: 1;">
      <div class="status-badge ${statusClass} mb-2" style="width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
        ${icon}
      </div>
      <div><small>${formatStatus(s)}</small></div>
    </div>`;
  }).join('');
  
  return `<div class="d-flex justify-content-between align-items-center w-100 mb-4">${items}</div>`;
}

function formatCurrency(amount, minimumFractionDigits = 2) {
  const settings = App.data.settings || {};
  const currency = settings.currency || 'TND';
  const locale = currency === 'TND' ? 'fr-TN' : currency === 'EUR' ? 'fr-FR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits
  }).format(amount || 0);
}

function calculateSurfaceMm2(format, width, height) {
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  switch (format) {
    case 'circle': return Math.round(Math.PI * Math.pow(w / 2, 2) * 100) / 100;
    case 'square': return Math.round(w * w * 100) / 100;
    case 'rectangle': return Math.round(w * h * 100) / 100;
    default: return 0;
  }
}

function formatSurfaceMm2(value) {
  if (!value) return '-';
  return `${Number(value).toLocaleString('fr-FR')} mm²`;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function addDeliveryDocument(delivery, name, type, dataUrl) {
  const doc = {
    id: getNextId('DOC', 'document'),
    name,
    type,
    category: 'delivery-notes',
    size: formatFileSize(dataUrl),
    data: dataUrl,
    url: dataUrl,
    related_delivery: delivery.id,
    related_po: delivery.related_po,
    created_at: new Date().toISOString().split('T')[0]
  };
  await dbSaveDocument(doc);
  // dbSaveDocument persists document into portal data; no manual push required
  return doc;
}

function formatFileSize(dataUrl) {
  if (!dataUrl) return '-';
  const bytes = Math.round((dataUrl.length - 'data:'.length) * 0.75);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function previewDataUrl(dataUrl, filename) {
  if (dataUrl.startsWith('data:image/') || dataUrl.startsWith('data:application/pdf')) {
    window.open(dataUrl, '_blank');
  } else {
    downloadDataUrl(dataUrl, filename);
  }
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function formatStatus(status) {
  if (!status) return '-';
  return status.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatPaymentMethod(method) {
  const methods = {
    'bank-transfer': 'Bank Transfer',
    'cheque': 'Cheque',
    'cash': 'Cash',
    'other': 'Other'
  };
  return methods[method] || method;
}

function formatCategory(category) {
  return category.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toastId = 'toast-' + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast" role="alert">
      <div class="toast-header">
        <i class="fas ${type === 'success' ? 'fa-check-circle text-success' : type === 'danger' ? 'fa-times-circle text-danger' : type === 'warning' ? 'fa-exclamation-circle text-warning' : 'fa-info-circle text-primary'} me-2"></i>
        <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">${message}</div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', toastHtml);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();

  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Make navigateTo global for onclick handlers
window.navigateTo = navigateTo;
window.showDeliveryModal = showDeliveryModal;
window.previewDataUrl = previewDataUrl;
window.downloadDataUrl = downloadDataUrl;
