# Flutter Shiritori - Setup & Testing Guide

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd shiritori_flutter
flutter pub get
```

### 2. Generate Code (if needed)

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### 3. Run the App

```bash
# Web
flutter run -d chrome

# macOS
flutter run -d macos

# Android
flutter run

# iOS
flutter run -d ios
```

## 🎮 Features Added

### 2D Game (Flame Engine)
- ✅ Falling word bubble game
- ✅ Player-controlled paddle
- ✅ Shiritori rule validation
- ✅ Score tracking
- ✅ Particle effects
- ✅ Collision detection

### 3D Visualization
- ✅ 3D word chain visualization
- ✅ Rotating camera effect
- ✅ Interactive word selection
- ✅ Smooth animations
- ✅ Depth effects

### Material 3 Design
- ✅ Modern UI components
- ✅ Dynamic color scheme
- ✅ Light & dark themes
- ✅ Adaptive layouts
- ✅ Smooth transitions

### Architecture
- ✅ Riverpod state management
- ✅ Go Router navigation
- ✅ Clean architecture setup
- ✅ Feature-based structure

## 🧪 Running Tests

### Unit Tests
```bash
flutter test
```

### With Coverage
```bash
flutter test --coverage
```

### Specific Test
```bash
flutter test test/game_2d/shiritori_rules_test.dart
```

### Integration Tests
```bash
flutter test integration_test/
```

## 🎨 Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home screen with game mode selection |
| `/game-2d` | 2D Flame game (catch falling words) |
| `/game-3d` | 3D word chain visualization |
| `/solo` | Classic solo game |
| `/room/:id` | Multiplayer game room |

## 📱 Platform Support

### Tested Platforms
- ✅ Web (Chrome, Safari, Firefox)
- ✅ macOS
- ✅ Android
- ✅ iOS (requires Xcode)
- ✅ Windows (requires setup)
- ✅ Linux (requires setup)

### Build Commands

```bash
# Web
flutter build web --release

# Android APK
flutter build apk --release

# Android App Bundle
flutter build appbundle --release

# iOS
flutter build ios --release

# macOS
flutter build macos --release

# Windows
flutter build windows --release

# Linux
flutter build linux --release
```

## 🔧 Troubleshooting

### Issue: Package conflicts
```bash
flutter pub get --no-example
flutter pub upgrade
```

### Issue: Build runner errors
```bash
flutter pub run build_runner clean
flutter pub run build_runner build --delete-conflicting-outputs
```

### Issue: Firebase not initialized
- Check `firebase_options.dart` exists
- Verify Firebase configuration
- Run `flutterfire configure`

### Issue: Missing assets
```bash
mkdir -p assets/{images,audio,lottie,models}
```

## 🎯 Game Controls

### 2D Game
- **Tap/Click** - Move paddle
- **Drag** - Continuous movement
- **Catch Blue Bubbles** - Valid shiritori words (+10 points)
- **Avoid Red Bubbles** - Invalid words (-5 points)

### 3D Visualization
- **Rotate** - Auto-rotating camera
- **Tap Word** - Select word in chain
- **Scroll List** - Browse words

## 📊 Performance Tips

### Optimize Build
```bash
flutter build --release --split-debug-info=debug-info --obfuscate
```

### Profile Performance
```bash
flutter run --profile
```

### Analyze App Size
```bash
flutter build apk --analyze-size
```

## 🚀 Deployment

### Firebase Hosting (Web)
```bash
flutter build web --release
firebase deploy --only hosting
```

### Google Play Store (Android)
```bash
flutter build appbundle --release
# Upload to Google Play Console
```

### App Store (iOS)
```bash
flutter build ios --release
# Use Xcode to upload to App Store Connect
```

## 📦 Asset Setup

### Required Assets
```
assets/
├── images/
│   └── (placeholder images for now)
├── audio/
│   └── (sound effects - optional)
├── lottie/
│   └── (animations - optional)
└── models/
    └── (3D models - optional)
```

## 🔥 Firebase Integration

### Current Firebase Services
- ✅ Authentication (Anonymous)
- ✅ Realtime Database
- ✅ Firestore (new)
- ✅ Analytics (new)
- ✅ Crashlytics (new)
- ✅ Performance Monitoring (new)

### Firebase Setup
```bash
# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Firebase
flutterfire configure
```

## 🧪 Test Coverage

### Current Tests
- ✅ Shiritori rules validation
- ✅ Word chain logic
- ⚠️ Widget tests (to be added)
- ⚠️ Integration tests (to be added)

### Adding More Tests

#### Widget Test Example
```dart
testWidgets('Game2D screen shows score', (tester) async {
  await tester.pumpWidget(
    const MaterialApp(home: Game2DScreen()),
  );
  expect(find.text('Score: 0'), findsOneWidget);
});
```

#### Integration Test Example
```dart
testWidgets('Complete game flow', (tester) async {
  // Start app
  await tester.pumpWidget(MyApp());
  
  // Navigate to 2D game
  await tester.tap(find.text('2D Game'));
  await tester.pumpAndSettle();
  
  // Verify game screen
  expect(find.byType(GameWidget), findsOneWidget);
});
```

## 📝 Next Steps

### Recommended Enhancements
1. **Add more word banks** - Expand vocabulary
2. **Sound effects** - Add audio feedback
3. **Achievements** - Track player progress
4. **Leaderboards** - Global rankings
5. **Power-ups** - Special abilities
6. **More game modes** - Puzzle, timed, etc.
7. **Multiplayer** - Real-time online play
8. **Localization** - Multi-language support

### Code Quality
1. **Add more tests** - Increase coverage to 80%+
2. **Lint fixes** - Run `flutter analyze`
3. **Performance** - Profile and optimize
4. **Documentation** - Add inline docs

## 🎓 Learning Resources

### Flutter
- [Flutter Documentation](https://docs.flutter.dev)
- [Flutter Cookbook](https://docs.flutter.dev/cookbook)
- [Material 3 Guidelines](https://m3.material.io)

### Flame Engine
- [Flame Documentation](https://docs.flame-engine.org)
- [Flame Examples](https://examples.flame-engine.org)

### Riverpod
- [Riverpod Documentation](https://riverpod.dev)
- [Go Router Guide](https://pub.dev/packages/go_router)

## ✅ Checklist

- [x] Flutter dependencies installed
- [x] 2D game implemented with Flame
- [x] 3D visualization created
- [x] Material 3 theme applied
- [x] Riverpod state management
- [x] Go Router navigation
- [x] Basic tests written
- [ ] Additional tests needed
- [ ] Sound effects
- [ ] More game modes
- [ ] Complete multiplayer
- [ ] Deployment to stores

---

**Ready to play! Run `flutter run` to start the app.** 🎮
