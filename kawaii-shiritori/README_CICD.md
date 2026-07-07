# 🚀 Shiritori Game - CI/CD Edition

![CI](https://github.com/YOUR_USERNAME/shiritori_game/workflows/CI/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/shiritori_game/workflows/Deploy%20to%20Firebase/badge.svg)

## 🎮 What's New

### 🔄 Continuous Integration & Deployment

- **Automated testing** on every push
- **Code quality checks** before every commit
- **Automatic deployment** to Firebase on merge to main
- **Pre-commit hooks** with Husky
- **Conventional commits** enforcement

### 🎯 2D Game Mode

- Interactive Phaser.js powered game
- Collect Japanese words as they fall
- Platform physics and particle effects
- Keyboard controls (Arrow keys)

### 🏆 Enhanced Leaderboard

- Cloud-based score persistence
- Real-time global rankings
- Advanced statistics tracking
- Game history with Firebase

### 🈯 ON-YOMI Readings

- Comprehensive kanji readings
- Educational Japanese learning
- 550+ vocabulary words

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/shiritori_game.git
cd shiritori_game/kawaii-shiritori
npm install
```

### 2. Setup CI/CD

```bash
chmod +x setup-cicd.sh
./setup-cicd.sh
```

This script will:

- ✅ Install all dependencies
- ✅ Setup Husky git hooks
- ✅ Configure pre-commit checks
- ✅ Run initial validation
- ✅ Create commit message validation

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## 📋 Available Commands

### Development

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
```

### Testing

```bash
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:ui          # Interactive UI
npm run test:coverage    # Coverage report
```

### Code Quality

```bash
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues
npm run format           # Format all files
npm run format:check     # Check formatting
npm run type-check       # TypeScript check
npm run validate         # Run all checks
```

### Deployment

```bash
npm run deploy           # Deploy everything
npm run deploy:hosting   # Deploy frontend only
npm run deploy:firestore # Deploy Firestore rules
npm run deploy:storage   # Deploy Storage rules
```

---

## 🔧 Tech Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Motion** - Animations
- **Phaser 3** - 2D game engine

### Backend & Services

- **Firebase Hosting** - Static hosting
- **Firestore** - Database
- **Firebase Storage** - File storage
- **Firebase Analytics** - Analytics
- **Express** - API server

### Development Tools

- **Vitest** - Unit testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Staged file linting

### CI/CD

- **GitHub Actions** - Automation
- **Firebase CLI** - Deployment
- **Codecov** - Coverage reports

---

## 🎮 Game Modes

### 1. Classic Shiritori

Traditional word chain game against AI opponents

### 2. Practice Mode

Learn Japanese vocabulary at your own pace

### 3. 2D Platformer (NEW!)

Collect falling Japanese words in a fun platformer

### 4. Multiplayer

Play with friends locally or online

---

## 📊 Testing

### Unit Tests

```bash
npm test
```

Tests cover:

- Dictionary helper functions
- Leaderboard calculations
- Word validation
- Score computation

### Coverage Report

```bash
npm run test:coverage
open coverage/index.html
```

---

## 🔐 Environment Setup

### Local Development

Create `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### GitHub Secrets

Required for CI/CD:

- `FIREBASE_SERVICE_ACCOUNT` - Service account JSON
- `FIREBASE_TOKEN` - CI token from `firebase login:ci`
- `FIREBASE_PROJECT_ID` - Your project ID
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Auth domain
- `VITE_FIREBASE_PROJECT_ID` - Project ID

---

## 🔄 Git Workflow

### Conventional Commits

Format: `<type>(<scope>): <subject>`

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**

```bash
git commit -m "feat(game): add 2D platformer mode"
git commit -m "fix(leaderboard): resolve sorting bug"
git commit -m "docs(readme): update setup guide"
```

### Pre-commit Checks

Automatically runs on `git commit`:

1. ESLint checks and auto-fixes
2. Prettier formatting
3. TypeScript type checking

### Workflow

```bash
# Create branch
git checkout -b feature/amazing-feature

# Make changes
# ...

# Commit (triggers Husky)
git commit -m "feat: add amazing feature"

# Push (triggers CI)
git push origin feature/amazing-feature

# Create PR on GitHub
# CI runs automatically
# Merge to main triggers deployment
```

---

## 📈 CI/CD Pipeline

### On Push/PR

```
1. Type Check → ESLint → Prettier → Tests
2. Build Project
3. Upload Artifacts
4. Generate Coverage
```

### On Merge to Main

```
1. Run Full Validation
2. Build Production
3. Deploy to Firebase
4. Update Firestore Rules
5. Update Storage Rules
```

---

## 📚 Documentation

- **[CICD_SETUP_GUIDE.md](./CICD_SETUP_GUIDE.md)** - Complete CI/CD setup
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Firebase deployment
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Quick start guide
- **[NEW_FEATURES_SUMMARY.md](./NEW_FEATURES_SUMMARY.md)** - Feature overview

---

## 🎯 Features

### Core Gameplay

- ✅ 550+ Japanese vocabulary words
- ✅ Hiragana, Katakana, and Kanji support
- ✅ ON-YOMI readings for educational purposes
- ✅ Pokemon and Ninja Turtle themed characters
- ✅ Multiple difficulty levels (Easy, Medium, Hard)

### Game Modes

- ✅ Classic Shiritori vs AI
- ✅ Practice Mode
- ✅ 2D Platformer Game
- ✅ Local Multiplayer
- ✅ Online Multiplayer (coming soon)

### Technical Features

- ✅ Firebase Cloud Persistence
- ✅ Real-time Leaderboards
- ✅ Game Statistics Tracking
- ✅ Responsive Design
- ✅ PWA Support
- ✅ Analytics Integration

### DevOps

- ✅ Automated Testing (Vitest)
- ✅ Code Quality (ESLint + Prettier)
- ✅ Git Hooks (Husky)
- ✅ CI/CD (GitHub Actions)
- ✅ Automated Deployment (Firebase)
- ✅ Code Coverage Tracking

---

## 🐛 Troubleshooting

### Husky Not Working

```bash
rm -rf .husky
npm run prepare
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Tests Failing

```bash
npm run test -- --reporter=verbose
```

### Build Errors

```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CI Failing on GitHub

1. Check Actions tab for detailed logs
2. Verify all secrets are configured
3. Ensure Node version matches (18.x or 20.x)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Note:** All commits must pass pre-commit hooks and CI checks!

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎉 Credits

- **Phaser.js** - 2D game engine
- **Firebase** - Backend services
- **React** - UI framework
- **Vite** - Build tool
- **Vitest** - Testing framework

---

## 📞 Support

For issues or questions:

- Open an issue on GitHub
- Check documentation in `/docs`
- Review workflow logs in Actions tab

---

**Built with ❤️ for Japanese language learners and game enthusiasts!**

🎮 **Play · Learn · Compete** 🏆
