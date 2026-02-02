# 🚀 GitHub Automation with Clawdbot - Quick Start Guide

**Last Updated:** 2026-01-31  
**Repository:** drbobber/ayssen-business-hub

---

## 🎯 How to Use GitHub Automation

### Option 1: Direct Commands (Simplest)

Just ask Clawdbot in Telegram:

```
"Process the next GitHub issue in ayssen-business-hub"
```

Or:

```
"Fix issue #74 in carousel-factory"
```

Or:

```
"Work on GitHub issues for carousel-factory using the automation workflow"
```

**Clawdbot will:**
1. ✅ Load automation commands from `~/.claude/autopilot/commands/`
2. ✅ Follow the new validation workflow
3. ✅ Create proper PR with validation
4. ✅ Report status back to you

---

### Option 2: Spawn Dedicated Sub-Agent (Recommended)

**For longer automation sessions:**

```
"Spawn a GitHub automation sub-agent to process carousel-factory issues"
```

**Benefits:**
- Isolated session (doesn't clutter main chat)
- Can run multiple issues in sequence
- Uses GLM-4.7 (fast, cheap)
- Falls back to Sonnet for complex issues
- Reports back when done

---

## 📝 What to Say

### Process Next Issue

```
"Process the next ready issue in ayssen-business-hub"
```

**Output:**
```
🔍 Scanning open issues...
Selected: Issue #74 - "Add template compression" (scope-small, medium-priority)

Starting automation workflow...
✅ Pre-check passed
✅ Implemented changes (3 files, 250 lines)
✅ Tests written (35 test cases)
✅ PR #92 created
✅ Validation passed

Awaiting: Human review and CI results
```

---

### Process Specific Issue

```
"Fix issue #77 in ayssen-business-hub"
```

**Output:**
```
🎯 Processing Issue #77 - "Add webhook support"

Pre-flight: ✅ Passed
Branch: issue-77-webhook-support
Implementation: [work happens here]
PR #93: ✅ Created and validated

Next steps:
- Review PR #93
- Approve if tests pass
- Merge to close issue
```

---

### Status Check

```
"GitHub automation status for ayssen-business-hub"
```

**Output:**
```
📊 GitHub Automation Status

Repository: ayssen-business-hub
Open Issues: 10
Open PRs: 2
  - PR #91: Issue #72 "Rate limiting" (awaiting review)
  - PR #92: Issue #74 "Template compression" (awaiting review)

Ready to process: Issues #77, #70, #69
Next recommended: #77 (webhooks, scope-small, medium-priority)

Say "process next" to continue.
```

---

### Batch Processing

```
"Process 3 issues in carousel-factory"
```

**Output:**
```
🔄 Batch Processing (max 3 issues)

Issue #77: ✅ PR #93 created
Issue #70: ✅ PR #94 created  
Issue #69: ⚠️  Scope too large, skipped

Completed: 2 PRs created
Remaining: 8 open issues

All PRs awaiting review.
```

---

## 🔧 Advanced Commands

### Run with Specific Model

```
"Process issue #74 using Sonnet"
```

### Run Validation Only

```
"Validate PR #91 for issue #72"
```

### Review Automation Quality

```
"Check PR quality metrics for ayssen-business-hub"
```

---

## 📋 Workflow Overview

**When you ask Clawdbot to process an issue, it:**

1. **Discovers** - Scans open issues, selects by priority
2. **Validates** - Runs pre-PR check (new workflow!)
3. **Implements** - Creates branch, writes code, tests
4. **Creates PR** - Following strict format rules
5. **Validates** - Runs post-PR check (ensures compliance)
6. **Reports** - Gives you status and next steps

**All following the rules:**
- ✅ ONE ISSUE = ONE PR
- ✅ ALWAYS use validation scripts
- ✅ NEVER push to main directly
- ✅ PROPER PR format
- ✅ HUMAN review required

---

## 🎯 Example Session

**You:**
```
"Process next issue in carousel-factory"
```

**Clawdbot:**
```
🔍 Selected Issue #74 - "Add template compression"

📁 Pre-flight checks:
  ✅ Repository clean
  ✅ Created branch: issue-74-template-compression
  ✅ Branch validation passed

💻 Implementation:
  ✅ Created TemplateCompressor class
  ✅ Added 3 compression formats (gzip, lz4, zstd)
  ✅ Wrote 35 unit tests
  ✅ Updated __init__.py exports
  
🧪 Tests:
  ✅ All 35 tests passing locally
  
📝 PR Creation:
  ✅ Pre-PR validation passed
  ✅ Pushed branch to origin
  ✅ Created PR #92
  ✅ Post-PR validation passed
  
🔗 Links:
  - Issue: #74
  - PR: #92
  - Branch: issue-74-template-compression

⏳ Next Steps:
  1. CI will run tests
  2. Review PR #92
  3. Approve if tests pass
  4. Merge to close issue #74

📊 Status: 1 PR created, 9 issues remaining
```

**You:**
```
"Continue"
```

**Clawdbot:**
```
🔍 Selected Issue #77 - "Add webhook support"
[repeats process...]
```

---

## ⚙️ Configuration

### Agent Settings

**Primary Model:** GLM-4.7 (fast, cheap, efficient)  
**Fallback Model:** Claude Sonnet 4.5 (complex issues)  
**Workspace:** `/home/abds/ayssen-business-hub`

### Automation Files

**Commands:**
- `~/.claude/autopilot/commands/github-issue-fix-enhanced`
- `~/.claude/autopilot/commands/github-autopilot`

**Validation Scripts:**
- `~/.claude/autopilot/scripts/pre-pr-check.sh`
- `~/.claude/autopilot/scripts/validate-pr.sh`

**Agent Definition:**
- `/home/abds/clawd/agents/github-automation-agent.md`

---

## 🚨 Important Rules

**Clawdbot ALWAYS:**
1. Runs pre-PR validation before creating PR
2. Runs post-PR validation after creating PR
3. Creates one PR per issue (no bundling)
4. Uses proper PR format (validated)
5. Waits for human review (never auto-merges)

**If validation fails:**
- Clawdbot will report the error
- Fix the issue
- Re-run the automation

---

## 📊 Success Metrics

**After using automation, check:**

```
"Show PR quality metrics"
```

**Expected:**
- ✅ 100% PRs pass validation
- ✅ 100% PRs reference only one issue
- ✅ 100% commits reference issue number
- ✅ >80% PRs pass tests on first try

---

## 🆘 Troubleshooting

### "Validation failed"

**Check:**
- Run: `~/.claude/autopilot/scripts/pre-pr-check.sh <issue-num>`
- Read error output
- Fix reported issues
- Try again

### "Tests failing"

**Ask:**
```
"Debug test failures for PR #92"
```

**Or manually:**
```bash
cd ~/ayssen-business-hub/carousel-factory
python3 -m pytest tests/test_template_compression.py -v
```

### "Wrong PR format"

**Ask:**
```
"Fix PR #92 format to match validation rules"
```

---

## 🎓 Tips & Best Practices

### 1. Start Small
Process 1-2 issues to start, verify quality, then scale up.

### 2. Review PRs Promptly
Automation works best with quick feedback loops.

### 3. Keep Issues Well-Defined
Clear acceptance criteria = better automation results.

### 4. Use Validation Scripts
They catch 90% of issues before they become problems.

### 5. Monitor Quality
Check PR quality metrics weekly to catch drift.

---

## 📞 Quick Reference

**Process next issue:**
> "Process next issue"

**Process specific issue:**
> "Fix issue #74"

**Status check:**
> "GitHub status"

**Batch processing:**
> "Process 3 issues"

**Validation:**
> "Validate PR #92"

**Debug:**
> "Debug issue #74"

---

## 🔗 Related Documentation

- **Full Guide:** `/home/abds/clawd/GITHUB_AUTOMATION_IMPROVEMENTS.md`
- **Quick Commands:** `~/.claude/autopilot/QUICK_REFERENCE.md`
- **Branch Protection:** `~/.claude/autopilot/docs/BRANCH_PROTECTION_SETUP.md`
- **Workflow Details:** `~/.claude/autopilot/docs/WORKFLOW_IMPROVEMENTS_SUMMARY.md`

---

## ✅ Ready to Start?

**Just say:**

```
"Process the next issue in ayssen-business-hub"
```

**Clawdbot will handle the rest!**

---

**Questions?** Ask Clawdbot:
> "How does GitHub automation work?"
> "What's the workflow for processing issues?"
> "Show me an example of processing an issue"
