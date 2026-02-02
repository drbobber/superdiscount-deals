# MayaSquare Sales Reporting - Quick Status

**Time:** 04:55 UTC | 2026-01-28

---

## 🎯 Project Overview

Building a sales revenue reporting dashboard for MayaSquare (mayasquare.com)

**What it does:**
- Shows sales revenue by product
- Shows sales revenue by store/warehouse
- Daily, weekly, monthly views
- Charts and CSV export

---

## ⚠️ Blocking Issue

**API Permission Error:** HTTP 401 Unauthorized
- Consumer key lacks `orders:read` permission
- Cannot fetch orders data needed for reports

---

## ✅ What I Did

1. **Analyzed existing work**
   - Reviewed `/home/abds/mayasquare-exports/` (old scripts)
   - Reviewed integration docs

2. **Created project plan**
   - `/home/abds/clawd/GLM/docs/PROJECT_PLAN.md`
   - Comprehensive requirements and implementation

3. **Spawned GLM dev agent**
   - Creating folder structure
   - Building script templates
   - Creating dashboard

---

## 📋 I Need 3 Answers From You

### 1. How to get data?
**A:** Update API key (add "Read Orders" in WordPress admin)
**B:** Manual CSV export (export from WooCommerce admin)
**C:** Database access (read-only MySQL)

### 2. How to identify store/warehouse?
- Shipping city (Paris → Paris Store)?
- Custom field?
- Other method?

### 3. Historical data range?
- Last 30 days?
- Last 90 days?
- All time?

---

## 📊 Deliverables

**Ready to build once unblocked:**
- ✅ Orders extraction script
- ✅ Data processing pipeline
- ✅ Dashboard with Chart.js
- ✅ Daily/Weekly/Monthly reports
- ✅ Export to CSV

**Time:** 3-5 hours

---

## 📁 Project Location
`/home/abds/clawd/GLM/`

---

**Reply with the 3 answers and I'll complete the project!**

---
*GLM Dev Agent currently building templates*
*Validation at 14:00 UTC (2 PM)*
