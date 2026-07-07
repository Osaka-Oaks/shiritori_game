# 🔥 Flutter + Firebase Setup Guide

**Complete guide to setting up Flutter with Firebase in the shiritori-game-ccaae project.**

---

## 🎯 Quick Setup (3 Commands)

```bash
# 1. Run automated setup
npm run flutter:setup

# 2. Test the app
npm run dev:flutter

# 3. Deploy
npm run deploy:flutter
```

**That's it!** ✅ The script handles everything automatically.

---

## 📋 Table of Contents

- [Quick Setup](#-quick-setup-3-commands)
- [What Gets Configured](#-what-gets-configured)
- [Manual Setup](#-manual-setup-step-by-step)
- [Initialize Firebase in Your App](#-initialize-firebase-in-your-app)
- [Add Firebase Services](#-add-firebase-services)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)

---

## 🔧 What Gets Configured

### Automated Setup Script Does:

1. ✅ **Verifies Prerequisites**
   - Firebase CLI
   - Flutter SDK
   - Dart SDK
   - Firebase login status

2. ✅ **Installs FlutterFire CLI**
   - `dart pub global activate flutterfire_cli`

3. ✅ **Configures FlutterFire**
   - Runs `flutterfire configure --project=shiritori-game-ccaae`
   - Creates `lib/firebase_options.dart`
   - Registers iOS, Android, Web, macOS apps

4. ✅ **Installs Firebase Packages**
   - `firebase_core` - Core functionality
   - `firebase_auth` - Authentication
   - `cloud_firestore` - Firestore database
   - `firebase_database` - Realtime Database

5. ✅ **Verifies Setup**
   - Checks all files created
   - Confirms packages installed

---

## 🚀 Quick Setup (Automated)

### One Command Setup

```bash
# From project root
npm run flutter:setup
```

**What happens:**

```
🔥 Flutter + Firebase Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Checking Prerequisites
  ✅ Firebase CLI installed
  ✅ Logged in to Firebase
  ✅ Flutter SDK installed
  ✅ Dart SDK installed

Step 2: Installing FlutterFire CLI
  ✅ FlutterFire CLI installed

Step 3: Configuring FlutterFire
  ✅ FlutterFire configured successfully
  ✅ firebase_options.dart created

Step 4: Installing Firebase Packages
  ✅ firebase_core added
  ✅ firebase_auth added
  ✅ cloud_firestore added
  ✅ firebase_database added

Step 5: Verifying Setup
  ✅ firebase_options.dart created
  ✅ firebase_core added to pubspec.yaml

✅ Setup Complete!
```

### Verify Setup

```bash
# Check Flutter project
cd shiritori-flutter
flutter doctor

# Check Firebase options file
ls lib/firebase_options.dart

# Run the app
flutter run -d chrome
```

---

## 📝 Manual Setup (Step-by-Step)

### Prerequisites

Before starting, ensure you have:

- [x] Firebase CLI installed (`npm install -g firebase-tools`)
- [x] Firebase CLI logged in (`firebase login`)
- [x] Flutter SDK installed
- [x] Dart SDK installed

### Step 1: Install FlutterFire CLI

```bash
# From any directory
dart pub global activate flutterfire_cli
```

**Add to PATH** (if needed):

```bash
# Add to ~/.zshrc or ~/.bashrc
export PATH="$PATH:$HOME/.pub-cache/bin"

# Then reload
source ~/.zshrc  # or source ~/.bashrc
```

### Step 2: Configure FlutterFire

```bash
# From Flutter project directory
cd shiritori-flutter

# Configure for your Firebase project
flutterfire configure --project=shiritori-game-ccaae
```

**This will:**

- Register your app with Firebase
- Create `lib/firebase_options.dart`
- Configure for all platforms (iOS, Android, Web, macOS)

### Step 3: Add Firebase Packages

```bash
# Add firebase_core (required)
flutter pub add firebase_core

# Add other Firebase services
flutter pub add firebase_auth
flutter pub add cloud_firestore
flutter pub add firebase_database

# Get dependencies
flutter pub get
```

### Step 4: Verify Installation

```bash
# Check if firebase_options.dart exists
ls lib/firebase_options.dart

# Check pubspec.yaml
cat pubspec.yaml | grep firebase
```

---

## 🔥 Initialize Firebase in Your App

### Update main.dart

**File:** `shiritori-flutter/lib/main.dart`

```dart
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  // Ensure Flutter binding is initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Shiritori Game',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Shiritori Game'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Firebase Initialized!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                print('Firebase is ready!');
              },
              child: const Text('Test Firebase'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Key Parts Explained

1. **Import Firebase Core**

   ```dart
   import 'package:firebase_core/firebase_core.dart';
   import 'firebase_options.dart';
   ```

2. **Ensure Binding**

   ```dart
   WidgetsFlutterBinding.ensureInitialized();
   ```

   Required before using Firebase in Flutter.

3. **Initialize Firebase**
   ```dart
   await Firebase.initializeApp(
     options: DefaultFirebaseOptions.currentPlatform,
   );
   ```
   Uses platform-specific configuration from `firebase_options.dart`.

---

## 🛠️ Add Firebase Services

### Authentication

```dart
import 'package:firebase_auth/firebase_auth.dart';

// Sign in anonymously
Future<UserCredential> signInAnonymously() async {
  return await FirebaseAuth.instance.signInAnonymously();
}

// Sign in with email/password
Future<UserCredential> signInWithEmail(String email, String password) async {
  return await FirebaseAuth.instance.signInWithEmailAndPassword(
    email: email,
    password: password,
  );
}

// Sign out
Future<void> signOut() async {
  await FirebaseAuth.instance.signOut();
}

// Listen to auth state
FirebaseAuth.instance.authStateChanges().listen((User? user) {
  if (user == null) {
    print('User is signed out');
  } else {
    print('User is signed in: ${user.uid}');
  }
});
```

### Firestore Database

```dart
import 'package:cloud_firestore/cloud_firestore.dart';

// Get Firestore instance
final db = FirebaseFirestore.instance;

// Add document
Future<void> addGame(String gameId, Map<String, dynamic> data) async {
  await db.collection('games').doc(gameId).set(data);
}

// Get document
Future<DocumentSnapshot> getGame(String gameId) async {
  return await db.collection('games').doc(gameId).get();
}

// Listen to changes
Stream<DocumentSnapshot> watchGame(String gameId) {
  return db.collection('games').doc(gameId).snapshots();
}

// Query collection
Future<QuerySnapshot> getActiveGames() async {
  return await db
      .collection('games')
      .where('status', isEqualTo: 'active')
      .get();
}
```

### Realtime Database

```dart
import 'package:firebase_database/firebase_database.dart';

// Get database reference
final dbRef = FirebaseDatabase.instance.ref();

// Write data
Future<void> writeGame(String gameId, Map<String, dynamic> data) async {
  await dbRef.child('games/$gameId').set(data);
}

// Read data once
Future<DataSnapshot> readGame(String gameId) async {
  return await dbRef.child('games/$gameId').get();
}

// Listen to changes
Stream<DatabaseEvent> watchGame(String gameId) {
  return dbRef.child('games/$gameId').onValue;
}

// Update specific fields
Future<void> updateGame(String gameId, Map<String, dynamic> updates) async {
  await dbRef.child('games/$gameId').update(updates);
}
```

---

## 🧪 Testing

### Run on Web

```bash
# From shiritori-flutter directory
flutter run -d chrome

# Or use npm script
npm run dev:flutter
```

### Run on iOS Simulator

```bash
# Start simulator
open -a Simulator

# Run Flutter app
flutter run -d ios

# Or specific simulator
flutter run -d "iPhone 15 Pro"
```

### Run on Android Emulator

```bash
# List devices
flutter devices

# Run on Android
flutter run -d android

# Or specific emulator
flutter run -d emulator-5554
```

### Test Firebase Connection

Add this to your app to verify Firebase is working:

```dart
import 'package:firebase_core/firebase_core.dart';

void testFirebase() async {
  // Check if Firebase is initialized
  print('Firebase apps: ${Firebase.apps.length}');

  if (Firebase.apps.isNotEmpty) {
    print('Firebase initialized successfully!');
    print('App name: ${Firebase.app().name}');
    print('Options: ${Firebase.app().options}');
  }
}
```

---

## 🐛 Troubleshooting

### Issue: FlutterFire CLI not found

**Error:**

```
flutterfire: command not found
```

**Solution:**

```bash
# Add to PATH
export PATH="$PATH:$HOME/.pub-cache/bin"

# Reload shell
source ~/.zshrc

# Or use full path
$HOME/.pub-cache/bin/flutterfire configure --project=shiritori-game-ccaae
```

---

### Issue: Firebase not initialized

**Error:**

```
[core/no-app] No Firebase App '[DEFAULT]' has been created
```

**Solution:**
Ensure you call `Firebase.initializeApp()` before using Firebase:

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}
```

---

### Issue: firebase_options.dart not found

**Error:**

```
Error: Cannot find 'firebase_options.dart'
```

**Solution:**
Run FlutterFire configure:

```bash
cd shiritori-flutter
flutterfire configure --project=shiritori-game-ccaae
```

---

### Issue: Platform not supported

**Error:**

```
Unsupported platform
```

**Solution:**
Make sure you're running on a supported platform:

```bash
# Check available devices
flutter devices

# Run on specific platform
flutter run -d chrome      # Web
flutter run -d macos       # macOS
flutter run -d ios         # iOS
flutter run -d android     # Android
```

---

### Issue: Permission denied

**Error:**

```
Permission denied: firebase_options.dart
```

**Solution:**

```bash
# Fix permissions
chmod 644 shiritori-flutter/lib/firebase_options.dart

# Or recreate
cd shiritori-flutter
rm lib/firebase_options.dart
flutterfire configure --project=shiritori-game-ccaae
```

---

## 📦 Installed Packages

### Core Packages

| Package             | Version | Purpose                 |
| ------------------- | ------- | ----------------------- |
| `firebase_core`     | Latest  | Firebase initialization |
| `firebase_auth`     | Latest  | Authentication          |
| `cloud_firestore`   | Latest  | Firestore database      |
| `firebase_database` | Latest  | Realtime Database       |

### Optional Packages

```bash
# Analytics
flutter pub add firebase_analytics

# Cloud Messaging
flutter pub add firebase_messaging

# Storage
flutter pub add firebase_storage

# Crashlytics
flutter pub add firebase_crashlytics

# Remote Config
flutter pub add firebase_remote_config
```

---

## 📁 Project Structure

```
shiritori-flutter/
├── lib/
│   ├── firebase_options.dart      # ✅ Generated by FlutterFire
│   ├── main.dart                  # ✅ Initialize Firebase here
│   └── ...
├── pubspec.yaml                   # ✅ Firebase dependencies
├── ios/
│   └── Runner/
│       └── GoogleService-Info.plist  # ✅ iOS config
├── android/
│   └── app/
│       └── google-services.json      # ✅ Android config
└── web/
    └── index.html                    # ✅ Web config
```

---

## 🎯 npm Scripts

### Setup & Development

```bash
# Setup Flutter + Firebase
npm run flutter:setup

# Run Flutter app
npm run dev:flutter

# Build Flutter app
npm run build:flutter

# Deploy Flutter app
npm run deploy:flutter
```

### Testing

```bash
# Run on specific platform
flutter run -d chrome      # Web
flutter run -d macos       # macOS
flutter run -d ios         # iOS
flutter run -d android     # Android
```

---

## 🚀 Next Steps

### 1. Build Your App

Now that Firebase is set up, you can:

- ✅ Use Authentication
- ✅ Store data in Firestore
- ✅ Use Realtime Database
- ✅ Deploy to Firebase Hosting

### 2. Deploy to Firebase

```bash
# Build for web
cd shiritori-flutter
flutter build web --release

# Deploy
firebase deploy --only hosting

# Or use npm script
npm run deploy:flutter
```

### 3. Add More Features

```bash
# Add analytics
flutter pub add firebase_analytics

# Add push notifications
flutter pub add firebase_messaging

# Add cloud storage
flutter pub add firebase_storage
```

---

## 📚 Resources

### Documentation

- **FlutterFire:** https://firebase.flutter.dev/
- **Firebase for Flutter:** https://firebase.google.com/docs/flutter/setup
- **Flutter Docs:** https://docs.flutter.dev/

### Guides

- [Firebase Authentication Guide](https://firebase.flutter.dev/docs/auth/overview)
- [Cloud Firestore Guide](https://firebase.flutter.dev/docs/firestore/overview)
- [Realtime Database Guide](https://firebase.flutter.dev/docs/database/overview)

---

## 🎉 Summary

### What You Have

✅ **Automated setup script** - One command configuration  
✅ **Firebase initialized** - Ready to use in Flutter  
✅ **All platforms configured** - iOS, Android, Web, macOS  
✅ **Firebase packages installed** - Auth, Firestore, Realtime DB  
✅ **Complete documentation** - This guide

### Quick Commands

```bash
# Setup (one time)
npm run flutter:setup

# Develop
npm run dev:flutter

# Deploy
npm run deploy:flutter
```

---

<div align="center">

**🔥 Flutter + Firebase Setup Complete!**

Your Flutter app is now connected to `shiritori-game-ccaae`

**Start building:** `npm run dev:flutter` 🚀

</div>
