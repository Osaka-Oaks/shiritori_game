# ⚡ Quick Start - Deploy in 3 Steps

## 🎯 **What I Fixed for You**

✅ **`.firebaserc`** - Now points to `shiritori-game-ccaae`  
✅ **`firebase.json`** - Removed Storage (requires Blaze plan)  
✅ **`package.json`** - Removed `deploy:storage` script  
✅ **Created deployment script** - Automates the whole process

---

## 🚀 **Deploy Now (3 Steps)**

### Option 1: Automated Script (Recommended)

```bash
./DEPLOY_NOW.sh
```

This script will:

1. Fix the `tsc: command not found` error
2. Optionally run validation checks
3. Let you choose what to deploy
4. Deploy to Firebase

### Option 2: Manual Commands

```bash
# Step 1: Fix tsc issue
npm install

# Step 2: Deploy everything
npm run deploy

# Or deploy selectively:
npm run deploy:hosting    # UI only
npm run deploy:firestore  # Rules only
```

---

## 🔧 **If You Get Errors**

### Error: "tsc: command not found"

```bash
npm install
npx tsc --version  # Should work now
```

### Error: "Permission denied"

```bash
firebase login
firebase projects:list  # Should show shiritori-game-ccaae
```

### Error: "Build failed"

```bash
npm run clean
npm install
npm run build
```

---

## 📊 **What's Deployed**

### Hosting (React App)

- **URL**: https://shiritori-game-ccaae.web.app
- **Console**: [View Hosting](https://console.firebase.google.com/project/shiritori-game-ccaae/hosting/sites)

### Firestore (Database)

- **Status**: Production mode (secure by default)
- **Rules**: Deployed from `firestore.rules`
- **Indexes**: Deployed from `firestore.indexes.json`
- **Console**: [View Firestore](https://console.firebase.google.com/project/shiritori-game-ccaae/firestore)

---

## 💰 **Spark Plan Limits**

You're using the **FREE Spark plan** with these limits:

| Feature           | Limit      |
| ----------------- | ---------- |
| Hosting Storage   | 10 GB      |
| Hosting Bandwidth | 360 MB/day |
| Firestore Storage | 1 GB       |
| Firestore Reads   | 50,000/day |
| Firestore Writes  | 20,000/day |
| Auth Users        | Unlimited  |

**Monitor usage**: https://console.firebase.google.com/project/shiritori-game-ccaae/usage

---

## 📚 **Available Commands**

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run deploy           # Deploy everything
npm run deploy:hosting   # Deploy UI only
npm run deploy:firestore # Deploy rules only
npm run validate         # Run all checks (type, lint, test)
npm run test             # Run tests
```

---

## 🎮 **Features in Your Game**

✅ **Multi-Dictionary Validation** - Hiragana, Katakana, Kanji  
✅ **LINE Friends Characters** - 8 characters + stickers  
✅ **Sound Effects** - 17 sounds with on/off toggle  
✅ **Performance Monitoring** - FPS, response time tracking  
✅ **Advanced Caching** - IndexedDB + memory cache  
✅ **Real-time Multiplayer** - WebSocket with lag prevention  
✅ **Monorepo Structure** - 6 packages with CI/CD

---

## 📖 **Documentation**

- **`DEPLOYMENT_FIX_GUIDE.md`** - Complete deployment guide
- **`PERFORMANCE_GUIDE.md`** - Performance & real-time features
- **`JAPANESE_INPUT_GUIDE.md`** - Multi-script input system
- **`MONOREPO_COMPLETE.md`** - Monorepo architecture
- **`MULTI_DICTIONARY_GUIDE.md`** - Dictionary validation

---

## 🆘 **Need Help?**

1. **Read**: `DEPLOYMENT_FIX_GUIDE.md` (comprehensive troubleshooting)
2. **Check**: Firebase Console for deployment status
3. **Run**: `./DEPLOY_NOW.sh` for automated deployment
4. **Test**: `npm run validate` to check everything works

---

## ✨ **That's It!**

**Just run:**

```bash
./DEPLOY_NOW.sh
```

Or manually:

```bash
npm install && npm run deploy
```

🎉 **Your Shiritori game will be live!** 🎌🎮
