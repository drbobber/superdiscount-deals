#!/usr/bin/env node

/**
 * test-calculations.js
 *
 * Test data processing calculations.
 * Validates that aggregation logic is correct.
 */

const fs = require('fs');
const path = require('path');

// Import process functions
const { processOrders } = require('../scripts/process-orders');

/**
 * Create mock orders data for testing
 */
function createMockOrders() {
  return {
    metadata: {
      extraction_date: new Date().toISOString(),
      order_count: 5
    },
    orders: [
      {
        id: 1,
        status: 'completed',
        total: 100.00,
        currency: 'EUR',
        date_created: '2026-01-15T10:00:00Z',
        store: 'Paris Store',
        line_items: [
          { product_id: 101, name: 'Product A', quantity: 2, total: 60.00 },
          { product_id: 102, name: 'Product B', quantity: 1, total: 40.00 }
        ]
      },
      {
        id: 2,
        status: 'completed',
        total: 150.00,
        currency: 'EUR',
        date_created: '2026-01-15T11:00:00Z',
        store: 'Lyon Store',
        line_items: [
          { product_id: 101, name: 'Product A', quantity: 3, total: 90.00 },
          { product_id: 103, name: 'Product C', quantity: 1, total: 60.00 }
        ]
      },
      {
        id: 3,
        status: 'completed',
        total: 75.00,
        currency: 'EUR',
        date_created: '2026-01-16T09:00:00Z',
        store: 'Paris Store',
        line_items: [
          { product_id: 102, name: 'Product B', quantity: 1, total: 40.00 },
          { product_id: 103, name: 'Product C', quantity: 1, total: 35.00 }
        ]
      },
      {
        id: 4,
        status: 'completed',
        total: 200.00,
        currency: 'EUR',
        date_created: '2026-01-16T14:00:00Z',
        store: 'Marseille Store',
        line_items: [
          { product_id: 101, name: 'Product A', quantity: 4, total: 120.00 },
          { product_id: 102, name: 'Product B', quantity: 2, total: 80.00 }
        ]
      },
      {
        id: 5,
        status: 'completed',
        total: 125.00,
        currency: 'EUR',
        date_created: '2026-01-17T10:00:00Z',
        store: 'Lyon Store',
        line_items: [
          { product_id: 103, name: 'Product C', quantity: 2, total: 70.00 },
          { product_id: 104, name: 'Product D', quantity: 1, total: 55.00 }
        ]
      }
    ]
  };
}

/**
 * Run tests
 */
function runTests() {
  console.log('=== Running Calculation Tests ===\n');

  const mockData = createMockOrders();
  const report = processOrders(mockData);

  let passed = 0;
  let failed = 0;

  // Test 1: Total revenue
  const expectedRevenue = 650.00;
  const actualRevenue = report.metadata.total_revenue;
  const test1 = Math.abs(actualRevenue - expectedRevenue) < 0.01;

  console.log(`Test 1: Total Revenue`);
  console.log(`  Expected: €${expectedRevenue.toFixed(2)}`);
  console.log(`  Actual:   €${actualRevenue.toFixed(2)}`);
  console.log(`  Result:   ${test1 ? '✓ PASS' : '✗ FAIL'}`);
  console.log();

  if (test1) passed++; else failed++;

  // Test 2: Total orders
  const expectedOrders = 5;
  const actualOrders = report.metadata.total_orders;
  const test2 = actualOrders === expectedOrders;

  console.log(`Test 2: Total Orders`);
  console.log(`  Expected: ${expectedOrders}`);
  console.log(`  Actual:   ${actualOrders}`);
  console.log(`  Result:   ${test2 ? '✓ PASS' : '✗ FAIL'}`);
  console.log();

  if (test2) passed++; else failed++;

  // Test 3: Product A total revenue
  const productA = report.sales_by_product.all.find(p => p.product_id === 101);
  const expectedProductA = 270.00; // 60 + 90 + 120
  const actualProductA = productA ? productA.total.revenue : 0;
  const test3 = Math.abs(actualProductA - expectedProductA) < 0.01;

  console.log(`Test 3: Product A Revenue`);
  console.log(`  Expected: €${expectedProductA.toFixed(2)}`);
  console.log(`  Actual:   €${actualProductA.toFixed(2)}`);
  console.log(`  Result:   ${test3 ? '✓ PASS' : '✗ FAIL'}`);
  console.log();

  if (test3) passed++; else failed++;

  // Test 4: Product A total quantity
  const expectedQuantityA = 9; // 2 + 3 + 4
  const actualQuantityA = productA ? productA.total.quantity : 0;
  const test4 = actualQuantityA === expectedQuantityA;

  console.log(`Test 4: Product A Quantity`);
  console.log(`  Expected: ${expectedQuantityA}`);
  console.log(`  Actual:   ${actualQuantityA}`);
  console.log(`  Result:   ${test4 ? '✓ PASS' : '✗ FAIL'}`);
  console.log();

  if (test4) passed++; else failed++;

  // Test 5: Paris Store total revenue
  const parisStore = report.sales_by_store.all.find(s => s.store_name === 'Paris Store');
  const expectedParisRevenue = 175.00; // 100 + 75
  const actualParisRevenue = parisStore ? parisStore.total.revenue : 0;
  const test5 = Math.abs(actualParisRevenue - expectedParisRevenue) < 0.01;

  console.log(`Test 5: Paris Store Revenue`);
  console.log(`  Expected: €${expectedParisRevenue.toFixed(2)}`);
  console.log(`  Actual:   €${actualParisRevenue.toFixed(2)}`);
  console.log(`  Result:   ${test5 ? '✓ PASS' : '✗ FAIL'}`);
  console.log();

  if (test5) passed++; else failed++;

  // Test 6: Lyon Store total revenue
  const lyonStore = report.sales_by_store.all.find(s => s.store_name === 'Lyon Store');
  const expectedLyonRevenue = 275.00; // 150 + 125
  const actualLyonRevenue = lyonStore ? lyonStore.total.revenue : 0;
  const test6 = Math.abs(actualLyonRevenue - expectedLyonRevenue) < 0.01;

  console.log(`Test 6: Lyon Store Revenue`);
  console.log(`  Expected: €${expectedLyonRevenue.toFixed(2)}`);
  console.log(`  Actual:   €${actualLyonRevenue.toFixed(2)}`);
  console.log(`  Result:   ${test6 ? '✓ PASS' : '✗ FAIL'}`);
  console.log();

  if (test6) passed++; else failed++;

  // Test 7: Product-Store Matrix (Product A @ Paris)
  const productAParis = report.product_store_matrix.all.find(
    m => m.product_id === 101 && m.store_name === 'Paris Store'
  );
  const expectedAParisRevenue = 60.00;
  const actualAParisRevenue = productAParis ? productAParis.revenue : 0;
  const test7 = Math.abs(actualAParisRevenue - expectedAParisRevenue) < 0.01;

  console.log(`Test 7: Product A @ Paris Revenue`);
  console.log(`  Expected: €${expectedAParisRevenue.toFixed(2)}`);
  console.log(`  Actual:   €${actualAParisRevenue.toFixed(2)}`);
  console.log(`  Result:   ${test7 ? '✓ PASS' : '✗ FAIL'}`);
  console.log();

  if (test7) passed++; else failed++;

  // Summary
  console.log('=== Test Summary ===');
  console.log(`Passed: ${passed}/${passed + failed}`);
  console.log(`Failed: ${failed}/${passed + failed}`);
  console.log();

  return failed === 0;
}

/**
 * Main execution
 */
async function main() {
  try {
    const success = runTests();

    if (success) {
      console.log('✓ All tests passed!');
      process.exit(0);
    } else {
      console.log('✗ Some tests failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
