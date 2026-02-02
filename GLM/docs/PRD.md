# MayaSquare Sales Reporting - Project Plan

## Customer: MayaSquare

### Problem Statement
Current stock system shows total quantity across all stores. Customer needs to see:
- Sales revenue per product
- Sales revenue per warehouse/store
- Period-based reports (day, week, month)

### Requirements
- **Output:** Reports + Dashboard showing sales by product & store
- **Time periods:** Daily, Weekly, Monthly
- **Constraint:** READ-ONLY access to WordPress source system (no data modifications)
- **Location:** GLM folder in workspace

## Project Tasks

### Phase 1: Discovery & Planning
- [ ] Understand WordPress/WooCommerce data structure
- [ ] Identify available data sources (API, DB export, etc.)
- [ ] Map data model: products, stores, orders, line items
- [ ] Define extract strategy

### Phase 2: Extract Scripts
- [ ] Write extract script for orders data
- [ ] Write extract script for products data
- [ ] Write extract script for stores/locations data
- [ ] Test extracts without touching source

### Phase 3: Data Processing
- [ ] Build transformation pipeline
- [ ] Aggregate by product, store, and time period
- [ ] Create intermediate data files

### Phase 4: Dashboard
- [ ] Design dashboard layout
- [ ] Implement data visualization
- [ ] Add period filters (day/week/month)
- [ ] Test all reports

### Phase 5: Delivery
- [ ] Final testing
- [ ] Documentation for deployment
- [ ] User guide

## Current Status
- **Started:** 2026-01-28 04:37 UTC
- **Next Validation:** 2 PM (ask @planner/Opus to review)
- **Progress:** Project initialization

## Notes
- Source system: WordPress (likely WooCommerce)
- All work must be READ-ONLY on source
- Work autonomously, break into small tasks
