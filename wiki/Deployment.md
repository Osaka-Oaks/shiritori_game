# 🚀 Deployment Guide

Deploy the Shiritori Game apps to Firebase Hosting via CI/CD or manually.

---

## 📋 Overview

The project supports:
- **GitHub Actions** - Automated CI/CD (primary)
- **GitLab CI/CD** - Alternative platform
- **Manual deployment** - For testing

All apps deploy to **Firebase Hosting** under project `shiritori-game-ccaae`.

---

## 🔑 Prerequisites

Before deploying:

1. ✅ [Firebase token configured](Security-Setup) - `FIREBASE_TOKEN` secret set
2. ✅ [Firebase credentials set](Security-Setup) - All `VITE_FIREBASE_*` variables
3. ✅ Firebase CLI installed - `npm install -g firebase-tools`
4. ✅ Logged into Firebase - `firebase login`

---

## 🤖 Automated Deployment (GitHub Actions)

### Deploy on Push to Main

**Automatic deployment** happens when you push to `main` branch:

```bash
git checkout main
git pull origin main
git merge your-feature-branch
git push origin main
```

CI/CD will:
1. Run lint & tests
2. Build all apps
3. Deploy to Firebase
4. Verify deployment
5. Report status

**Monitor deployment:**

```bash
# Watch the run
gh run watch

# Or view in browser
gh run list --workflow=ci.yml
```

### Manual Deployment Trigger

Trigger deployment without pushing code:

```bash
# Using GitHub CLI
gh workflow run deploy-and-test.yml -f environment=production

# Or via GitHub UI
# Actions → Deploy and Test → Run workflow → Choose branch
```

---

## 🦊 GitLab CI/CD Deployment

### Setup GitLab Variables

**Settings → CI/CD → Variables**

Required:
- `FIREBASE_TOKEN` (protected, masked)
- All `VITE_FIREBASE_*` variables

See [GitLab Setup Guide](https://jorelfuji.github.io/shiritori_game/deployment/gitlab.html) for details.

### Deploy

```bash
# Push to main (auto-deploys)
git push gitlab main

# Or push to develop (staging)
git push gitlab develop
```

---

## 💻 Manual Deployment

### Deploy React Apps

**Shiritori Online:**

```bash
cd shiritori-online

# Build
npm run build

# Deploy
firebase deploy --only hosting --project shiritori-game-ccaae

# Deployed to: https://shiritori-game-ccaae.web.app
```

**Kawaii Shiritori:**

```bash
cd kawaii-shiritori

# Build
npm run build

# Deploy (if configured)
firebase deploy --only hosting --project shiritori-game-ccaae
```

### Deploy Flutter App

```bash
cd shiritori_flutter

# Build for web
flutter build web --release

# Deploy
firebase deploy --only hosting --project shiritori-game-ccaae

# Deployed to: https://shiritori-flutter.web.app
```

### Deploy Database Rules

```bash
# Realtime Database rules
cd shiritori-online
firebase deploy --only database --project shiritori-game-ccaae

# Firestore rules
cd kawaii-shiritori
firebase deploy --only firestore --project shiritori-game-ccaae
```

---

## 🌍 Deployment Environments

### Production

**URL:** https://shiritori-game-ccaae.web.app  
**Branch:** `main`  
**Auto-deploy:** ✅ Yes (on push to main)  
**Manual gate:** ❌ No (auto-deploys)

### Staging

**URL:** Preview channels (14-day expiry)  
**Branch:** `develop`  
**Auto-deploy:** ✅ Yes (on push to develop)  
**Preview URL:** Created for each deploy

### Flutter Production

**URL:** https://shiritori-flutter.web.app  
**Branch:** `main`  
**Auto-deploy:** ✅ Yes (on push to main)  
**Path filter:** `shiritori_flutter/**`

---

## 🔍 Verify Deployment

### Check Site is Live

```bash
# Test production
curl -I https://shiritori-game-ccaae.web.app

# Test Flutter
curl -I https://shiritori-flutter.web.app

# Should return HTTP 200
```

### View Deployment History

```bash
# Firebase CLI
firebase hosting:channel:list --project shiritori-game-ccaae

# GitHub Actions
gh run list --workflow=ci.yml --limit 10
```

### Check Deployment Logs

```bash
# Latest CI run
gh run view --log

# Specific run
gh run view <run-id> --log
```

---

## 🐛 Troubleshooting

### Deploy Fails: "FIREBASE_TOKEN not set"

**Solution:**

```bash
# Generate new token
firebase login:ci

# Add to GitHub secrets
gh secret set FIREBASE_TOKEN
```

See [Security Setup](Security-Setup) for details.

### Build Succeeds but Deploy Skipped

**Check conditions:**

1. Deploy only runs on `push` events (not PRs)
2. Must be on `main` or `develop` branch
3. Check job `if:` conditions in workflow

**Force deploy:**

```bash
gh workflow run deploy-and-test.yml -f environment=production
```

### Deploy Succeeds but Site Not Updated

**Possible causes:**

1. **CDN cache** - Wait 5-10 minutes
2. **Browser cache** - Hard refresh (Ctrl+Shift+R)
3. **Wrong project** - Check `firebase.json` project setting

**Verify:**

```bash
# Check deployed version
curl https://shiritori-game-ccaae.web.app/index.html | grep -o '<meta.*version.*>'

# Force cache clear
curl -H "Cache-Control: no-cache" https://shiritori-game-ccaae.web.app
```

### HTTP 401: Unauthorized

**Cause:** Firebase token expired or invalid

**Solution:**

```bash
# Test token locally
firebase projects:list --token "$FIREBASE_TOKEN"

# If fails, regenerate
firebase logout
firebase login:ci
gh secret set FIREBASE_TOKEN
```

---

## 📊 Deployment Workflow

### GitHub Actions Pipeline

**Main CI/CD (`ci.yml`):**

```
Push to main
↓
Lint & Format Check
↓
TypeScript Validation
↓
Run Tests (coverage)
↓
Build Apps
↓
Deploy to Firebase
↓
Verify Deployment
↓
Report Status
```

**Flutter Deploy (`deploy-flutter.yml`):**

```
Push to main (flutter path)
↓
Setup Flutter SDK
↓
Get Dependencies
↓
Analyze & Test
↓
Build Web (release)
↓
Deploy to Firebase
↓
Health Check (retries)
↓
Report Metrics
```

---

## 🔒 Security Notes

### Deployment Credentials

- **FIREBASE_TOKEN** - CI/CD deployment token (secret)
- **Firebase config** - Client keys (can be public variables)
- **Service accounts** - Not used (token-based deploy)

### Branch Protection

Recommended for `main`:

1. Require pull request reviews
2. Require status checks to pass
3. No force pushes
4. No deletions

See [GitHub Security Setup](https://jorelfuji.github.io/shiritori_game/security/github-security.html).

---

## 📚 Related Documentation

### Deployment Guides

- **[GitHub Secrets Setup](Security-Setup)** - Configure CI/CD credentials
- **[GitLab CI/CD Setup](https://jorelfuji.github.io/shiritori_game/deployment/gitlab.html)** - Alternative platform
- **[Firebase Setup](https://jorelfuji.github.io/shiritori_game/deployment/firebase.html)** - Firebase configuration
- **[Flutter Deployment](https://jorelfuji.github.io/shiritori_game/deployment/flutter.html)** - Flutter-specific guide

### CI/CD Documentation

- **[CI/CD Pipeline Summary](https://github.com/JorelFuji/shiritori_game/blob/main/DEPLOYMENT_CI_CD_SUMMARY.md)** - Pipeline details
- **[Complete CI/CD Setup](https://github.com/JorelFuji/shiritori_game/blob/main/COMPLETE_CI_CD_SETUP.md)** - Full configuration

---

## 📞 Need Help?

- **Issues:** [GitHub Issues](https://github.com/JorelFuji/shiritori_game/issues)
- **Docs:** [Full Documentation](https://jorelfuji.github.io/shiritori_game)
- **Firebase:** [Firebase Console](https://console.firebase.google.com/project/shiritori-game-ccaae)

---

**Previous:** [Security Setup](Security-Setup)

**Next:** [Contributing Guide](Contributing)
