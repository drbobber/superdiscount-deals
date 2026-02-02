#!/usr/bin/env node

/**
 * extract-orders.js
 *
 * Extract orders data from WooCommerce REST API or CSV file.
 *
 * This script supports two data sources:
 * 1. WooCommerce REST API (automated, real-time)
 * 2. Manual CSV export from WooCommerce admin
 *
 * Usage:
 *   node extract-orders.js                          # Auto-detect source
 *   node extract-orders.js --api                    # Force API extraction
 *   node extract-orders.js --csv data/raw/orders.csv  # Use CSV file
 *
 * Environment variables (.env):
 *   WOOCOMMERCE_URL           - WooCommerce store URL
 *   WOOCOMMERCE_CONSUMER_KEY  - API consumer key (with orders:read permission)
 *   WOOCOMMERCE_CONSUMER_SECRET - API consumer secret
 *   STORE_IDENTIFICATION_METHOD - How to identify stores (city, metadata, billing)
 *   STORE_MAPPING - JSON array mapping cities to stores
 *   ORDER_STATUS - Order statuses to include (default: completed)
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Load environment variables
require('dotenv').config();

// Configuration
const CONFIG = {
  api: {
    url: process.env.WOOCOMMERCE_URL || 'https://mayasquare.com',
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    perPage: parseInt(process.env.ORDERS_PER_PAGE) || 100,
    startDate: process.env.START_DATE || null,
    endDate: process.env.END_DATE || null,
    orderStatus: (process.env.ORDER_STATUS || 'completed').split(',').map(s => s.trim())
  },
  store: {
    identificationMethod: process.env.STORE_IDENTIFICATION_METHOD || 'city',
    metadataField: process.env.STORE_METADATA_FIELD || '_store_id',
    mapping: JSON.parse(process.env.STORE_MAPPING || '[]')
  },
  paths: {
    raw: path.join(__dirname, '../data/raw'),
    output: path.join(__dirname, '../data/raw/orders_raw.json')
  },
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
  if (!fs.existsSync(CONFIG.paths.raw)) {
    fs.mkdirSync(CONFIG.paths.raw, { recursive: true });
    logger.info('Created data/raw directory');
  }
}

/**
 * Identify store from order based on configuration
 *
 * @param {Object} order - Order object from WooCommerce API
 * @returns {String|null} Store name or null if not identified
 */
function identifyStore(order) {
  const { identificationMethod, mapping } = CONFIG.store;

  switch (identificationMethod) {
    case 'city':
      // Use shipping city to identify store
      const city = order.shipping?.city || order.billing?.city;
      if (!city) {
        logger.warn(`No city found for order ${order.id}`);
        return null;
      }

      // Find matching store
      for (const entry of mapping) {
        if (entry.city_pattern.endsWith('*')) {
          // Wildcard match
          const prefix = entry.city_pattern.slice(0, -1);
          if (city.toLowerCase().startsWith(prefix.toLowerCase())) {
            return entry.store;
          }
        } else {
          // Exact match
          if (city.toLowerCase() === entry.city_pattern.toLowerCase()) {
            return entry.store;
          }
        }
      }

      logger.warn(`No store mapping found for city: ${city}`);
      return null;

    case 'metadata':
      // Use custom metadata field
      const storeId = order.meta_data?.find(m => m.key === CONFIG.store.metadataField)?.value;
      if (!storeId) {
        logger.warn(`No metadata field "${CONFIG.store.metadataField}" found in order ${order.id}`);
        return null;
      }
      return storeId;

    case 'billing':
      // Use billing address state/region
      const state = order.billing?.state;
      if (!state) {
        logger.warn(`No state found for order ${order.id}`);
        return null;
      }
      // Use mapping to find store (similar to city method)
      for (const entry of mapping) {
        if (entry.state_pattern && entry.state_pattern.endsWith('*')) {
          const prefix = entry.state_pattern.slice(0, -1);
          if (state.toLowerCase().startsWith(prefix.toLowerCase())) {
            return entry.store;
          }
        } else if (entry.state_pattern) {
          if (state.toLowerCase() === entry.state_pattern.toLowerCase()) {
            return entry.store;
          }
        }
      }
      logger.warn(`No store mapping found for state: ${state}`);
      return null;

    default:
      logger.error(`Unknown store identification method: ${identificationMethod}`);
      return null;
  }
}

/**
 * Fetch orders from WooCommerce API
 *
 * @returns {Promise<Array>} Array of orders
 */
async function fetchFromAPI() {
  logger.info('Starting API extraction...');

  if (!CONFIG.api.consumerKey || !CONFIG.api.consumerSecret) {
    throw new Error('Missing API credentials. Please set WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET in .env');
  }

  const axios = require('axios');
  const auth = Buffer.from(`${CONFIG.api.consumerKey}:${CONFIG.api.consumerSecret}`).toString('base64');

  let page = 1;
  let allOrders = [];
  let hasMore = true;

  while (hasMore) {
    try {
      logger.info(`Fetching page ${page}...`);

      // Build request URL
      const params = {
        page: page,
        per_page: CONFIG.api.perPage,
        status: CONFIG.api.orderStatus.join(',')
      };

      // Add date filters if specified
      if (CONFIG.api.startDate) {
        params.after = CONFIG.api.startDate;
      }
      if (CONFIG.api.endDate) {
        params.before = CONFIG.api.endDate;
      }

      const response = await axios.get(`${CONFIG.api.url}/wp-json/wc/v3/orders`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        params
      });

      const orders = response.data;
      logger.info(`Received ${orders.length} orders from page ${page}`);

      if (orders.length === 0) {
        hasMore = false;
        break;
      }

      // Identify store for each order
      const processedOrders = orders.map(order => ({
        id: order.id,
        number: order.number,
        status: order.status,
        currency: order.currency,
        total: parseFloat(order.total),
        total_tax: parseFloat(order.total_tax),
        total_shipping: parseFloat(order.shipping_total),
        date_created: order.date_created,
        date_paid: order.date_paid,
        payment_method: order.payment_method,
        payment_method_title: order.payment_method_title,

        // Store identification
        store: identifyStore(order),

        // Line items (products)
        line_items: order.line_items.map(item => ({
          product_id: item.product_id,
          variation_id: item.variation_id || null,
          name: item.name,
          quantity: item.quantity,
          subtotal: parseFloat(item.subtotal),
          subtotal_tax: parseFloat(item.subtotal_tax),
          total: parseFloat(item.total),
          total_tax: parseFloat(item.total_tax),
          price: parseFloat(item.price)
        })),

        // Shipping info
        shipping: {
          first_name: order.shipping?.first_name || '',
          last_name: order.shipping?.last_name || '',
          company: order.shipping?.company || '',
          address_1: order.shipping?.address_1 || '',
          address_2: order.shipping?.address_2 || '',
          city: order.shipping?.city || '',
          state: order.shipping?.state || '',
          postcode: order.shipping?.postcode || '',
          country: order.shipping?.country || ''
        },

        // Billing info
        billing: {
          first_name: order.billing?.first_name || '',
          last_name: order.billing?.last_name || '',
          company: order.billing?.company || '',
          address_1: order.billing?.address_1 || '',
          address_2: order.billing?.address_2 || '',
          city: order.billing?.city || '',
          state: order.billing?.state || '',
          postcode: order.billing?.postcode || '',
          country: order.billing?.country || ''
        },

        // Metadata
        meta_data: order.meta_data || []
      }));

      allOrders = allOrders.concat(processedOrders);
      page++;

      // Check if we got fewer orders than requested (means we're done)
      if (orders.length < CONFIG.api.perPage) {
        hasMore = false;
      }

    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Your API key may not have "orders:read" permission.');
      }
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  logger.info(`Successfully fetched ${allOrders.length} orders`);
  return allOrders;
}

/**
 * Parse orders from CSV file
 *
 * @param {String} filePath - Path to CSV file
 * @returns {Promise<Array>} Array of orders
 */
async function parseCSV(filePath) {
  logger.info(`Parsing CSV file: ${filePath}`);

  return new Promise((resolve, reject) => {
    const orders = [];
    let headerRow = null;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (headers) => {
        headerRow = headers;
        logger.debug('CSV headers:', headers);
      })
      .on('data', (row) => {
        try {
          // Map CSV columns to our data model
          // This assumes standard WooCommerce CSV export format
          const order = {
            id: parseInt(row['Order ID'] || row['ID']),
            number: row['Order Number'] || '',
            status: row['Status'] || '',
            currency: row['Currency'] || CONFIG.api.currency || 'EUR',
            total: parseFloat(row['Total'] || row['Order Total'] || 0),
            total_tax: parseFloat(row['Tax Total'] || 0),
            total_shipping: parseFloat(row['Shipping Total'] || 0),
            date_created: row['Date Created'] || row['Date'] || '',
            date_paid: row['Date Paid'] || '',

            // Store identification
            store: null, // Will be identified below

            // Line items (CSV export format varies, this is basic parsing)
            line_items: [],

            // Shipping info
            shipping: {
              first_name: row['Shipping First Name'] || '',
              last_name: row['Shipping Last Name'] || '',
              company: row['Shipping Company'] || '',
              address_1: row['Shipping Address 1'] || '',
              address_2: row['Shipping Address 2'] || '',
              city: row['Shipping City'] || '',
              state: row['Shipping State'] || '',
              postcode: row['Shipping Postcode'] || '',
              country: row['Shipping Country'] || ''
            },

            // Billing info
            billing: {
              first_name: row['Billing First Name'] || '',
              last_name: row['Billing Last Name'] || '',
              company: row['Billing Company'] || '',
              address_1: row['Billing Address 1'] || '',
              address_2: row['Billing Address 2'] || '',
              city: row['Billing City'] || '',
              state: row['Billing State'] || '',
              postcode: row['Billing Postcode'] || '',
              country: row['Billing Country'] || ''
            },

            // Metadata
            meta_data: []
          };

          // Identify store
          order.store = identifyStore(order);

          // Parse line items from CSV (format varies by export type)
          // This is a simplified parser - may need adjustment based on actual CSV format
          if (row['Line Items']) {
            try {
              // Try to parse line items JSON if available
              const lineItems = JSON.parse(row['Line Items']);
              order.line_items = lineItems;
            } catch (e) {
              // Fallback: parse as text if not JSON
              logger.debug(`Could not parse line items for order ${order.id}`);
            }
          }

          orders.push(order);
        } catch (error) {
          logger.warn(`Error parsing row: ${error.message}`);
        }
      })
      .on('end', () => {
        logger.info(`Successfully parsed ${orders.length} orders from CSV`);
        resolve(orders);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Save orders to JSON file
 *
 * @param {Array} orders - Array of orders to save
 */
function saveOrders(orders) {
  const outputPath = CONFIG.paths.output;

  // Create summary statistics
  const stats = {
    total_orders: orders.length,
    total_revenue: orders.reduce((sum, o) => sum + o.total, 0),
    stores_identified: orders.filter(o => o.store).length,
    stores_unidentified: orders.filter(o => !o.store).length,
    extraction_date: new Date().toISOString(),
    extraction_method: 'API' // Will be updated below
  };

  // Update extraction method based on how we got data
  if (process.argv.includes('--csv')) {
    stats.extraction_method = 'CSV';
  }

  const output = {
    metadata: stats,
    orders: orders
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  logger.info(`Saved ${orders.length} orders to ${outputPath}`);
  logger.info('Statistics:', stats);
}

/**
 * Main execution function
 */
async function main() {
  try {
    logger.info('=== MayaSquare Orders Extraction ===');
    logger.info('Configuration:', {
      api: {
        url: CONFIG.api.url,
        hasCredentials: !!(CONFIG.api.consumerKey && CONFIG.api.consumerSecret)
      },
      store: CONFIG.store
    });

    ensureDirectories();

    let orders = [];

    // Determine extraction method
    const args = process.argv.slice(2);
    if (args.includes('--csv') && args[1]) {
      // CSV mode
      const csvPath = args[1];
      if (!fs.existsSync(csvPath)) {
        throw new Error(`CSV file not found: ${csvPath}`);
      }
      orders = await parseCSV(csvPath);
    } else if (args.includes('--api') || CONFIG.api.consumerKey) {
      // API mode
      orders = await fetchFromAPI();
    } else {
      throw new Error('No extraction method specified. Use --api or --csv <path>, or configure API credentials in .env');
    }

    if (orders.length === 0) {
      logger.warn('No orders found. Check your date range and API permissions.');
      return;
    }

    saveOrders(orders);

    logger.info('Extraction complete! Run "npm run process" to generate reports.');
    logger.info(`Dashboard will use: ${CONFIG.paths.output}`);

  } catch (error) {
    logger.error('Extraction failed:', error.message);
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

module.exports = { identifyStore, fetchFromAPI, parseCSV };
