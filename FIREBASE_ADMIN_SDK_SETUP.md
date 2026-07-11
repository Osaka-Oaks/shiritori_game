# 🔧 Firebase Admin SDK Setup

**Replace deprecated database secrets with Firebase Admin SDK for server-side operations.**

---

## ⚠️ Database Secrets Are Deprecated

Firebase Console shows this warning:

> Database secrets are currently deprecated and use a legacy Firebase token generator. Update your source code with the Firebase Admin SDK.

**DO NOT use database secrets** for new code. Use Firebase Admin SDK instead.

---

## 🎯 What Changed

### Old Method (Deprecated)

```javascript
// ❌ DEPRECATED - Don't use
const firebase = require('firebase');
const secret = process.env.FIREBASE_DATABASE_SECRET;
const token = firebase.auth().createCustomToken(uid, secret);
```

### New Method (Firebase Admin SDK)

```javascript
// ✅ CORRECT - Use this
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://shiritori-game-ccaae-default-rtdb.firebaseio.com'
});
```

---

## 📥 Get Service Account Key

### Step 1: Download from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/project/shiratori-game-ccaae/settings/serviceaccounts/adminsdk)
2. Click **Project settings** ⚙️
3. Navigate to **Service accounts** tab
4. Click **Generate new private key**
5. Download `serviceAccountKey.json`

### Step 2: Store Securely

**Local development:**

```bash
# Store in project root (gitignored)
mv ~/Downloads/serviceAccountKey.json ./serviceAccountKey.json

# Verify it's ignored
git check-ignore serviceAccountKey.json
# Should output: serviceAccountKey.json
```

**CI/CD (GitHub Actions):**

```bash
# Add as GitHub secret
gh secret set FIREBASE_SERVICE_ACCOUNT < serviceAccountKey.json

# Or via GitHub UI:
# Settings → Secrets → New secret → FIREBASE_SERVICE_ACCOUNT
# Paste entire JSON content
```

---

## 🔧 Implementation

### Install Firebase Admin SDK

```bash
# In your app directory
cd kawaii-shiritori
npm install firebase-admin

cd ../shiritori-online
npm install firebase-admin
```

### Initialize Admin SDK

**Option 1: Using Service Account File**

```typescript
// server/firebase-admin.ts
import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://shiritori-game-ccaae-default-rtdb.firebaseio.com'
  });
}

export default admin;
```

**Option 2: Using Environment Variables**

```typescript
// server/firebase-admin.ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    }),
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
  });
}

export default admin;
```

**Add to `.env`:**

```bash
FIREBASE_ADMIN_PROJECT_ID=shiritori-game-ccaae
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@shiritori-game-ccaae.iam.gserviceaccount.com
```

---

## 🚀 Usage Examples

### Create Custom Tokens

```typescript
// server/auth.ts
import admin from './firebase-admin';

async function createCustomToken(uid: string): Promise<string> {
  try {
    const token = await admin.auth().createCustomToken(uid);
    return token;
  } catch (error) {
    console.error('Error creating custom token:', error);
    throw error;
  }
}
```

### Verify ID Tokens

```typescript
// server/middleware/auth.ts
import admin from '../firebase-admin';

async function verifyToken(idToken: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}
```

### Access Realtime Database

```typescript
// server/database.ts
import admin from './firebase-admin';

const db = admin.database();

// Read data
async function getGameState(roomId: string) {
  const snapshot = await db.ref(`rooms/${roomId}`).once('value');
  return snapshot.val();
}

// Write data
async function updateScore(roomId: string, playerId: string, score: number) {
  await db.ref(`rooms/${roomId}/players/${playerId}/score`).set(score);
}
```

### Access Firestore

```typescript
// server/firestore.ts
import admin from './firebase-admin';

const firestore = admin.firestore();

// Read document
async function getUser(userId: string) {
  const doc = await firestore.collection('users').doc(userId).get();
  return doc.data();
}

// Write document
async function updateUser(userId: string, data: any) {
  await firestore.collection('users').doc(userId).set(data, { merge: true });
}
```

---

## 🔒 Security Best Practices

### ✅ Do

- **Store service account key securely** - Never commit to git
- **Use environment variables in production** - Don't bundle key in client
- **Restrict service account permissions** - Least privilege principle
- **Rotate keys regularly** - Generate new keys quarterly
- **Use different keys per environment** - Dev vs staging vs production

### ❌ Don't

- **Don't commit serviceAccountKey.json** - Already in `.gitignore`
- **Don't expose in client bundles** - Server-side only
- **Don't use database secrets** - They're deprecated
- **Don't share keys in Slack/email** - Use secure channels
- **Don't give full admin access** - Scope permissions

---

## 📦 Update Existing Code

### Find & Replace Database Secrets

```bash
# Search for deprecated usage
grep -r "FIREBASE_DATABASE_SECRET" .
grep -r "firebase.*createCustomToken" .

# Replace with Admin SDK
# See examples above
```

### Server Files to Update

1. **kawaii-shiritori/server.ts**
   - Replace custom token generation
   - Use Admin SDK for auth

2. **shiritori-online/server.ts** (if exists)
   - Same updates

3. **API routes**
   - Update any server endpoints using database secrets

---

## 🧪 Testing

### Test Admin SDK Connection

```typescript
// test-admin.ts
import admin from './firebase-admin';

async function testConnection() {
  try {
    // Test Realtime Database
    const dbRef = admin.database().ref('test');
    await dbRef.set({ timestamp: Date.now() });
    console.log('✅ Realtime Database connection OK');

    // Test Firestore
    const firestoreDoc = await admin.firestore().collection('test').doc('test').set({
      timestamp: Date.now()
    });
    console.log('✅ Firestore connection OK');

    // Test Auth
    const users = await admin.auth().listUsers(1);
    console.log('✅ Auth connection OK');

  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
```

Run test:

```bash
npx tsx test-admin.ts
```

---

## 🌐 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/ci.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Setup Firebase Admin SDK
        run: |
          echo '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}' > serviceAccountKey.json
      
      - name: Deploy with Admin SDK
        run: |
          npm run deploy
        env:
          FIREBASE_ADMIN_SDK_JSON: ./serviceAccountKey.json
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
deploy:
  script:
    - echo "$FIREBASE_SERVICE_ACCOUNT" > serviceAccountKey.json
    - npm run deploy
  variables:
    FIREBASE_ADMIN_SDK_JSON: ./serviceAccountKey.json
```

---

## 🔗 Resources

### Official Documentation

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Service Accounts](https://firebase.google.com/docs/admin/setup#initialize-sdk)
- [Custom Tokens](https://firebase.google.com/docs/auth/admin/create-custom-tokens)
- [Migration Guide](https://firebase.google.com/support/guides/service-accounts)

### Project Documentation

- [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md) - CI/CD secrets
- [SECURITY.md](SECURITY.md) - Security policy
- [.env.example](.env.example) - Environment template

---

## ✅ Checklist

### Setup

- [ ] Download service account key from Firebase Console
- [ ] Store key securely (not in git)
- [ ] Install `firebase-admin` package
- [ ] Initialize Admin SDK in server code
- [ ] Update environment variables

### Migration

- [ ] Find all usages of `FIREBASE_DATABASE_SECRET`
- [ ] Replace with Admin SDK calls
- [ ] Remove deprecated database secret from code
- [ ] Test all server-side operations
- [ ] Update documentation

### Security

- [ ] Verify `serviceAccountKey.json` is in `.gitignore`
- [ ] Add service account to GitHub Secrets
- [ ] Test that key is not exposed in client bundles
- [ ] Restrict service account permissions
- [ ] Set reminder to rotate keys quarterly

---

<div align="center">

**🔧 Admin SDK Ready!**

Legacy database secrets replaced with secure Admin SDK.

[View Security Guide](GITHUB_SECRETS_SETUP.md) | 
[Firebase Console](https://console.firebase.google.com/project/shiritori-game-ccaae)

</div>
