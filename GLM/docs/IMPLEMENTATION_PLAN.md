# MayaSquare Sales Reporting - Implementation Plan

## Status Update (2026-01-28 04:45 UTC)

### ❌ BLOCKING ISSUE: API Permissions
Current consumer key lacks `orders:read` permission. Cannot fetch orders data needed for sales reports.

### Action Required from Ayssen
1. Access https://mayasquare.com/wp-admin
2. Navigate to WooCommerce → Settings → Advanced → REST API
3. Either:
   - Update existing key to include "Read Orders" permission, OR
   - Create a new consumer key with Read permissions for: products, orders, customers
4. Share the updated key/secret

---

## Project Structure (When Access Is Granted)

### Phase 1: Data Extraction
**Script:** `fetch-orders.sh`
- Fetch all orders with pagination
- Extract line items (product, quantity, price)
- Extract shipping/billing addresses
- Identify warehouse/store from order metadata

**Data Model:**
```json
{
  "order_id": 12345,
  "date": "2026-01-15T10:30:00Z",
  "status": "completed",
  "total": "125.50",
  "customer_id": 678,
  "line_items": [
    {
      "product_id": 456,
      "name": "Product Name",
      "quantity": 2,
      "subtotal": "100.00",
      "total": "100.00",
      "meta_data": [] // Look for warehouse/store info here
    }
  ],
  "shipping": {
    "first_name": "John",
    "last_name": "Doe",
    "company": "",
    "address_1": "123 Main St",
    "city": "Paris",
    "state": "",
    "postcode": "75001",
    "country": "FR"
  }
}
```

### Phase 2: Data Processing
**Script:** `process-orders.js`
- Aggregate sales by product
- Aggregate sales by store/warehouse
- Group by time period (day, week, month)
- Calculate totals and rankings

**Output Structure:**
```json
{
  "sales_by_product": {
    "2026-01": [
      {"product_id": 456, "name": "Product A", "quantity": 150, "revenue": 1500.00},
      {"product_id": 789, "name": "Product B", "quantity": 200, "revenue": 2000.00}
    ]
  },
  "sales_by_store": {
    "2026-01": [
      {"store_id": 1, "name": "Paris Store", "revenue": 3000.00, "orders": 45},
      {"store_id": 2, "name": "Lyon Store", "revenue": 1500.00, "orders": 25}
    ]
  },
  "sales_by_product_store": {
    "2026-01": [
      {"product_id": 456, "store_id": 1, "quantity": 75, "revenue": 750.00},
      {"product_id": 456, "store_id": 2, "quantity": 50, "revenue": 500.00}
    ]
  }
}
```

### Phase 3: Dashboard
**Tech Stack:**
- HTML/CSS/JavaScript (no build tools)
- Chart.js for visualizations
- Data: JSON files processed by JS

**Views:**
1. **Daily Report** - Today's sales by product & store
2. **Weekly Report** - Last 7 days
3. **Monthly Report** - Current month
4. **Date Range Picker** - Custom period

**Features:**
- Top selling products
- Revenue by warehouse/store
- Product-store matrix
- Export to CSV/Excel

---

## Data Flow (Once API Access Is Fixed)

```
WordPress/WooCommerce
         ↓
    /wp-json/wc/v3/orders
         ↓
  fetch-orders.sh (extract)
         ↓
  orders_raw.json (raw data)
         ↓
  process-orders.js (aggregate)
         ↓
  sales_reports.json (processed)
         ↓
  dashboard.html (visualization)
```

---

## Key Questions for Ayssen

1. **Warehouse/Store Identification:** How do we identify which store/warehouse an order belongs to?
   - Is it in the shipping address (city/region)?
   - Is it in a custom field in line items?
   - Is it in the order metadata?

2. **Historical Data:** How far back should the reports go?
   - Last 30 days? 90 days? All time?

3. **Refresh Frequency:** How often should we sync data?
   - Hourly? Daily?

---

## Alternative Approach (If API Cannot Be Fixed)

If we cannot get API access, we could:
1. **Export from WooCommerce Admin**
   - Use WooCommerce → Reports → Orders
   - Export to CSV manually
   - Upload to dashboard

2. **Direct Database Access**
   - Get read-only access to WordPress MySQL database
   - Query orders tables directly
   - More complex but reliable

---

## Current Progress

| Task | Status |
|------|--------|
| API Testing | ❌ Failed (401 Unauthorized) |
| Extract Scripts | ⏳ Blocked - waiting for API access |
| Data Processing | ✅ Ready to write once data available |
| Dashboard | ✅ Ready to build once data available |
| Documentation | ✅ In progress |

---

## Next Steps

1. **Immediate:** Get updated WooCommerce API credentials with `orders:read` permission
2. **Then:** Run `fetch-orders.sh` to get orders data
3. **Then:** Process and aggregate data
4. **Then:** Build dashboard
5. **Finally:** Test and deliver to MayaSquare

---

**Last Updated:** 2026-01-28 04:45 UTC
**Current Blocker:** API permissions for orders endpoint
