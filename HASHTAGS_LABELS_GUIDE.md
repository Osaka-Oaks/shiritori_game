# 🏷️ Hashtags & Labels Guide

Complete guide to using hashtags and labels for deployment identification, tracking, and Firebase URL testing.

---

## 🎯 Overview

Your repository now supports **hashtags and labels** for:

✅ **Deployment identification** - Tag deployments with custom hashtags  
✅ **Commit tracking** - Extract hashtags from commit messages  
✅ **Automated labeling** - Auto-label issues and deployments  
✅ **Firebase URL testing** - Test deployments with labeled reports  
✅ **Status tracking** - Monitor deployments by tags  

---

## 🏷️ Using Hashtags in Commits

### Basic Usage

Include hashtags in your commit messages:

```bash
git commit -m "feat(kawaii): add dark mode #feature #ui #darkmode"
```

**Hashtags are automatically:**
- ✅ Extracted from commit message
- ✅ Added to deployment labels
- ✅ Included in test reports
- ✅ Used for identification

### Recommended Hashtags

#### By Type
```bash
#feature    - New feature
#bugfix     - Bug fix
#hotfix     - Critical fix
#security   - Security update
#performance - Performance improvement
#refactor   - Code refactoring
```

#### By Component
```bash
#online     - shiritori-online app
#kawaii     - kawaii-shiritori app
#firebase   - Firebase changes
#database   - Database updates
#ui         - UI changes
#api        - API changes
```

#### By Priority
```bash
#critical   - Critical/urgent
#high       - High priority
#normal     - Normal priority
#low        - Low priority
```

#### By Status
```bash
#wip        - Work in progress
#ready      - Ready for review
#tested     - Tested locally
#breaking   - Breaking changes
```

### Example Commits

```bash
# Feature with multiple tags
git commit -m "feat(kawaii): add user profiles #feature #ui #authentication"

# Bug fix
git commit -m "fix(online): resolve connection timeout #bugfix #critical #firebase"

# Performance improvement
git commit -m "perf: optimize dictionary loading #performance #kawaii #optimization"

# Security hotfix
git commit -m "security(auth): patch XSS vulnerability #security #hotfix #critical"
```

---

## 🚀 Deploying with Hashtags

### Method 1: Automatic (from commit)

Commit with hashtags, then deploy:

```bash
# Commit with hashtags
git commit -m "feat: add awesome feature #feature #production-ready"
git push origin main

# Hashtags automatically extracted and applied to deployment
```

### Method 2: Using the Script

```bash
# Basic deployment
npm run deploy:with-tags

# With environment
./scripts/deploy-with-tags.sh production

# With custom tags
./scripts/deploy-with-tags.sh production "#hotfix #security #urgent"
```

**What happens:**
1. Script extracts hashtags from last commit
2. Combines with custom tags you provide
3. Adds auto-generated tags (branch, SHA, date, env)
4. Triggers GitHub Actions workflow
5. Creates deployment issue with all tags

### Method 3: Manual Workflow Trigger

```bash
# Using GitHub CLI
gh workflow run deploy-with-labels.yml \
  -f environment=production \
  -f tags="#hotfix,#security,#critical"

# Or via GitHub UI:
# Actions → Deploy & Test with Labels → Run workflow
# Fill in environment and tags fields
```

---

## 🧪 Testing Firebase URLs

### Test Current Deployment

```bash
# Test production
npm run test:firebase

# Test with specific URL
./scripts/test-firebase-url.sh https://shiritori-game-ccaae.web.app production

# Test staging
./scripts/test-firebase-url.sh https://shiritori-game-ccaae--develop.web.app staging
```

### Test Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Firebase URL Testing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

URL: https://shiritori-game-ccaae.web.app
Environment: production
Timestamp: 2026-07-07T03:14:00Z

[1/10] Testing homepage accessibility...
✅ Homepage accessible (HTTP 200, 0.523s)
   #homepage #http200 #accessible

[2/10] Checking version endpoint...
✅ Version endpoint found
   Version: 20260707.031400-abc123
   Tags: #feature,#ui,#production-ready
   #version #endpoint

[3/10] Verifying page content...
✅ Expected Japanese content found
   #content #japanese #verified

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Passed:   9
  ⚠️  Warnings: 1
  ❌ Failed:   0

Status: ✅ HEALTHY
Labels: #testing #firebase #production #healthy #passing
URL: https://shiritori-game-ccaae.web.app
Tested: 2026-07-07T03:14:00Z

Report saved: .github/test-summary-20260707-031400.md
```

---

## 📊 Deployment Tracking with Labels

### Automatic Deployment Issue

When you deploy, an issue is automatically created:

**Title:** `🚀 Deploy 20260707.031400-abc123 to production`

**Labels:**
- `deployment`
- `env-production`
- `feature`
- `ui`
- `production-ready`
- `version-20260707.031400-abc123`

**Body:**
```markdown
## 🚀 Deployment: 20260707.031400-abc123

**Environment**: production
**Version**: `20260707.031400-abc123`
**Branch**: `main`
**SHA**: `abc123`
**Triggered by**: @jarrel

### 🏷️ Tags
- `#feature`
- `#ui`
- `#production-ready`
- `version:20260707.031400-abc123`
- `env:production`
- `branch:main`

### ⏱️ Timeline
- **Started**: 2026-07-07T03:14:00Z
- **Status**: 🔄 In Progress

---
*This issue will be auto-updated with deployment status*
```

### Issue Updates

The issue is automatically updated with:
- ✅ Deployment completion status
- 🧪 Test results
- 🔗 Live URL
- ⏱️ Completion timestamp

---

## 🔍 Finding Deployments by Tags

### Using GitHub Search

**Find by hashtag:**
```
is:issue label:deployment #hotfix
is:issue label:deployment #security
is:issue label:deployment #feature
```

**Find by environment:**
```
is:issue label:env-production
is:issue label:env-staging
```

**Find by status:**
```
is:issue label:deployment is:open     # In progress
is:issue label:deployment is:closed   # Completed
```

### Using GitHub CLI

```bash
# List deployment issues
gh issue list --label deployment

# Find by specific tag
gh issue list --label deployment --search "#hotfix"

# View deployment details
gh issue view <issue-number>
```

### Filter by Multiple Tags

```bash
# Security hotfixes in production
gh issue list --label deployment --label env-production --search "#security #hotfix"

# Recent feature deployments
gh issue list --label deployment --label feature --state all --limit 10
```

---

## 🎯 Labeling Strategy

### Deployment Labels

**Automatically added:**
- `deployment` - All deployments
- `env-production` - Production deploys
- `env-staging` - Staging deploys
- `version-X` - Version identifier

**From hashtags:**
- `feature` - From #feature
- `bugfix` - From #bugfix
- `security` - From #security
- `hotfix` - From #hotfix
- Custom tags from your commits

### Label Hierarchy

```
deployment
├── env-production
│   ├── feature
│   │   ├── #ui
│   │   └── #api
│   ├── bugfix
│   │   └── #critical
│   └── security
│       └── #hotfix
└── env-staging
    └── feature
        └── #wip
```

---

## 📈 Best Practices

### Commit Messages with Hashtags

✅ **DO:**
```bash
# Clear, descriptive with relevant hashtags
git commit -m "feat(kawaii): add user authentication #feature #authentication #firebase"

# Priority tags for important fixes
git commit -m "fix(online): resolve data corruption #bugfix #critical #database"

# Multiple component tags
git commit -m "refactor: optimize game engine #performance #refactor #online #kawaii"
```

❌ **DON'T:**
```bash
# Too many hashtags
git commit -m "update code #a #b #c #d #e #f #g #h #i"

# Irrelevant hashtags
git commit -m "fix typo #critical #urgent #breaking #major"

# Special characters in hashtags
git commit -m "feat: new feature #this_is_too_long! #with@special$chars"
```

### Hashtag Naming

✅ **Good hashtags:**
- `#darkmode` - Clear, one word
- `#user-auth` - Hyphenated for clarity
- `#v2-migration` - Version prefix
- `#api-v3` - Specific version

❌ **Bad hashtags:**
- `#dark mode` - Spaces don't work
- `#toomanycharsinthishashtag` - Too long
- `#123` - Just numbers
- `#fix!` - Special characters

### Deployment Tags

**Use for:**
- Version identification
- Feature tracking
- Rollback identification
- Performance monitoring
- A/B testing groups

**Examples:**
```bash
# Version releases
#v1.0.0 #v2.0.0-beta

# Feature flags
#feature-flagA #experiment-newUI

# Rollback identifiers
#rollback-candidate #stable-version

# Performance testing
#perf-test #load-test-1000
```

---

## 🔄 Complete Workflow Example

### Scenario: Deploy Security Hotfix

```bash
# 1. Create fix with hashtags
git checkout -b hotfix/security-patch
git commit -m "security: patch XSS vulnerability #security #hotfix #critical"
git push origin hotfix/security-patch

# 2. Create PR (hashtags auto-labeled)
gh pr create --title "Security: XSS Vulnerability Patch" --body "Fixes #234"
# PR auto-labeled: security, hotfix, critical

# 3. Merge to main
gh pr merge --squash

# 4. Deploy with tags
git checkout main
git pull
npm run deploy:with-tags
# Or: ./scripts/deploy-with-tags.sh production "#security #hotfix #critical"

# 5. Deployment issue created automatically
# Title: 🚀 Deploy 20260707.031400-abc123 to production
# Labels: deployment, env-production, security, hotfix, critical

# 6. Wait for deployment (monitors automatically)
gh run watch

# 7. Test deployment
npm run test:firebase

# 8. Issue auto-updated with results
# Status: ✅ Completed
# All tests passed

# 9. Find deployment later
gh issue list --label deployment --label security --label hotfix
```

---

## 📊 Reporting & Analytics

### View Deployments by Tag

```bash
# All security deploys
gh issue list --label deployment --label security --state all

# Critical hotfixes
gh issue list --label deployment --label critical --state all

# Feature releases
gh issue list --label deployment --label feature --state all
```

### Generate Reports

```bash
# Export deployment data
gh issue list --label deployment --json number,title,labels,createdAt --limit 100 > deployments.json

# Count by environment
gh issue list --label env-production --state all | wc -l
gh issue list --label env-staging --state all | wc -l

# Recent deployments
gh issue list --label deployment --state all --limit 20
```

---

## 🎓 Quick Reference

### Commands

```bash
# Deploy with tags (interactive)
npm run deploy:with-tags

# Deploy to production
npm run deploy:production

# Deploy to staging
npm run deploy:staging

# Test Firebase URL
npm run test:firebase

# Manual deploy with tags
./scripts/deploy-with-tags.sh production "#tag1 #tag2"

# Test specific URL
./scripts/test-firebase-url.sh https://your-url.web.app production
```

### Commit Template

```bash
type(scope): subject #hashtag1 #hashtag2

Longer description if needed.

Closes #123
```

### Popular Hashtag Combinations

```bash
#feature #ui #darkmode          # UI feature
#bugfix #critical #database     # Critical bug
#security #hotfix #urgent       # Security fix
#performance #optimization      # Performance
#refactor #breaking             # Breaking change
#docs #readme                   # Documentation
```

---

## 🔧 Troubleshooting

### Hashtags Not Detected

**Problem:** Hashtags in commit not appearing in deployment

**Solution:**
- Ensure hashtags in commit message (not just subject)
- Use format: `#word` or `#word-with-hyphens`
- No spaces in hashtags
- Check workflow logs for extraction

### Deployment Issue Not Created

**Problem:** Deployed but no issue created

**Solution:**
- Check GitHub Actions logs
- Verify `issues: write` permission
- Ensure workflow triggered correctly
- Check `DEPLOY_ISSUE` environment variable

### Test Results Not Labeled

**Problem:** Tests run but no labels/hashtags in report

**Solution:**
- Run `npm run test:firebase` after deployment
- Check `.github/test-summary-*.md` files
- Verify URL is accessible
- Review script output for hashtags

---

## 🎉 Summary

You now have:

✅ **Hashtag support** in commits and deployments  
✅ **Automatic labeling** for issues and deployments  
✅ **Firebase URL testing** with labeled reports  
✅ **Deployment tracking** with searchable tags  
✅ **Complete workflow** from commit to test  

**Usage:**
1. Commit with hashtags: `git commit -m "feat: add feature #feature #ui"`
2. Deploy: `npm run deploy:with-tags`
3. Test: `npm run test:firebase`
4. Track: `gh issue list --label deployment`

**Your deployments are now fully tagged and traceable!** 🏷️🚀

---

*Last updated: July 2026*  
*System version: 1.0*  
*Status: ✅ Production Ready*
