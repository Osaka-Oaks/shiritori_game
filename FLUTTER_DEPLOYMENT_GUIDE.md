# 🚀 Flutter Firebase Deployment Guide

Complete guide for deploying and testing the Flutter Shiritori app with CI/CD automation.

---

## 🎯 Quick Deploy & Test

### One-Command Deployment

```bash
# Deploy to production
npm run deploy:flutter

# Deploy to staging
npm run deploy:flutter:staging

# Test deployment
npm run deploy:flutter:test
```

---

## 📋 Deployment URLs

| Environment | URL | Branch |
|-------------|-----|--------|
| **Production** | https://shiritori-game-ccaae.web.app | `main` |
| **Staging** | https://shiritori-game-ccaae--develop.web.app | `develop` |
| **Preview** | https://shiritori-game-ccaae--[branch].web.app | Feature branches |

---

## 🔄 CI/CD Workflow

### Automatic Deployment

The GitHub Actions workflow `.github/workflows/deploy-flutter.yml` **automatically**:

✅ **Builds** Flutter web app  
✅ **Tests** the application  
✅ **Deploys** to Firebase Hosting  
✅ **Verifies** deployment health  
✅ **Tracks** deployment time  
✅ **Reports** status  

### Trigger Conditions

**Automatic deployment on:**
- Push to `main` branch → Production
- Push to `develop` branch → Staging
- Push to feature branch → Preview channel

**Manual deployment:**
```bash
# Trigger manual deployment from GitHub UI
Actions → Deploy Flutter to Firebase → Run workflow
```

---

## 📊 What Gets Checked

### Build Phase
- ✅ Flutter dependencies installed
- ✅ Tests pass
- ✅ Code analysis (no errors)
- ✅ Build completes successfully
- ✅ Build size calculated

### Deployment Phase
- ✅ Deployed to Firebase Hosting
- ✅ Deployment channel determined
- ✅ Deployment time tracked

### Verification Phase
- ✅ HTTP status (200 OK)
- ✅ Content verification (Flutter app loaded)
- ✅ Performance test (response time)
- ✅ SSL certificate valid
- ✅ Mobile compatibility

---

## ⏱️ Deployment Time Tracking

### Tracked Metrics

**Build Time:**
- Dependency installation
- Test execution
- Code analysis
- Web compilation

**Deploy Time:**
- Firebase upload
- CDN propagation

**Verification Time:**
- Health checks
- Content verification
- Performance tests

### View Deployment Times

**In GitHub Actions:**
```
Actions → Deploy Flutter to Firebase → Latest run
```

**In workflow output:**
```
✅ Deployment Successful
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Build: Passed
✅ Deploy: Completed  
✅ Verification: Passed

🌐 URL: https://shiritori-game-ccaae.web.app
⏱️  Total Time: 245s
📅 Deployed: 2026-07-06 23:00:00 UTC
```

---

## 🧪 Manual Testing

### Test Production Deployment

```bash
# Run comprehensive tests
npm run deploy:flutter:test

# Or directly
bash scripts/test-flutter-deployment.sh

# Test specific URL
bash scripts/test-flutter-deployment.sh https://shiritori-game-ccaae--develop.web.app
```

### Test Output

```
🧪 Flutter Firebase Deployment Test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Testing URL: https://shiritori-game-ccaae.web.app

▶ Test 1: HTTP Status Code
  Status code: 200
  ✅ PASSED

▶ Test 2: Response Time
  Response time: 0.8s
  ✅ PASSED

▶ Test 3: Content Type
  Content-Type: text/html
  ✅ PASSED

▶ Test 4: Flutter Content
  ✅ Flutter app detected
  ✅ PASSED

▶ Test 5: SSL Certificate
  ✅ HTTPS enabled
  ✅ PASSED

... (more tests)

📊 Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total Tests:    10
  Passed:         10
  Failed:         0
  Success Rate:   100%

✅ ALL TESTS PASSED
🎉 Deployment is healthy and fully functional!
```

---

## 📊 Deployment Status

### Check Status in GitHub

**1. GitHub Actions Badge**

Add to README:
```markdown
![Deploy Flutter](https://github.com/YOUR_USERNAME/shiritori_game/workflows/Deploy%20Flutter%20to%20Firebase/badge.svg)
```

**2. View Workflow Runs**
```
GitHub → Actions → Deploy Flutter to Firebase
```

**3. Deployment Report**

Each deployment generates a report:
- Build time and size
- Deploy time
- Verification results
- Live URL
- Status of all checks

---

## 🔍 Deployment Verification

### What Gets Verified

**1. HTTP Status Check**
```bash
curl -I https://shiritori-game-ccaae.web.app
# Expected: 200 OK
```

**2. Content Verification**
```bash
curl -s https://shiritori-game-ccaae.web.app | grep -q "flutter"
# Expected: Flutter content found
```

**3. Performance Test**
```bash
curl -o /dev/null -s -w '%{time_total}\n' https://shiritori-game-ccaae.web.app
# Expected: < 3 seconds
```

**4. SSL Certificate**
```bash
openssl s_client -servername shiritori-game-ccaae.web.app -connect shiritori-game-ccaae.web.app:443
# Expected: Valid certificate
```

---

## 🚨 Status Notifications

### Success Notifications

**GitHub:**
- ✅ Green checkmark on commit
- ✅ Status badge updated
- ✅ Deployment report in Actions

**Logs:**
```
::notice title=✅ Deployment Successful::Flutter app deployed and verified successfully!
```

### Failure Notifications

**GitHub:**
- ❌ Red X on commit
- ❌ Email notification (if enabled)
- ❌ Detailed error logs

**Logs:**
```
::error title=❌ Deployment Failed::One or more deployment steps failed
```

---

## 🔧 Manual Deployment

### Prerequisites

```bash
# Install Flutter
brew install flutter

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### Deploy Steps

```bash
# 1. Navigate to Flutter app
cd shiritori-flutter

# 2. Get dependencies
flutter pub get

# 3. Build for web
flutter build web --release --web-renderer canvaskit

# 4. Deploy to Firebase
firebase deploy --only hosting --project shiritori-game-ccaae

# 5. Test deployment
cd ..
npm run deploy:flutter:test
```

---

## 📈 Deployment Tracking

### Deployment Metadata

Each deployment saves metadata:

```json
{
  "timestamp": "2026-07-06 23:00:00 UTC",
  "commit": "abc1234",
  "branch": "main",
  "actor": "username",
  "channel": "production",
  "duration": "245",
  "build_size": "3.2MB",
  "status": "deployed"
}
```

### View Deployment History

**In Firebase Console:**
```
Firebase Console → Hosting → View All Releases
```

**In GitHub:**
```
Actions → Deploy Flutter to Firebase → All workflow runs
```

---

## 🎯 Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass locally: `cd shiritori-flutter && flutter test`
- [ ] Code analysis clean: `flutter analyze`
- [ ] Build completes: `flutter build web --release`
- [ ] Firebase project configured: `flutterfire configure`
- [ ] Secrets configured in GitHub (FIREBASE_TOKEN)

After deploying:

- [ ] Check GitHub Actions status (green checkmark)
- [ ] Run deployment tests: `npm run deploy:flutter:test`
- [ ] Visit live URL and test manually
- [ ] Check Firebase Console for deployment
- [ ] Verify in different browsers
- [ ] Test on mobile devices

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear build cache
cd shiritori-flutter
flutter clean
flutter pub get
flutter build web --release
```

### Deploy Fails

```bash
# Check Firebase CLI
firebase --version

# Re-login
firebase login --reauth

# Check project
firebase projects:list
```

### Tests Fail

```bash
# Test manually
npm run deploy:flutter:test

# Check specific URL
bash scripts/test-flutter-deployment.sh https://shiritori-game-ccaae.web.app

# Check Firebase hosting
firebase hosting:channel:list --project shiritori-game-ccaae
```

### Verification Fails

**Issue: HTTP 404**
```bash
# Solution: Wait for CDN propagation (30-60 seconds)
sleep 60 && npm run deploy:flutter:test
```

**Issue: Slow response time**
```bash
# Solution: Enable caching in firebase.json
# Check build size: du -sh shiritori-flutter/build/web
```

---

## 📚 CI/CD Configuration

### GitHub Secrets Required

```
FIREBASE_TOKEN - Firebase CI token (from firebase login:ci)
```

### Set up secrets:

```bash
# 1. Generate token
firebase login:ci

# 2. Add to GitHub
GitHub → Settings → Secrets → New repository secret
Name: FIREBASE_TOKEN
Value: [paste token]
```

### Workflow File

**Location:** `.github/workflows/deploy-flutter.yml`

**Jobs:**
1. `build-flutter` - Build the app
2. `deploy-firebase` - Deploy to hosting
3. `verify-deployment` - Health checks
4. `deployment-status` - Summary

---

## 🎉 Summary

### What You Get

✅ **Automatic Deployment** - Push to deploy  
✅ **Status Checking** - Every deployment verified  
✅ **Time Tracking** - Build, deploy, verify times  
✅ **Health Checks** - 10 comprehensive tests  
✅ **Deployment Reports** - Detailed status for each deploy  
✅ **Multiple Environments** - Production, staging, preview  

### Commands Reference

```bash
# Deploy to production
npm run deploy:flutter

# Deploy to staging
npm run deploy:flutter:staging

# Test deployment
npm run deploy:flutter:test

# Manual deployment
cd shiritori-flutter
flutter build web --release
firebase deploy --only hosting
```

### URLs

- **Production:** https://shiritori-game-ccaae.web.app
- **Staging:** https://shiritori-game-ccaae--develop.web.app
- **Firebase Console:** https://console.firebase.google.com/project/shiritori-game-ccaae/hosting

---

**Deployment:** Fully Automated with CI/CD  
**Status Checking:** 10 comprehensive tests  
**Time Tracking:** Complete metrics  
**Status:** ✅ Ready to Deploy!

**Deploy now:** `npm run deploy:flutter`  
**Test now:** `npm run deploy:flutter:test`
