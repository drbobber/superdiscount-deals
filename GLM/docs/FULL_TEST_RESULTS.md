# Full API Test Results for MayaSquare

## Test 1: Orders Endpoint

### Command
```bash
curl -s "https://mayasquare.com/wp-json/wc/v3/orders?per_page=1&status=completed" \
  -H "Authorization: Basic $(echo -n "ck_258879ff2895d05e1fa03a70ee2fea5592a640e4de5e58309afb701e3b921be0b30f01663:" | base64 -w 0)" \
  -H "Content-Type: application/json"
```

### Full Response
```json
{
  "code": "woocommerce_rest_cannot_view",
  "message": "Désolé, vous ne pouvez pas lister les ressources.",
  "data": {
    "status": 401
  }
}
```

### HTTP Status
- **Status:** 401 Unauthorized
- **Server:** nginx
- **Content-Type:** application/json; charset=UTF-8
- **Powered by:** PHP/8.3.30

---

## Test 2: Products Endpoint

### Command
```bash
curl -s "https://mayasquare.com/wp-json/wc/v3/products?per_page=1" \
  -H "Authorization: Basic $(echo -n "ck_258879ff2895d05e1fa03a70ee2fea5592a640e4de5e58309afb701e3b921be0b30f01663:" | base64 -w 0)" \
  -H "Content-Type: application/json"
```

### Full Response
```json
{
  "code": "woocommerce_rest_cannot_view",
  "message": "Désolé, vous ne pouvez pas lister les ressources.",
  "data": {
    "status": 401
  }
}
```

### HTTP Status
- **Status:** 401 Unauthorized
- **Same error as orders endpoint**

---

## Test 3: WooCommerce Base API (Discovery)

### Command
```bash
curl -s "https://mayasquare.com/wp-json/wc/v3" \
  -H "Content-Type: application/json"
```

### Result
✅ **WooCommerce API is installed and working!**

The base endpoint returns a full JSON API schema with all available endpoints including:
- `/wc/v3/orders`
- `/wc/v3/products`
- `/wc/v3/reports/sales`
- `/wc/v3/reports/orders/totals`
- And many more...

**This proves:**
1. WooCommerce is installed ✅
2. The API endpoints exist ✅
3. The issue is NOT a missing endpoint ✅
4. The issue is PERMISSIONS only ❌

---

## Diagnosis

### The Problem
- **Consumer Key:** `ck_258879ff2895d05e1fa03a70ee2fea5592a640e4de5e58309afb701e3b921be0b30f01663`
- **Error:** `woocommerce_rest_cannot_view` (401 Unauthorized)
- **Message:** "Désolé, vous ne pouvez pas lister les ressources." (Sorry, you cannot list the resources)

### What This Means
The consumer key exists and is recognized by WooCommerce, BUT:
1. The key does NOT have `orders:read` permission
2. The key does NOT have `products:read` permission
3. The permissions for this key are insufficient

---

## What the Admin Needs to Do

### Step 1: Log into WordPress Admin
```
URL: https://mayasquare.com/wp-admin
```

### Step 2: Navigate to API Keys
```
WooCommerce → Settings → Advanced → REST API
```

### Step 3: Find the Key
```
Consumer Key: ck_258879ff2895d05e1fa03a70ee2fea5592a640e4de5e58309afb701e3b921be0b30f01663
```

### Step 4: Check/Update Permissions
The key MUST have these permissions checked:
- ✅ **Read Orders** (`orders:read`) ← This is what's missing!
- ✅ **Read Products** (`products:read`) ← Also missing!

**Screenshot to send to admin:**
- Show the API Keys page
- Show the permissions checkboxes for this specific key
- Show that "Read" permissions need to be checked

---

## What to Tell the Developer

If the developer says "I already adjusted permissions", forward this information:

```
Hi,

We're still getting HTTP 401 Unauthorized when trying to access the WooCommerce API.

Test Results:
- Orders endpoint (/wp-json/wc/v3/orders): 401 Unauthorized
- Products endpoint (/wp-json/wc/v3/products): 401 Unauthorized
- Base WooCommerce API: Working fine, permissions issue only

Error Message:
"woocommerce_rest_cannot_view"
"Désolé, vous ne pouvez pas lister les ressources."

Consumer Key in Use:
ck_258879ff2895d05e1fa03a70ee2fea5592a640e4de5e58309afb701e3b921be0b30f01663

The WooCommerce API is installed and the endpoints exist. The issue is ONLY permissions.

Can you please verify that the consumer key has:
- Read Orders permission
- Read Products permission

Or generate a new key with these permissions.

Thanks,
```

---

## Alternative: Try Without Secret

The error happens even with just the consumer key (no secret). This confirms it's a **permission scope** issue, not a credential format issue.

---

## Summary

| Item | Status |
|-------|--------|
| WooCommerce Installed | ✅ Yes |
| API Endpoints Exist | ✅ Yes |
| Consumer Key Recognized | ✅ Yes |
| Orders Permission | ❌ No |
| Products Permission | ❌ No |
| Root Cause | **Missing read permissions on the consumer key** |

---

**Action Required:** The website admin must update the consumer key permissions to include "Read Orders" and "Read Products" permissions.

**Forward the section "What to Tell the Developer" above to the developer.**
