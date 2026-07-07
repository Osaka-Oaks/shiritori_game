# 🔧 Fix Dependency Errors - Complete Guide

## 🐛 **Problem**

You're getting this error:

```
npm error ERESOLVE unable to resolve dependency tree
npm error peer react@"^18.0.0" from @testing-library/react@14.3.1
npm error Found: react@19.2.7
```

**Root cause:** @testing-library/react version 14 only supports React 18, but you have React 19.

---

## ✅ **Solution (Automated)**

I've already fixed your `package.json` and created an automated script:

```bash
cd ~/Documents/Github/shiritori_game/kawaii-shiritori
./FIX_AND_DEPLOY.sh
```

This script will:

1. ✅ Clean node_modules and package-lock.json
2. ✅ Install with `--legacy-peer-deps` (fixes React 19 conflict)
3. ✅ Build your project
4. ✅ Deploy to Firebase

---

## 🛠️ **Manual Fix (If Script Fails)**

### Step 1: Clean Everything

```bash
cd ~/Documents/Github/shiritori_game/kawaii-shiritori
rm -rf node_modules
rm -f package-lock.json
```

### Step 2: Install with Legacy Peer Deps

```bash
npm install --legacy-peer-deps
```

**Why `--legacy-peer-deps`?**

- Allows React 19 with older packages that expect React 18
- Safe to use - doesn't break functionality
- Alternative to `--force` (which is riskier)

### Step 3: Build

```bash
npm run build
```

### Step 4: Deploy

```bash
npm run deploy
```

Or deploy separately:

```bash
npm run deploy:hosting    # Frontend only
npm run deploy:firestore  # Rules only
```

---

## 📋 **What I Fixed**

### Changed in `package.json`:

**Before:**

```json
"@testing-library/react": "^14.1.0"
```

**After:**

```json
"@testing-library/react": "^16.0.0"
```

**Why:** Version 16+ supports React 19

---

## 🚨 **If You Still Get Errors**

### Error: "vite: command not found"

```bash
# Make sure vite is installed
npm install --legacy-peer-deps

# Use npx
npx vite build
```

### Error: "tsc: command not found"

```bash
# TypeScript should be installed now
npx tsc --version

# Add to PATH if needed
export PATH="$PATH:./node_modules/.bin"
```

### Error: "Firebase command not found"

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Or use npx
npx firebase deploy
```

### Error: "Permission denied"

```bash
# Login to Firebase
firebase login

# Check project
firebase projects:list
```

---

## 💡 **Alternative: Force Install**

If `--legacy-peer-deps` doesn't work, try:

```bash
npm install --force
```

⚠️ **Warning:** `--force` overrides all conflicts. Use as last resort.

---

## 🎯 **Complete Flow**

```bash
# 1. Navigate to project
cd ~/Documents/Github/shiritori_game/kawaii-shiritori

# 2. Clean
rm -rf node_modules package-lock.json

# 3. Install (with legacy peer deps)
npm install --legacy-peer-deps

# 4. Build
npm run build

# 5. Deploy
firebase deploy
```

---

## 📦 **Add to .npmrc (Permanent Fix)**

To always use `--legacy-peer-deps`:

```bash
echo "legacy-peer-deps=true" >> .npmrc
```

Then regular `npm install` will work without the flag.

---

## 🔍 **Verify Everything Works**

```bash
# Check TypeScript
npx tsc --version
# Expected: Version 5.8.2

# Check Vite
npx vite --version
# Expected: vite/6.2.3

# Check build output
ls -la dist/
# Should see: index.html, assets/, etc.

# Check Firebase login
firebase projects:list
# Should show: shiritori-game-ccaae
```

---

## 📊 **Dependency Versions**

After fix, you should have:

| Package                | Version | Supports React |
| ---------------------- | ------- | -------------- |
| react                  | 19.2.7  | -              |
| react-dom              | 19.0.1  | -              |
| @testing-library/react | 16.0.0  | React 19 ✅    |
| typescript             | 5.8.2   | -              |
| vite                   | 6.2.3   | -              |

---

## 🎊 **Success Indicators**

After running the fix, you should see:

```
✅ Dependencies installed
✅ Build successful
✅ Deploy complete
✅ Site live at: https://shiritori-game-ccaae.web.app
```

---

## 🐛 **Common Mistakes**

### ❌ Running `npm install` without flags

```bash
npm install  # ❌ Will fail with React 19
```

### ✅ Correct way

```bash
npm install --legacy-peer-deps  # ✅ Works!
```

### ❌ Not cleaning node_modules first

```bash
npm install --legacy-peer-deps  # ❌ Old deps cached
```

### ✅ Correct way

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps  # ✅ Fresh install!
```

---

## 📚 **Understanding the Error**

### What is "ERESOLVE"?

- npm 7+ has strict peer dependency checking
- Fails when package versions conflict
- React 19 is new, many packages still list React 18

### What are "peer dependencies"?

- Dependencies that your package expects YOU to install
- Example: Testing Library expects you to have React
- Must match version ranges

### Why does this happen?

- You have React 19 (latest)
- @testing-library/react@14 was built for React 18
- npm sees mismatch and fails

### How does `--legacy-peer-deps` help?

- Tells npm to use old behavior (npm 6)
- Installs even with peer dep mismatches
- Safe for development - doesn't affect runtime

---

## 🔗 **Useful Links**

- **npm docs**: https://docs.npmjs.com/cli/v8/commands/npm-install
- **React 19 migration**: https://react.dev/blog/2024/04/25/react-19
- **Testing Library**: https://testing-library.com/docs/react-testing-library/intro

---

## 💬 **Quick Answers**

**Q: Is `--legacy-peer-deps` safe?**  
A: Yes! It's just using npm 6 behavior. Won't break anything.

**Q: Should I always use it?**  
A: Only until packages update to support React 19. Add to `.npmrc` for convenience.

**Q: Will my app break?**  
A: No! Testing Library works fine with React 19, just the version check is outdated.

**Q: Why not downgrade to React 18?**  
A: React 19 has better features. Packages will catch up soon.

---

## ✨ **Summary**

**Problem:** React 19 + old Testing Library = dependency conflict  
**Fix:** Updated Testing Library to v16 + use `--legacy-peer-deps`  
**Deploy:** Run `./FIX_AND_DEPLOY.sh` or follow manual steps

**You're now ready to deploy!** 🚀
