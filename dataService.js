// JSON data service for WAVE VI Supplier Portal (GitHub Pages static hosting)

const DEFAULT_SETTINGS = {
  companyName: 'WAVE VI',
  supplierName: 'SGS Printing Services',
  currency: 'TND',
  defaultVat: 0,
  theme: 'light',
  categories: [
    'Tickets', 'Flyers', 'Posters', 'Brochures', 'Badges', 'Labels', 'Packaging', 'Signage', 'Other'
  ]
};

/** In-memory snapshot synced on load and admin edits (session only). */
let portalData = null;

/** Session counters for ID generation (not persisted to browser storage). */
const counters = {
  product: 0,
  purchaseOrder: 0,
  delivery: 0,
  payment: 0,
  document: 0,
  poNumber: 0
};

function dataUrl(filename) {
  return `${import.meta.env.BASE_URL}data/${filename}?v=${Date.now()}`;
}

async function fetchJSON(filename) {
  const response = await fetch(dataUrl(filename));
  if (!response.ok) {
    throw new Error(`Failed to load data/${filename} (${response.status})`);
  }
  return response.json();
}

export async function loadProducts() {
  return fetchJSON('products.json');
}

export async function loadPurchaseOrders() {
  return fetchJSON('purchase-orders.json');
}

export async function loadDeliveries() {
  return fetchJSON('deliveries.json');
}

export async function loadPayments() {
  return fetchJSON('payments.json');
}

export async function loadDocuments() {
  return fetchJSON('documents.json');
}

export async function loadSettings() {
  const settings = await fetchJSON('settings.json');
  const { categories, ...rest } = settings || {};
  return {
    settings: { ...DEFAULT_SETTINGS, ...rest },
    categories: categories?.length ? categories : [...DEFAULT_SETTINGS.categories]
  };
}

export async function loadPortalData() {
  const [products, purchaseOrders, deliveries, payments, documents, settingsResult] =
    await Promise.all([
      loadProducts(),
      loadPurchaseOrders(),
      loadDeliveries(),
      loadPayments(),
      loadDocuments(),
      loadSettings()
    ]);

  portalData = {
    products: Array.isArray(products) ? products : [],
    purchaseOrders: Array.isArray(purchaseOrders) ? purchaseOrders : [],
    deliveries: Array.isArray(deliveries) ? deliveries : [],
    payments: Array.isArray(payments) ? payments : [],
    documents: Array.isArray(documents) ? documents : [],
    settings: settingsResult.settings,
    categories: settingsResult.categories
  };

  syncCountersFromData(portalData);
  syncPONumberCounter(portalData.purchaseOrders);

  return portalData;
}

function ensurePortalData() {
  if (!portalData) {
    portalData = {
      products: [],
      purchaseOrders: [],
      deliveries: [],
      payments: [],
      documents: [],
      settings: { ...DEFAULT_SETTINGS },
      categories: [...DEFAULT_SETTINGS.categories]
    };
  }
  return portalData;
}

export async function saveProduct(product) {
  const data = ensurePortalData();
  const index = data.products.findIndex((p) => p.id === product.id);
  if (index >= 0) data.products[index] = product;
  else data.products.push(product);
}

export async function savePurchaseOrder(po) {
  const data = ensurePortalData();
  const index = data.purchaseOrders.findIndex((p) => p.id === po.id);
  if (index >= 0) data.purchaseOrders[index] = po;
  else data.purchaseOrders.push(po);
}

export async function saveDelivery(delivery) {
  const data = ensurePortalData();
  const index = data.deliveries.findIndex((d) => d.id === delivery.id);
  if (index >= 0) data.deliveries[index] = delivery;
  else data.deliveries.push(delivery);
}

export async function savePayment(payment) {
  const data = ensurePortalData();
  const index = data.payments.findIndex((p) => p.id === payment.id);
  if (index >= 0) data.payments[index] = payment;
  else data.payments.push(payment);
}

export async function saveDocument(document) {
  const data = ensurePortalData();
  const index = data.documents.findIndex((d) => d.id === document.id);
  if (index >= 0) data.documents[index] = document;
  else data.documents.push(document);
}

export async function saveSettings(settings) {
  const data = ensurePortalData();
  data.settings = { ...data.settings, ...settings };
}

export async function saveCategories(categories) {
  const data = ensurePortalData();
  data.categories = categories;
  data.settings.categories = categories;
}

export function exportData() {
  const data = ensurePortalData();
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    products: data.products,
    purchase_orders: data.purchaseOrders,
    deliveries: data.deliveries,
    payments: data.payments,
    documents: data.documents,
    settings: data.settings,
    categories: data.categories
  };
}

export function exportDataFiles() {
  const data = ensurePortalData();
  const { categories, ...settingsWithoutCategories } = data.settings;
  return {
    'products.json': data.products,
    'purchase-orders.json': data.purchaseOrders,
    'deliveries.json': data.deliveries,
    'payments.json': data.payments,
    'documents.json': data.documents,
    'settings.json': {
      ...settingsWithoutCategories,
      categories: data.categories
    }
  };
}

export function importData(json) {
  const parsed = typeof json === 'string' ? JSON.parse(json) : json;
  portalData = {
    products: parsed.products || [],
    purchaseOrders: parsed.purchase_orders || parsed.purchaseOrders || [],
    deliveries: parsed.deliveries || [],
    payments: parsed.payments || [],
    documents: parsed.documents || [],
    settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
    categories: parsed.categories?.length
      ? parsed.categories
      : parsed.settings?.categories?.length
        ? parsed.settings.categories
        : [...DEFAULT_SETTINGS.categories]
  };
  portalData.settings.categories = portalData.categories;
  syncCountersFromData(portalData);
  syncPONumberCounter(portalData.purchaseOrders);
  return portalData;
}

export function getNextId(prefix, counterKey) {
  counters[counterKey] = (counters[counterKey] || 0) + 1;
  return `${prefix}-${String(counters[counterKey]).padStart(3, '0')}`;
}

export function peekNextPONumber() {
  const count = (counters.poNumber || 0) + 1;
  return `PO-SGS-${String(count).padStart(3, '0')}`;
}

export function getNextPONumber() {
  counters.poNumber = (counters.poNumber || 0) + 1;
  return `PO-SGS-${String(counters.poNumber).padStart(3, '0')}`;
}

export function syncPONumberCounter(purchaseOrders) {
  if (!purchaseOrders?.length) return;
  const max = purchaseOrders.reduce((m, po) => {
    const match = (po.po_number || '').match(/^PO-SGS-(\d+)$/);
    return match ? Math.max(m, parseInt(match[1], 10)) : m;
  }, 0);
  if (max > 0) counters.poNumber = max;
}

export function syncCountersFromData(data) {
  counters.product = maxIdNumber(data.products, 'PRD-');
  counters.purchaseOrder = maxIdNumber(data.purchase_orders || data.purchaseOrders, 'PO-');
  counters.delivery = maxIdNumber(data.deliveries, 'DEL-');
  counters.payment = maxIdNumber(data.payments, 'PAY-');
  counters.document = maxIdNumber(data.documents, 'DOC-');
}

function maxIdNumber(items, prefix) {
  if (!items?.length) return 0;
  return items.reduce((max, item) => {
    const id = item.id || '';
    if (!id.startsWith(prefix)) return max;
    const num = parseInt(id.slice(prefix.length), 10);
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);
}

export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function downloadAllDataFiles() {
  const files = exportDataFiles();
  for (const [filename, content] of Object.entries(files)) {
    downloadJSON(content, filename);
  }
}
