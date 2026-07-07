# 🚀 Quick Deploy to Firebase

## 5-Minute Setup

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Get Your Firebase Project ID

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select or create your project
3. Copy your project ID (e.g., "shiritori-game-12345")

### Step 4: Configure Project

Edit `.firebaserc`:

```json
{
  "projects": {
    "default": "YOUR_PROJECT_ID_HERE"
  }
}
```

### Step 5: Update Firebase Config

Edit `src/lib/firebase-applet-config.json` with your Firebase credentials:

```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abcdef",
  "firestoreDatabaseId": "(default)"
}
```

**Where to find these values:**

1. Firebase Console → Project Settings
2. Scroll down to "Your apps"
3. Click "Web app" (</>) icon
4. Copy the config object

### Step 6: Deploy! 🚀

```bash
npm run deploy
```

That's it! Your app will be live at:

```
https://YOUR_PROJECT_ID.web.app
```

---

## Commands Reference

```bash
# Deploy everything (hosting + rules)
npm run deploy

# Deploy only frontend
npm run deploy:hosting

# Deploy only Firestore rules
npm run deploy:firestore

# Deploy only Storage rules
npm run deploy:storage

# Local development
npm run dev

# Build without deploying
npm run build
```

---

## Troubleshooting

### "Permission Denied" Error

```bash
firebase login --reauth
```

### Build Fails

```bash
npm run clean
npm install
npm run build
```

### Wrong Project

```bash
firebase use YOUR_PROJECT_ID
```

### Check Current Project

```bash
firebase projects:list
firebase use
```

---

## Free Tier Limits (Spark Plan)

✅ **Hosting:**

- 10 GB storage
- 360 MB/day bandwidth
- Perfect for small-medium games

✅ **Firestore:**

- 1 GB storage
- 50K reads/day
- 20K writes/day
- Good for 1000+ active players

✅ **Storage:**

- 5 GB storage
- 1 GB/day downloads
- 20K uploads/day

**You can handle 1000s of games per day on the free tier!**

---

## Post-Deployment

### Monitor Your App:

- **Live URL**: https://YOUR_PROJECT_ID.web.app
- **Console**: https://console.firebase.google.com
- **Analytics**: Firebase Console → Analytics
- **Database**: Firebase Console → Firestore

### Set Up Custom Domain (Optional):

1. Firebase Console → Hosting
2. Add custom domain
3. Follow DNS instructions
4. Wait 24-48h for SSL

---

## Need Help?

- 📖 Full Guide: See `DEPLOYMENT_GUIDE.md`
- 🔧 Firebase Docs: https://firebase.google.com/docs
- 💬 Firebase Support: https://firebase.google.com/support

---

**Ready? Run `npm run deploy` and watch the magic happen! ✨**
