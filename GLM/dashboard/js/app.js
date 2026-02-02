/**
 * app.js
 *
 * Main application logic for MayaSquare Sales Dashboard.
 * Handles UI interactions, data loading, and chart updates.
 */

// Application state
const appState = {
  data: null,
  currentPeriod: 'month',
  activeTab: 'overview'
};

/**
 * Initialize the application
 */
async function init() {
  console.log('[app.js] Initializing...');

  // Setup event listeners
  setupEventListeners();

  // Load data
  await refreshData();

  // Update UI
  updateUI();

  console.log('[app.js] Initialization complete');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.target.dataset.tab;
      switchTab(tab);
    });
  });

  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', refreshData);

  // Export button
  document.getElementById('exportBtn').addEventListener('click', exportCurrentData);

  // Period selectors
  document.getElementById('overviewPeriod').addEventListener('change', (e) => {
    updateOverview(e.target.value);
  });

  document.getElementById('productPeriod').addEventListener('change', (e) => {
    appState.currentPeriod = e.target.value;
    updateProductsTab();
  });

  document.getElementById('storePeriod').addEventListener('change', (e) => {
    appState.currentPeriod = e.target.value;
    updateStoresTab();
  });

  // Product search
  document.getElementById('productSearch').addEventListener('input', (e) => {
    filterProductsTable(e.target.value);
  });
}

/**
 * Switch to a different tab
 *
 * @param {String} tabId - Tab identifier
 */
function switchTab(tabId) {
  appState.activeTab = tabId;

  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });

  // Update charts for the active tab
  updateActiveTab();

  console.log('[app.js] Switched to tab:', tabId);
}

/**
 * Update the active tab's content
 */
function updateActiveTab() {
  if (!appState.data) return;

  switch (appState.activeTab) {
    case 'overview':
      updateOverview(appState.currentPeriod);
      break;
    case 'products':
      updateProductsTab();
      break;
    case 'stores':
      updateStoresTab();
      break;
    case 'matrix':
      updateMatrixTab();
      break;
  }
}

/**
 * Refresh data from server
 */
async function refreshData() {
  console.log('[app.js] Refreshing data...');

  try {
    // Clear cache
    clearCache();

    // Show loading state
    document.body.classList.add('loading');

    // Load data
    appState.data = await loadData();

    // Update last updated timestamp
    if (appState.data.metadata?.generated_at) {
      const date = new Date(appState.data.metadata.generated_at);
      document.getElementById('lastUpdated').textContent = date.toLocaleString();
    }

    // Update UI
    updateUI();

    // Hide loading state
    document.body.classList.remove('loading');

    console.log('[app.js] Data refreshed successfully');

  } catch (error) {
    console.error('[app.js] Error refreshing data:', error);
    alert('Failed to refresh data. Please check the console for details.');
    document.body.classList.remove('loading');
  }
}

/**
 * Update all UI elements
 */
function updateUI() {
  if (!appState.data) return;

  // Update summary cards
  updateSummaryCards();

  // Update active tab
  updateActiveTab();
}

/**
 * Update summary cards
 */
function updateSummaryCards() {
  const data = appState.data;

  // Total revenue
  document.getElementById('totalRevenue').textContent = formatCurrency(data.metadata?.total_revenue || 0);

  // Total orders
  document.getElementById('totalOrders').textContent = formatNumber(data.metadata?.total_orders || 0);

  // Active stores
  document.getElementById('activeStores').textContent = formatNumber(data.sales_by_store?.all?.length || 0);

  // Products sold
  document.getElementById('productsSold').textContent = formatNumber(data.metadata?.total_items_sold || 0);
}

/**
 * Update overview tab
 *
 * @param {String} period - Time period (today, week, month, all)
 */
function updateOverview(period) {
  if (!appState.data) return;

  console.log('[app.js] Updating overview for period:', period);

  const stats = getOverviewStats(appState.data, period);
  const timeSeries = getTimeSeries(appState.data, period);
  const topProducts = getTopProducts(appState.data, 5);
  const topStores = getTopStores(appState.data, 5);

  // Update charts
  createRevenueChart('revenueChart', timeSeries);
  createTopProductsChart('topProductsChart', topProducts);

  // Update tables
  updateTopProductsTable(topProducts);
  updateTopStoresTable(topStores);
}

/**
 * Update products tab
 */
function updateProductsTab() {
  if (!appState.data) return;

  console.log('[app.js] Updating products tab for period:', appState.currentPeriod);

  const productSales = getProductSales(appState.data, appState.currentPeriod);

  // Update chart
  createProductsRevenueChart('productsRevenueChart', productSales);

  // Update table
  updateProductsTable(productSales);
}

/**
 * Update stores tab
 */
function updateStoresTab() {
  if (!appState.data) return;

  console.log('[app.js] Updating stores tab for period:', appState.currentPeriod);

  const storeSales = getStoreSales(appState.data, appState.currentPeriod);

  // Update chart
  createStoresRevenueChart('storesRevenueChart', storeSales);

  // Update table
  updateStoresTable(storeSales);
}

/**
 * Update matrix tab
 */
function updateMatrixTab() {
  if (!appState.data) return;

  console.log('[app.js] Updating matrix tab');

  const matrix = getProductStoreMatrix(appState.data);

  // Update chart
  createMatrixChart('matrixChart', matrix);

  // Update table
  updateMatrixTable(matrix);
}

/**
 * Update top products table
 *
 * @param {Array} products - Product data
 */
function updateTopProductsTable(products) {
  const tbody = document.querySelector('#topProductsTable tbody');
  tbody.innerHTML = '';

  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td class="numeric">${formatNumber(product.total?.quantity || 0)}</td>
      <td class="numeric">${formatCurrency(product.total?.revenue || 0)}</td>
    `;
    tbody.appendChild(row);
  });
}

/**
 * Update top stores table
 *
 * @param {Array} stores - Store data
 */
function updateTopStoresTable(stores) {
  const tbody = document.querySelector('#topStoresTable tbody');
  tbody.innerHTML = '';

  stores.forEach(store => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${store.store_name}</td>
      <td class="numeric">${formatNumber(store.total?.orders || 0)}</td>
      <td class="numeric">${formatCurrency(store.total?.revenue || 0)}</td>
    `;
    tbody.appendChild(row);
  });
}

/**
 * Update products table
 *
 * @param {Array} products - Product data
 */
function updateProductsTable(products) {
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';

  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.product_id}</td>
      <td>${product.name}</td>
      <td class="numeric">${formatNumber(product.total?.quantity || 0)}</td>
      <td class="numeric">${formatCurrency(product.total?.revenue || 0)}</td>
    `;
    tbody.appendChild(row);
  });
}

/**
 * Filter products table by search term
 *
 * @param {String} searchTerm - Search term
 */
function filterProductsTable(searchTerm) {
  const rows = document.querySelectorAll('#productsTable tbody tr');
  const term = searchTerm.toLowerCase();

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? '' : 'none';
  });
}

/**
 * Update stores table
 *
 * @param {Array} stores - Store data
 */
function updateStoresTable(stores) {
  const tbody = document.querySelector('#storesTable tbody');
  tbody.innerHTML = '';

  stores.forEach(store => {
    // Find top product for this store
    const products = Object.values(store.total?.products || {});
    const topProduct = products.sort((a, b) => b.revenue - a.revenue)[0];

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${store.store_name}</td>
      <td class="numeric">${formatNumber(store.total?.orders || 0)}</td>
      <td class="numeric">${formatCurrency(store.total?.revenue || 0)}</td>
      <td>${topProduct ? topProduct.name : '-'}</td>
    `;
    tbody.appendChild(row);
  });
}

/**
 * Update matrix table
 *
 * @param {Array} matrix - Product-store matrix data
 */
function updateMatrixTable(matrix) {
  const tbody = document.querySelector('#matrixTable tbody');
  tbody.innerHTML = '';

  // Show top 20 combinations
  const topCombinations = matrix
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 20);

  topCombinations.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.product_name}</td>
      <td>${item.store_name}</td>
      <td class="numeric">${formatNumber(item.quantity)}</td>
      <td class="numeric">${formatCurrency(item.revenue)}</td>
    `;
    tbody.appendChild(row);
  });
}

/**
 * Export current tab data to CSV
 */
function exportCurrentData() {
  if (!appState.data) {
    alert('No data available to export');
    return;
  }

  const typeMap = {
    'overview': 'products',
    'products': 'products',
    'stores': 'stores',
    'matrix': 'matrix'
  };

  const type = typeMap[appState.activeTab] || 'products';
  exportToCSV(appState.data, type);
}

/**
 * Handle window resize
 */
window.addEventListener('resize', () => {
  // Charts will auto-resize via Chart.js
  console.log('[app.js] Window resized');
});

/**
 * Handle visibility change (tab switch in browser)
 */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && appState.data) {
    console.log('[app.js] Tab became visible');
    // Optionally refresh data after a delay
  }
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
