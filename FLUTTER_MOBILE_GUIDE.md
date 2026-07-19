# 📱 Flutter Mobile App Guide - Shiritori Game

## 🎯 Two Approaches to Mobile

### Option 1: Flutter WebView (Fast - Recommended First)

Wrap your existing React app in a Flutter WebView shell.

**Pros:**

- ✅ Fast (1-2 hours setup)
- ✅ Keep all existing code
- ✅ Deploy to iOS/Android immediately
- ✅ All features work as-is
- ✅ Easy updates (just update web app)

**Cons:**

- ⚠️ Slightly slower than native
- ⚠️ Requires internet connection
- ⚠️ Web app limitations

### Option 2: Native Flutter Rewrite (Best - Long Term)

Rebuild the game in Flutter/Dart.

**Pros:**

- ✅ True native performance
- ✅ Offline support
- ✅ Better UX/animations
- ✅ Access to all device features
- ✅ Smaller app size

**Cons:**

- ⚠️ 2-4 weeks development
- ⚠️ Maintain two codebases
- ⚠️ Learn Flutter/Dart

---

## 🚀 OPTION 1: Flutter WebView (Quick Start)

### Step 1: Install Flutter

**Mac:**

```bash
# Install Flutter SDK
git clone https://github.com/flutter/flutter.git -b stable ~/flutter
export PATH="$PATH:$HOME/flutter/bin"

# Add to ~/.zshrc for permanent
echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.zshrc

# Verify
flutter doctor
```

**Install Xcode (for iOS):**

```bash
# Install from App Store
# Open Xcode > Preferences > Locations > Command Line Tools

# Accept license
sudo xcodebuild -license accept

# Install iOS simulator
xcode-select --install
```

**Install Android Studio (for Android):**

```bash
# Download from: https://developer.android.com/studio
# Install Android SDK
# Create virtual device in AVD Manager
```

### Step 2: Create Flutter Project

```bash
# Navigate to your repo
cd "/Users/m1876041/Documents/Github/Shiritori Game"

# Create Flutter app
flutter create shiritori_mobile

# Enter project
cd shiritori_mobile
```

### Step 3: Install Dependencies

**Edit `pubspec.yaml`:**

```yaml
name: shiritori_mobile
description: Shiritori Game Mobile App
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter

  # Firebase
  firebase_core: ^3.8.1
  firebase_analytics: ^11.3.5
  firebase_auth: ^5.3.3
  firebase_database: ^11.1.7
  cloud_firestore: ^5.5.2
  firebase_messaging: ^15.1.6
  firebase_performance: ^0.10.0+10
  firebase_remote_config: ^5.1.6

  # WebView
  webview_flutter: ^4.11.1

  # UI
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0

flutter:
  uses-material-design: true

  # Add app icon
  assets:
    - assets/icon.png
```

**Install:**

```bash
flutter pub get
```

### Step 4: Configure Firebase for Flutter

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Firebase
flutterfire configure

# Follow prompts:
# - Select your project: shiritori-game-ccaae
# - Select platforms: iOS, Android, Web
# - This creates firebase_options.dart
```

### Step 5: Create WebView App

**Create `lib/main.dart`:**

```dart
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const ShiritoriApp());
}

class ShiritoriApp extends StatelessWidget {
  const ShiritoriApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Shiritori Game',
      theme: ThemeData(
        primarySwatch: Colors.pink,
        useMaterial3: true,
      ),
      home: const WebViewScreen(),
    );
  }
}

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late final WebViewController _controller;
  static FirebaseAnalytics analytics = FirebaseAnalytics.instance;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();

    // Track app open
    analytics.logAppOpen();

    // Initialize WebView
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
            // Track screen view
            analytics.logScreenView(screenName: 'WebView');
          },
          onWebResourceError: (WebResourceError error) {
            print('WebView error: ${error.description}');
          },
        ),
      )
      ..loadRequest(Uri.parse('https://shiritori-game-ccaae.web.app'));

      // For local testing, use:
      // ..loadRequest(Uri.parse('http://localhost:3000'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFE5E5), // Your app's pink background
      body: SafeArea(
        child: Stack(
          children: [
            WebViewWidget(controller: _controller),
            if (_isLoading)
              const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(
                      color: Colors.pink,
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Loading Shiritori...',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.pink,
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
```

### Step 6: Configure iOS

**Edit `ios/Runner/Info.plist`:**
Add camera/microphone permissions for voice input:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access for profile pictures</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for voice typing</string>
<key>NSLocalNetworkUsageDescription</key>
<string>This app needs local network for multiplayer</string>
<key>NSBonjourServices</key>
<array>
    <string>_http._tcp</string>
</array>
```

**iOS App Transport Security (for local testing):**

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Step 7: Configure Android

**Edit `android/app/src/main/AndroidManifest.xml`:**

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    <uses-permission android:name="android.permission.BLUETOOTH"/>
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>

    <application
        android:label="Shiritori Game"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true">
        <!-- For local testing -->

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">

            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### Step 8: Test on iOS Simulator

```bash
# List available simulators
flutter emulators

# Launch simulator
flutter emulators --launch apple_ios_simulator

# Run app
flutter run
```

### Step 9: Test on Android Emulator

```bash
# Launch Android emulator from Android Studio
# Or from command line:
flutter emulators --launch Pixel_7_API_34

# Run app
flutter run
```

### Step 10: Build for Production

**iOS:**

```bash
# Build iOS app
flutter build ios --release

# Open in Xcode
open ios/Runner.xcworkspace

# In Xcode:
# 1. Select Runner > Signing & Capabilities
# 2. Select your team
# 3. Product > Archive
# 4. Distribute App > App Store Connect
```

**Android:**

```bash
# Build APK (for testing)
flutter build apk --release

# Build App Bundle (for Play Store)
flutter build appbundle --release

# Output: build/app/outputs/bundle/release/app-release.aab
```

---

## 🎨 OPTION 2: Native Flutter App (Full Rewrite)

This is a long-term project. I'll provide the architecture.

### Project Structure

```
shiritori_flutter/
├── lib/
│   ├── main.dart
│   ├── models/
│   │   ├── player_profile.dart
│   │   ├── game_state.dart
│   │   └── word.dart
│   ├── screens/
│   │   ├── home_screen.dart
│   │   ├── game_screen.dart
│   │   ├── rules_screen.dart
│   │   └── multiplayer_screen.dart
│   ├── widgets/
│   │   ├── word_input.dart
│   │   ├── voice_button.dart
│   │   └── word_history.dart
│   ├── services/
│   │   ├── firebase_service.dart
│   │   ├── ai_service.dart
│   │   └── dictionary_service.dart
│   └── utils/
│       ├── romaji_converter.dart
│       └── validators.dart
├── assets/
│   ├── images/
│   └── dictionary.json
└── pubspec.yaml
```

### Key Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter

  # State Management
  riverpod: ^2.6.1
  flutter_riverpod: ^2.6.1

  # Firebase
  firebase_core: ^3.8.1
  firebase_analytics: ^11.3.5
  firebase_auth: ^5.3.3
  firebase_database: ^11.1.7
  cloud_firestore: ^5.5.2

  # UI
  google_fonts: ^6.2.1
  flutter_animate: ^4.5.0

  # Functionality
  speech_to_text: ^7.0.0
  flutter_tts: ^4.2.0
  shared_preferences: ^2.3.3
  http: ^1.2.2
```

### Sample Game Screen (Native)

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GameScreen extends ConsumerStatefulWidget {
  const GameScreen({super.key});

  @override
  ConsumerState<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends ConsumerState<GameScreen> {
  final TextEditingController _wordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFE5E5),
      appBar: AppBar(
        title: const Text('Shiritori Game'),
        backgroundColor: Colors.pink,
      ),
      body: Column(
        children: [
          // Timer
          _buildTimer(),

          // Word History
          Expanded(
            child: _buildWordHistory(),
          ),

          // Input Area
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildTimer() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: const Text(
        '0:40',
        style: TextStyle(
          fontSize: 48,
          fontWeight: FontWeight.bold,
          color: Colors.pink,
        ),
      ),
    );
  }

  Widget _buildWordHistory() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 10,
      itemBuilder: (context, index) {
        return Card(
          child: ListTile(
            leading: CircleAvatar(
              child: Text('${index + 1}'),
            ),
            title: const Text('ねこ (neko)'),
            subtitle: const Text('cat'),
          ),
        );
      },
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
          ),
        ],
      ),
      child: Row(
        children: [
          // Voice button
          IconButton(
            icon: const Icon(Icons.mic),
            onPressed: () {
              // Voice input
            },
            color: Colors.pink,
            iconSize: 32,
          ),

          // Text input
          Expanded(
            child: TextField(
              controller: _wordController,
              decoration: const InputDecoration(
                hintText: 'Type word...',
                border: OutlineInputBorder(),
              ),
            ),
          ),

          // Submit button
          IconButton(
            icon: const Icon(Icons.send),
            onPressed: () {
              // Submit word
            },
            color: Colors.pink,
            iconSize: 32,
          ),
        ],
      ),
    );
  }
}
```

---

## 🧪 Testing Your Flutter App

### Test on iOS Simulator

```bash
# Open iOS Simulator
open -a Simulator

# Run app
flutter run
```

### Test on Android Emulator

```bash
# Start emulator
flutter emulators --launch Pixel_7_API_34

# Run app
flutter run
```

### Test on Physical Device

**iOS:**

```bash
# Connect iPhone via USB
# Trust computer on iPhone
# Run
flutter run
```

**Android:**

```bash
# Enable Developer Mode on Android
# Enable USB Debugging
# Connect via USB
# Run
flutter run
```

### Hot Reload While Developing

```bash
# Press 'r' to hot reload
# Press 'R' to hot restart
# Press 'q' to quit
```

---

## 📦 App Store Deployment

### iOS App Store

**Step 1: Apple Developer Account**

- Cost: $99/year
- Sign up: https://developer.apple.com

**Step 2: App Store Connect**

1. Create new app
2. Set app name: "Shiritori Game"
3. Bundle ID: `com.yourname.shiritori`
4. Upload screenshots
5. Write description

**Step 3: Build and Archive**

```bash
# Build iOS
flutter build ios --release

# Open Xcode
open ios/Runner.xcworkspace

# Archive and upload to App Store Connect
```

**Step 4: Submit for Review**

1. Fill app information
2. Set age rating
3. Add privacy policy
4. Submit for review
5. Wait 1-3 days for approval

### Google Play Store

**Step 1: Google Play Console**

- Cost: $25 one-time
- Sign up: https://play.google.com/console

**Step 2: Create App**

1. Create new app
2. Set app name: "Shiritori Game"
3. Upload icon
4. Write description
5. Add screenshots

**Step 3: Build App Bundle**

```bash
# Generate signing key
keytool -genkey -v -keystore ~/shiritori-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias shiritori

# Build app bundle
flutter build appbundle --release
```

**Step 4: Upload and Publish**

1. Upload AAB file
2. Create production release
3. Submit for review
4. Wait 1-3 days for approval

---

## 🎯 Recommended Approach

### Phase 1: WebView App (Week 1)

1. Create Flutter project
2. Add WebView
3. Configure Firebase
4. Test on simulators
5. Test on physical devices
6. Deploy to App Store & Play Store

**Result:** Your existing React app works on iOS/Android!

### Phase 2: Native Flutter (Weeks 2-8)

1. Build game screen natively
2. Migrate Firebase logic
3. Add voice input
4. Add local multiplayer
5. Optimize performance
6. Replace WebView version

**Result:** True native app with better performance!

---

## 🔧 Troubleshooting

### "Flutter not found"

```bash
# Add to PATH
export PATH="$PATH:$HOME/flutter/bin"
```

### "pod install failed" (iOS)

```bash
cd ios
pod repo update
pod install
cd ..
```

### "Gradle build failed" (Android)

```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
```

### WebView not loading

```bash
# Check internet connection
# Verify URL is correct
# Check iOS Info.plist permissions
# Check Android Manifest permissions
```

---

## 📱 Features Support Matrix

| Feature               | React Web          | Flutter WebView | Native Flutter  |
| --------------------- | ------------------ | --------------- | --------------- |
| **Game Logic**        | ✅                 | ✅              | ✅              |
| **Voice Input**       | ✅ (Web API)       | ✅ (Web API)    | ✅ (Native)     |
| **Local Multiplayer** | ✅ (Web Bluetooth) | ⚠️ Limited      | ✅ (Native BLE) |
| **Firebase**          | ✅                 | ✅              | ✅              |
| **Offline Mode**      | ❌                 | ❌              | ✅              |
| **Performance**       | Good               | Good            | Excellent       |
| **File Size**         | N/A                | ~50MB           | ~20MB           |
| **Development Time**  | Done               | 1-2 days        | 2-4 weeks       |

---

## 🚀 Quick Start Commands

```bash
# 1. Install Flutter
git clone https://github.com/flutter/flutter.git -b stable ~/flutter
export PATH="$PATH:$HOME/flutter/bin"

# 2. Check setup
flutter doctor

# 3. Create project
cd "/Users/m1876041/Documents/Github/Shiritori Game"
flutter create shiritori_mobile
cd shiritori_mobile

# 4. Install dependencies
flutter pub get

# 5. Configure Firebase
flutterfire configure

# 6. Run on simulator
flutter run

# 7. Build for production
flutter build ios --release  # iOS
flutter build appbundle --release  # Android
```

---

## 🎉 Summary

**Option 1 (WebView):**

- ✅ Fast setup (1-2 days)
- ✅ Use existing React app
- ✅ Deploy immediately to App Store & Play Store
- ⚠️ Requires internet

**Option 2 (Native):**

- ✅ Best performance
- ✅ Offline support
- ✅ Better user experience
- ⚠️ Takes 2-4 weeks

**My Recommendation:**

1. Start with WebView (Option 1)
2. Get on App Store & Play Store fast
3. Build native version in parallel
4. Replace WebView with native when ready

---

## 📚 Resources

**Flutter:**

- Docs: https://docs.flutter.dev
- Codelabs: https://docs.flutter.dev/codelabs
- YouTube: https://www.youtube.com/c/flutterdev

**Firebase + Flutter:**

- FlutterFire: https://firebase.flutter.dev
- Setup: https://firebase.google.com/docs/flutter/setup

**Your Project:**

- Firebase Console: https://console.firebase.google.com/project/shiritori-game-ccaae
- GitHub: https://github.com/JorelFuji/shiritori_game

がんばってください！📱✨
