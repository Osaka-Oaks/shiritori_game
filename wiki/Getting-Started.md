# 🏁 Getting Started

Quick guide to set up and run the Shiritori Game project locally.

---

## 📋 Prerequisites

### Required Software

- **Node.js** v24+ - [Download](https://nodejs.org/)
- **npm** v10.9+ (included with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Firebase CLI** - Install with `npm install -g firebase-tools`

### Optional Software

- **Flutter SDK** v3.44+ (for Flutter app) - [Install Guide](https://docs.flutter.dev/get-started/install)
- **Docker Desktop** (for monitoring stack) - [Install Guide](https://docs.docker.com/get-docker/)
- **VS Code** or your preferred IDE

### Verify Installation

```bash
node --version  # Should show v24.x.x
npm --version   # Should show 10.9.x or higher
git --version
firebase --version
flutter --version  # If using Flutter
```

---

## 🚀 Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/JorelFuji/shiritori_game.git
cd shiritori_game
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install app-specific dependencies
cd shiritori-online && npm install && cd ..
cd kawaii-shiritori && npm install && cd ..
cd shiritori-word-chain && npm install && cd ..
```

### Step 3: Configure Firebase

**Get Firebase credentials:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `shiritori-game-ccaae`
3. Click ⚙️ Settings → Project settings
4. Scroll to "Your apps" → Web app
5. Copy the config values

**Create environment file:**

```bash
# Copy template
cp .env.example .env

# Edit with your Firebase credentials
nano .env  # or code .env in VS Code
```

**Required variables:**

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=shiritori-game-ccaae.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://shiritori-game-ccaae-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=shiritori-game-ccaae
VITE_FIREBASE_STORAGE_BUCKET=shiritori-game-ccaae.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Per-app configs (optional):**

```bash
# Each app can have its own .env
cp shiritori-online/.env.example shiritori-online/.env
cp kawaii-shiritori/.env.example kawaii-shiritori/.env
```

---

## 🎮 Running Applications

### React App: Shiritori Online

```bash
npm run dev:online
```

Opens at: **http://localhost:5173**

Features:
- Realtime Database backend
- WebSocket multiplayer
- Room-based gameplay

### React App: Kawaii Shiritori

```bash
npm run dev:kawaii
```

Opens at: **http://localhost:3000**

Features:
- Firestore backend
- AI opponent (Gemini/Ollama)
- Advanced caching

### Flutter App

```bash
npm run dev:flutter
# Or manually: cd shiritori_flutter && flutter run -d chrome
```

Opens in Chrome browser

Features:
- Cross-platform (Web, iOS, Android)
- Native performance
- Material Design UI

---

## 🔧 Development Commands

### Code Quality

```bash
# Lint check
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
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

# Build specific apps
npm run build:online
npm run build:kawaii

# Build Flutter
cd shiritori_flutter
flutter build web --release
```

### Monitoring

```bash
# Start ELK stack (Docker required)
npm run monitor:elk:start

# Stop ELK stack
npm run monitor:elk:stop

# View logs
npm run monitor:elk:logs
```

---

## 🐛 Common Issues

### Issue: Port Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**

```bash
# Kill process on port 5173
npm run port:kill:5173

# Or kill all common ports
npm run port:kill:all
```

### Issue: Missing Firebase Environment Variables

**Error:** `Missing Firebase environment variables: VITE_FIREBASE_API_KEY`

**Solution:**

1. Check `.env` file exists
2. Verify all `VITE_FIREBASE_*` variables are set
3. Restart dev server

```bash
# Check env file
cat .env | grep FIREBASE

# If missing, copy template
cp .env.example .env
# Then edit with real values
```

### Issue: Firebase Connection Failure

**Error:** `Firebase: Error (auth/invalid-api-key)`

**Solution:**

1. Verify API key is correct (copy from Firebase Console)
2. Check project ID matches: `shiritori-game-ccaae`
3. Ensure Firebase Security Rules allow access

### Issue: npm install Failures

**Error:** Various npm errors

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json
rm -rf */node_modules */package-lock.json

# Reinstall
npm install
```

### Issue: Flutter Doctor Warnings

**Error:** Flutter doctor shows warnings

**Solution:**

```bash
# Run doctor
flutter doctor

# Accept licenses (Android)
flutter doctor --android-licenses

# Install missing components as shown
```

---

## 📚 Next Steps

Once you have the project running:

1. **Explore the codebase** - Understand the architecture
2. **Read [Security Setup](Security-Setup)** - Configure CI/CD secrets
3. **Check [Deployment](Deployment)** - Learn how to deploy
4. **Review [Contributing](Contributing)** - Contribution guidelines
5. **Visit [Documentation Site](https://jorelfuji.github.io/shiritori_game)** - Full guides

---

## 🔗 Useful Links

- [README](https://github.com/JorelFuji/shiritori_game/blob/main/README.md) - Project overview
- [WIKI Home](Home) - Wiki homepage
- [Documentation Site](https://jorelfuji.github.io/shiritori_game) - Full documentation
- [Firebase Console](https://console.firebase.google.com/project/shiritori-game-ccaae) - Firebase dashboard

---

## 📞 Need Help?

- **Documentation:** [Full documentation site](https://jorelfuji.github.io/shiritori_game)
- **Issues:** [GitHub Issues](https://github.com/JorelFuji/shiritori_game/issues)
- **Discussions:** [GitHub Discussions](https://github.com/JorelFuji/shiritori_game/discussions)

---

**Ready to contribute?** See [Contributing Guide](Contributing)

**Ready to deploy?** See [Deployment Guide](Deployment)
