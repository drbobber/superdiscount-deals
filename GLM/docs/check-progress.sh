#!/bin/bash
# Hourly progress check for MayaSquare project
# Runs automatically via cron to check status and continue work

PROGRESS_FILE="/home/abds/clawd/GLM/PROGRESS.md"
LOG_FILE="/home/abds/clawd/GLM/logs/progress-$(date +%Y%m%d-%H%M).log"
CURRENT_TIME=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

mkdir -p /home/abds/clawd/GLM/logs

echo "========================================" | tee -a "$LOG_FILE"
echo "Progress Check: $CURRENT_TIME" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

# Read current status from PROGRESS.md
if [ -f "$PROGRESS_FILE" ]; then
    CURRENT_STATE=$(grep "^Current State:" "$PROGRESS_FILE" | cut -d: -f2- | xargs)
    echo "Current Status: $CURRENT_STATE" | tee -a "$LOG_FILE"
else
    echo "⚠️  PROGRESS.md not found" | tee -a "$LOG_FILE"
fi

# Check if we can access orders API now
echo "" | tee -a "$LOG_FILE"
echo "Checking API access..." | tee -a "$LOG_FILE"

WP_SITE="https://mayasquare.com"
CONSUMER_KEY="ck_258879ff2895d05e1fa03a70ee2fea5592a640e4de5e58309afb701e3b921be0b30f01663"

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -X GET "$WP_SITE/wp-json/wc/v3/orders?per_page=1" \
    -H "Authorization: Basic $(echo -n "$CONSUMER_KEY:" | base64 -w 0)" \
    -H "Content-Type: application/json")

echo "API Status: HTTP $HTTP_STATUS" | tee -a "$LOG_FILE"

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ API Access granted!" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
    echo "Next Task: Fetch orders data" | tee -a "$LOG_FILE"

    # Update PROGRESS.md to reflect API access
    sed -i 's/^Current State:.*/Current State: 🟢 API ACCESS GRANTED - Ready to fetch orders/' "$PROGRESS_FILE"
else
    echo "❌ API still blocked (HTTP $HTTP_STATUS)" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
    echo "⏳ Waiting for Ayssen to update API credentials" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
echo "Check complete" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
