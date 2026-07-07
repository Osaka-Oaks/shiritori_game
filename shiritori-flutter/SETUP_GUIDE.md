##🚀 Flutter Shiritori Setup Guide

Complete step-by-step guide to set up and run the Flutter Shiritori game.

---

## 📋 Prerequisites

### 1. Install Flutter SDK

**macOS/Linux:**
```bash
# Download Flutter
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"

# Or use Homebrew (macOS)
brew install --cask flutter
```

**Windows:**
Download from: https://docs.flutter.dev/get-started/install/windows

**Verify Installation:**
```bash
flutter doctor
```

### 2. Install Firebase CLI

```bash
# Install globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### 3. Install FlutterFire CLI

```bash
dart pub global activate flutterfire_cli
```

---

## 🎯 Project Setup

### Step 1: Initialize Flutter Project

```bash
# Navigate to shiritori-flutter directory
cd shiritori-flutter

# Get dependencies
flutter pub get
```

### Step 2: Configure Firebase

```bash
# Configure with your Firebase project
flutterfire configure --project=shiritori-game-ccaae

# This will:
# - Register your apps with Firebase
# - Create/update lib/firebase_options.dart
# - Configure iOS, Android, Web, macOS platforms
```

**What happens:**
- ✅ Connects to Firebase project: `shiritori-game-ccaae`
- ✅ Generates `lib/firebase_options.dart` with API keys
- ✅ Sets up platform-specific configurations
- ✅ Enables Firestore, Auth, Analytics

### Step 3: Verify Setup

```bash
# Check Flutter environment
flutter doctor -v

# Should see:
# ✓ Flutter (Channel stable, version X.X.X)
# ✓ Connected device (Chrome, if web)
# ✓ Network resources
```

---

## 🌐 Run on Web (Primary Target)

### Development Mode

```bash
# Run with hot reload
flutter run -d chrome

# Or with custom port
flutter run -d chrome --web-port=8080

# With debugging
flutter run -d chrome --debug
```

### Production Build

```bash
# Build for web with WebAssembly
flutter build web --wasm

# Build with optimization
flutter build web --wasm --release

# Output location: build/web/
```

### Deploy to Firebase

```bash
# Make sure you're in shiritori-flutter directory

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Or deploy specific project
firebase deploy --only hosting --project shiritori-game-ccaae
```

---

## 📱 Run on Mobile (Scaffolded)

### Android

```bash
# Check Android setup
flutter doctor

# Run on Android emulator
flutter run

# Build APK
flutter build apk --release

# Build App Bundle (for Play Store)
flutter build appbundle --release
```

**Android Setup:**
1. Install Android Studio
2. Install Android SDK
3. Create/start emulator: `flutter emulators --launch <emulator_id>`

### iOS (macOS only)

```bash
# Install CocoaPods
sudo gem install cocoapods

# Navigate to iOS directory
cd ios
pod install
cd ..

# Run on iOS simulator
flutter run

# Build for iOS
flutter build ios --release

# Open in Xcode
open ios/Runner.xcworkspace
```

**iOS Setup:**
1. Install Xcode from App Store
2. Install Xcode Command Line Tools: `xcode-select --install`
3. Open iOS Simulator

---

## 💻 Run on Desktop

### Windows

```bash
# Enable Windows desktop
flutter config --enable-windows-desktop

# Run on Windows
flutter run -d windows

# Build
flutter build windows --release
```

### macOS

```bash
# Enable macOS desktop
flutter config --enable-macos-desktop

# Run on macOS
flutter run -d macos

# Build
flutter build macos --release
```

### Linux

```bash
# Enable Linux desktop
flutter config --enable-linux-desktop

# Install dependencies (Ubuntu/Debian)
sudo apt-get install clang cmake ninja-build pkg-config libgtk-3-dev

# Run on Linux
flutter run -d linux

# Build
flutter build linux --release
```

---

## 🔥 Firebase Configuration Details

### Firestore Collections Setup

**Create these collections in Firebase Console:**

```javascript
// /users/{userId}
{
  displayName: "Player Name",
  email: "player@example.com",
  createdAt: timestamp,
  stats: {
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
    highScore: 0
  }
}

// /games/{gameId}
{
  playerIds: ["userId1", "userId2"],
  words: ["りんご", "ごりら", "らっぱ"],
  scores: [100, 120],
  status: "completed",
  winner: "userId1",
  createdAt: timestamp,
  updatedAt: timestamp
}

// /leaderboard/{userId}
{
  displayName: "Player Name",
  score: 1500,
  wins: 25,
  rank: 1,
  updatedAt: timestamp
}
```

### Firestore Rules

Add these security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Games collection
    match /games/{gameId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       request.auth.uid in resource.data.playerIds;
    }
    
    // Leaderboard collection
    match /leaderboard/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Firebase Hosting Configuration

Create `firebase.json` in project root:

```json
{
  "hosting": {
    "public": "build/web",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(wasm|js|css|map)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
flutter test

# Integration tests
flutter test integration_test/

# Test with coverage
flutter test --coverage

# Generate coverage report
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
```

### Create Tests

**Unit Test Example:**
```dart
// test/word_validator_test.dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('validates shiritori word chain', () {
    final lastWord = 'りんご';
    final newWord = 'ごりら';
    
    expect(newWord.startsWith(lastWord[lastWord.length - 1]), true);
  });
}
```

---

## 🎨 Development Workflow

### Hot Reload

While app is running:
- **Press `r`** - Hot reload (rebuild UI)
- **Press `R`** - Hot restart (restart app)
- **Press `q`** - Quit
- **Press `h`** - Help

### Debugging

```bash
# Run with debugging enabled
flutter run --debug

# Profile mode (performance testing)
flutter run --profile

# Release mode
flutter run --release
```

### DevTools

```bash
# Open DevTools
flutter pub global activate devtools
flutter pub global run devtools

# Then run your app and click the DevTools link
```

---

## 📦 Dependencies Explained

### State Management
```yaml
flutter_riverpod: ^2.4.0       # Modern, simple state management
```

### Firebase
```yaml
firebase_core: ^2.24.0          # Firebase core SDK
firebase_auth: ^4.15.0          # Authentication
cloud_firestore: ^4.13.0        # NoSQL database
firebase_analytics: ^10.7.0     # Analytics tracking
```

### UI
```yaml
google_fonts: ^6.1.0            # Custom fonts
flutter_animate: ^4.3.0         # Animations
shimmer: ^3.0.0                 # Loading effects
```

### Utilities
```yaml
go_router: ^12.1.0              # Navigation
dio: ^5.4.0                     # HTTP client
shared_preferences: ^2.2.0      # Local storage
```

---

## 🐛 Troubleshooting

### Issue: `flutter doctor` shows problems

**Solution:**
```bash
# Accept Android licenses
flutter doctor --android-licenses

# Install missing dependencies
flutter doctor

# Fix each issue listed
```

### Issue: Firebase not initializing

**Solution:**
```bash
# Reconfigure Firebase
flutterfire configure --project=shiritori-game-ccaae

# Make sure firebase_options.dart exists
ls lib/firebase_options.dart

# Clean and rebuild
flutter clean
flutter pub get
flutter run
```

### Issue: Web build fails

**Solution:**
```bash
# Clean build
flutter clean

# Get dependencies
flutter pub get

# Build without --wasm first
flutter build web

# If successful, try --wasm
flutter build web --wasm
```

### Issue: Hot reload not working

**Solution:**
```bash
# Restart with clean
flutter clean
flutter run --hot
```

### Issue: Package version conflicts

**Solution:**
```bash
# Update dependencies
flutter pub upgrade

# Get dependencies
flutter pub get

# If still failing, check pubspec.yaml versions
```

---

## 📚 Useful Commands

### Flutter Commands
```bash
flutter doctor                 # Check environment
flutter clean                  # Clean build files
flutter pub get                # Get dependencies
flutter pub upgrade            # Upgrade dependencies
flutter pub outdated           # Check outdated packages
flutter analyze                # Analyze code
flutter format lib/            # Format code
flutter build web              # Build for web
flutter build apk              # Build for Android
flutter build ios              # Build for iOS
```

### Firebase Commands
```bash
firebase login                 # Login to Firebase
firebase projects:list         # List projects
firebase use shiritori-game-ccaae  # Select project
firebase deploy                # Deploy all
firebase deploy --only hosting # Deploy hosting only
firebase serve                 # Test locally
```

### DevTools Commands
```bash
flutter devices                # List connected devices
flutter emulators              # List emulators
flutter emulators --launch <id> # Launch emulator
flutter logs                   # View logs
```

---

## 🎯 Next Steps

### 1. Run the App

```bash
cd shiritori-flutter
flutter pub get
flutterfire configure --project=shiritori-game-ccaae
flutter run -d chrome
```

### 2. Test Features

- ✅ Home screen navigation
- ✅ Start a game
- ✅ Submit words
- ✅ View leaderboard
- ✅ Check history

### 3. Customize

- Edit `lib/presentation/screens/` for UI changes
- Add game logic in `lib/domain/usecases/`
- Connect Firebase in `lib/data/services/`

### 4. Deploy

```bash
flutter build web --wasm
firebase deploy --only hosting
```

---

## 📊 Project Structure Reference

```
shiritori-flutter/
├── lib/
│   ├── main.dart                    # Entry point ✅
│   ├── firebase_options.dart        # Firebase config ✅
│   ├── presentation/                # UI layer
│   │   └── screens/                 # App screens ✅
│   │       ├── home_screen.dart
│   │       ├── game_screen.dart
│   │       ├── leaderboard_screen.dart
│   │       └── history_screen.dart
│   ├── data/                        # Data layer (add later)
│   ├── domain/                      # Business logic (add later)
│   └── core/                        # Core utilities (add later)
├── pubspec.yaml                     # Dependencies ✅
├── firebase.json                    # Firebase config (create)
└── README.md                        # Documentation ✅
```

---

## 🎉 You're Ready!

Your Flutter Shiritori game is now set up and ready to run!

**Quick Start:**
```bash
cd shiritori-flutter
flutter pub get
flutter run -d chrome
```

**Deploy:**
```bash
flutter build web --wasm
firebase deploy --only hosting
```

**Visit:** `https://shiritori-game-ccaae.web.app`

---

*Last updated: July 2026*  
*Flutter version: 3.x*  
*Status: ✅ Ready for Development*
