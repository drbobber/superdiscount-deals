# MayaSquare Sales Reporting Dashboard

Sales revenue reporting dashboard showing:
- Total sales revenue per product
- Total sales revenue per warehouse/store
- Period views: daily, weekly, monthly

## Quick Start

```bash
# Install dependencies
npm install

# Extract orders (requires API access or CSV file)
npm run extract

# Process and aggregate data
npm run process

# Start dashboard (opens at http://localhost:8080)
npm run dashboard
```

## Project Structure

```
mayasquare-sales-reporting/
├── .env                  # API credentials (create this)
├── package.json          # Dependencies
├── README.md             # This file
├── docs/
│   ├── PROJECT_PLAN.md   # Comprehensive project plan
│   ├── DATA_MODEL.md    # Data schema documentation
│   └── USER_GUIDE.md    # Dashboard user guide
├── scripts/
│   ├── extract-orders.js   # Extract from WooCommerce API
│   ├── process-orders.js   # Process and aggregate data
│   └── test-data.sh        # Test with sample data
├── data/
│   ├── raw/
│   │   └── orders_raw.json     # Raw orders data
│   └── processed/
│       └── sales_reports.json # Aggregated reports
├── dashboard/
│   ├── index.html          # Main dashboard page
│   ├── css/styles.css      # Dashboard styles
│   └── js/
│       ├── app.js          # Main app logic
│       ├── charts.js       # Chart.js integration
│       └── data.js         # Data loading
└── tests/
    └── test-calculations.js # Test data processing
```

## Configuration

Create a `.env` file in the project root:

```bash
# WooCommerce API Credentials
WOOCOMMERCE_URL=https://mayasquare.com
WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here

# Store Mapping (JSON array of city -> store mappings)
STORE_MAPPING=[{"city_pattern":"Paris*","store":"Paris Store"}]
```

## Data Extraction

The dashboard requires orders data. You can provide it in two ways:

### Option 1: WooCommerce REST API (Automated)

Ensure your API key has `orders:read` permission, then run:
```bash
npm run extract
```

### Option 2: Manual CSV Export

1. Log into WooCommerce admin
2. Go to WooCommerce → Reports → Orders
3. Export orders as CSV
4. Save to `data/raw/orders.csv`

The script will automatically detect and process CSV files.

## Dashboard Features

- **Overview Tab**: Today's total revenue, top 5 products, top 5 stores
- **By Product Tab**: Revenue by product with bar charts and detailed tables
- **By Store Tab**: Revenue by store with performance comparison
- **Product-Store Matrix**: Heatmap showing product sales per store
- **Date Range Picker**: Custom date range selector and CSV export

## Documentation

- [PROJECT_PLAN.md](docs/PROJECT_PLAN.md) - Complete project documentation
- [DATA_MODEL.md](docs/DATA_MODEL.md) - Data schema and structure
- [USER_GUIDE.md](docs/USER_GUIDE.md) - Dashboard usage guide

## Troubleshooting

**"401 Unauthorized" when extracting orders**
- Your WooCommerce API key lacks `orders:read` permission
- Update key in WooCommerce → Settings → API → Keys

**"No orders found"**
- Check if orders exist in your WooCommerce store
- Verify date range in `.env` file
- Check console logs for API errors

**Dashboard not loading charts**
- Ensure `data/processed/sales_reports.json` exists
- Run `npm run process` to generate reports
- Check browser console for errors

## License

MIT
