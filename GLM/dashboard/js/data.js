/**
 * data.js
 *
 * Data loading and caching for MayaSquare Sales Dashboard.
 * Loads sales_reports.json and provides access to the data.
 */

const DATA_PATH = '../data/processed/sales_reports.json';

// Cache for loaded data
let cachedData = null;
let lastLoadTime = null;

/**
 * Load sales data from JSON file
 *
 * @returns {Promise<Object>} Sales data
 */
async function loadData() {
  // Return cached data if available and less than 5 minutes old
  if (cachedData && lastLoadTime && (Date.now() - lastLoadTime < 5 * 60 * 1000)) {
    console.log('[data.js] Returning cached data');
    return cachedData;
  }

  try {
    console.log('[data.js] Loading data from', DATA_PATH);
    const response = await fetch(DATA_PATH);

    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    cachedData = data;
    lastLoadTime = Date.now();

    console.log('[data.js] Data loaded successfully');
    console.log('[data.js] Metadata:', data.metadata);

    return data;

  } catch (error) {
    console.error('[data.js] Error loading data:', error);

    // Return empty data structure on error
    return {
      metadata: {
        generated_at: new Date().toISOString(),
        currency: 'EUR',
        order_count: 0,
        total_revenue: 0,
        total_orders: 0,
        total_items_sold: 0
      },
      sales_by_product: { all: [], top_products: [], daily: [], weekly: [], monthly: [] },
      sales_by_store: { all: [], top_stores: [], daily: [], weekly: [], monthly: [] },
      product_store_matrix: { all: [], top_combinations: [] },
      sales_by_time: { daily: {}, weekly: {}, monthly: {}, total: { revenue: 0, orders: 0, items_sold: 0 } },
      overview: { today: {}, this_week: {}, this_month: {} }
    };
  }
}

/**
 * Format currency value
 *
 * @param {Number} value - Value to format
 * @param {String} currency - Currency code (default: EUR)
 * @returns {String} Formatted currency string
 */
function formatCurrency(value, currency = 'EUR') {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format number with thousands separator
 *
 * @param {Number} value - Value to format
 * @returns {String} Formatted number
 */
function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Get product sales data for a time period
 *
 * @param {Object} data - Sales data
 * @param {String} period - Time period (daily, weekly, monthly)
 * @returns {Array} Product sales data
 */
function getProductSales(data, period = 'monthly') {
  return data.sales_by_product[period] || [];
}

/**
 * Get store sales data for a time period
 *
 * @param {Object} data - Sales data
 * @param {String} period - Time period (daily, weekly, monthly)
 * @returns {Array} Store sales data
 */
function getStoreSales(data, period = 'monthly') {
  return data.sales_by_store[period] || [];
}

/**
 * Get time series data
 *
 * @param {Object} data - Sales data
 * @param {String} period - Time period (daily, weekly, monthly)
 * @returns {Array} Time series data
 */
function getTimeSeries(data, period = 'monthly') {
  const timeData = data.sales_by_time[period] || {};

  return Object.entries(timeData).map(([key, value]) => ({
    date: key,
    revenue: value.revenue,
    orders: value.orders,
    items_sold: value.items_sold
  })).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get top products by revenue
 *
 * @param {Object} data - Sales data
 * @param {Number} limit - Number of products to return
 * @returns {Array} Top products
 */
function getTopProducts(data, limit = 10) {
  return (data.sales_by_product.top_products || []).slice(0, limit);
}

/**
 * Get top stores by revenue
 *
 * @param {Object} data - Sales data
 * @param {Number} limit - Number of stores to return
 * @returns {Array} Top stores
 */
function getTopStores(data, limit = 10) {
  return (data.sales_by_store.top_stores || []).slice(0, limit);
}

/**
 * Get product-store matrix data
 *
 * @param {Object} data - Sales data
 * @returns {Array} Product-store combinations
 */
function getProductStoreMatrix(data) {
  return data.product_store_matrix.all || [];
}

/**
 * Get overview statistics for a period
 *
 * @param {Object} data - Sales data
 * @param {String} period - Period (today, week, month, all)
 * @returns {Object} Overview statistics
 */
function getOverviewStats(data, period = 'week') {
  if (period === 'all') {
    return {
      revenue: data.metadata.total_revenue,
      orders: data.metadata.total_orders,
      items_sold: data.metadata.total_items_sold
    };
  }

  if (period === 'today') {
    return {
      revenue: data.overview.today?.revenue || 0,
      orders: data.overview.today?.orders || 0,
      items_sold: data.overview.today?.items_sold || 0
    };
  }

  if (period === 'week') {
    return {
      revenue: data.overview.this_week?.revenue || 0,
      orders: data.overview.this_week?.orders || 0,
      items_sold: data.overview.this_week?.items_sold || 0
    };
  }

  if (period === 'month') {
    return {
      revenue: data.overview.this_month?.revenue || 0,
      orders: data.overview.this_month?.orders || 0,
      items_sold: data.overview.this_month?.items_sold || 0
    };
  }

  return { revenue: 0, orders: 0, items_sold: 0 };
}

/**
 * Export data to CSV
 *
 * @param {Object} data - Sales data
 * @param {String} type - Type of data to export (products, stores, matrix)
 */
function exportToCSV(data, type = 'products') {
  let csv = '';
  let filename = 'export.csv';

  if (type === 'products') {
    filename = 'products-export.csv';
    csv = 'Product ID,Product Name,Quantity,Revenue\n';

    for (const product of data.sales_by_product.all) {
      csv += `${product.product_id},"${product.name}",${product.total.quantity},${product.total.revenue}\n`;
    }

  } else if (type === 'stores') {
    filename = 'stores-export.csv';
    csv = 'Store Name,Orders,Revenue\n';

    for (const store of data.sales_by_store.all) {
      csv += `"${store.store_name}",${store.total.orders},${store.total.revenue}\n`;
    }

  } else if (type === 'matrix') {
    filename = 'matrix-export.csv';
    csv = 'Product Name,Store Name,Quantity,Revenue\n';

    for (const item of data.product_store_matrix.all) {
      csv += `"${item.product_name}","${item.store_name}",${item.quantity},${item.revenue}\n`;
    }
  }

  // Create download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log('[data.js] Exported', filename);
}

/**
 * Clear cached data
 */
function clearCache() {
  cachedData = null;
  lastLoadTime = null;
  console.log('[data.js] Cache cleared');
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadData,
    formatCurrency,
    formatNumber,
    getProductSales,
    getStoreSales,
    getTimeSeries,
    getTopProducts,
    getTopStores,
    getProductStoreMatrix,
    getOverviewStats,
    exportToCSV,
    clearCache
  };
}
