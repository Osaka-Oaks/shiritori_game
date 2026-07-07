# 🚀 Deployment Guide

Complete guide for deploying the Shiritori game to Firebase.

---

## 🎯 Quick Deploy

### Automated (Recommended)
```bash
# Just push to main - GitHub Actions handles everything!
git add .
git commit -m "feat: your changes"
git push origin main

# Monitor deployment
# https://github.com/JorelFuji/shiritori_game/actions
```

### Manual Deploy
```bash
# 1. Run pre-deployment checks
npm run pre-deploy

# 2. Deploy Shiritori Online
cd shiritori-online
npm run deploy

# 3. Deploy Kawaii Shiritori
cd ../kawaii-shiritori
npm run deploy

# 4. Test deployment
cd ..
npm run test:deployment
```

---

## 🤖 GitHub Actions Pipeline

### What Happens Automatically

When you push to `main`, the pipeline:

1. **🔍 Validates Code** (2 min)
   - Checks dependencies
   - Runs security audit
   - Generates dependency report

2. **🏗️ Builds & Tests** (3 min)
   - Lints both apps
   - Type checks TypeScript
   - Runs unit tests (kawaii)
   - Builds production bundles
   - Saves build artifacts

3. **🚀 Deploys** (2 min)
   - Shiritori Online → Firebase (RTDB)
   - Kawaii Shiritori → Firebase (Firestore)
   - Updates security rules

4. **🧪 Tests Deployment** (1 min)
   - Verifies homepage loads
   - Checks content presence
   - Tests response time
   - Validates security headers
   - Tests database connectivity
   - Verifies SPA routing

5. **✅ Validates** (1 min)
   - Creates deployment record
   - Updates commit status
   - Sends notifications

**Total Time:** ~9 minutes from push to live!

---

## 📊 Pipeline Status

### View Deployment Progress

1. **Go to GitHub Actions:**
   ```
   https://github.com/JorelFuji/shiritori_game/actions
   ```

2. **Click "Deploy & Test" workflow**

3. **View latest run** - See real-time progress:
   - ✅ Green = Passed
   - 🔄 Yellow = Running
   - ❌ Red = Failed

4. **Check Summary tab** for detailed report:
   - Build sizes
   - Test results
   - Performance metrics
   - Live URLs

### Example Summary Output

```markdown
## 📦 Build Output - kawaii-shiritori

✅ Build successful!

Files:
-rw-r--r-- 1 runner runner  23K index.html
-rw-r--r-- 1 runner runner 450K main.js
-rw-r--r-- 1 runner runner  56K main.css

Size: 2.3M

## 🧪 Testing Shiritori Online

- **HTTP Status**: 200
- ✅ Homepage loads successfully
- ✅ Japanese content found
- ✅ Assets loaded

### Performance Metrics
- **Response Time**: 0.523s
- **Page Size**: 45231 bytes
- ✅ Performance acceptable

### Security Headers
- ✅ Served by Firebase Hosting
- ✅ Caching headers present

🎉 Deployment Successful!
```

---

## 🔧 Manual Deployment

### Prerequisites

**Required:**
- Node.js 20+
- npm 10+
- Firebase CLI

**Optional:**
- Firebase login credentials
- FIREBASE_TOKEN (for CI/CD)

### Setup Firebase CLI

```bash
# Install globally
npm install -g firebase-tools

# Login
firebase login

# Verify project
firebase projects:list
```

### Deploy Shiritori Online

```bash
cd shiritori-online

# Install dependencies
npm ci

# Build
npm run build

# Deploy hosting + database rules
firebase deploy --only hosting,database

# Or use npm script
npm run deploy
```

**Expected output:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/shiritori-game-ccaae
Hosting URL: https://shiritori-game-ccaae.web.app
```

### Deploy Kawaii Shiritori

```bash
cd kawaii-shiritori

# Install dependencies
npm ci

# Build
npm run build

# Deploy hosting + firestore rules
firebase deploy --only hosting,firestore

# Or use npm script
npm run deploy
```

---

## 🧪 Testing Deployments

### Automated Test Script

```bash
# Run comprehensive tests
npm run test:deployment
```

**Tests:**
- ✅ Homepage accessibility (HTTP 200)
- ✅ Content verification (Japanese text)
- ✅ Assets loading (scripts, styles)
- ✅ Response time (<3s)
- ✅ Firebase hosting headers
- ✅ Realtime Database connectivity
- ✅ SPA routing (all routes return 200)

### Manual Testing

**1. Homepage:**
```bash
curl https://shiritori-game-ccaae.web.app/
```

**2. Check HTTP status:**
```bash
curl -I https://shiritori-game-ccaae.web.app/
```

**3. Test specific route:**
```bash
curl https://shiritori-game-ccaae.web.app/game
```

**4. Measure response time:**
```bash
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://shiritori-game-ccaae.web.app/
```

---

## 🔍 Pre-Deployment Checklist

### Run Pre-Deploy Script

```bash
npm run pre-deploy
```

**Checks:**
1. ✅ Git status (clean, on main)
2. ✅ Dependencies installed
3. ✅ Security audit
4. ✅ Type checking
5. ✅ Builds succeed
6. ✅ Tests pass
7. ✅ Firebase config valid
8. ✅ Security rules present

**Example output:**
```
╔════════════════════════════════════════════════════════╗
║      🚀 PRE-DEPLOYMENT VALIDATION CHECKLIST          ║
╚════════════════════════════════════════════════════════╝

▸ 1. Git Status
────────────────────────────────────────────────────────
✅ PASS - Working directory clean
✅ PASS - On main branch

▸ 2. Dependencies
────────────────────────────────────────────────────────
✅ PASS - npm installed
✅ PASS - Node.js version: v20.11.0
✅ PASS - No production vulnerabilities

[... more checks ...]

╔════════════════════════════════════════════════════════╗
║                    SUMMARY                            ║
╚════════════════════════════════════════════════════════╝

  ✅ Passed:   18
  ⚠️  Warnings: 2
  ❌ Failed:   0

🎉 All critical checks passed!
Ready to deploy!
```

---

## 🌐 Environment URLs

### Production

| Service | URL | Status |
|---------|-----|--------|
| **Shiritori Online** | https://shiritori-game-ccaae.web.app | ✅ Live |
| **Kawaii Shiritori** | https://shiritori-game-ccaae.web.app | ✅ Live |
| **Firebase Console** | https://console.firebase.google.com/project/shiritori-game-ccaae | 🔧 Admin |
| **Realtime DB** | https://shiritori-game-ccaae-default-rtdb.firebaseio.com | 🔒 Secure |

### Monitoring

- **GitHub Actions**: https://github.com/JorelFuji/shiritori_game/actions
- **Deployments**: https://github.com/JorelFuji/shiritori_game/deployments
- **Firebase Hosting**: https://console.firebase.google.com/project/shiritori-game-ccaae/hosting

---

## 🔒 Security & Secrets

### Required GitHub Secrets

**`FIREBASE_TOKEN`** (Required for automated deployment)

**How to get:**
```bash
# Generate token
firebase login:ci

# Copy the token
# Add to GitHub: Settings → Secrets → Actions → New secret
# Name: FIREBASE_TOKEN
# Value: [paste token]
```

**Verify secret:**
```bash
# In GitHub Actions logs, you'll see:
# ✓ FIREBASE_TOKEN secret available
```

---

## 🚨 Troubleshooting

### Build Fails

**Problem:** `npm run build` fails

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install

# Check for TypeScript errors
npx tsc --noEmit

# Try legacy peer deps
npm install --legacy-peer-deps
```

### Deploy Fails

**Problem:** Firebase deploy fails with auth error

**Solutions:**
```bash
# Re-login
firebase logout
firebase login

# Check project
firebase use shiritori-game-ccaae

# Verify token (CI/CD)
echo $FIREBASE_TOKEN  # Should output token
```

### Site Not Loading

**Problem:** Deployed but site shows 404

**Solutions:**
```bash
# Check firebase.json rewrites
cat firebase.json | grep -A 5 rewrites

# Verify dist folder exists
ls -la dist/

# Check hosting deployment
firebase hosting:channel:list
```

### Database Rules Not Applying

**Problem:** Database rules not updated

**Solutions:**
```bash
# Deploy only rules
firebase deploy --only database

# Verify rules in console
firebase database:rules:get

# Check rules file
cat database.rules.json
```

---

## 📈 Performance Optimization

### Build Optimization

**Current sizes:**
- Shiritori Online: ~800 KB
- Kawaii Shiritori: ~2.3 MB

**Optimization tips:**
```bash
# Analyze bundle
cd kawaii-shiritori
npm run build
npx vite-bundle-visualizer

# Check for large dependencies
npm run deps:report
```

### Caching Strategy

**Firebase Hosting automatically caches:**
- Static assets: 1 year
- HTML: No cache (always fresh)
- Service worker: Updates on deployment

**Verify caching:**
```bash
curl -I https://shiritori-game-ccaae.web.app/ | grep -i cache
```

---

## 🔄 Rollback Procedure

### Emergency Rollback

**Option 1: GitHub Revert**
```bash
# Find last working commit
git log --oneline

# Revert to previous commit
git revert HEAD
git push origin main

# Pipeline auto-deploys previous version
```

**Option 2: Firebase Hosting Rollback**
```bash
# List releases
firebase hosting:channel:list

# Rollback to previous
firebase hosting:clone source:PREVIOUS_RELEASE destination:live
```

**Option 3: Manual Redeploy**
```bash
# Checkout previous version
git checkout <previous-commit-hash>

# Deploy manually
cd shiritori-online
npm run deploy
```

---

## 📊 Deployment Metrics

### Expected Timings

| Phase | Time | Status |
|-------|------|--------|
| Validate Code | 2 min | ⚡ Fast |
| Build & Test | 3 min | 🏗️ Building |
| Deploy | 2 min | 🚀 Deploying |
| Test | 1 min | 🧪 Testing |
| **Total** | **~9 min** | ✅ Complete |

### Success Rate

- **Target:** 95% success rate
- **Typical failures:** Dependency conflicts, test timeouts
- **Auto-retry:** Not enabled (manual retry required)

---

## 🎯 Best Practices

### Before Deploying

1. ✅ **Run pre-deploy check**: `npm run pre-deploy`
2. ✅ **Test locally**: `npm run dev`
3. ✅ **Review changes**: `git diff`
4. ✅ **Update version**: Bump version in package.json
5. ✅ **Write changelog**: Document changes

### After Deploying

1. ✅ **Monitor pipeline**: Watch GitHub Actions
2. ✅ **Test live site**: Run `npm run test:deployment`
3. ✅ **Check console**: Look for errors in browser console
4. ✅ **Verify features**: Manual smoke test
5. ✅ **Update docs**: Document new features

### Deployment Schedule

**Recommended:**
- 🌅 **Best time:** Morning/early afternoon (easy to monitor)
- ❌ **Avoid:** Late evening, weekends, holidays
- 🔄 **Frequency:** After major features or bug fixes
- 📅 **Cadence:** 1-2 times per week

---

## 📞 Support

### Deployment Issues

**Check these first:**
1. GitHub Actions logs
2. Firebase Console → Hosting → Release history
3. Browser console errors
4. Network tab in DevTools

**Get help:**
- 📚 [Firebase Docs](https://firebase.google.com/docs)
- 💬 [GitHub Discussions](https://github.com/JorelFuji/shiritori_game/discussions)
- 🐛 [Report Issue](https://github.com/JorelFuji/shiritori_game/issues)

---

## 🎉 Quick Reference

### Essential Commands

```bash
# Pre-deployment check
npm run pre-deploy

# Deploy (automated via GitHub)
git push origin main

# Test deployment
npm run test:deployment

# Manual deploy (if needed)
cd shiritori-online && npm run deploy
cd kawaii-shiritori && npm run deploy

# View logs
firebase hosting:channel:list
```

### Important URLs

- 🌐 **Live Site**: https://shiritori-game-ccaae.web.app
- 🔧 **Console**: https://console.firebase.google.com/project/shiritori-game-ccaae
- 🤖 **Actions**: https://github.com/JorelFuji/shiritori_game/actions
- 📊 **Status**: Check GitHub Actions badge in README

---

**Last updated:** July 7, 2026  
**Pipeline version:** 2.0  
**Status:** ✅ Active & Stable
