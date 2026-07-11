# 🔒 Firebase PERMISSION_DENIED Fix

**Issue:** Getting `PERMISSION_DENIED` errors from Firebase  
**Root Cause:** Race condition - users accessing database before authentication completes  
**Status:** ✅ Solution provided

---

## 🔍 What's Happening

Your Firebase security rules require authentication:

```json
// database.rules.json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": "auth != null",    // ← Requires authentication
        ".write": "auth != null && ..."
      }
    }
  }
}
```

Your app **does** sign in users anonymously via `ensureSignedIn()`, but:

1. ✅ App starts
2. ✅ `ensureSignedIn()` called (async)
3. ❌ User clicks "Create Room" before sign-in completes
4. ❌ Database write fails: `PERMISSION_DENIED`

**The Problem:** The UI allows interactions before authentication finishes.

---

## ✅ Solution 1: Add Loading State (RECOMMENDED)

### Update App.tsx

Make sure the app waits for authentication before showing the UI:

```tsx
// File: shiritori-online/src/App.tsx

export default function App() {
  const [uid, setUid] = useState<string>("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);  // ← Add this
  
  useEffect(() => {
    setAuthLoading(true);  // ← Start loading
    ensureSignedIn()
      .then(setUid)
      .catch(e => setAuthError(t("connectError") + "\n" + (e?.message ?? "")))
      .finally(() => setAuthLoading(false));  // ← Stop loading
  }, []);
  
  // Show loading screen while authenticating
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Connecting...</p>
      </div>
    );
  }
  
  // Show error if authentication failed
  if (authError) {
    return (
      <div className="error-screen">
        <p>{authError}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }
  
  // Only show UI when authenticated (uid exists)
  if (!uid) {
    return (
      <div className="loading-screen">
        <p>Authenticating...</p>
      </div>
    );
  }
  
  // Rest of your app...
  return (
    <div className="app">
      {/* Your existing UI */}
    </div>
  );
}
```

---

## ✅ Solution 2: Guard Database Operations

### Update room-service.ts

Add authentication checks before database operations:

```typescript
// File: shiritori-online/src/lib/game/room-service.ts

import { auth } from "../../firebase";

// Add this helper function at the top
function ensureAuth(): void {
  if (!auth.currentUser) {
    throw new Error("Not authenticated. Please wait for sign-in to complete.");
  }
}

// Update createRoom
export async function createRoom(
  uid: string,
  name: string,
  timeLimit: number,
  settings: RuleSettings
): Promise<string> {
  ensureAuth();  // ← Add this check
  
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = randomCode();
    const snap = await get(gameRef(code));
    if (snap.exists()) continue;
    
    // ... rest of function
  }
}

// Update joinRoom
export async function joinRoom(
  uid: string, 
  name: string, 
  rawCode: string
): Promise<JoinResult> {
  ensureAuth();  // ← Add this check
  
  const code = rawCode.trim().toUpperCase();
  // ... rest of function
}

// Update playWord
export async function playWord(
  state: GameState,
  uid: string,
  rawWord: string,
  meaning?: string,
  readingKana?: string
): Promise<PlayResult> {
  ensureAuth();  // ← Add this check
  
  const seat = seatOf(state, uid);
  // ... rest of function
}
```

---

## ✅ Solution 3: Development/Testing Rules (TEMPORARY ONLY!)

**⚠️ WARNING: Only use this for local testing, NEVER in production!**

### For Local Development Only

Create a separate rules file for development:

```json
// File: shiritori-online/database.rules.dev.json
{
  "rules": {
    ".read": true,   // ⚠️ DANGEROUS: Allow all reads
    ".write": true   // ⚠️ DANGEROUS: Allow all writes
  }
}
```

**To use:**

```bash
# Deploy development rules to Firebase (LOCAL EMULATOR ONLY)
firebase emulators:start

# Or update firebase.json temporarily
{
  "database": {
    "rules": "database.rules.dev.json"  // ← NEVER commit this
  }
}
```

**⚠️ NEVER deploy these rules to production!**

---

## ✅ Solution 4: Check Firebase Console

### Verify Authentication is Enabled

1. Go to: https://console.firebase.google.com
2. Select your project: `shiritori-game-ccaae`
3. Go to **Authentication** → **Sign-in method**
4. Check that **Anonymous** is **ENABLED**

If Anonymous authentication is disabled:
- Click **Anonymous**
- Toggle **Enable**
- Click **Save**

### Check Database Rules Deployment

```bash
# Deploy your rules
cd shiritori-online
firebase deploy --only database

# Verify rules in console
# Go to: Realtime Database → Rules tab
# Should show your rules from database.rules.json
```

---

## 🧪 Testing the Fix

### Test Authentication

```typescript
// Add this to your browser console (F12)
import { auth } from './firebase';

// Check if user is signed in
console.log('Current user:', auth.currentUser);
console.log('UID:', auth.currentUser?.uid);

// If null, wait a moment and check again
setTimeout(() => {
  console.log('Current user (after delay):', auth.currentUser);
}, 2000);
```

### Test Database Access

```typescript
// In browser console
import { ref, get } from 'firebase/database';
import { db } from './firebase';

// Try to read data
get(ref(db, 'games'))
  .then(snap => console.log('✅ Read success:', snap.exists()))
  .catch(err => console.error('❌ Read failed:', err));
```

---

## 🔍 Debugging Steps

### 1. Check Browser Console

Open DevTools (F12) and look for:

```
❌ PERMISSION_DENIED: Permission denied
```

### 2. Check Network Tab

- Look for failed requests to Firebase
- Status: 401 Unauthorized or 403 Forbidden
- Response: "Permission denied"

### 3. Check Authentication State

```typescript
// Add this to App.tsx temporarily
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', {
      isAuthenticated: !!user,
      uid: user?.uid,
      isAnonymous: user?.isAnonymous
    });
  });
  return unsubscribe;
}, []);
```

### 4. Check Firebase Console Logs

1. Go to Firebase Console
2. Navigate to **Realtime Database** → **Usage** tab
3. Look for failed operations

---

## 📋 Quick Fix Checklist

Apply these fixes in order:

- [ ] **Check Firebase Console**
  - [ ] Anonymous auth is enabled
  - [ ] Database rules are deployed
  - [ ] Database exists and is accessible

- [ ] **Update App.tsx**
  - [ ] Add `authLoading` state
  - [ ] Show loading screen while authenticating
  - [ ] Block UI until `uid` exists

- [ ] **Update room-service.ts**
  - [ ] Add `ensureAuth()` helper
  - [ ] Call `ensureAuth()` in `createRoom`
  - [ ] Call `ensureAuth()` in `joinRoom`
  - [ ] Call `ensureAuth()` in `playWord`

- [ ] **Test**
  - [ ] Clear browser cache
  - [ ] Open app in incognito mode
  - [ ] Check console for auth state
  - [ ] Try creating a room
  - [ ] Verify no PERMISSION_DENIED errors

---

## 🎯 Root Causes & Solutions Summary

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Race condition** | PERMISSION_DENIED on first action | Add loading state in App.tsx |
| **No auth check** | Occasional failures | Add `ensureAuth()` guards |
| **Anonymous disabled** | Always fails | Enable in Firebase Console |
| **Rules not deployed** | Works locally, fails in prod | Run `firebase deploy --only database` |
| **Wrong rules file** | Unexpected behavior | Check firebase.json points to correct file |

---

## 🚀 Recommended Implementation

### Step 1: Update App.tsx (5 minutes)

```tsx
const [authLoading, setAuthLoading] = useState(true);

useEffect(() => {
  ensureSignedIn()
    .then(setUid)
    .catch(setAuthError)
    .finally(() => setAuthLoading(false));
}, []);

if (authLoading) return <LoadingScreen />;
if (authError) return <ErrorScreen error={authError} />;
if (!uid) return <LoadingScreen />;

// Your app UI
```

### Step 2: Verify Firebase (2 minutes)

```bash
# Check Anonymous auth is enabled
firebase console

# Deploy rules
firebase deploy --only database
```

### Step 3: Test (3 minutes)

```bash
# Start local dev server
npm run dev

# Open http://localhost:5173
# Check console - should see: "Auth state changed: { isAuthenticated: true, ... }"
# Try creating a room - should work!
```

---

## 📚 Understanding Firebase Security Rules

### Your Current Rules

```json
{
  "rules": {
    ".read": false,   // ← Deny all reads by default
    ".write": false,  // ← Deny all writes by default
    "games": {
      "$gameId": {
        ".read": "auth != null",  // ← Allow if authenticated
        ".write": "auth != null && ..."  // ← Allow if authenticated AND authorized
      }
    }
  }
}
```

**What this means:**
- ✅ Safe: Denies everything by default
- ✅ Secure: Only authenticated users can read games
- ✅ Protected: Only game participants can write

**Why PERMISSION_DENIED happens:**
- User tries to read/write when `auth == null`
- Firebase rejects the request
- Error bubbles up to your app

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep authentication required
- Use anonymous auth for guests
- Show loading state during sign-in
- Guard database operations
- Deploy rules frequently

### ❌ DON'T:
- Remove auth requirements in production
- Use `.read: true, .write: true` in production
- Allow database access before authentication
- Skip loading states
- Forget to deploy rules

---

## 🎉 Expected Result

After applying fixes:

```
1. User opens app
   → "Connecting..." shown
   
2. Anonymous sign-in completes (1-2 seconds)
   → UID acquired
   
3. App UI appears
   → User can now interact
   
4. User clicks "Create Room"
   → ✅ SUCCESS: Room created
   → No PERMISSION_DENIED error
```

---

## 📞 Still Having Issues?

### Check These:

1. **Browser console** - Any red errors?
2. **Network tab** - Failed requests to Firebase?
3. **Firebase Console** → Authentication → Users
   - Do you see anonymous users appearing?
4. **Firebase Console** → Realtime Database → Data
   - Can you manually add data?
5. **Environment variables** - Are they set correctly?

### Common Mistakes:

❌ Forgot to enable Anonymous auth in Firebase Console  
❌ Using wrong Firebase project (check `.firebaserc`)  
❌ Rules file not deployed (`firebase deploy --only database`)  
❌ App trying to access database before auth completes  
❌ Network issues preventing Firebase connection

---

**Created:** July 11, 2026  
**Status:** ✅ Solutions Provided  
**Priority:** 🔥 HIGH - Blocking gameplay

**Apply Solution 1 (Loading State) + Solution 2 (Guards) for best results!**
