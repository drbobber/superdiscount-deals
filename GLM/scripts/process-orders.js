#!/usr/bin/env node

/**
 * process-orders.js
 *
 * Process raw orders data and generate sales reports.
 *
 * This script:
 * 1. Reads raw orders from orders_raw.json
 * 2. Groups and aggregates data by product, store, and time period
 * 3. Generates sales reports for daily, weekly, and monthly views
 * 4. Outputs sales_reports.json for the dashboard
 *
 * Usage:
 *   node process-orders.js
 *
 * Environment variables (.env):
 *   CURRENCY - Currency code for formatting (default: EUR)
 *   LOG_LEVEL - Logging verbosity (default: info)
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Configuration
const CONFIG = {
  paths: {
    input: path.join(__dirname, '../data/raw/orders_raw.json'),
    output: path.join(__dirname, '../data/processed/sales_reports.json')
  },
  currency: process.env.CURRENCY || 'EUR',
  logging: process.env.LOG_LEVEL || 'info'
};

// Logger utility
const logger = {
  debug: (msg, data) => CONFIG.logging === 'debug' && console.log(`[DEBUG] ${msg}`, data || ''),
  info: (msg, data) => ['debug', 'info'].includes(CONFIG.logging) && console.log(`[INFO] ${msg}`, data || ''),
  warn: (msg, data) => console.warn(`[WARN] ${msg}`, data || ''),
  error: (msg, data) => console.error(`[ERROR] ${msg}`, data || '')
};

/**
 * Ensure output directories exist
 */
function ensureDirectories() {
  const outputDir = path.dirname(CONFIG.paths.output);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    logger.info('Created data/processed directory');
  }
}

/**
 * Parse date string to Date object
 *
 * @param {String} dateStr - ISO date string
 * @returns {Date|null} Date object or null
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr);
  } catch (e) {
    return null;
  }
}

/**
 * Get date key for grouping (YYYY-MM-DD)
 *
 * @param {Date} date - Date object
 * @returns {String} Date key
 */
function getDateKey(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Get week key for grouping (YYYY-Www)
 *
 * @param {Date} date - Date object
 * @returns {String} Week key
 */
function getWeekKey(date) {
  const year = date.getFullYear();
  const oneJan = new Date(year, 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
}

/**
 * Get month key for grouping (YYYY-MM)
 *
 * @param {Date} date - Date object
 * @returns {String} Month key
 */
function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Group orders by product
 *
 * @param {Array} orders - Array of orders
 * @returns {Object} Sales by product
 */
function groupByProduct(orders) {
  const productMap = new Map();

  for (const order of orders) {
    const orderDate = parseDate(order.date_created);
    const dateKey = getDateKey(orderDate);
    const weekKey = getWeekKey(orderDate);
    const monthKey = getMonthKey(orderDate);

    for (const item of order.line_items) {
      const key = item.product_id;
      const name = item.name || `Product ${item.product_id}`;

      if (!productMap.has(key)) {
        productMap.set(key, {
          product_id: item.product_id,
          name: name,
          daily: {},
          weekly: {},
          monthly: {},
          total: {
            quantity: 0,
            revenue: 0,
            orders: 0
          }
        });
      }

      const product = productMap.get(key);

      // Daily aggregation
      if (!product.daily[dateKey]) {
        product.daily[dateKey] = { quantity: 0, revenue: 0, orders: 0 };
      }
      product.daily[dateKey].quantity += item.quantity;
      product.daily[dateKey].revenue += item.total;
      product.daily[dateKey].orders += 1;

      // Weekly aggregation
      if (!product.weekly[weekKey]) {
        product.weekly[weekKey] = { quantity: 0, revenue: 0, orders: 0 };
      }
      product.weekly[weekKey].quantity += item.quantity;
      product.weekly[weekKey].revenue += item.total;
      product.weekly[weekKey].orders += 1;

      // Monthly aggregation
      if (!product.monthly[monthKey]) {
        product.monthly[monthKey] = { quantity: 0, revenue: 0, orders: 0 };
      }
      product.monthly[monthKey].quantity += item.quantity;
      product.monthly[monthKey].revenue += item.total;
      product.monthly[monthKey].orders += 1;

      // Total aggregation
      product.total.quantity += item.quantity;
      product.total.revenue += item.total;
      product.total.orders += 1;
    }
  }

  // Convert map to array
  return Array.from(productMap.values());
}

/**
 * Group orders by store
 *
 * @param {Array} orders - Array of orders
 * @returns {Object} Sales by store
 */
function groupByStore(orders) {
  const storeMap = new Map();

  for (const order of orders) {
    // Skip orders without identified store
    if (!order.store) {
      continue;
    }

    const orderDate = parseDate(order.date_created);
    const dateKey = getDateKey(orderDate);
    const weekKey = getWeekKey(orderDate);
    const monthKey = getMonthKey(orderDate);

    const key = order.store;

    if (!storeMap.has(key)) {
      storeMap.set(key, {
        store_name: order.store,
        daily: {},
        weekly: {},
        monthly: {},
        total: {
          revenue: 0,
          orders: 0,
          products: {}
        }
      });
    }

    const store = storeMap.get(key);

    // Daily aggregation
    if (!store.daily[dateKey]) {
      store.daily[dateKey] = { revenue: 0, orders: 0, products: {} };
    }
    store.daily[dateKey].revenue += order.total;
    store.daily[dateKey].orders += 1;

    // Weekly aggregation
    if (!store.weekly[weekKey]) {
      store.weekly[weekKey] = { revenue: 0, orders: 0, products: {} };
    }
    store.weekly[weekKey].revenue += order.total;
    store.weekly[weekKey].orders += 1;

    // Monthly aggregation
    if (!store.monthly[monthKey]) {
      store.monthly[monthKey] = { revenue: 0, orders: 0, products: {} };
    }
    store.monthly[monthKey].revenue += order.total;
    store.monthly[monthKey].orders += 1;

    // Total aggregation
    store.total.revenue += order.total;
    store.total.orders += 1;

    // Track products sold at this store
    for (const item of order.line_items) {
      if (!store.total.products[item.product_id]) {
        store.total.products[item.product_id] = {
          name: item.name,
          quantity: 0,
          revenue: 0
        };
      }
      store.total.products[item.product_id].quantity += item.quantity;
      store.total.products[item.product_id].revenue += item.total;
    }
  }

  // Convert map to array
  return Array.from(storeMap.values());
}

/**
 * Create product-store matrix
 *
 * @param {Array} orders - Array of orders
 * @returns {Array} Product-store sales matrix
 */
function createProductStoreMatrix(orders) {
  const matrixMap = new Map();

  for (const order of orders) {
    // Skip orders without identified store
    if (!order.store) {
      continue;
    }

    for (const item of order.line_items) {
      const key = `${item.product_id}:${order.store}`;

      if (!matrixMap.has(key)) {
        matrixMap.set(key, {
          product_id: item.product_id,
          product_name: item.name,
          store_name: order.store,
          quantity: 0,
          revenue: 0,
          orders: 0
        });
      }

      const entry = matrixMap.get(key);
      entry.quantity += item.quantity;
      entry.revenue += item.total;
      entry.orders += 1;
    }
  }

  // Convert map to array
  return Array.from(matrixMap.values());
}

/**
 * Group orders by time period (for timeline view)
 *
 * @param {Array} orders - Array of orders
 * @returns {Object} Sales by time period
 */
function groupByTime(orders) {
  const timeData = {
    daily: {},
    weekly: {},
    monthly: {},
    total: {
      revenue: 0,
      orders: 0,
      items_sold: 0
    }
  };

  for (const order of orders) {
    const orderDate = parseDate(order.date_created);
    const dateKey = getDateKey(orderDate);
    const weekKey = getWeekKey(orderDate);
    const monthKey = getMonthKey(orderDate);

    // Daily
    if (!timeData.daily[dateKey]) {
      timeData.daily[dateKey] = { revenue: 0, orders: 0, items_sold: 0 };
    }
    timeData.daily[dateKey].revenue += order.total;
    timeData.daily[dateKey].orders += 1;
    timeData.daily[dateKey].items_sold += order.line_items.reduce((sum, item) => sum + item.quantity, 0);

    // Weekly
    if (!timeData.weekly[weekKey]) {
      timeData.weekly[weekKey] = { revenue: 0, orders: 0, items_sold: 0 };
    }
    timeData.weekly[weekKey].revenue += order.total;
    timeData.weekly[weekKey].orders += 1;
    timeData.weekly[weekKey].items_sold += order.line_items.reduce((sum, item) => sum + item.quantity, 0);

    // Monthly
    if (!timeData.monthly[monthKey]) {
      timeData.monthly[monthKey] = { revenue: 0, orders: 0, items_sold: 0 };
    }
    timeData.monthly[monthKey].revenue += order.total;
    timeData.monthly[monthKey].orders += 1;
    timeData.monthly[monthKey].items_sold += order.line_items.reduce((sum, item) => sum + item.quantity, 0);

    // Total
    timeData.total.revenue += order.total;
    timeData.total.orders += 1;
    timeData.total.items_sold += order.line_items.reduce((sum, item) => sum + item.quantity, 0);
  }

  return timeData;
}

/**
 * Generate top rankings
 *
 * @param {Array} data - Array of data to rank
 * @param {String} sortBy - Field to sort by (revenue, quantity, orders)
 * @param {Number} limit - Number of top items to return
 * @returns {Array} Top items
 */
function getTopRankings(data, sortBy = 'revenue', limit = 10) {
  return [...data]
    .sort((a, b) => {
      const aValue = sortBy === 'revenue' ? a.total?.revenue || a.revenue || 0 :
                     sortBy === 'quantity' ? a.total?.quantity || a.quantity || 0 :
                     a.total?.orders || a.orders || 0;
      const bValue = sortBy === 'revenue' ? b.total?.revenue || b.revenue || 0 :
                     sortBy === 'quantity' ? b.total?.quantity || b.quantity || 0 :
                     b.total?.orders || b.orders || 0;
      return bValue - aValue;
    })
    .slice(0, limit);
}

/**
 * Process orders and generate reports
 *
 * @param {Object} rawData - Raw orders data with metadata
 * @returns {Object} Processed sales reports
 */
function processOrders(rawData) {
  const orders = rawData.orders || [];
  const metadata = rawData.metadata || {};

  logger.info(`Processing ${orders.length} orders`);
  logger.info(`Date range: ${metadata.extraction_date}`);

  // Group and aggregate data
  const salesByProduct = groupByProduct(orders);
  const salesByStore = groupByStore(orders);
  const productStoreMatrix = createProductStoreMatrix(orders);
  const salesByTime = groupByTime(orders);

  // Generate rankings
  const topProducts = getTopRankings(salesByProduct, 'revenue', 10);
  const topStores = getTopRankings(salesByStore, 'revenue', 10);
  const topProductStores = getTopRankings(productStoreMatrix, 'revenue', 20);

  // Build report
  const report = {
    metadata: {
      generated_at: new Date().toISOString(),
      currency: CONFIG.currency,
      order_count: orders.length,
      total_revenue: salesByTime.total.revenue,
      total_orders: salesByTime.total.orders,
      total_items_sold: salesByTime.total.items_sold,
      store_identified_count: orders.filter(o => o.store).length,
      store_unidentified_count: orders.filter(o => !o.store).length
    },

    sales_by_product: {
      all: salesByProduct,
      top_products: topProducts,
      daily: salesByProduct.map(p => ({
        product_id: p.product_id,
        name: p.name,
        ...p.daily
      })),
      weekly: salesByProduct.map(p => ({
        product_id: p.product_id,
        name: p.name,
        ...p.weekly
      })),
      monthly: salesByProduct.map(p => ({
        product_id: p.product_id,
        name: p.name,
        ...p.monthly
      }))
    },

    sales_by_store: {
      all: salesByStore,
      top_stores: topStores,
      daily: salesByStore.map(s => ({
        store_name: s.store_name,
        ...s.daily
      })),
      weekly: salesByStore.map(s => ({
        store_name: s.store_name,
        ...s.weekly
      })),
      monthly: salesByStore.map(s => ({
        store_name: s.store_name,
        ...s.monthly
      }))
    },

    product_store_matrix: {
      all: productStoreMatrix,
      top_combinations: topProductStores
    },

    sales_by_time: salesByTime,

    overview: {
      today: getTodayStats(orders),
      this_week: getThisWeekStats(orders),
      this_month: getThisMonthStats(orders)
    }
  };

  logger.info('Report generated successfully');
  logger.info(`Total revenue: ${CONFIG.currency} ${report.metadata.total_revenue.toFixed(2)}`);
  logger.info(`Total orders: ${report.metadata.total_orders}`);
  logger.info(`Products: ${salesByProduct.length}`);
  logger.info(`Stores: ${salesByStore.length}`);

  return report;
}

/**
 * Get today's statistics
 *
 * @param {Array} orders - Array of orders
 * @returns {Object} Today's stats
 */
function getTodayStats(orders) {
  const today = new Date();
  const todayKey = getDateKey(today);

  const todayOrders = orders.filter(order => {
    const orderDate = parseDate(order.date_created);
    return getDateKey(orderDate) === todayKey;
  });

  const revenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const itemsSold = todayOrders.reduce((sum, o) => sum + o.line_items.reduce((s, i) => s + i.quantity, 0), 0);

  return {
    date: todayKey,
    orders: todayOrders.length,
    revenue: revenue,
    items_sold: itemsSold
  };
}

/**
 * Get this week's statistics
 *
 * @param {Array} orders - Array of orders
 * @returns {Object} This week's stats
 */
function getThisWeekStats(orders) {
  const now = new Date();
  const weekKey = getWeekKey(now);

  // Find first day of week (Monday)
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  const mondayKey = getDateKey(monday);

  const weekOrders = orders.filter(order => {
    const orderDate = parseDate(order.date_created);
    const orderWeekKey = getWeekKey(orderDate);
    return orderWeekKey === weekKey;
  });

  const revenue = weekOrders.reduce((sum, o) => sum + o.total, 0);
  const itemsSold = weekOrders.reduce((sum, o) => sum + o.line_items.reduce((s, i) => s + i.quantity, 0), 0);

  return {
    week: weekKey,
    start_date: mondayKey,
    orders: weekOrders.length,
    revenue: revenue,
    items_sold: itemsSold
  };
}

/**
 * Get this month's statistics
 *
 * @param {Array} orders - Array of orders
 * @returns {Object} This month's stats
 */
function getThisMonthStats(orders) {
  const now = new Date();
  const monthKey = getMonthKey(now);
  const firstDayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  const monthOrders = orders.filter(order => {
    const orderDate = parseDate(order.date_created);
    const orderMonthKey = getMonthKey(orderDate);
    return orderMonthKey === monthKey;
  });

  const revenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
  const itemsSold = monthOrders.reduce((sum, o) => sum + o.line_items.reduce((s, i) => s + i.quantity, 0), 0);

  return {
    month: monthKey,
    start_date: firstDayKey,
    orders: monthOrders.length,
    revenue: revenue,
    items_sold: itemsSold
  };
}

/**
 * Save report to JSON file
 *
 * @param {Object} report - Report to save
 */
function saveReport(report) {
  ensureDirectories();

  const outputPath = CONFIG.paths.output;
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  logger.info(`Report saved to ${outputPath}`);
  logger.info(`Dashboard ready: Open dashboard/index.html`);
}

/**
 * Main execution function
 */
async function main() {
  try {
    logger.info('=== MayaSquare Orders Processing ===');

    // Read raw orders data
    if (!fs.existsSync(CONFIG.paths.input)) {
      throw new Error(`Raw orders file not found: ${CONFIG.paths.input}`);
      logger.info('Run "npm run extract" first to extract orders data.');
    }

    const rawData = JSON.parse(fs.readFileSync(CONFIG.paths.input, 'utf8'));
    logger.info(`Loaded ${rawData.orders?.length || 0} orders from ${CONFIG.paths.input}`);

    // Process orders
    const report = processOrders(rawData);

    // Save report
    saveReport(report);

    logger.info('=== Processing Complete ===');
    logger.info('Start dashboard: npm run dashboard');

  } catch (error) {
    logger.error('Processing failed:', error.message);
    if (CONFIG.logging === 'debug') {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  processOrders,
  groupByProduct,
  groupByStore,
  createProductStoreMatrix,
  groupByTime
};
