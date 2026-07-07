---
layout: default
title: Getting Started
---

# 🏁 Getting Started

Quick guide to get the Shiritori Game running locally in minutes.

---

## 📋 Prerequisites

### Required

- **Node.js** v24+ ([Download](https://nodejs.org/))
- **npm** v10.9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Firebase CLI** (`npm install -g firebase-tools`)

### Optional

- **Flutter SDK** v3.44+ (for Flutter app) - [Install Guide](https://docs.flutter.dev/get-started/install)
- **Docker** (for monitoring stack) - [Install Guide](https://docs.docker.com/get-docker/)

### Check Versions

```bash
node --version  # v24.0.0 or higher
npm --version   # 10.9.0 or higher
firebase --version
flutter --version  # If using Flutter
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Clone Repository

```bash
git clone https://github.com/JorelFuji/shiritori_game.git
cd shiritori_game
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install app dependencies
cd shiritori-online && npm install && cd ..
cd kawaii-shiritori && npm install && cd ..
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Firebase credentials
# Get credentials from: https://console.firebase.google.com/
nano .env  # or use your preferred editor
```

**Required variables:**
```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=shiritori-game-ccaae.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shiritori-game-ccaae
VITE_FIREBASE_STORAGE_BUCKET=shiritori-game-ccaae.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://shiritori-game-ccaae-default-rtdb.firebaseio.com
```

---

## 🎮 Run Applications

### React Apps

**Shiritori Online** (Realtime Database)
```bash
npm run dev:online
# Open http://localhost:5173
```

**Kawaii Shiritori** (Firestore + AI)
```bash
npm run dev:kawaii
# Open http://localhost:3000
```

### Flutter App

```bash
npm run dev:flutter
# Or: cd shiritori_flutter && flutter run -d chrome
# Opens in Chrome browser
```

---

## 🔧 Development Workflow

### Linting & Formatting

```bash
# Check code style
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

### Testing

```bash
# Run all tests
npm test

# Run tests for specific app
cd shiritori-online && npm test
cd kawaii-shiritori && npm test
```

### Building

```bash
# Build all apps
npm run build

# Build specific app
npm run build:online
npm run build:kawaii

# Build Flutter
cd shiritori_flutter && flutter build web
```

---

## 🚢 Deployment

### Firebase Hosting

```bash
# Login to Firebase
firebase login

# Deploy React app
cd shiritori-online
firebase deploy --only hosting

# Deploy Flutter app
cd shiritori_flutter
firebase deploy --only hosting
```

### CI/CD Deploy

Deployments happen automatically via GitHub Actions on push to `main` branch.

See [Deployment Guide](deployment/) for details.

---

## 🔍 Project Structure

```
shiritori_game/
├── shiritori-online/       # React app (Realtime Database)
│   ├── src/
│   ├── public/
│   └── package.json
├── kawaii-shiritori/       # React app (Firestore + AI)
│   ├── src/
│   ├── server.ts
│   └── package.json
├── shiritori_flutter/      # Flutter app
│   ├── lib/
│   ├── android/
│   ├── ios/
│   └── pubspec.yaml
├── .github/workflows/      # CI/CD pipelines
├── monitoring/             # Observability stack
├── scripts/                # Utility scripts
└── docs/                   # This documentation
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npm run port:kill:5173

# Or use the port management script
npm run port:kill:all
```

See [Port Management Guide](../PORT_MANAGEMENT_GUIDE.md) for more.

### Firebase Connection Issues

```bash
# Verify Firebase credentials
firebase projects:list

# Check .env file
cat .env | grep FIREBASE

# Test Firebase connection
cd shiritori-online && npm run dev
# Should NOT show "Missing Firebase environment variables" error
```

### Build Failures

```bash
# Clear caches
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf shiritori-online/.vite
rm -rf kawaii-shiritori/.vite
```

### Flutter Issues

```bash
# Run Flutter doctor
flutter doctor

# Clean Flutter build
cd shiritori_flutter
flutter clean
flutter pub get
```

---

## 📚 Next Steps

1. **Read the [README](../README.md)** - Understand the project
2. **Check [WIKI.md](../WIKI.md)** - Browse all documentation
3. **Review [Security Guide](security/)** - Set up CI/CD secrets
4. **Explore [Build Optimization](build/)** - Speed up builds
5. **Set up [Monitoring](monitoring/)** - Observability stack

---

## 🤝 Contributing

Ready to contribute?

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing`)
7. Open a Pull Request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## 📞 Need Help?

- **Documentation:** [Full Wiki](../WIKI.md)
- **Issues:** [GitHub Issues](https://github.com/JorelFuji/shiritori_game/issues)
- **Discussions:** [GitHub Discussions](https://github.com/JorelFuji/shiritori_game/discussions)

---

<div align="center">

**🎮 Happy Coding!**

[Back to Home](index.html) | [Security Setup](security/) | [Deployment](deployment/)

</div>
