# Data migration: IndexedDB → JSON files

This portal no longer uses IndexedDB or `localStorage` for application data. All read-only users load data from static JSON files in `public/data/`, which are published to GitHub Pages on each deploy.

## Files changed

| File | Change |
|------|--------|
| `dataService.js` | **New** — fetch-based data layer with in-memory session writes |
| `db.js` | **Removed** — IndexedDB + localStorage persistence |
| `main.js` | Imports from `dataService.js`; settings UI updated for JSON publishing |
| `public/data/*.json` | **New** — hosted datasets |
| `public/admin-export.html` | **New** — one-time IndexedDB migration utility |
| `vite.config.js` | Comment clarifying relative `base` for GitHub Pages subfolders |
| `README.md` | Updated with data workflow |

## IndexedDB code removed

The following were deleted with `db.js`:

- `indexedDB.open('wave-vi-portal', …)` and object stores: `products`, `purchaseOrders`, `deliveries`, `payments`, `documents`, `meta`
- Transaction helpers (`tx`, `getAll`, `put`, `putMany`, `clearStore`, `getMeta`, `setMeta`)
- `clearAll()` — full database wipe
- `localStorage` counter keys (`counter_product`, `counter_poNumber`, etc.)
- `clearCounters()`

Session authentication still uses `sessionStorage` only (login state).

## JSON file schemas

### `products.json` — array

```json
[
  {
    "id": "PRD-001",
    "reference": "REF-001",
    "name": "Product name",
    "category": "Tickets",
    "unit": "piece",
    "description": "",
    "price_ht": 10.5,
    "print_support": "indoor",
    "print_method": "digital",
    "material": "paper",
    "finish": "matte",
    "format": "rectangle",
    "dimension_width": 100,
    "dimension_height": 50,
    "surface_mm2": 5000,
    "product_image": null,
    "delivery_image": null,
    "source_file": null,
    "source_file_name": null,
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
]
```

### `purchase-orders.json` — array

```json
[
  {
    "id": "PO-001",
    "po_number": "PO-SGS-001",
    "date": "2026-01-15",
    "status": "draft",
    "supplier_reference": "",
    "expected_delivery_date": "2026-02-01",
    "actual_delivery_date": null,
    "lines": [
      {
        "product_id": "PRD-001",
        "product_name": "Product name",
        "quantity": 100,
        "unit_price_ht": 10.5,
        "line_total_ht": 1050,
        "received_qty": 0,
        "surface_mm2": 5000
      }
    ],
    "total_ht": 1050,
    "total_ttc": 1050,
    "notes": "",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
]
```

### `deliveries.json` — array

```json
[
  {
    "id": "DEL-001",
    "delivery_number": "DEL-PO-SGS-001",
    "related_po": "PO-001",
    "po_number": "PO-SGS-001",
    "status": "pending",
    "delivery_date": null,
    "amount": 0,
    "lines": [],
    "documents": [],
    "notes": "",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
]
```

### `payments.json` — array

```json
[
  {
    "id": "PAY-001",
    "payment_reference": "PAY-DEL-PO-SGS-001",
    "related_po": "PO-001",
    "related_delivery": "DEL-001",
    "delivery_number": "DEL-PO-SGS-001",
    "po_number": "PO-SGS-001",
    "payment_method": "bank-transfer",
    "amount": 1050,
    "amount_paid": 0,
    "payment_date": null,
    "status": "pending",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
]
```

### `documents.json` — array

```json
[
  {
    "id": "DOC-001",
    "name": "artwork.pdf",
    "type": "pdf",
    "category": "artwork-files",
    "size": "1.2 MB",
    "data": null,
    "url": null,
    "related_product": "PRD-001",
    "created_at": "2026-01-01"
  }
]
```

### `settings.json` — object

```json
{
  "companyName": "WAVE VI",
  "supplierName": "SGS Printing Services",
  "currency": "TND",
  "defaultVat": 0,
  "theme": "light",
  "categories": ["Tickets", "Flyers", "Posters", "Brochures", "Badges", "Labels", "Packaging", "Signage", "Other"]
}
```

### Local development auto-save

When using `npm run dev`, each admin save action writes all datasets to `public/data/*.json` via a dev-only Vite endpoint (`/__api/local-data`). Refresh the page and data is reloaded from those files.

This endpoint is **not available in production** — on GitHub Pages, use the download-and-commit workflow below.

## Migration steps

### 1. Export existing IndexedDB data (one time)

If you have data in the browser from the old version:

1. Open the portal locally (`npm run dev`) using the **same browser** that had the old data.
2. Go to **Settings → Publish Data** and click the **IndexedDB export utility** link,  
   or open `/admin-export.html` directly.
3. Click **Download all JSON files**.
4. Replace the files in `public/data/` with the downloaded files.
5. Commit and push to `main`.

### 2. Publish updates (ongoing admin workflow)

1. Sign in as admin (`wavevi` / `waveiovi`).
2. Make changes in the portal (session-only, in memory).
3. Go to **Settings → Publish Data → Download JSON Files**.
4. Copy the downloaded files into `public/data/`.
5. Commit and push — GitHub Actions redeploys; all users get fresh data (cache-busted fetch).

### 3. Read-only users

Supplier login (`sgs` / `sgs`) can browse all data. The refresh button reloads JSON from the server.

## GitHub Pages paths

JSON is loaded with:

```javascript
fetch(`${import.meta.env.BASE_URL}data/products.json?v=${Date.now()}`)
```

Production builds use `base: './'`, so paths resolve correctly under `https://waveiovi.github.io/sgs_portail/`.

Cache-busting via `?v=${Date.now()}` ensures users see updates after each deployment without hard-refreshing.
