# WooCommerce Orders API - What We Need

## To Forward to Website Admin

---

## The Problem

We're trying to access orders data to build sales reports, but getting HTTP 401 (Unauthorized) error:

```
Error: "Désolé, vous ne pouvez pas lister les ressources"
HTTP Status: 401
```

## What We're Trying to Access

**Endpoint:** `GET /wp-json/wc/v3/orders`

**Parameters:**
```
per_page=100          # Get up to 100 orders per request
page=1                # Page number (pagination)
status=completed       # Filter by order status
order=desc            # Most recent first
orderby=date          # Sort by date
```

---

## What Data We Get From This Endpoint

When the API works correctly, it returns an array of orders with this structure:

```json
[
  {
    "id": 12345,
    "date_created": "2026-01-15T10:30:00Z",
    "status": "completed",
    "currency": "EUR",
    "total": "125.50",
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
      "first_name": "John",
      "last_name": "Doe",
      "address_1": "123 Main St",
      "city": "Paris",
      "state": "",
      "postcode": "75001",
      "country": "FR"
    },
    "billing": {
      "first_name": "John",
      "last_name": "Doe",
      "address_1": "123 Main St",
      "city": "Paris",
      "state": "",
      "postcode": "75001",
      "country": "FR"
    },
    "meta_data": [
      {
        "key": "_store_id",
        "value": "store_paris"
      }
    ]
  }
]
```

---

## Why We Need This Data

### 1. Sales Revenue by Product
From `line_items` we get:
- Which product was sold
- How many units
- Total revenue per product

**Example output:**
```
Product A: €1,500 (150 units)
Product B: €2,000 (200 units)
```

### 2. Sales Revenue by Store/Warehouse
From `shipping.city` or `meta_data` we identify which store:
- Paris Store: €3,000
- Lyon Store: €1,500
- Marseille Store: €800

### 3. Time-Based Reports
From `date_created` we group by:
- Day: "2026-01-15" → €500
- Week: Week 3 → €3,500
- Month: January → €15,000

---

## Current API Key

```
Consumer Key: ck_258879ff2895d05e1fa03a70ee2fea5592a640e4de5e58309afb701e3b921be0b30f01663
```

**Issue:** This key cannot access the `/wp-json/wc/v3/orders` endpoint

---

## What the Admin Needs to Do

### Option 1: Check Existing Key Permissions

1. **Log in to WordPress Admin**
   - URL: https://mayasquare.com/wp-admin

2. **Navigate to API Keys**
   - Go to: WooCommerce → Settings → Advanced → REST API
   - Find the key: `ck_258879ff2895d05e1fa03a70ee2fea5592a640e4de5e58309afb701e3b921be0b30f01663`

3. **Verify Permissions**
   - The key should have: **Read Orders** (`orders:read`)
   - Also helpful: **Read Products** (`products:read`)

4. **If Permissions Missing**
   - Edit the key and add "Read Orders" permission
   - Save and try again

### Option 2: Create New Key with Correct Permissions

1. **Create New API Key**
   - Same location: WooCommerce → Settings → Advanced → REST API
   - Click "Add Key"

2. **Configure Permissions**
   - **Description:** "Mayasquare Sales Reports"
   - **User:** Select appropriate user
   - **Permissions:**
     - ✅ Read Products
     - ✅ Read Orders
     - ✅ Read Customers (optional, for analytics)
     - ❌ No Write permissions needed (we're read-only)

3. **Save and Share**
   - Copy the new Consumer Key and Secret
   - Share with us

---

## How to Verify the Key Works

The admin can test the key with this command:

```bash
curl -X GET "https://mayasquare.com/wp-json/wc/v3/orders?per_page=1" \
  -H "Authorization: Basic $(echo -n "CONSUMER_KEY:SECRET" | base64 -w 0)" \
  -H "Content-Type: application/json"
```

**Expected Response (Success):**
```json
[
  {
    "id": 12345,
    "date_created": "2026-01-15T10:30:00Z",
    ...
  }
]
```

**Expected Response (Error):**
```json
{
  "code": "woocommerce_rest_cannot_view",
  "message": "Désolé, vous ne pouvez pas lister les ressources."
}
```

---

## Security Note

We need **READ permissions only**. We will:
- ✅ Extract orders data
- ✅ Process and aggregate
- ✅ Generate reports
- ❌ NEVER write, modify, or delete anything

---

## Summary

**Endpoint:** `/wp-json/wc/v3/orders`
**Permissions Needed:** `orders:read`
**Purpose:** Sales revenue reports by product, store, and time period

**Action Required for Admin:**
1. Check if existing key has "Read Orders" permission
2. If not, add permission or create new key
3. Share updated Consumer Key (and Secret if changed)

---

**Contact:** Forward this to the website admin to resolve the API access issue.

**Last Updated:** 2026-01-28 04:50 UTC
