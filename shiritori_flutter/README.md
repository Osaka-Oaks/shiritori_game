# shiritori_flutter

Independent **Flutter + Dart** build of the bilingual Shiritori game. Shares the same Firebase project (`shiritori-game-ccaae`) and Realtime Database as `shiritori-online`, but is a separate codebase.

## Stack

| Layer | Technology |
|-------|------------|
| Language | **Dart** |
| UI framework | **Flutter** (Material 3) |
| Backend | **Firebase** — Auth (anonymous), Realtime Database |
| Web | Primary target (`flutter run -d chrome`, `flutter build web`) |
| Mobile | Android + iOS scaffolded (FlutterFire registered) |
| Desktop | macOS / Windows / Linux folders present; Firebase not configured yet |

## Setup (one-time)

```bash
dart pub global activate flutterfire_cli
export PATH="$PATH:$HOME/.pub-cache/bin"
cd shiritori_flutter
flutterfire configure --project=shiritori-game-ccaae --platforms=web,android,ios
flutter pub get
```

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

# Or manually
cd shiritori_flutter
flutter build web
npx firebase-tools deploy --only hosting --project shiritori-game-ccaae
```

CI deploys automatically on push to `main` when `shiritori_flutter/` changes. Post-deploy verification runs in the **Deployment verify & record** job and writes timestamps to `.github/deployments.jsonl`.

## Features

- Create / join room (same RTDB schema as React app)
- Live multiplayer with turn timer and rematch
- Solo practice vs CPU
- Anonymous Firebase auth
