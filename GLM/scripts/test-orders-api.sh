#!/bin/bash
# Test WooCommerce Orders API access
set -e

# Configuration
WP_SITE="https://mayasquare.com"
CONSUMER_KEY="ck_258879ff2895d05e1fa03a1fa03a70ee2fea5592a640e4de5e58309afb701e3b921be0b30f01663"
OUTPUT_DIR="/home/abds/clawd/GLM/exports"
DATE=$(date +%Y-%m-%d)

echo "========================================"
echo "Testing WooCommerce Orders API"
echo "========================================"
echo ""

mkdir -p "$OUTPUT_DIR"

# Test 1: Fetch orders
echo "Test 1: Fetching orders (last 10)..."
echo "----------------------------------------"
ORDERS=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
    -X GET "$WP_SITE/wp-json/wc/v3/orders?per_page=10&order=desc&orderby=date" \
    -H "Authorization: Basic $(echo -n "$CONSUMER_KEY:" | base64 -w 0)" \
    -H "Content-Type: application/json")

HTTP_CODE=$(echo "$ORDERS" | grep "HTTP_CODE:" | cut -d: -f2)
ORDERS_BODY=$(echo "$ORDERS" | sed '/^HTTP_CODE:/d')

echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Orders API accessible!"

    # Parse response
    ORDER_COUNT=$(echo "$ORDERS_BODY" | jq 'length' 2>/dev/null || echo "0")
    echo "Orders returned: $ORDER_COUNT"

    if [ "$ORDER_COUNT" -gt 0 ]; then
        echo ""
        echo "First order sample:"
        echo "$ORDERS_BODY" | jq '.[0] | {
            id: .id,
            date: .date_created,
            status: .status,
            total: .total,
            currency: .currency,
            line_items: [.line_items[] | {name: .name, quantity: .quantity, total: .total}]
        }' 2>/dev/null

        # Save full orders data
        echo "$ORDERS_BODY" > "$OUTPUT_DIR/orders_test_$DATE.json"
        echo ""
        echo "✅ Saved to: $OUTPUT_DIR/orders_test_$DATE.json"

        # Check if orders have location/warehouse info
        echo ""
        echo "Checking for location/warehouse fields..."
        echo "$ORDERS_BODY" | jq '.[0]' | grep -iE "(shipping|billing|store|warehouse|location)" || echo "No obvious location fields found in order object"

        # Check line items for meta data
        echo ""
        echo "Checking line items for product meta..."
        echo "$ORDERS_BODY" | jq '.[0].line_items[0]' 2>/dev/null
    else
        echo "⚠️  No orders returned"
    fi
else
    echo "❌ API Error"
    echo "$ORDERS_BODY"
fi

# Test 2: Check available endpoints
echo ""
echo "Test 2: Checking WooCommerce API capabilities..."
echo "----------------------------------------"
ENDPOINTS=(
    "/wp-json/wc/v3/products"
    "/wp-json/wc/v3/orders"
    "/wp-json/wc/v3/customers"
    "/wp-json/wc/v3/reports/sales"
    "/wp-json/wc/v3/reports/orders/totals"
)

for endpoint in "${ENDPOINTS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
        -X GET "$WP_SITE$endpoint?per_page=1" \
        -H "Authorization: Basic $(echo -n "$CONSUMER_KEY:" | base64 -w 0)" \
        -H "Content-Type: application/json")

    NAME=$(basename $endpoint)
    if [ "$STATUS" = "200" ]; then
        echo "✅ $NAME - Accessible"
    else
        echo "❌ $NAME - HTTP $STATUS"
    fi
done

echo ""
echo "========================================"
echo "Test complete"
echo "========================================"
