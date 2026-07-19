#!/usr/bin/env bash
# One-time FlutterFire setup for shiritori_flutter → shiritori-game-ccaae
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="$ROOT/shiritori_flutter"

echo "==> FlutterFire setup (project: shiritori-game-ccaae)"
echo ""

command -v firebase >/dev/null || {
  echo "Install Firebase CLI: npm install -g firebase-tools && firebase login"
  exit 1
}

command -v flutter >/dev/null || {
  echo "Install Flutter SDK: https://docs.flutter.dev/get-started/install"
  exit 1
}

export PATH="$PATH:$HOME/.pub-cache/bin"
dart pub global activate flutterfire_cli

cd "$APP_DIR"
flutter pub get

# Web + Android always; iOS needs Ruby xcodeproj gem on macOS
PLATFORMS="web,android"
if [[ "$(uname -s)" == "Darwin" ]]; then
  if gem list xcodeproj -i >/dev/null 2>&1; then
    PLATFORMS="web,android,ios"
  else
    echo "Tip: for iOS run: sudo gem install xcodeproj"
    echo "     then re-run with: flutterfire configure --project=shiritori-game-ccaae --platforms=web,android,ios --yes"
  fi
fi

flutterfire configure \
  --project=shiritori-game-ccaae \
  --platforms="$PLATFORMS" \
  --yes || {
  echo ""
  echo "FlutterFire finished with warnings (often iOS xcodeproj on macOS)."
  echo "Web/Android config in lib/firebase_options.dart is usually still valid."
}

echo ""
echo "==> Verify"
flutter analyze lib test
flutter test
flutter build web --release

echo ""
echo "Done. Firebase project: shiritori-game-ccaae"
echo "  Web RTDB:  https://shiritori-game-ccaae-default-rtdb.firebaseio.com"
echo "  Hosting:   https://shiritori-flutter.web.app"
echo "  Run local: flutter run -d chrome"
