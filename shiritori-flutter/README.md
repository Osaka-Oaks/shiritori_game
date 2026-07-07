# 🎮 Shiritori Game - Flutter Edition

Independent Flutter implementation of the Shiritori word chain game with Firebase integration.

## 🎯 Overview

**Cross-platform Shiritori game built with Flutter & Dart**

- ✅ **Web** - Primary target (webapp)
- 🚧 **iOS** - Scaffolded, ready to build
- 🚧 **Android** - Scaffolded, ready to build
- 🚧 **Desktop** - Windows, macOS, Linux support

## 🏗️ Architecture

```
shiritori-flutter/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── firebase_options.dart        # Firebase config
│   │
│   ├── core/                        # Core infrastructure
│   │   ├── constants/               # App constants
│   │   ├── theme/                   # App theming
│   │   └── utils/                   # Utilities
│   │
│   ├── data/                        # Data layer
│   │   ├── models/                  # Data models
│   │   ├── repositories/            # Data repositories
│   │   └── services/                # API/Firebase services
│   │
│   ├── domain/                      # Business logic layer
│   │   ├── entities/                # Domain entities
│   │   ├── repositories/            # Repository interfaces
│   │   └── usecases/                # Business logic
│   │
│   ├── presentation/                # UI layer
│   │   ├── screens/                 # App screens
│   │   ├── widgets/                 # Reusable widgets
│   │   └── providers/               # State management
│   │
│   └── features/                    # Feature modules
│       ├── game/                    # Game feature
│       ├── dictionary/              # Dictionary feature
│       ├── leaderboard/             # Leaderboard feature
│       └── history/                 # Game history
│
├── assets/                          # Static assets
│   ├── images/
│   ├── sounds/
│   └── fonts/
│
├── test/                            # Unit tests
├── integration_test/                # Integration tests
│
├── web/                             # Web-specific files
├── android/                         # Android-specific files
├── ios/                             # iOS-specific files
├── macos/                           # macOS-specific files
├── windows/                         # Windows-specific files
└── linux/                           # Linux-specific files
```

## 🚀 Quick Start

### Prerequisites

```bash
# Install Flutter SDK
# Download from: https://flutter.dev/docs/get-started/install

# Verify installation
flutter doctor

# Install Firebase CLI
npm install -g firebase-tools
firebase login

# Install FlutterFire CLI
dart pub global activate flutterfire_cli
```

### Setup Project

```bash
# Navigate to Flutter project
cd shiritori-flutter

# Get dependencies
flutter pub get

# Configure Firebase
flutterfire configure --project=shiritori-game-ccaae

# Run on web
flutter run -d chrome

# Build for web (production)
flutter build web --wasm

# Build for mobile
flutter build apk                    # Android
flutter build ios                    # iOS (needs macOS)
```

## 📦 Dependencies

```yaml
# State Management
flutter_riverpod: ^2.4.0            # Modern state management

# Firebase
firebase_core: ^2.24.0               # Firebase core
firebase_auth: ^4.15.0               # Authentication
cloud_firestore: ^4.13.0             # Firestore database
firebase_analytics: ^10.7.0          # Analytics

# UI Components
google_fonts: ^6.1.0                 # Custom fonts
flutter_animate: ^4.3.0              # Animations
shimmer: ^3.0.0                      # Loading effects

# Game Logic
collection: ^1.18.0                  # Collection utilities
uuid: ^4.2.0                         # Unique IDs

# Audio
audioplayers: ^5.2.0                 # Sound effects

# Storage
shared_preferences: ^2.2.0           # Local storage
```

## 🎮 Features

### Core Game
- ✅ **Word validation** - Japanese word chain rules
- ✅ **Dictionary lookup** - Jisho.org API integration
- ✅ **Turn-based gameplay** - Player vs AI
- ✅ **Score tracking** - Points and streaks
- ✅ **Timer** - Optional time limits

### Firebase Integration
- ✅ **Authentication** - Anonymous & Google Sign-In
- ✅ **Firestore** - Game state persistence
- ✅ **Realtime Database** - Live multiplayer (optional)
- ✅ **Leaderboard** - Global rankings
- ✅ **Analytics** - Usage tracking

### UI Features
- ✅ **Material Design 3** - Modern UI
- ✅ **Responsive** - Works on all screen sizes
- ✅ **Animations** - Smooth transitions
- ✅ **Dark mode** - Theme support
- ✅ **Accessibility** - Screen reader support

## 🎨 Design System

### Colors
```dart
Primary: #6750A4      // Purple
Secondary: #625B71    // Gray-purple
Tertiary: #7D5260     // Mauve
Error: #B3261E        // Red
Success: #4CAF50      // Green
```

### Typography
- **Headline:** Noto Sans Japanese
- **Body:** Roboto
- **Monospace:** Roboto Mono

## 🧪 Testing

```bash
# Unit tests
flutter test

# Integration tests
flutter test integration_test/

# Test coverage
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
```

## 📱 Platform-Specific Setup

### Web
```bash
flutter build web --wasm
firebase deploy --only hosting
```

### Android
```bash
flutter build apk --release
flutter build appbundle --release
```

### iOS
```bash
flutter build ios --release
open ios/Runner.xcworkspace
```

### Desktop
```bash
flutter build windows           # Windows
flutter build macos             # macOS
flutter build linux             # Linux
```

## 🔥 Firebase Configuration

### Project Details
- **Project ID:** `shiritori-game-ccaae`
- **Web URL:** `https://shiritori-game-ccaae.web.app`
- **Database URL:** `https://shiritori-game-ccaae-default-rtdb.firebaseio.com`

### Firestore Collections
```
/users/{userId}
  - displayName: string
  - createdAt: timestamp
  - stats: map

/games/{gameId}
  - players: array
  - words: array
  - status: string
  - createdAt: timestamp

/leaderboard/{userId}
  - score: number
  - wins: number
  - updatedAt: timestamp
```

## 🎯 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-game-mode

# Develop with hot reload
flutter run -d chrome

# Test changes
flutter test

# Commit
git commit -m "feat(game): add new game mode"
```

### 2. State Management Pattern
```dart
// 1. Define model
class GameState {
  final List<String> words;
  final int score;
  
  GameState({required this.words, required this.score});
}

// 2. Create provider
final gameProvider = StateNotifierProvider<GameNotifier, GameState>((ref) {
  return GameNotifier();
});

// 3. Use in widget
class GameScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final game = ref.watch(gameProvider);
    return Text('Score: ${game.score}');
  }
}
```

### 3. Firebase Integration
```dart
// Initialize Firebase
await Firebase.initializeApp(
  options: DefaultFirebaseOptions.currentPlatform,
);

// Use Firestore
final db = FirebaseFirestore.instance;
await db.collection('games').add({
  'words': ['りんご', 'ごりら'],
  'score': 100,
});
```

## 📊 Performance Tips

### Web Optimization
```bash
# Build with WebAssembly
flutter build web --wasm

# Enable tree shaking
flutter build web --tree-shake-icons

# Analyze bundle size
flutter build web --analyze-size
```

### Code Splitting
```dart
// Lazy load screens
import 'package:flutter/material.dart' deferred as material;

// Load when needed
await material.loadLibrary();
```

## 🐛 Troubleshooting

### Issue: Firebase not initializing
```bash
# Reconfigure Firebase
flutterfire configure --project=shiritori-game-ccaae
```

### Issue: Web build fails
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter build web
```

### Issue: Hot reload not working
```bash
# Restart with clean
flutter run --hot
```

## 📚 Resources

### Flutter
- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- [Flutter Packages](https://pub.dev)

### Firebase
- [FlutterFire Documentation](https://firebase.flutter.dev)
- [Firebase Console](https://console.firebase.google.com/project/shiritori-game-ccaae)

### Learning
- [Flutter Codelabs](https://flutter.dev/docs/codelabs)
- [Dart Cheatsheet](https://dart.dev/codelabs/dart-cheatsheet)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow architecture patterns
4. Write tests
5. Submit PR

## 📄 License

MIT License - See LICENSE file

---

**🎮 Built with Flutter & ❤️ for Japanese language learners!**

*Last updated: July 2026*  
*Version: 1.0.0*  
*Status: 🚀 Ready for Development*
