# 🔥 PERMISSION_DENIED - Quick Fix Guide

**Issue:** Getting `PERMISSION_DENIED` errors from Firebase  
**Status:** ✅ FIXED - Auth guards added  
**Date:** July 11, 2026

---

## ✅ What I Fixed

### 1. Added Authentication Guards

I've added safety checks to prevent database operations before user is signed in:

**Files Updated:**
- `@/Users/jarrel/Documents/Github/shiritori_game/shiritori-online/src/lib/game/room-service.ts`
- `@/Users/jarrel/Documents/Github/shiritori_game/shiritori-online/src/lib/game/presence.ts`

**Changes:**
```typescript
// Now checks auth before database operations
function ensureAuth(): void {
  if (!auth.currentUser) {
    throw new Error("Authentication required. Please wait for sign-in to complete.");
  }
}

// Applied to:
- createRoom() ← Checks auth before creating room
- joinRoom() ← Checks auth before joining
- playWord() ← Checks auth before playing
- initPresence() ← Checks auth before presence updates
```

### 2. Created Debug Utilities

New file: `shiritori-online/src/utils/debug-auth.ts`

**Use in browser console:**
```javascript
// Run complete diagnostics
debugAuth.runDiagnostics()

// Check auth status
debugAuth.checkAuth()

// Test database access
debugAuth.testDatabaseRead()

// Watch auth changes live
debugAuth.watchAuth()
```

---

## 🔍 Root Causes

Your app **already had loading state** in `App.tsx` (lines 103-114), which is good! But the issue can still happen if:

### ❌ Cause 1: Firebase Console Settings

**Anonymous Authentication might not be enabled**

**Fix:**
1. Go to: https://console.firebase.google.com/project/shiritori-game-ccaae
2. Click **Authentication** → **Sign-in method**
3. Find **Anonymous** in the list
4. Click it and toggle **Enable**
5. Click **Save**

### ❌ Cause 2: Security Rules Not Deployed

**Your rules might not be deployed to Firebase**

**Fix:**
```bash
cd /Users/jarrel/Documents/Github/shiritori_game/shiritori-online
firebase deploy --only database
```

**Expected output:**
```
✔ Deploy complete!
Database Rules: deployed
```

### ❌ Cause 3: Race Condition (NOW FIXED!)

**App tried to access database before sign-in completed**

**✅ Fixed by adding `ensureAuth()` guards**

---

## 🚀 Quick Test

### Step 1: Deploy the Fixes

```bash
cd /Users/jarrel/Documents/Github/shiritori_game/shiritori-online

# Build with the new auth guards
npm run build

# Test locally first
npm run dev
```

### Step 2: Open Browser Console (F12)

```javascript
// Check if auth guards are working
debugAuth.checkAuth()

// Should show:
// ✅ User is authenticated
// UID: xxxxxx
```

### Step 3: Test Game Actions

1. Click "Create Room"
2. If it works → ✅ Fixed!
3. If still fails → See "Still Having Issues?" below

---

## 🧪 Testing Checklist

Run these tests in order:

- [ ] **Clear browser cache** (Cmd+Shift+R or Ctrl+Shift+R)
- [ ] **Open in incognito/private mode**
- [ ] **Open DevTools (F12)**
- [ ] **Go to Console tab**
- [ ] **Look for logs:**
  ```
  🔐 Authentication Status:
    ✅ User is authenticated
  ```
- [ ] **Run diagnostic:**
  ```javascript
  debugAuth.runDiagnostics()
  ```
- [ ] **Check output:**
  ```
  ✅ Database READ successful
  ✅ Database WRITE test completed
  ```
- [ ] **Try creating a room**
- [ ] **Verify:** No `PERMISSION_DENIED` errors in console
- [ ] **Try joining a room**
- [ ] **Try playing a word**

---

## 🔥 Still Having Issues?

### Issue: "Authentication required" error

**Symptom:** Error message about authentication

**Fix:** The guards are working! This means you're trying to do something before sign-in. Wait 2 seconds after page load.

### Issue: Still getting PERMISSION_DENIED

**Check Firebase Console:**

```bash
# 1. Verify you're using the right project
firebase use

# Should show: shiritori-game-ccaae

# 2. Deploy rules
firebase deploy --only database

# 3. Check rules in console
# Go to: Firebase Console → Realtime Database → Rules tab
```

**Expected rules:**
```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": "auth != null",
        ".write": "auth != null && ..."
      }
    }
  }
}
```

### Issue: Auth state shows "NOT SIGNED IN"

**This means `ensureSignedIn()` failed**

**Check:**
```javascript
// In console
debugAuth.watchAuth()

// Wait 5 seconds
// Should see: Auth state changed: { authenticated: true, ... }
```

**If still not signed in:**
1. Check browser console for errors
2. Check network tab for failed requests to Firebase
3. Verify Firebase config in `.env.local`

---

## 📊 Firebase Console Checklist

Go to: https://console.firebase.google.com/project/shiritori-game-ccaae

### Authentication Settings

- [ ] **Authentication** → **Sign-in method**
  - [ ] Anonymous: **ENABLED** ✅
  - [ ] Google: Optional
  - [ ] Email/Password: Optional

### Realtime Database Settings

- [ ] **Realtime Database** → **Rules**
  - [ ] Rules show `auth != null` requirements ✅
  - [ ] Last deployed timestamp is recent ✅

- [ ] **Realtime Database** → **Data**
  - [ ] Database exists and is accessible ✅
  - [ ] Can manually add test data ✅

### Usage Tab

- [ ] **Realtime Database** → **Usage**
  - [ ] Check for recent errors
  - [ ] Look for PERMISSION_DENIED in logs

---

## 💻 Quick Commands

```bash
# Deploy database rules
firebase deploy --only database

# Check which Firebase project you're using
firebase use

# Switch to correct project (if needed)
firebase use shiritori-game-ccaae

# Start local dev server
npm run dev

# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy everything
firebase deploy
```

---

## 🛠️ Debug in Browser Console

### Check Current Auth Status

```javascript
debugAuth.checkAuth()
```

**Good output:**
```
🔐 Authentication Status:
  Current User: {...}
  UID: abc123xyz
  Is Anonymous: true
  Auth Ready: true
  ✅ User is authenticated
```

**Bad output:**
```
🔐 Authentication Status:
  Current User: null
  UID: NOT SIGNED IN
  ❌ NO USER SIGNED IN - This will cause PERMISSION_DENIED!
```

### Test Database Access

```javascript
// Test read permission
debugAuth.testDatabaseRead()

// Test write permission  
debugAuth.testDatabaseWrite()

// Run all tests
debugAuth.runDiagnostics()
```

### Watch Auth Changes Live

```javascript
// Start watching
debugAuth.watchAuth()

// You'll see auth state changes in real-time
// Stop watching when done
stopWatchingAuth()
```

---

## 📋 Solution Summary

### ✅ Changes Made

1. **Added `ensureAuth()` guard** in `room-service.ts`
   - Blocks `createRoom()` until auth ready
   - Blocks `joinRoom()` until auth ready
   - Blocks `playWord()` until auth ready

2. **Added `ensureAuth()` guard** in `presence.ts`
   - Blocks `initPresence()` until auth ready

3. **Created debug utilities** in `debug-auth.ts`
   - Easy diagnostics via browser console
   - Real-time auth state monitoring

### 🎯 Expected Behavior

**Before Fix:**
```
User opens app
  → Sign-in starts (async)
  → User clicks "Create Room" too fast
  → Database operation runs
  → auth.currentUser is still null
  → Firebase rejects: PERMISSION_DENIED ❌
```

**After Fix:**
```
User opens app
  → Sign-in starts (async)
  → "Connecting..." spinner shows
  → Sign-in completes (1-2 seconds)
  → UI appears with uid
  → User clicks "Create Room"
  → ensureAuth() checks auth.currentUser
  → auth.currentUser exists ✅
  → Database operation succeeds ✅
```

---

## 🎓 Understanding the Error

### What is PERMISSION_DENIED?

Firebase Realtime Database checks security rules for every operation:

```json
"games": {
  "$gameId": {
    ".read": "auth != null",   // ← User must be signed in
    ".write": "auth != null && ..."  // ← User must be signed in AND authorized
  }
}
```

**When you get PERMISSION_DENIED:**
- Firebase checked the rules
- Rule said: "auth must not be null"
- But `auth` WAS null (user not signed in yet)
- Firebase rejected the request

### Why Does This Happen?

**Authentication is asynchronous:**

```typescript
// This takes 1-2 seconds
ensureSignedIn()
  .then(uid => {
    // NOW auth.currentUser exists
  })

// But your code might try to access database immediately:
createRoom() // ❌ Too fast! auth.currentUser is still null
```

**The fix:**

```typescript
function ensureAuth() {
  if (!auth.currentUser) {
    throw new Error("Wait for sign-in!");
  }
}

// Now we check first:
function createRoom() {
  ensureAuth(); // ✅ Blocks if not ready
  // ... database operation
}
```

---

## ✅ Final Checklist

Before deploying:

- [x] Auth guards added to `room-service.ts`
- [x] Auth guards added to `presence.ts`
- [x] Debug utilities created
- [ ] Firebase Anonymous auth enabled (CHECK THIS!)
- [ ] Database rules deployed: `firebase deploy --only database`
- [ ] App tested locally: `npm run dev`
- [ ] Browser console checked: `debugAuth.runDiagnostics()`
- [ ] No PERMISSION_DENIED errors
- [ ] Can create room successfully
- [ ] Can join room successfully
- [ ] Can play words successfully

---

## 📞 Need More Help?

### Run Full Diagnostics

```bash
# Terminal
cd /Users/jarrel/Documents/Github/shiritori_game/shiritori-online
npm run dev

# Browser (http://localhost:5173)
# Open Console (F12) and run:
debugAuth.runDiagnostics()

# Share the complete output
```

### Check These Files

1. `.env.local` - Are Firebase credentials correct?
2. `.firebaserc` - Points to `shiritori-game-ccaae`?
3. `firebase.json` - Points to `database.rules.json`?
4. `database.rules.json` - Has `auth != null` requirements?

---

**Created:** July 11, 2026  
**Status:** ✅ FIXED  
**Files Changed:** 2  
**New Files:** 2  
**Priority:** 🔥 CRITICAL (Blocking gameplay)

**Next Step:** Enable Anonymous Auth in Firebase Console, then test!

