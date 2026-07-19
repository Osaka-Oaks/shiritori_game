# 🧪 Firebase Testing & Deployment Guide

## 🚀 **Step 1: Deploy to Firebase**

### Quick Deploy

```bash
cd ~/Documents/Github/shiritori_game/kawaii-shiritori

# Install dependencies (fixes tsc issue)
npm install

# Deploy everything
npm run deploy
```

### Or use the automated script:

```bash
./DEPLOY_NOW.sh
```

---

## ✅ **Step 2: Verify Deployment**

### Check Hosting

```bash
# List hosting sites
firebase hosting:sites:list

# Expected output:
# ┌──────────────────────────┬──────────────┬─────────────────────────────────┐
# │ Site ID                   │ Default URL  │ Status                          │
# ├──────────────────────────┼──────────────┼─────────────────────────────────┤
# │ shiritori-game-ccaae     │ ...web.app   │ DEPLOYED                        │
# └──────────────────────────┴──────────────┴─────────────────────────────────┘
```

### Check Firestore Rules

```bash
# Get current Firestore rules
firebase firestore:rules:get

# Should show your rules from firestore.rules
```

### Check Firestore Indexes

```bash
# List indexes
firebase firestore:indexes

# Should show 3 indexes (leaderboard, games by userId, games by difficulty)
```

---

## 🧪 **Step 3: Test Hosting**

### 1. Open Your Live Site

```bash
# Visit in browser:
open https://shiritori-game-ccaae.web.app

# Or
open https://shiritori-game-ccaae.firebaseapp.com
```

### 2. Test Key Pages

- **Home Page** - Should load instantly
- **Game Room** - Check if game starts
- **Leaderboard** - Check if data loads
- **Settings** - Check sound toggles

### 3. Check Browser Console

```javascript
// Open DevTools (F12) and check for:
// ✅ No 404 errors
// ✅ No Firebase connection errors
// ✅ All assets loaded
```

### 4. Test Performance

```bash
# Run Lighthouse audit
npm install -g lighthouse

lighthouse https://shiritori-game-ccaae.web.app \
  --output html \
  --output-path ./lighthouse-report.html

# Open report
open lighthouse-report.html
```

---

## 🔥 **Step 4: Test Firestore**

### 1. Test Firestore Connection

Create a test file: `test-firestore.js`

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Your Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "shiritori-game-ccaae.firebaseapp.com",
  projectId: "shiritori-game-ccaae",
  storageBucket: "shiritori-game-ccaae.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test write (will fail - expected with current rules)
async function testFirestore() {
  try {
    // This should fail due to security rules
    await setDoc(doc(db, "test", "test123"), {
      message: "Hello Firestore",
      timestamp: new Date(),
    });
    console.log("❌ Write succeeded (rules not working!)");
  } catch (error) {
    console.log("✅ Write blocked by security rules (expected)");
    console.log("Error:", error.code);
  }
}

testFirestore();
```

Run:

```bash
node test-firestore.js
```

Expected output: **Write should fail** (security rules working!)

### 2. Test with Firebase Console

1. Visit: https://console.firebase.google.com/project/shiritori-game-ccaae/firestore
2. Try to add a document manually
3. Create collection: `test`
4. Add document with ID: `test123`
5. Should succeed (console has admin access)

### 3. Test Security Rules

```bash
# Install Firebase emulator
firebase emulators:start --only firestore

# In another terminal, run tests
npm test
```

---

## 🔐 **Step 5: Test Authentication** (if using)

### 1. Enable Auth Methods

```bash
# Visit Firebase Console
open https://console.firebase.google.com/project/shiritori-game-ccaae/authentication/providers

# Enable:
# ✅ Email/Password
# ✅ Google
# ✅ Anonymous (for testing)
```

### 2. Test Anonymous Sign-In

Create `test-auth.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {/* your config */};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testAuth() {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("✅ Anonymous sign-in successful");
    console.log("User ID:", userCredential.user.uid);
  } catch (error) {
    console.log("❌ Sign-in failed:", error.message);
  }
}

testAuth();
```

---

## 📊 **Step 6: Monitor Performance**

### Real-time Monitoring

```bash
# Open Firebase Console
open https://console.firebase.google.com/project/shiritori-game-ccaae/overview

# Check these tabs:
# 1. Hosting - View recent deployments
# 2. Firestore - Check database size & operations
# 3. Usage - Monitor Spark plan limits
# 4. Analytics - View user activity (if enabled)
```

### Performance Metrics to Check

**Hosting:**

- [ ] Load time < 3 seconds
- [ ] TTI (Time to Interactive) < 5 seconds
- [ ] No 404 errors

**Firestore:**

- [ ] Read operations < 50K/day
- [ ] Write operations < 20K/day
- [ ] Database size < 1 GB

**General:**

- [ ] No console errors
- [ ] All assets cached properly
- [ ] Mobile responsive

---

## 🧪 **Step 7: Run Automated Tests**

### Unit Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Integration Tests

```bash
# Test build
npm run build

# Test locally before deploy
npm run dev
# Visit http://localhost:5173
```

### E2E Tests (Optional)

Install Playwright:

```bash
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

---

## 🔍 **Step 8: Test Specific Features**

### Test Multi-Dictionary Validation

```javascript
import { wordValidator } from "./src/lib/wordValidator";

async function testValidation() {
  // Test hiragana
  const result1 = await wordValidator.validateWord("いぬ");
  console.log("Hiragana:", result1.isValid ? "✅" : "❌");

  // Test katakana
  const result2 = await wordValidator.validateWord("イヌ");
  console.log("Katakana:", result2.isValid ? "✅" : "❌");

  // Test kanji
  const result3 = await wordValidator.validateWord("犬");
  console.log("Kanji:", result3.isValid ? "✅" : "❌");

  // Test invalid
  const result4 = await wordValidator.validateWord("xyz");
  console.log("Invalid:", !result4.isValid ? "✅" : "❌");
}

testValidation();
```

### Test Sound Effects

```javascript
import { soundManager } from "./src/lib/soundEffects";

async function testSounds() {
  await soundManager.initialize();

  // Test each sound
  soundManager.play("click");
  setTimeout(() => soundManager.play("correct"), 500);
  setTimeout(() => soundManager.play("win"), 1000);

  console.log("✅ Sound system working");
}

testSounds();
```

### Test Performance Monitoring

```javascript
import { performanceOptimizer } from "./src/lib/performanceOptimizer";

function testPerformance() {
  const metrics = performanceOptimizer.getMetrics();

  console.log("FPS:", metrics.fps);
  console.log("Response Time:", metrics.responseTime + "ms");
  console.log("Lag:", metrics.lag ? "❌" : "✅");
}

testPerformance();
```

### Test Caching

```javascript
import { wordCache } from "./src/lib/advancedCache";

async function testCache() {
  // Write to cache
  await wordCache.set("test_word", { word: "いぬ", valid: true });

  // Read from cache
  const cached = await wordCache.get("test_word");
  console.log("Cache:", cached ? "✅" : "❌");

  // Check stats
  const stats = await wordCache.getStats();
  console.log("Cache size:", stats.size);
}

testCache();
```

---

## 📋 **Complete Testing Checklist**

### Pre-Deployment

- [ ] `npm install` - Dependencies installed
- [ ] `npm run validate` - All checks pass
- [ ] `npm run build` - Build succeeds
- [ ] `npm run test` - All tests pass

### Deployment

- [ ] `npm run deploy` - Deployment succeeds
- [ ] Firebase Console shows success
- [ ] No errors in deployment log

### Hosting Tests

- [ ] Site loads at `*.web.app` URL
- [ ] Home page displays correctly
- [ ] All routes work (SPA routing)
- [ ] Assets load (images, fonts, icons)
- [ ] No 404 errors in console
- [ ] Mobile responsive
- [ ] Performance score > 90

### Firestore Tests

- [ ] Firestore rules deployed
- [ ] Security rules block unauthorized access
- [ ] Authenticated writes work
- [ ] Indexes created successfully
- [ ] Queries execute fast (<1s)

### Feature Tests

- [ ] Word validation works (all 3 scripts)
- [ ] Sound effects play
- [ ] Performance monitoring active
- [ ] Caching works
- [ ] Real-time sync (if using)
- [ ] LINE characters load
- [ ] Leaderboard displays

### Performance Tests

- [ ] FPS > 30
- [ ] Response time < 100ms
- [ ] No lag detected
- [ ] Memory usage < 90%
- [ ] Cache hit rate > 50%

### Security Tests

- [ ] Firestore rules block unauthenticated writes
- [ ] Auth required for user data
- [ ] Input validation working
- [ ] XSS protection enabled

---

## 🐛 **Common Issues & Fixes**

### Issue: "Site not loading"

```bash
# Check deployment status
firebase hosting:channel:list

# Redeploy
npm run deploy:hosting
```

### Issue: "Firestore permission denied"

```bash
# Check rules
firebase firestore:rules:get

# Redeploy rules
npm run deploy:firestore
```

### Issue: "Performance is slow"

```bash
# Check bundle size
npm run build
du -sh dist/*

# Analyze bundle
npm run build -- --mode production --minify
```

### Issue: "Tests failing"

```bash
# Clear cache
npm run clean
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Run tests
npm test
```

---

## 📊 **Performance Benchmarks**

### Expected Metrics

| Metric           | Target | Acceptable | Poor   |
| ---------------- | ------ | ---------- | ------ |
| Load Time        | <2s    | <3s        | >5s    |
| FPS              | 60     | 30-59      | <30    |
| Response Time    | <50ms  | <100ms     | >200ms |
| Bundle Size      | <500KB | <1MB       | >2MB   |
| Lighthouse Score | >90    | >70        | <50    |

---

## 🎯 **Next Steps After Testing**

### 1. Setup Monitoring

```bash
# Enable Analytics
open https://console.firebase.google.com/project/shiritori-game-ccaae/analytics

# Enable Performance Monitoring
npm install firebase
# Add to your app
```

### 2. Setup CI/CD

```bash
# GitHub Actions already configured
# Push to main branch to trigger deploy
git push origin main
```

### 3. Custom Domain (Optional)

```bash
firebase hosting:sites:create
firebase hosting:channel:create production
# Follow instructions to add custom domain
```

### 4. Monitor Usage

```bash
# Check daily
open https://console.firebase.google.com/project/shiritori-game-ccaae/usage

# Set up alerts for Spark limits
```

---

## 🎊 **Testing Complete!**

If all tests pass:

✅ **Deployment**: Site is live  
✅ **Hosting**: Fast and responsive  
✅ **Firestore**: Secure and functional  
✅ **Features**: All working correctly  
✅ **Performance**: Optimized  
✅ **Security**: Protected

**Your Shiritori game is production-ready!** 🎌🎮✨

---

## 🔗 **Useful Links**

- **Live Site**: https://shiritori-game-ccaae.web.app
- **Firebase Console**: https://console.firebase.google.com/project/shiritori-game-ccaae
- **Hosting Dashboard**: .../hosting/sites
- **Firestore Dashboard**: .../firestore/databases
- **Usage Dashboard**: .../usage
- **Performance**: .../performance
