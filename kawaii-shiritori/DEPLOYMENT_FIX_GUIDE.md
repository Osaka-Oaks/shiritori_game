# 🚀 Deployment Fix Guide - Spark Plan Features Only

## ✅ **FIXED Issues**

I've already fixed these in your codebase:

1. ✅ **Updated `.firebaserc`** - Now points to `shiritori-game-ccaae`
2. ✅ **Removed Storage** from `firebase.json` - Storage requires Blaze plan
3. ✅ **Removed `deploy:storage`** script - Not available on Spark

---

## 🔧 **Fix "tsc: command not found" Error**

The error happens because `tsc` isn't in your shell's PATH. Here's how to fix it:

### Quick Fix (Run this in your terminal)

```bash
# Navigate to your project
cd ~/Documents/Github/shiritori_game/kawaii-shiritori

# Reinstall dependencies to ensure everything is linked
npm install

# If that doesn't work, try:
npx tsc --version

# If npx works but tsc doesn't, add this to your ~/.zshrc:
export PATH="$PATH:./node_modules/.bin"

# Then reload your shell:
source ~/.zshrc
```

### Alternative: Use npx

Instead of calling `tsc` directly, you can use `npx tsc`. Update your build if needed, but your current build script doesn't use `tsc` directly anyway - it bundles with esbuild.

---

## 📦 **What's Available on Spark (Free) Plan**

### ✅ **Included in Your Setup**

| Feature               | Status            | Limits (Spark)                              |
| --------------------- | ----------------- | ------------------------------------------- |
| **Hosting**           | ✅ Configured     | 10 GB storage, 360 MB/day bandwidth         |
| **Firestore**         | ✅ Configured     | 1 GB storage, 50K reads/day, 20K writes/day |
| **Authentication**    | ✅ Available      | Unlimited users                             |
| **Realtime Database** | ✅ Available      | 1 GB storage, 10 GB/month bandwidth         |
| **Cloud Functions**   | ❌ Requires Blaze | -                                           |
| **Cloud Storage**     | ❌ Requires Blaze | -                                           |

### ❌ **Not Included (Removed from Config)**

- **Cloud Storage** - Requires Blaze plan (pay-as-you-go)
- **Cloud Functions** - Requires Blaze plan
- **Test Lab** - Requires Blaze plan

---

## 🎯 **Current Firebase Configuration**

### `.firebaserc` (Project Alias)

```json
{
  "projects": {
    "default": "shiritori-game-ccaae"
  }
}
```

✅ **Status:** Fixed - now points to correct project

### `firebase.json` (Services Config)

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [/* caching rules */]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

✅ **Status:** Fixed - removed storage config

### `firestore.rules` (Security)

Your rules are production-ready with:

- ✅ Secure by default (deny all)
- ✅ User authentication required
- ✅ Owner-only access to user docs
- ✅ Input validation
- ✅ ID poisoning protection

### `firestore.indexes.json` (Query Optimization)

Your indexes are configured for:

- ✅ Leaderboard queries (totalScore + lastPlayedAt)
- ✅ User game history (userId + playedAt)
- ✅ Games by difficulty (difficulty + playedAt)

---

## 🚀 **Deployment Commands**

### Option 1: Deploy Everything (Hosting + Firestore)

```bash
npm run deploy
```

This runs:

1. `npm run build` - Builds your React app with Vite + bundles server
2. `firebase deploy` - Deploys hosting and Firestore rules/indexes

### Option 2: Deploy Hosting Only

```bash
npm run deploy:hosting
```

Use this when you only changed UI code (no Firestore rules changes).

### Option 3: Deploy Firestore Rules Only

```bash
npm run deploy:firestore
```

Use this when you only changed security rules or indexes (no UI changes).

---

## 📋 **Complete Deployment Checklist**

### First Time Setup

1. **Install Firebase CLI** (if not installed)

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**

   ```bash
   firebase login
   ```

3. **Verify Project Connection**

   ```bash
   firebase projects:list
   # Should show shiritori-game-ccaae
   ```

4. **Initialize Firestore** (Already done via console)
   - ✅ Database created in production mode
   - ✅ Location: nam5 (United States)
   - ✅ Ready to receive rules deployment

### Before Every Deployment

```bash
# 1. Make sure dependencies are installed
npm install

# 2. Run validation checks
npm run validate
# This runs: type-check, lint, format:check, and tests

# 3. Test build locally
npm run build

# 4. Check what will be deployed
firebase deploy --only hosting,firestore --dry-run
```

### Deploy

```bash
# Deploy everything
npm run deploy

# Or deploy selectively:
npm run deploy:hosting
npm run deploy:firestore
```

### After Deployment

```bash
# Check deployment status
firebase hosting:channel:list

# View hosting URL
firebase hosting:sites:list

# Check Firestore rules
firebase firestore:rules:get
```

---

## 🐛 **Troubleshooting**

### Error: "tsc: command not found"

**Fix:**

```bash
# Reinstall dependencies
npm install

# Use npx if PATH issue persists
npx tsc --version

# Add node_modules/.bin to PATH
export PATH="$PATH:./node_modules/.bin"
```

### Error: "Missing script: deploy:storage"

**Fix:** Already fixed! Removed from `package.json` since Storage requires Blaze.

### Error: "Permission denied" for Firestore

**Fix:**

```bash
# Make sure you're logged in
firebase login

# Verify you have access to the project
firebase projects:list

# Re-deploy rules
npm run deploy:firestore
```

### Error: "Build failed"

**Fix:**

```bash
# Clean build artifacts
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Error: "Hosting site not found"

**Fix:**

```bash
# Initialize hosting if needed
firebase init hosting

# Select dist as public directory
# Choose Yes for single-page app
```

---

## 🔐 **Firestore Security Rules Summary**

Your current rules (`firestore.rules`):

### Users Collection (`/users/{userId}`)

**What's allowed:**

- ✅ **Read**: Only the owner can read their own document
- ✅ **Create**: User can create their own profile (with validation)
- ✅ **Update**: Owner can update their own profile (preserves uid)
- ✅ **Delete**: Owner can delete their own profile

**Validation:**

- User ID must be alphanumeric + `-_` (max 128 chars)
- Required fields: `uid`, `name`, `avatarUrl`, `accentColor`
- Optional fields: `gridStyle`, `font`, `headingStyle`, `layoutDensity`
- All fields have size limits

**Protection:**

- ✅ ID poisoning prevented (uid in doc must match document ID)
- ✅ No unauthorized access (must be signed in + owner)
- ✅ Input validation (all fields checked for type and size)

### Global Rules

**Default:** Deny all reads and writes (fail-safe)

```rules
match /{document=**} {
  allow read, write: if false;
}
```

This means any collection not explicitly allowed will be blocked.

---

## 📊 **Adding New Collections**

If you need to add more Firestore collections (e.g., games, leaderboard), add rules to `firestore.rules`:

### Example: Games Collection

```rules
// In firestore.rules, inside service cloud.firestore { match /databases/{database}/documents {

match /games/{gameId} {
  // Anyone can read game data (public games)
  allow read: if true;

  // Only authenticated users can create games
  allow create: if isSignedIn() &&
                   isValidId(gameId) &&
                   incoming().createdBy == request.auth.uid;

  // Only game creator can update
  allow update: if isSignedIn() &&
                   existing().createdBy == request.auth.uid;

  // Only game creator can delete
  allow delete: if isSignedIn() &&
                   existing().createdBy == request.auth.uid;
}
```

### Example: Leaderboard Collection

```rules
match /leaderboard/{entryId} {
  // Everyone can read leaderboard
  allow read: if true;

  // Only system can write (use Cloud Functions on Blaze, or write from authenticated client with validation)
  allow create, update: if isSignedIn() &&
                           incoming().userId == request.auth.uid;

  // No deletions
  allow delete: if false;
}
```

After adding rules, deploy:

```bash
npm run deploy:firestore
```

---

## 🎯 **Performance Tips**

### 1. **Use Firestore Indexes**

Your `firestore.indexes.json` is already configured. If you get "index required" errors in console:

```bash
# Firebase will show a link in error - click it to auto-generate index
# Or manually add to firestore.indexes.json and deploy
npm run deploy:firestore
```

### 2. **Optimize Hosting Caching**

Your `firebase.json` already includes:

- ✅ 1-year cache for images (jpg, png, svg, webp)
- ✅ 1-year cache for JS/CSS bundles
- ✅ SPA routing with `index.html` fallback

### 3. **Monitor Spark Limits**

```bash
# Check usage in Firebase Console
firebase projects:list
# Then visit: https://console.firebase.google.com/project/shiritori-game-ccaae/usage
```

**Spark limits to watch:**

- Firestore: 50K reads/day, 20K writes/day
- Hosting: 360 MB/day bandwidth
- If you exceed, consider:
  - Caching more aggressively
  - Lazy-loading images
  - Using local storage for frequent data

---

## 📚 **Available NPM Scripts**

```json
{
  "dev": "tsx server.ts", // Run dev server
  "build": "vite build && esbuild...", // Build production
  "deploy": "npm run build && firebase deploy", // Deploy all
  "deploy:hosting": "... firebase deploy --only hosting", // Deploy UI only
  "deploy:firestore": "firebase deploy --only firestore", // Deploy rules only
  "validate": "type-check + lint + format + test", // Run all checks
  "test": "vitest run", // Run tests
  "lint": "eslint ..." // Lint code
}
```

---

## 🎊 **Summary: You're Ready to Deploy!**

### ✅ **What's Fixed**

1. ✅ `.firebaserc` - Points to `shiritori-game-ccaae`
2. ✅ `firebase.json` - Removed Storage (Blaze-only)
3. ✅ `package.json` - Removed `deploy:storage` script
4. ✅ Firestore rules - Production-ready security
5. ✅ Firestore indexes - Optimized for queries
6. ✅ TypeScript - Installed (v5.8.2)

### 🚀 **Deploy Now**

```bash
# Navigate to project
cd ~/Documents/Github/shiritori_game/kawaii-shiritori

# Fix tsc PATH issue
npm install

# Validate everything works
npm run validate

# Deploy!
npm run deploy
```

### 📊 **What You Get (Spark Plan)**

- **Hosting**: Your React app served globally
- **Firestore**: User profiles, game data, leaderboards
- **Authentication**: Firebase Auth (email, Google, etc.)
- **Analytics**: Basic usage tracking

### ❌ **What You Don't Get (Requires Blaze)**

- Cloud Storage (file uploads)
- Cloud Functions (server-side logic)
- Advanced features (Test Lab, ML, etc.)

---

## 🔗 **Useful Links**

- **Firebase Console**: https://console.firebase.google.com/project/shiritori-game-ccaae
- **Hosting Dashboard**: .../hosting/sites
- **Firestore Dashboard**: .../firestore/databases
- **Usage Dashboard**: .../usage
- **Firebase Docs**: https://firebase.google.com/docs

---

## 💡 **Next Steps**

### Immediate

1. Run `npm install` to fix tsc PATH
2. Run `npm run deploy` to deploy
3. Check `https://shiritori-game-ccaae.web.app` (or your custom domain)

### Optional Enhancements

1. **Add more Firestore collections**
   - Games collection for match history
   - Leaderboard collection for high scores
   - Update `firestore.rules` with new rules

2. **Setup Custom Domain**

   ```bash
   firebase hosting:channel:create production
   firebase hosting:sites:create
   ```

3. **Add Firebase Authentication**
   - Enable email/password in Console
   - Add Google Sign-In
   - Update rules to use `request.auth.uid`

4. **Monitor Performance**
   - Setup Firebase Performance Monitoring
   - Add Analytics events
   - Track user behavior

---

**Your deployment is now ready! Just run:**

```bash
npm install
npm run deploy
```

🎉 **Good luck with your Shiritori game!** 🎌🎮
