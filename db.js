// IndexedDB storage layer for WAVE VI Supplier Portal

const DB_NAME = 'wave-vi-portal';
const DB_VERSION = 1;

const STORES = ['products', 'purchaseOrders', 'deliveries', 'payments', 'documents', 'meta'];

const DEFAULT_SETTINGS = {
  companyName: 'WAVE VI',
  supplierName: 'SGS Printing Services',
  currency: 'TND',
  defaultVat: 0,
  theme: 'light'
};

const DEFAULT_CATEGORIES = [
  'Tickets', 'Flyers', 'Posters', 'Brochures', 'Badges', 'Labels', 'Packaging', 'Signage', 'Other'
];

let dbPromise = null;

function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        for (const store of STORES) {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: store === 'meta' ? 'key' : 'id' });
          }
        }
      };
    });
  }
  return dbPromise;
}

async function tx(storeName, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const result = fn(store);
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function getAll(storeName) {
  return tx(storeName, 'readonly', (store) => {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
}

async function put(storeName, item) {
  return tx(storeName, 'readwrite', (store) => store.put(item));
}

async function putMany(storeName, items) {
  return tx(storeName, 'readwrite', (store) => {
    for (const item of items) {
      store.put(item);
    }
  });
}

async function clearStore(storeName) {
  return tx(storeName, 'readwrite', (store) => store.clear());
}

async function getMeta(key) {
  return tx('meta', 'readonly', (store) => {
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value ?? null);
      request.onerror = () => reject(request.error);
    });
  });
}

async function setMeta(key, value) {
  return put('meta', { key, value });
}

export async function getSettings() {
  const settings = await getMeta('settings');
  return settings ? { ...DEFAULT_SETTINGS, ...settings } : { ...DEFAULT_SETTINGS };
}

export async function saveSettings(settings) {
  await setMeta('settings', settings);
}

export async function getCategories() {
  const categories = await getMeta('categories');
  return categories?.length ? categories : [...DEFAULT_CATEGORIES];
}

export async function saveCategories(categories) {
  await setMeta('categories', categories);
}

export async function loadPortalData() {
  const [products, purchaseOrders, deliveries, payments, documents, settings, categories] =
    await Promise.all([
      getAll('products'),
      getAll('purchaseOrders'),
      getAll('deliveries'),
      getAll('payments'),
      getAll('documents'),
      getSettings(),
      getCategories()
    ]);

  return {
    products,
    purchaseOrders,
    deliveries,
    payments,
    documents,
    settings,
    categories
  };
}

export async function saveProduct(product) {
  await put('products', product);
}

export async function savePurchaseOrder(po) {
  await put('purchaseOrders', po);
}

export async function saveDelivery(delivery) {
  await put('deliveries', delivery);
}

export async function savePayment(payment) {
  await put('payments', payment);
}

export async function saveDocument(document) {
  await put('documents', document);
}

export async function exportData() {
  const data = await loadPortalData();
  return {
    version: 1,
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

export async function importData(json) {
  const data = typeof json === 'string' ? JSON.parse(json) : json;

  await clearAll();

  await Promise.all([
    putMany('products', data.products || []),
    putMany('purchaseOrders', data.purchase_orders || data.purchaseOrders || []),
    putMany('deliveries', data.deliveries || []),
    putMany('payments', data.payments || []),
    putMany('documents', data.documents || []),
    saveSettings({ ...DEFAULT_SETTINGS, ...(data.settings || {}) }),
    saveCategories(data.categories || DEFAULT_CATEGORIES)
  ]);

  syncCountersFromData(data);
  syncPONumberCounter(data.purchase_orders || data.purchaseOrders || []);
}

export async function clearAll() {
  await Promise.all(STORES.map(clearStore));
}

export function getNextId(prefix, counterKey) {
  const key = `counter_${counterKey}`;
  const count = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  localStorage.setItem(key, String(count));
  return `${prefix}-${String(count).padStart(3, '0')}`;
}

export function peekNextPONumber() {
  const key = 'counter_poNumber';
  const count = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  return `PO-SGS-${String(count).padStart(3, '0')}`;
}

export function getNextPONumber() {
  const key = 'counter_poNumber';
  const count = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  localStorage.setItem(key, String(count));
  return `PO-SGS-${String(count).padStart(3, '0')}`;
}

export function syncPONumberCounter(purchaseOrders) {
  if (!purchaseOrders?.length) return;
  const max = purchaseOrders.reduce((m, po) => {
    const match = (po.po_number || '').match(/^PO-SGS-(\d+)$/);
    return match ? Math.max(m, parseInt(match[1], 10)) : m;
  }, 0);
  if (max > 0) localStorage.setItem('counter_poNumber', String(max));
}

export function syncCountersFromData(data) {
  const counters = {
    product: maxIdNumber(data.products, 'PRD-'),
    purchaseOrder: maxIdNumber(data.purchase_orders || data.purchaseOrders, 'PO-'),
    delivery: maxIdNumber(data.deliveries, 'DEL-'),
    payment: maxIdNumber(data.payments, 'PAY-'),
    document: maxIdNumber(data.documents, 'DOC-')
  };

  for (const [key, value] of Object.entries(counters)) {
    localStorage.setItem(`counter_${key}`, String(value));
  }
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

export function clearCounters() {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('counter_')) {
      localStorage.removeItem(key);
    }
  }
}

export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
