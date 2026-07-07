# ⚡ Flutter Deployment Quick Start

**Deploy, test, and track your Flutter app in minutes.**

---

## 🚀 3-Step Deployment

### Step 1: Deploy
```bash
npm run deploy:flutter
```

### Step 2: Test
```bash
npm run deploy:flutter:test
```

### Step 3: Visit
```bash
open https://shiritori-game-ccaae.web.app
```

**That's it!** ✅

---

## 📋 All Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run deploy:flutter` | Deploy to production | Push to `main` branch |
| `npm run deploy:flutter:staging` | Deploy to staging | Testing before production |
| `npm run deploy:flutter:test` | Test deployment | After every deploy |

---

## 🤖 Automatic CI/CD

### What Happens Automatically

**When you push to GitHub:**

1. ✅ **Build** - Flutter app compiled for web
2. ✅ **Test** - All tests run
3. ✅ **Analyze** - Code quality checked
4. ✅ **Deploy** - Uploaded to Firebase
5. ✅ **Verify** - Health checks run
6. ✅ **Track** - Time and status recorded

### View Status

```
GitHub → Actions → Deploy Flutter to Firebase
```

**You'll see:**
```
✅ Deployment Successful
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Build: Passed (120s)
✅ Deploy: Completed (45s)
✅ Verification: Passed (30s)

🌐 URL: https://shiritori-game-ccaae.web.app
⏱️  Total Time: 195s
📅 Deployed: 2026-07-06 23:00:00 UTC
```

---

## 🧪 Testing Your Deployment

### Run All Tests

```bash
npm run deploy:flutter:test
```

**10 Tests Run:**
1. ✅ HTTP Status (200 OK)
2. ✅ Response Time (<3s)
3. ✅ Content Type (text/html)
4. ✅ Flutter Content (app loaded)
5. ✅ SSL Certificate (valid HTTPS)
6. ✅ URL Redirects (working)
7. ✅ Response Headers (correct)
8. ✅ Mobile Compatible (responsive)
9. ✅ Static Assets (loading)
10. ✅ Service Worker (PWA ready)

### Quick Test

```bash
# Just check if it's up
curl -I https://shiritori-game-ccaae.web.app

# Expected output:
# HTTP/2 200
```

---

## 📊 Deployment Status

### Check Status

**Option 1: GitHub Badge**

Add to README:
```markdown
![Deploy Status](https://github.com/YOUR_USERNAME/shiritori_game/workflows/Deploy%20Flutter%20to%20Firebase/badge.svg)
```

**Option 2: GitHub Actions**
```
https://github.com/YOUR_USERNAME/shiritori_game/actions
```

**Option 3: Firebase Console**
```
https://console.firebase.google.com/project/shiritori-game-ccaae/hosting
```

---

## ⏱️ Tracked Metrics

### What Gets Tracked

**Every deployment tracks:**
- ⏱️ Build time (seconds)
- 📦 Build size (MB)
- 📁 File count
- ⏱️ Deploy time (seconds)
- ⏱️ Verification time (seconds)
- ⏱️ Total time (seconds)
- 📅 Timestamp (UTC)
- 🌿 Git branch
- 📝 Git commit
- 👤 Deployed by

### View History

```bash
# In GitHub Actions
GitHub → Actions → Deploy Flutter to Firebase → All runs

# You'll see a complete history of all deployments
```

---

## 🌐 Deployment URLs

| Environment | URL | Auto-Deploy On |
|-------------|-----|----------------|
| **Production** | [shiritori-game-ccaae.web.app](https://shiritori-game-ccaae.web.app) | Push to `main` |
| **Staging** | [shiritori-game-ccaae--develop.web.app](https://shiritori-game-ccaae--develop.web.app) | Push to `develop` |
| **Preview** | shiritori-game-ccaae--[branch].web.app | Push to feature branch |

---

## 🎯 Deployment Flow

```
1. Push Code
   ↓
2. GitHub Actions Triggered
   ↓
3. Build Flutter App (⏱️ ~120s)
   ↓
4. Run Tests (⏱️ ~30s)
   ↓
5. Deploy to Firebase (⏱️ ~45s)
   ↓
6. Verify Deployment (⏱️ ~30s)
   ↓
7. ✅ Live! (Total: ~225s)
```

---

## 🚨 Status Checks

### Deployment Success Indicators

✅ **GitHub Actions:** Green checkmark  
✅ **Tests:** All 10 tests pass  
✅ **URL:** Returns HTTP 200  
✅ **Content:** Flutter app loads  
✅ **Performance:** Response time <3s  

### What to Check After Deploy

```bash
# 1. Run tests
npm run deploy:flutter:test

# 2. Visit URL
open https://shiritori-game-ccaae.web.app

# 3. Check GitHub Actions
# Go to: GitHub → Actions → Latest run

# 4. Verify in Firebase Console
open https://console.firebase.google.com/project/shiritori-game-ccaae/hosting
```

---

## 🔧 Quick Fixes

### If Deploy Fails

```bash
# 1. Check Flutter installation
flutter doctor

# 2. Clean build
cd shiritori-flutter
flutter clean
flutter pub get

# 3. Build locally
flutter build web --release

# 4. Try deploying again
npm run deploy:flutter
```

### If Tests Fail

```bash
# 1. Wait for CDN propagation (30-60s)
sleep 60

# 2. Run tests again
npm run deploy:flutter:test

# 3. Check specific URL
bash scripts/test-flutter-deployment.sh https://shiritori-game-ccaae.web.app
```

---

## 📚 Full Documentation

**Detailed guides:**
- `FLUTTER_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `shiritori-flutter/README.md` - Flutter app documentation
- `.github/workflows/deploy-flutter.yml` - CI/CD configuration

---

## 🎉 Summary

### What You Have

✅ **One-command deploy** - `npm run deploy:flutter`  
✅ **Automatic CI/CD** - Push to deploy  
✅ **10 health checks** - Comprehensive testing  
✅ **Time tracking** - Every deployment tracked  
✅ **Status reporting** - Full visibility  
✅ **3 environments** - Production, staging, preview  

### Typical Deployment

```
⏱️  Build:        120s
⏱️  Deploy:       45s
⏱️  Verify:       30s
━━━━━━━━━━━━━━━━━━━━━
⏱️  Total:        195s (< 4 minutes)

✅ Status:        Deployed & Verified
🌐 Live:          https://shiritori-game-ccaae.web.app
```

---

## 🚀 Start Deploying

```bash
# Deploy now
npm run deploy:flutter

# Test it
npm run deploy:flutter:test

# Visit it
open https://shiritori-game-ccaae.web.app
```

---

**Deployment:** Fully Automated  
**Testing:** 10 comprehensive checks  
**Tracking:** Complete metrics  
**Time:** ~4 minutes per deploy  
**Status:** ✅ Ready to Use!

**Deploy:** `npm run deploy:flutter` 🚀
