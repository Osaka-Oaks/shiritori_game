# shiritori_flutter

Independent **Flutter + Dart** build of the bilingual Shiritori game. Uses the same Firebase project as `shiritori-online` (`shiritori-game-ccaae`) — shared Realtime Database, separate Hosting site.

## Stack

| Layer            | Technology                                                    |
| ---------------- | ------------------------------------------------------------- |
| Language         | **Dart**                                                      |
| UI framework     | **Flutter** (Material 3)                                      |
| Backend          | **Firebase** — Auth (anonymous), Realtime Database            |
| Firebase project | `shiritori-game-ccaae`                                        |
| Web hosting      | https://shiritori-flutter.web.app                             |
| Web              | Primary target (`flutter run -d chrome`, `flutter build web`) |
| Mobile           | Android + iOS registered in Firebase                          |

## Firebase setup (FlutterFire)

This app is already wired to **`shiritori-game-ccaae`**. To reproduce or refresh config:

### 1. Prepare workspace

```bash
# Firebase CLI (log in once)
npm install -g firebase-tools
firebase login

# Flutter SDK — https://docs.flutter.dev/get-started/install
flutter doctor

# FlutterFire CLI
dart pub global activate flutterfire_cli
export PATH="$PATH:$HOME/.pub-cache/bin"
```

Or from repo root:

```bash
bash scripts/setup-flutterfire.sh
```

### 2. Configure FlutterFire

From `shiritori_flutter/`:

```bash
cd shiritori_flutter
flutterfire configure --project=shiritori-game-ccaae --platforms=web,android,ios
```

This registers platform apps in Firebase and writes:

| File                                  | Purpose                      |
| ------------------------------------- | ---------------------------- |
| `lib/firebase_options.dart`           | Per-platform Firebase config |
| `android/app/google-services.json`    | Android SDK config           |
| `ios/Runner/GoogleService-Info.plist` | iOS SDK config               |

**Registered apps in `shiritori-game-ccaae`:**

| Platform | App                                    | App ID                                          |
| -------- | -------------------------------------- | ----------------------------------------------- |
| Web      | Shiritori Game Web (shared with React) | `1:324507601155:web:d69804f7cf3dba96ec4136`     |
| Android  | shiritori_flutter                      | `1:324507601155:android:1e8c704834cf594fec4136` |
| iOS      | shiritori_flutter                      | `1:324507601155:ios:45bb4ebcba9ae116ec4136`     |

Web reuses the existing web app so both React and Flutter talk to the same RTDB and Auth project.

### 3. Initialize Firebase in code

Already done in `lib/main.dart`:

```dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const ShiritoriApp());
}
```

Plugins in `pubspec.yaml`: `firebase_core`, `firebase_auth`, `firebase_database`.

## Run (web)

```bash
flutter run -d chrome
```

## Build & test

```bash
flutter test
flutter analyze
flutter build web
```

## Deploy (Firebase Hosting)

Production URL: **https://shiritori-flutter.web.app**

```bash
# From repo root
npm run build:flutter
npm run deploy:flutter
```

CI deploys on push to `main` when `shiritori_flutter/` changes.

## Features

- Create / join room (same RTDB schema as React app)
- Live multiplayer with turn timer and rematch
- Solo practice vs CPU
- Anonymous Firebase auth

## Troubleshooting

| Issue                                              | Fix                                                                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `flutterfire configure` fails on iOS (`xcodeproj`) | `sudo gem install xcodeproj`, then re-run configure                                                           |
| Android build fails                                | Confirm `applicationId` is `com.shiritori.shiritori_flutter` and `google-services.json` includes that package |
| Web auth/DB errors                                 | Enable **Anonymous Auth** and **Realtime Database** in Firebase Console for `shiritori-game-ccaae`            |
