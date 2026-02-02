# 📋 For Website Admin - API Access Explanation

## Quick Summary

**Issue:** API returning HTTP 401 (Unauthorized) when accessing orders data

**We're trying to access:**
```
GET /wp-json/wc/v3/orders?per_page=100&status=completed
```

**Current Error:**
```
"woocommerce_rest_cannot_view"
"Désolé, vous ne pouvez pas lister les ressources."
```

---

## What Data We Need

From the orders endpoint, we get:

```json
[
  {
    "id": 12345,
    "date_created": "2026-01-15T10:30:00Z",
    "status": "completed",
    "total": "125.50",
    "currency": "EUR",
    "line_items": [
      {
        "product_id": 456,
        "name": "Product Name",
        "quantity": 2,
        "total": "100.00"
      }
    ],
    "shipping": {
      "city": "Paris",
      "state": "Île-de-France"
    },
    "billing": {
      "city": "Paris",
      "state": "Île-de-France"
    }
  }
]
```

---

## Why We Need This

### 1. Sales by Product
- Which products sold
- How many units
- Total revenue per product

### 2. Sales by Store
- From shipping city, identify which store
- Revenue per location

### 3. Time-Based Reports
- Daily, weekly, monthly aggregations

---

## What the Admin Needs to Check

### Step 1: Go to WooCommerce API Keys
```
WordPress Admin → WooCommerce → Settings → Advanced → REST API
```

### Step 2: Find This Key
```
Consumer Key: ck_258879ff2895d05e1fa03a70ee2fea5592a640e4de5e58309afb701e3b921be0b30f01663
```

### Step 3: Verify Permissions
The key MUST have:
- ✅ **Read Orders** (`orders:read`) ← MISSING!
- ✅ Read Products (optional but helpful)

### Step 4: If Permission Missing
Either:
- **Edit** the existing key and add "Read Orders" permission, OR
- **Create** a new key with "Read Orders" permission

---

## How to Test

Admin can test with:
```bash
curl -X GET "https://mayasquare.com/wp-json/wc/v3/orders?per_page=1" \
  -H "Authorization: Basic $(echo -n "CONSUMER_KEY:SECRET" | base64 -w 0)" \
  -H "Content-Type: application/json"
```

If it returns order data → **Working!**
If it returns 401 error → **Permission still missing**

---

## Security Note

We need **READ permissions only**. We will NOT write, modify, or delete anything.

---

**Action:** Please check the API key permissions and add "Read Orders" access.

**Then share:** Updated Consumer Key (and Secret if new key was created).

---

*Full details in: /home/abds/clawd/GLM/docs/API_ENDPOINT_EXPLANATION.md*
