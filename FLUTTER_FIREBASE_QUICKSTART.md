# 🔥 Flutter + Firebase Quick Start

**Set up Flutter with Firebase in `shiritori-game-ccaae` project in 3 commands.**

---

## ⚡ 3-Command Setup

```bash
# 1. Run automated setup
npm run flutter:setup

# 2. Run the app
npm run dev:flutter

# 3. Deploy (optional)
npm run deploy:flutter
```

**Done!** ✅

---

## 📋 What Happens

### Automated Setup Does:

1. ✅ Verifies Firebase CLI, Flutter SDK, Dart SDK
2. ✅ Installs FlutterFire CLI
3. ✅ Configures Firebase for `shiritori-game-ccaae`
4. ✅ Creates `lib/firebase_options.dart`
5. ✅ Installs Firebase packages (core, auth, firestore, database)
6. ✅ Verifies everything works

---

## 🎯 npm Scripts

```bash
# Setup Flutter + Firebase (one time)
npm run flutter:setup

# Check Flutter installation
npm run flutter:doctor

# Clean Flutter project
npm run flutter:clean

# Run Flutter app
npm run dev:flutter

# Build Flutter app
npm run build:flutter

# Deploy to Firebase
npm run deploy:flutter

# Test deployment
npm run deploy:flutter:test
```

---

## 🔧 Manual Steps (If Needed)

### 1. Prerequisites

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Install Flutter SDK
# Visit: https://docs.flutter.dev/get-started/install
```

### 2. Run Setup

```bash
npm run flutter:setup
```

### 3. Initialize Firebase in App

**File:** `shiritori-flutter/lib/main.dart`

```dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const MyApp());
}
```

---

## 🧪 Test It

### Run on Web

```bash
npm run dev:flutter

# Or directly
cd shiritori-flutter
flutter run -d chrome
```

### Test Firebase

```dart
// Check Firebase is initialized
print('Firebase apps: ${Firebase.apps.length}');

if (Firebase.apps.isNotEmpty) {
  print('✅ Firebase initialized!');
}
```

---

## 📦 Installed Packages

| Package             | Purpose                 |
| ------------------- | ----------------------- |
| `firebase_core`     | Firebase initialization |
| `firebase_auth`     | User authentication     |
| `cloud_firestore`   | Firestore database      |
| `firebase_database` | Realtime Database       |

### Add More Services

```bash
cd shiritori-flutter

# Analytics
flutter pub add firebase_analytics

# Cloud Messaging
flutter pub add firebase_messaging

# Cloud Storage
flutter pub add firebase_storage
```

---

## 🐛 Common Issues

### Issue: FlutterFire not found

```bash
# Add to PATH
export PATH="$PATH:$HOME/.pub-cache/bin"

# Reload shell
source ~/.zshrc
```

### Issue: Firebase not initialized

```dart
// Make sure to add this before runApp()
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}
```

### Issue: Port already in use

```bash
# Kill the port
npm run port:kill:5173

# Or kill all dev ports
npm run port:kill:all
```

---

## 📚 Firebase Services

### Authentication

```dart
import 'package:firebase_auth/firebase_auth.dart';

// Sign in anonymously
await FirebaseAuth.instance.signInAnonymously();

// Get current user
User? user = FirebaseAuth.instance.currentUser;
```

### Firestore

```dart
import 'package:cloud_firestore/cloud_firestore.dart';

// Get Firestore
final db = FirebaseFirestore.instance;

// Add document
await db.collection('games').doc('game1').set({
  'status': 'active',
  'players': 2
});

// Get document
DocumentSnapshot doc = await db.collection('games').doc('game1').get();
```

### Realtime Database

```dart
import 'package:firebase_database/firebase_database.dart';

// Get database reference
final dbRef = FirebaseDatabase.instance.ref();

// Write data
await dbRef.child('games/game1').set({
  'status': 'active',
  'players': 2
});

// Read data
DataSnapshot snapshot = await dbRef.child('games/game1').get();
```

---

## 🚀 Deploy to Firebase

### Build & Deploy

```bash
# Build for web
cd shiritori-flutter
flutter build web --release

# Deploy
firebase deploy --only hosting

# Or use npm script
npm run deploy:flutter
```

### Test Deployment

```bash
# Run comprehensive tests
npm run deploy:flutter:test
```

**Tests include:**

- HTTP Status (200 OK)
- Response Time
- Flutter Content
- SSL Certificate
- Mobile Compatibility
- And 5 more checks!

---

## 📁 Files Created

```
shiritori-flutter/
├── lib/
│   ├── firebase_options.dart      # ✅ Firebase config
│   └── main.dart                  # ✅ Initialize here
├── pubspec.yaml                   # ✅ Dependencies
├── ios/Runner/
│   └── GoogleService-Info.plist   # ✅ iOS config
├── android/app/
│   └── google-services.json       # ✅ Android config
└── web/
    └── index.html                 # ✅ Web config
```

---

## 🎯 Project Structure

```
shiritori-game-ccaae (Firebase Project)
├── Hosting (Web)
│   ├── shiritori-online          # React app
│   ├── kawaii-shiritori          # React app
│   └── shiritori-flutter         # Flutter app ⭐
├── Realtime Database             # Shared database
├── Firestore                     # Shared Firestore
├── Authentication               # Shared auth
└── Storage                      # Shared storage
```

**All apps share the same Firebase backend!** 🎉

---

## 💡 Quick Tips

### 1. Check Setup Status

```bash
# Verify Flutter installation
npm run flutter:doctor

# Check Firebase config exists
ls shiritori-flutter/lib/firebase_options.dart

# Check packages installed
cat shiritori-flutter/pubspec.yaml | grep firebase
```

### 2. Rebuild If Needed

```bash
# Clean and rebuild
npm run flutter:clean
npm run build:flutter
```

### 3. Multiple Platforms

```bash
# Run on web
flutter run -d chrome

# Run on iOS simulator
flutter run -d ios

# Run on Android emulator
flutter run -d android

# Run on macOS
flutter run -d macos
```

---

## 🔗 Links

- **Complete Guide:** [FLUTTER_FIREBASE_SETUP.md](FLUTTER_FIREBASE_SETUP.md)
- **Flutter Deployment:** [FLUTTER_DEPLOY_QUICKSTART.md](FLUTTER_DEPLOY_QUICKSTART.md)
- **Port Management:** [PORT_MANAGEMENT_GUIDE.md](PORT_MANAGEMENT_GUIDE.md)
- **Main README:** [README.md](README.md)

### External Resources

- **FlutterFire Docs:** https://firebase.flutter.dev/
- **Flutter Docs:** https://docs.flutter.dev/
- **Firebase Console:** https://console.firebase.google.com/project/shiritori-game-ccaae

---

## 📊 Summary

### Setup Time

<table>
<tr>
<td align="center" width="33%">
<h3>⚡ 2 minutes</h3>
<p>Automated setup</p>
</td>
<td align="center" width="33%">
<h3>📦 4 packages</h3>
<p>Firebase installed</p>
</td>
<td align="center" width="33%">
<h3>🎯 1 project</h3>
<p>shiritori-game-ccaae</p>
</td>
</tr>
</table>

### What You Get

✅ **Firebase Core** - Initialization  
✅ **Firebase Auth** - User management  
✅ **Cloud Firestore** - NoSQL database  
✅ **Realtime Database** - Real-time sync  
✅ **Auto Configuration** - All platforms  
✅ **Complete Docs** - Step-by-step guides

---

## 🎉 Ready to Build!

```bash
# Setup (2 minutes)
npm run flutter:setup

# Develop
npm run dev:flutter

# Deploy
npm run deploy:flutter
```

---

<div align="center">

**🔥 Flutter + Firebase Ready!**

Connected to `shiritori-game-ccaae`

**Start coding:** `npm run dev:flutter` 🚀

</div>
