# MayaSquare Sales Reporting - Comprehensive Project Plan

## Executive Summary

**Customer:** MayaSquare (WordPress/WooCommerce site: mayasquare.com)
**Goal:** Build sales revenue reports dashboard showing:
- Total sales revenue per product
- Total sales revenue per warehouse/store
- Period views: daily, weekly, monthly

**Current Status:** 🔄 Assessment in progress
**Timeline:** 3-5 hours to complete (once data access is resolved)

---

## Customer Requirements (Clarified)

### Core Problem
> "The stock shows the total quantity and do not show the stock per store. Thus the customer want to know how many sells each store made (and per product)."

### Deliverables
1. **Sales Reports**
   - Revenue by product (top selling, detailed)
   - Revenue by store/warehouse (performance comparison)
   - Product-store matrix (which products sell best at which location)

2. **Time Periods**
   - Daily report (today's sales)
   - Weekly report (last 7 days)
   - Monthly report (current month)
   - Custom date range

3. **Dashboard**
   - Visual charts (bar charts, pie charts, tables)
   - Exportable to CSV/Excel
   - Easy to understand for non-technical users

---

## Current Project State

### ✅ What Exists
1. `/home/abds/mayasquare-exports/`
   - Old scripts for products (not orders)
   - API tests from previous session
   - All failed due to permissions

2. `/home/abds/ayssen-business-hub/projects/mayasquare-integration/`
   - Package.json with dependencies (axios, csv-writer, chart.js)
   - `api/wordpress-client.js` (basic WordPress API client)
   - Empty scripts folder
   - README with detailed API documentation

### ❌ What's Missing
1. **Orders extraction script** - Cannot fetch orders data (401 Unauthorized)
2. **Data processing pipeline** - Not written yet
3. **Dashboard** - Not built yet
4. **Testing** - Not done yet

---

## Data Source Options

### Option 1: WooCommerce REST API (Preferred)
**Status:** 🔴 BLOCKED - Permission issue

```
Consumer Key: ck_258879ff2895d05e1fa03a70ee2fea5592a640e4de5e58309afb701e3b921be0b30f01663
Issue: Lacks orders:read permission
Solution: Update in WordPress admin → WooCommerce → Settings → API → Keys
```

**Advantages:**
- Real-time data
- Automated sync possible
- No manual work
- Scalable

**Disadvantages:**
- Currently blocked (permissions)
- Requires admin access

---

### Option 2: Manual CSV Export
**Method:**
1. Log into WooCommerce admin
2. Go to WooCommerce → Reports → Orders
3. Export orders as CSV
4. Upload to dashboard

**Advantages:**
- Works immediately
- No API permissions needed
- Full control over data

**Disadvantages:**
- Manual process (not automated)
- Not real-time
- Must re-export frequently

---

### Option 3: Direct Database Access
**Method:**
1. Get read-only MySQL access to WordPress database
2. Query orders tables directly
3. Process and build reports

**Advantages:**
- Complete data access
- Fast queries
- No API limitations

**Disadvantages:**
- Requires DB credentials
- Security concerns
- More complex setup

---

## Implementation Plan

### Phase 1: Data Extraction (When Access is Resolved)

**Script:** `scripts/extract-orders.js`

```javascript
// Fetch orders from WooCommerce API
// Endpoint: /wp-json/wc/v3/orders
// Parameters: per_page=100, page=N, status=completed

// Extract:
// - Order ID
// - Date
// - Total amount
// - Line items (product, quantity, price)
// - Shipping/billing addresses (for store identification)
// - Order metadata (custom fields)

// Output: orders_raw.json
```

**Data Model:**
```json
{
  "order_id": 12345,
  "date_created": "2026-01-15T10:30:00Z",
  "status": "completed",
  "total": "125.50",
  "currency": "EUR",
  "line_items": [
    {
      "product_id": 456,
      "name": "Product Name",
      "quantity": 2,
      "subtotal": "100.00",
      "total": "100.00"
    }
  ],
  "shipping": {
    "city": "Paris",
    "state": "Île-de-France",
    "postcode": "75001"
  }
}
```

---

### Phase 2: Store Identification

**Critical Question:** How to identify which store/warehouse an order belongs to?

**Possible Methods:**

**A. By Shipping City/Region**
```javascript
// Map cities to stores
const storeMapping = {
  "Paris": "Store Paris",
  "Lyon": "Store Lyon",
  "Marseille": "Store Marseille",
  "Bordeaux": "Store Bordeaux"
};
```

**B. By Order Metadata**
```javascript
// Look for custom field in order
const storeId = order.meta_data.find(m => m.key === "_store_id")?.value;
```

**C. By Billing Address**
```javascript
// Use customer location
const storeRegion = order.billing.state;
```

**D. Manual Mapping Table**
```javascript
// Manual mapping file: store-mapping.json
[
  {"city_pattern": "Paris*", "store": "Paris Store"},
  {"city_pattern": "Lyon*", "store": "Lyon Store"}
]
```

---

### Phase 3: Data Processing

**Script:** `scripts/process-orders.js`

```javascript
// Read: orders_raw.json
// Write: sales_reports.json

// 1. Group by Product
//    - Calculate total revenue per product
//    - Count total units sold
//    - Rank products

// 2. Group by Store
//    - Calculate total revenue per store
//    - Count total orders
//    - Rank stores

// 3. Group by Time Period
//    - Daily: group by date
//    - Weekly: group by week number
//    - Monthly: group by month

// 4. Create Product-Store Matrix
//    - For each product, show revenue by store
//    - Identify best-selling stores per product
```

**Output Structure:**
```json
{
  "sales_by_product": {
    "daily": [
      {"product_id": 456, "name": "Product A", "quantity": 150, "revenue": 1500.00}
    ],
    "weekly": [...],
    "monthly": [...]
  },
  "sales_by_store": {
    "daily": [
      {"store_id": 1, "name": "Paris Store", "revenue": 3000.00, "orders": 45}
    ],
    "weekly": [...],
    "monthly": [...]
  },
  "sales_by_product_store": {
    "product_id": 456,
    "name": "Product A",
    "stores": [
      {"store": "Paris", "revenue": 750.00, "quantity": 75},
      {"store": "Lyon", "revenue": 500.00, "quantity": 50}
    ]
  }
}
```

---

### Phase 4: Dashboard

**Tech Stack:**
- HTML5 + CSS3 (modern, responsive)
- Chart.js (for charts)
- Pure JavaScript (no frameworks)

**File Structure:**
```
dashboard/
├── index.html        # Main dashboard
├── js/
│   ├── app.js        # Main app logic
│   ├── charts.js     # Chart.js wrappers
│   └── data.js      # Data loader
├── css/
│   └── styles.css   # Styles
└── data/
    └── sales_reports.json  # Processed data
```

**Dashboard Views:**

**1. Overview Tab**
- Today's total revenue
- Top 5 products
- Top 5 stores
- Quick summary cards

**2. By Product Tab**
- Bar chart: Revenue by product
- Table: Detailed product breakdown
- Filter by time period

**3. By Store Tab**
- Bar chart: Revenue by store
- Table: Detailed store breakdown
- Filter by time period

**4. Product-Store Matrix**
- Heatmap or table showing product sales per store
- Identify cross-store patterns
- Highlight best-sellers

**5. Date Range Picker**
- Custom date range selector
- Compare periods
- Export to CSV

---

### Phase 5: Testing

**Test Checklist:**
- [ ] Data extraction works (fetch orders)
- [ ] Store identification correct
- [ ] Calculations accurate (sums, averages)
- [ ] All time periods work (day/week/month)
- [ ] Dashboard loads in <3 seconds
- [ ] Charts render correctly
- [ ] CSV export works
- [ ] Responsive on mobile

---

## File Structure (Final)

```
mayasquare-sales-reporting/
├── .env                  # API credentials
├── package.json          # Dependencies
├── README.md             # Documentation
├── docs/
│   ├── PROJECT_PLAN.md   # This file
│   ├── DATA_MODEL.md    # Data schema
│   └── USER_GUIDE.md    # Dashboard user guide
├── scripts/
│   ├── extract-orders.js   # Extract from API/CSV
│   ├── process-orders.js   # Process and aggregate
│   └── test-data.sh        # Test with sample data
├── data/
│   ├── raw/
│   │   └── orders_raw.json     # Raw orders
│   └── processed/
│       └── sales_reports.json # Aggregated reports
├── dashboard/
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── app.js
│       ├── charts.js
│       └── data.js
└── tests/
    └── test-calculations.js
```

---

## Tasks Breakdown

### Critical Path (Must complete first)
- [ ] **TASK 1:** Get data access (API or CSV or DB)
- [ ] **TASK 2:** Extract orders data
- [ ] **TASK 3:** Identify store/warehouse mapping
- [ ] **TASK 4:** Process and aggregate data

### Secondary Path (Can do in parallel)
- [ ] **TASK 5:** Design dashboard layout
- [ ] **TASK 6:** Build HTML/CSS
- [ ] **TASK 7:** Implement Chart.js visualizations
- [ ] **TASK 8:** Add date range picker

### Final Phase
- [ ] **TASK 9:** Test with real data
- [ ] **TASK 10:** Validate calculations
- [ ] **TASK 11:** Document for user
- [ ] **TASK 12:** Deploy and deliver

---

## Questions for Customer

### 1. Data Source
Which option can you provide?
- [ ] Update WooCommerce API key (add orders:read permission)
- [ ] Manual CSV export from WooCommerce admin
- [ ] Direct database access (MySQL read-only)

### 2. Store Identification
How do we identify which store/warehouse an order belongs to?
- [ ] By shipping city/region
- [ ] By custom field in order metadata
- [ ] By billing address
- [ ] Other method (please specify)

### 3. Historical Data
How far back should reports show?
- [ ] Last 30 days
- [ ] Last 90 days
- [ ] Last 12 months
- [ ] All time

### 4. Deployment
Where should the dashboard be hosted?
- [ ] On abds-server (Coolify)
- [ ] Static file (can run locally)
- [ ] Other

---

## Time Estimates

| Phase | Time (if API) | Time (if CSV/DB) |
|-------|---------------|------------------|
| Data extraction | 30-60 min | 60-90 min |
| Data processing | 60-90 min | 60-90 min |
| Dashboard build | 90-120 min | 90-120 min |
| Testing | 30-60 min | 30-60 min |
| **TOTAL** | **3-5 hours** | **4-6 hours** |

---

## Success Criteria

### Must Have (MVP)
- ✅ Sales revenue by product (daily/weekly/monthly)
- ✅ Sales revenue by store (daily/weekly/monthly)
- ✅ Dashboard with charts
- ✅ Export to CSV

### Should Have
- ✅ Product-store matrix
- ✅ Date range picker
- ✅ Top products/stores ranking
- ✅ Responsive design

### Nice to Have
- ⭕ Comparison with previous period
- ⭕ Automatic data refresh
- ⭕ Email alerts for low sales
- ⭕ Mobile app version

---

## Next Steps

### Immediate (Now)
1. ✉️ Ask customer: Data source option
2. ✉️ Ask customer: Store identification method
3. ✉️ Ask customer: Historical data range

### Once Answers Received
1. Implement data extraction
2. Process and aggregate
3. Build dashboard
4. Test and deliver

### Validation (14:00 UTC)
1. Ask @planner or Opus to review plan
2. Get feedback
3. Adjust if needed

---

**Last Updated:** 2026-01-28 04:50 UTC
**Author:** GLM Agent
**Status:** 🔄 Waiting for customer input
