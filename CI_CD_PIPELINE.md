# 🤖 CI/CD Pipeline Documentation

Complete documentation for the automated deployment pipeline.

---

## 🎯 Pipeline Overview

```
┌─────────────┐
│  Git Push   │ ──► Push to main branch
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Validate   │ ──► Code quality checks (2 min)
│    Code     │     ├─ Dependencies
└──────┬──────┘     ├─ Security audit
       │            └─ Dependency report
       ▼
┌─────────────┐
│  Build &    │ ──► Build both apps (3 min)
│    Test     │     ├─ Lint code
└──────┬──────┘     ├─ Type check
       │            ├─ Run tests
       │            └─ Build bundles
       ▼
┌─────────────┐
│   Deploy    │ ──► Deploy to Firebase (2 min)
│  (Online)   │     ├─ Shiritori Online
└──────┬──────┘     └─ Realtime DB rules
       │
       ├──────────────┐
       ▼              ▼
┌─────────────┐ ┌─────────────┐
│   Deploy    │ │    Test     │ ──► Test deployment (1 min)
│  (Kawaii)   │ │ Deployment  │     ├─ HTTP checks
└──────┬──────┘ └──────┬──────┘     ├─ Content verify
       │               │             ├─ Performance
       │               │             └─ Database test
       └───────┬───────┘
               ▼
       ┌─────────────┐
       │  Validate   │ ──► Final validation (1 min)
       │     &       │     ├─ Create deployment
       │   Notify    │     ├─ Update status
       └─────────────┘     └─ Send notifications

Total Time: ~9 minutes
```

---

## 📋 Pipeline Stages

### Stage 1: Validate Code (2 min)

**File:** `.github/workflows/deploy-and-test.yml`

**What it does:**
- Checks out code
- Installs dependencies
- Runs dependency health check
- Performs security audit
- Generates report in GitHub Summary

**Scripts:**
- `npm run deps:report`
- `npm audit`

**Success criteria:**
- ✅ All dependencies installed
- ✅ No critical vulnerabilities
- ✅ Report generated

**Failure handling:**
- ⚠️ Warnings don't block deployment
- ❌ Critical errors stop pipeline

---

### Stage 2: Build & Test (3 min)

**Runs in parallel for both apps:**
- shiritori-online
- kawaii-shiritori

**Steps per app:**

1. **Install Dependencies**
   ```bash
   npm ci
   ```

2. **Lint Code**
   ```bash
   npm run lint
   ```
   - ESLint checks
   - Code style validation
   - Warnings logged but don't fail

3. **Type Check**
   ```bash
   npx tsc --noEmit
   ```
   - TypeScript validation
   - Interface checks
   - Type safety verification

4. **Run Tests** (kawaii-shiritori only)
   ```bash
   npm test
   ```
   - Unit tests
   - Integration tests
   - Coverage report

5. **Build Production Bundle**
   ```bash
   npm run build
   ```
   - Vite production build
   - Asset optimization
   - Tree shaking
   - Code splitting

6. **Verify Build Output**
   - Check dist/ exists
   - Calculate bundle size
   - Report in Summary

7. **Upload Artifacts**
   - Save dist/ folder
   - 30-day retention
   - Available for download

**Success criteria:**
- ✅ Build completes without errors
- ✅ dist/ folder contains files
- ✅ Artifacts uploaded

---

### Stage 3: Deploy Shiritori Online (2 min)

**Environment:** shiritori-online-production

**URL:** https://shiritori-game-ccaae.web.app

**Steps:**

1. **Download Build Artifact**
   - Retrieves dist/ from previous stage
   - No rebuild needed

2. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting,database
   ```
   - Uploads static files
   - Updates database rules
   - Invalidates CDN cache

3. **Generate Summary**
   - Deployment URL
   - Timestamp
   - Commit SHA

**What's deployed:**
- ✅ Static website files
- ✅ Realtime Database security rules
- ✅ Hosting configuration

---

### Stage 4: Deploy Kawaii Shiritori (2 min)

**Environment:** kawaii-shiritori-production

**URL:** https://shiritori-game-ccaae.web.app

**Steps:**

1. **Download Build Artifact**

2. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting,firestore
   ```
   - Uploads static files
   - Updates Firestore rules
   - Invalidates CDN cache

3. **Generate Summary**

**What's deployed:**
- ✅ Static website files
- ✅ Firestore security rules
- ✅ Hosting configuration

---

### Stage 5: Test Deployment (1 min)

**Runs after both deploys complete**

**Tests performed:**

1. **Wait for DNS Propagation** (30s)

2. **Homepage Test**
   ```bash
   curl https://shiritori-game-ccaae.web.app/
   ```
   - HTTP 200 expected
   - Reports status to Summary

3. **Content Verification**
   - Checks for Japanese characters (しりとり)
   - Verifies assets loaded
   - Confirms expected text

4. **Performance Test**
   - Measures response time
   - Checks page size
   - Ensures <3s load time

5. **Security Headers**
   - Verifies Firebase hosting
   - Checks caching headers
   - Reports security status

6. **Database Connectivity**
   ```bash
   curl https://shiritori-game-ccaae-default-rtdb.firebaseio.com/.json
   ```
   - HTTP 401 or 200 expected
   - Confirms database online

7. **Route Testing**
   - Tests multiple routes
   - Verifies SPA rewrites
   - Checks 200 responses

**Success criteria:**
- ✅ All HTTP checks return 200
- ✅ Content found
- ✅ Performance acceptable
- ✅ Database accessible

---

### Stage 6: Validate Deployment (1 min)

**Final checks:**

1. **Create Deployment Record**
   - Logs deployment in GitHub
   - Links to live URL
   - Records timestamp

2. **Update Commit Status**
   - Sets status to "success"
   - Links to live site
   - Shows in PR/commit view

3. **Generate Final Summary**
   - All URLs listed
   - Test results shown
   - Deployment info recorded

**Outputs:**
```markdown
# 🎉 Deployment Successful!

## 🌐 Live URLs
- 🎮 Shiritori Online: https://shiritori-game-ccaae.web.app
- 🎨 Kawaii Shiritori: https://shiritori-game-ccaae.web.app

## ✅ All Tests Passed
- ✅ Code validation
- ✅ Build successful
- ✅ Deployment complete
- ✅ Site responsive
- ✅ Content verified
- ✅ Performance acceptable

Deployed at: 2026-07-07 03:45:12 UTC
Commit: abc123def
```

---

## 🔄 Workflow Triggers

### Automatic Triggers

**1. Push to Main**
```yaml
on:
  push:
    branches: [main]
```
- Triggers full pipeline
- Deploys to production
- Runs all tests

**2. Manual Trigger**
```yaml
on:
  workflow_dispatch:
```
- Available in Actions tab
- "Run workflow" button
- Optional environment selection

### What Doesn't Trigger

- ❌ Pull requests (use ci.yml instead)
- ❌ Pushes to other branches
- ❌ Tag pushes
- ❌ Wiki changes

---

## 🔒 Secrets & Environment

### Required Secrets

**`FIREBASE_TOKEN`**
- Location: Repository Settings → Secrets → Actions
- Purpose: Firebase CLI authentication
- How to get:
  ```bash
  firebase login:ci
  ```

### Environment Variables

```yaml
env:
  NODE_VERSION: '20'
```

**Used in pipeline:**
- Node.js version
- Build environment
- Test configuration

---

## 📊 Monitoring & Logs

### View Pipeline Status

**1. GitHub Actions Tab**
```
https://github.com/JorelFuji/shiritori_game/actions
```
- Lists all workflow runs
- Shows status (running/success/failed)
- Provides duration

**2. Workflow Details**
- Click any workflow run
- View each job
- Check logs for each step

**3. Summary Tab**
- Formatted reports
- Test results
- Performance metrics
- Direct links to deployed sites

### Log Locations

**Build Logs:**
```
Actions → Deploy & Test → build-and-test → Build production bundle
```

**Deploy Logs:**
```
Actions → Deploy & Test → deploy-online → Deploy to Firebase
```

**Test Logs:**
```
Actions → Deploy & Test → test-deployment → (all test steps)
```

### Download Artifacts

**Available artifacts:**
- `build-shiritori-online` (30 days)
- `build-kawaii-shiritori` (30 days)

**How to download:**
1. Go to workflow run
2. Scroll to "Artifacts" section
3. Click to download ZIP

---

## 🚨 Error Handling

### Build Failures

**Symptom:** Build stage fails

**Common causes:**
- TypeScript errors
- Missing dependencies
- Syntax errors
- Import issues

**How to debug:**
```bash
# Reproduce locally
npm ci
npm run build

# Check specific errors
npx tsc --noEmit
```

**Fix:**
- Correct code errors
- Update dependencies
- Fix imports
- Push fix to main

---

### Deploy Failures

**Symptom:** Deploy stage fails

**Common causes:**
- Missing FIREBASE_TOKEN
- Invalid firebase.json
- Network timeout
- Rules syntax error

**How to debug:**
```bash
# Test deploy locally
firebase deploy --only hosting

# Validate rules
firebase deploy --only database --dry-run

# Check token
echo $FIREBASE_TOKEN
```

**Fix:**
- Update GitHub secret
- Fix firebase.json
- Retry deployment
- Validate rules syntax

---

### Test Failures

**Symptom:** Test stage fails

**Common causes:**
- Site not accessible (DNS delay)
- Content mismatch
- Slow response time
- Database offline

**How to debug:**
```bash
# Test manually
curl -I https://shiritori-game-ccaae.web.app/

# Check content
curl https://shiritori-game-ccaae.web.app/ | grep しりとり

# Test database
curl https://shiritori-game-ccaae-default-rtdb.firebaseio.com/.json
```

**Fix:**
- Wait for DNS propagation
- Verify deployment completed
- Check Firebase status
- Retry workflow

---

## 🔧 Configuration

### Workflow File

**Location:** `.github/workflows/deploy-and-test.yml`

**Key configurations:**

```yaml
# Prevent concurrent deploys
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false

# Node version
env:
  NODE_VERSION: '20'

# Artifact retention
retention-days: 30

# Environment URLs
environment:
  name: production
  url: https://shiritori-game-ccaae.web.app
```

### Customization

**Change Node version:**
```yaml
env:
  NODE_VERSION: '22'  # Update here
```

**Adjust artifact retention:**
```yaml
retention-days: 7  # Shorter retention
```

**Add notification:**
```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 📈 Performance Metrics

### Typical Run Times

| Stage | Time | Variance |
|-------|------|----------|
| Validate | 2 min | ±30s |
| Build shiritori-online | 1.5 min | ±20s |
| Build kawaii-shiritori | 2 min | ±30s |
| Deploy online | 1 min | ±15s |
| Deploy kawaii | 1 min | ±15s |
| Test | 1 min | ±20s |
| Validate | 30s | ±10s |
| **Total** | **~9 min** | **±2 min** |

### Optimization Opportunities

**Current bottlenecks:**
1. ⏱️ Dependency installation (parallel)
2. ⏱️ TypeScript compilation
3. ⏱️ Vite build (large bundle)

**Potential improvements:**
- Use build cache
- Parallel deploy jobs
- Optimize bundle size
- Skip redundant steps

---

## 🎯 Best Practices

### Pipeline Hygiene

1. ✅ **Keep pipeline fast** (<10 min target)
2. ✅ **Fail fast** (catch errors early)
3. ✅ **Clear logs** (readable output)
4. ✅ **Stable tests** (no flaky tests)
5. ✅ **Monitor status** (check regularly)

### When to Skip Pipeline

**Use manual deploy if:**
- 🚨 Emergency hotfix
- 🔧 Infrastructure changes
- 🧪 Testing deployment process
- 📦 Large dependency updates

**How to skip:**
```bash
# Deploy manually without pipeline
cd shiritori-online
firebase deploy
```

---

## 🔍 Debugging Guide

### Pipeline Stuck

**Symptoms:**
- Job running >15 min
- No log updates
- "Waiting" status

**Solutions:**
1. Cancel workflow
2. Check GitHub status
3. Retry workflow
4. Contact support if persistent

### Logs Not Showing

**Symptoms:**
- Empty log sections
- Missing output
- Incomplete reports

**Solutions:**
1. Refresh page
2. Check browser console
3. Download raw logs
4. View in different browser

### Tests Passing Locally But Failing in CI

**Symptoms:**
- Local: ✅ All tests pass
- CI: ❌ Tests fail

**Common causes:**
- Environment differences
- Missing env vars
- Different Node version
- Timing issues

**Solutions:**
```bash
# Match CI environment
nvm use 20
npm ci --silent
npm test
```

---

## 📚 Related Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Dependency Monitoring](./DEPENDENCY_MONITORING_SETUP.md)
- [Firebase Setup](./FIREBASE_SPARK_FEATURES.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

## 🎉 Summary

Your CI/CD pipeline:

✅ **Automated** - Push and forget  
✅ **Fast** - 9 minutes end-to-end  
✅ **Reliable** - Error handling built-in  
✅ **Observable** - Detailed logs & reports  
✅ **Secure** - Token-based auth  
✅ **Tested** - Comprehensive validation  

**Just push to main and watch it deploy!** 🚀

---

**Last updated:** July 7, 2026  
**Pipeline version:** 2.0  
**Status:** ✅ Production Ready
