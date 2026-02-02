/**
 * charts.js
 *
 * Chart.js integration for MayaSquare Sales Dashboard.
 * Creates and manages all charts.
 */

// Chart instances
let charts = {
  revenueChart: null,
  topProductsChart: null,
  productsRevenueChart: null,
  storesRevenueChart: null,
  matrixChart: null
};

// Chart colors
const colors = {
  primary: '#2563eb',
  primaryLight: '#60a5fa',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  palette: [
    '#2563eb', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#f97316', '#6366f1', '#14b8a6', '#a855f7'
  ]
};

/**
 * Create revenue over time chart
 *
 * @param {String} canvasId - Canvas element ID
 * @param {Array} data - Time series data
 */
function createRevenueChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  // Destroy existing chart
  if (charts.revenueChart) {
    charts.revenueChart.destroy();
  }

  const labels = data.map(d => d.date);
  const revenues = data.map(d => d.revenue);

  charts.revenueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue',
        data: revenues,
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight + '20',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `Revenue: ${formatCurrency(context.raw)}`
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        }
      }
    }
  });
}

/**
 * Create top products bar chart
 *
 * @param {String} canvasId - Canvas element ID
 * @param {Array} data - Product data
 */
function createTopProductsChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  // Destroy existing chart
  if (charts.topProductsChart) {
    charts.topProductsChart.destroy();
  }

  const labels = data.map(d => d.name);
  const revenues = data.map(d => d.total?.revenue || 0);

  charts.topProductsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue',
        data: revenues,
        backgroundColor: colors.palette,
        borderWidth: 0
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `Revenue: ${formatCurrency(context.raw)}`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Create products revenue chart
 *
 * @param {String} canvasId - Canvas element ID
 * @param {Array} data - Product data
 */
function createProductsRevenueChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  // Destroy existing chart
  if (charts.productsRevenueChart) {
    charts.productsRevenueChart.destroy();
  }

  // Get latest period data (find object with most keys)
  const latestPeriod = data.reduce((latest, product) => {
    const productKeys = Object.keys(product).filter(k => /^\d{4}-\d{2}$/.test(k) || /^\d{4}-W\d{2}$/.test(k));
    if (productKeys.length > latest.count) {
      return { key: productKeys[productKeys.length - 1], count: productKeys.length };
    }
    return latest;
  }, { key: null, count: 0 });

  const labels = data.map(d => d.name);
  const revenues = data.map(d => d.total?.revenue || 0);

  charts.productsRevenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue',
        data: revenues,
        backgroundColor: colors.primary,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `Revenue: ${formatCurrency(context.raw)}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Create stores revenue chart
 *
 * @param {String} canvasId - Canvas element ID
 * @param {Array} data - Store data
 */
function createStoresRevenueChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  // Destroy existing chart
  if (charts.storesRevenueChart) {
    charts.storesRevenueChart.destroy();
  }

  const labels = data.map(d => d.store_name);
  const revenues = data.map(d => d.total?.revenue || 0);

  charts.storesRevenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue',
        data: revenues,
        backgroundColor: colors.palette,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `Revenue: ${formatCurrency(context.raw)}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Create product-store matrix bubble chart
 *
 * @param {String} canvasId - Canvas element ID
 * @param {Array} data - Product-store matrix data
 */
function createMatrixChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  // Destroy existing chart
  if (charts.matrixChart) {
    charts.matrixChart.destroy();
  }

  // Get unique products and stores
  const products = [...new Set(data.map(d => d.product_name))];
  const stores = [...new Set(data.map(d => d.store_name))];

  // Create dataset
  const chartData = data.map(d => ({
    x: stores.indexOf(d.store_name),
    y: products.indexOf(d.product_name),
    r: Math.sqrt(d.revenue) / 100, // Bubble size based on revenue
    revenue: d.revenue,
    product: d.product_name,
    store: d.store_name
  }));

  charts.matrixChart = new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Revenue',
        data: chartData,
        backgroundColor: colors.palette.map(c => c + '80'),
        borderColor: colors.palette,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const point = context.raw;
              return `${point.product} @ ${point.store}: ${formatCurrency(point.revenue)}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Stores'
          },
          ticks: {
            stepSize: 1,
            callback: (value) => stores[value] || ''
          },
          grid: {
            display: false
          }
        },
        y: {
          type: 'linear',
          title: {
            display: true,
            text: 'Products'
          },
          ticks: {
            stepSize: 1,
            callback: (value) => products[value] || ''
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Destroy all charts
 */
function destroyAllCharts() {
  Object.values(charts).forEach(chart => {
    if (chart) {
      chart.destroy();
    }
  });

  charts = {
    revenueChart: null,
    topProductsChart: null,
    productsRevenueChart: null,
    storesRevenueChart: null,
    matrixChart: null
  };
}

/**
 * Update all charts with new data
 *
 * @param {Object} data - Sales data
 * @param {String} period - Time period
 */
function updateAllCharts(data, period = 'monthly') {
  // Destroy existing charts
  destroyAllCharts();

  // Create new charts
  const timeSeries = getTimeSeries(data, period);
  createRevenueChart('revenueChart', timeSeries);

  const topProducts = getTopProducts(data, 5);
  createTopProductsChart('topProductsChart', topProducts);

  const productSales = getProductSales(data, period);
  createProductsRevenueChart('productsRevenueChart', productSales);

  const storeSales = getStoreSales(data, period);
  createStoresRevenueChart('storesRevenueChart', storeSales);

  const matrix = getProductStoreMatrix(data);
  createMatrixChart('matrixChart', matrix);

  console.log('[charts.js] All charts updated');
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createRevenueChart,
    createTopProductsChart,
    createProductsRevenueChart,
    createStoresRevenueChart,
    createMatrixChart,
    destroyAllCharts,
    updateAllCharts
  };
}
