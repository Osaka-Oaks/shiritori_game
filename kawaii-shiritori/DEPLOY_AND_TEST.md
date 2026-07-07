# 🚀 Deploy and Test Firebase - Quick Commands

## **Step 1: Deploy** (Choose One)

### Option A: Automated (Recommended)

```bash
./DEPLOY_NOW.sh
```

### Option B: Manual

```bash
npm install
npm run deploy
```

---

## **Step 2: Test** (Choose One)

### Option A: Automated Testing

```bash
./test-firebase.sh
```

### Option B: Manual Testing

**Test Hosting:**

```bash
open https://shiritori-game-ccaae.web.app
```

**Test Firestore:**

```bash
firebase firestore:rules:get
```

**Run Unit Tests:**

```bash
npm test
```

---

## **Step 3: Verify in Browser**

### 1. Open Your Site

```
https://shiritori-game-ccaae.web.app
```

### 2. Open Browser DevTools (F12)

- Check Console for errors
- Check Network tab for failed requests
- Check Application > Storage for cache

### 3. Test Key Features

- [ ] Home page loads
- [ ] Can start a game
- [ ] Word validation works
- [ ] Sound effects play (if enabled)
- [ ] Leaderboard displays
- [ ] No console errors

---

## **Quick Reference**

| Command                    | Purpose              |
| -------------------------- | -------------------- |
| `npm install`              | Fix dependencies     |
| `npm run build`            | Build for production |
| `npm run deploy`           | Deploy everything    |
| `npm run deploy:hosting`   | Deploy UI only       |
| `npm run deploy:firestore` | Deploy rules only    |
| `npm test`                 | Run tests            |
| `./DEPLOY_NOW.sh`          | Automated deploy     |
| `./test-firebase.sh`       | Automated testing    |

---

## **Firebase Console Links**

- **Overview**: https://console.firebase.google.com/project/shiritori-game-ccaae
- **Hosting**: https://console.firebase.google.com/project/shiritori-game-ccaae/hosting/sites
- **Firestore**: https://console.firebase.google.com/project/shiritori-game-ccaae/firestore
- **Usage**: https://console.firebase.google.com/project/shiritori-game-ccaae/usage

---

## **Troubleshooting**

### Deployment Failed?

```bash
# Check Firebase login
firebase login

# Check project
firebase projects:list

# Try again
npm install
npm run deploy
```

### Site Not Loading?

```bash
# Check deployment status
firebase hosting:channel:list

# Redeploy
npm run deploy:hosting
```

### Tests Failing?

```bash
# Clear cache and reinstall
npm run clean
rm -rf node_modules
npm install

# Run tests
npm test
```

---

## **What to Expect**

### After Deployment:

- ✅ Site live at: https://shiritori-game-ccaae.web.app
- ✅ Firestore rules deployed
- ✅ All assets uploaded
- ✅ Cache configured

### After Testing:

- ✅ All unit tests pass
- ✅ Site loads in <3 seconds
- ✅ No console errors
- ✅ Firestore secured
- ✅ Performance score >70

---

## **Complete Flow**

```bash
# 1. Deploy
./DEPLOY_NOW.sh

# 2. Test
./test-firebase.sh

# 3. Open site
open https://shiritori-game-ccaae.web.app

# 4. Check console
open https://console.firebase.google.com/project/shiritori-game-ccaae
```

---

## **That's It!**

Your Shiritori game should now be:

- ✅ Deployed to Firebase Hosting
- ✅ Firestore configured and secure
- ✅ Tested and working
- ✅ Ready for players!

🎉 **Enjoy your live game!** 🎌🎮
