# 🚀 CI/CD Setup Guide with GitHub Actions & Husky

## Overview

This project now includes:

- ✅ **Husky** - Git hooks for pre-commit validation
- ✅ **lint-staged** - Run linters on staged files only
- ✅ **ESLint** - Code linting
- ✅ **Prettier** - Code formatting
- ✅ **Vitest** - Unit testing
- ✅ **GitHub Actions** - Automated CI/CD workflows
- ✅ **2D Game** - Phaser.js powered game mode

---

## 📦 Installation

### Step 1: Install Dependencies

```bash
npm install
```

This will install all dependencies including:

- `husky` - Git hooks
- `lint-staged` - Selective linting
- `eslint` - Linting
- `prettier` - Formatting
- `vitest` - Testing
- `phaser` - 2D game engine

### Step 2: Setup Husky

```bash
npm run prepare
```

This creates the `.husky` directory and sets up git hooks.

### Step 3: Create Pre-commit Hook

Create `.husky/pre-commit` file:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

Make it executable:

```bash
chmod +x .husky/pre-commit
```

---

## 🔧 Available Commands

### Development

```bash
npm run dev              # Start development server
npm run build            # Build for production
```

### Testing

```bash
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report
```

### Code Quality

```bash
npm run lint             # Check for linting errors
npm run lint:fix         # Fix linting errors
npm run format           # Format all files
npm run format:check     # Check formatting
npm run type-check       # TypeScript type checking
```

### Validation

```bash
npm run validate         # Run all checks (type-check, lint, format, test)
```

### Deployment

```bash
npm run deploy           # Build and deploy to Firebase
npm run deploy:hosting   # Deploy only frontend
npm run deploy:firestore # Deploy Firestore rules
npm run deploy:storage   # Deploy Storage rules
```

---

## 🎯 Git Hooks (Husky)

### Pre-commit Hook

Automatically runs before every commit:

1. **ESLint** - Checks and fixes TypeScript/React code
2. **Prettier** - Formats code
3. **Type Check** - Ensures TypeScript types are correct

**Only staged files are checked** (thanks to lint-staged)!

### How It Works

When you run `git commit`:

```
1. Husky intercepts the commit
2. lint-staged runs on staged files
3. ESLint fixes issues automatically
4. Prettier formats code
5. If all pass → Commit succeeds ✅
6. If any fail → Commit blocked ❌
```

---

## 🔄 GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers**: On push/PR to `main` or `develop`

**Jobs**:

1. **Test & Lint**
   - Runs on Node 18.x and 20.x
   - Type checking
   - Linting
   - Format checking
   - Unit tests
   - Coverage report (uploaded to Codecov)

2. **Build**
   - Builds the project
   - Uploads artifacts

**Status Badge**: Add to README.md

```markdown
![CI](https://github.com/YOUR_USERNAME/shiritori_game/workflows/CI/badge.svg)
```

### Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers**: On push to `main` or manual dispatch

**Steps**:

1. Install dependencies
2. Run validation (`npm run validate`)
3. Build project
4. Deploy to Firebase Hosting
5. Deploy Firestore rules
6. Deploy Storage rules
7. Comment on PR with preview URL

---

## 🔐 GitHub Secrets Setup

### Required Secrets

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

Add these secrets:

```
FIREBASE_SERVICE_ACCOUNT
  - Get from Firebase Console → Project Settings → Service Accounts
  - Generate new private key
  - Copy entire JSON content

FIREBASE_TOKEN
  - Run: firebase login:ci
  - Copy the token

FIREBASE_PROJECT_ID
  - Your Firebase project ID (e.g., "shiritori-game-12345")

VITE_FIREBASE_API_KEY
  - From Firebase config

VITE_FIREBASE_AUTH_DOMAIN
  - From Firebase config

VITE_FIREBASE_PROJECT_ID
  - From Firebase config
```

---

## 🎮 2D Game Mode

### New Feature: Phaser.js Game

A fun 2D platformer where you collect Japanese words!

**Location**: `src/components/Game2D.tsx`

**Features**:

- Platform physics
- Japanese word collection
- Score tracking
- Particle effects
- Arrow key controls

**Access from App**:

```tsx
import Game2D from './components/Game2D';

// In your App.tsx
case "GAME_2D":
  return <Game2D onWordCollected={(word) => console.log(word)} />;
```

---

## 📊 Testing

### Test Structure

```
src/
├── lib/
│   ├── __tests__/
│   │   ├── dictionaryHelper.test.ts
│   │   └── leaderboard.test.ts
└── test/
    └── setup.ts
```

### Writing Tests

```typescript
import { describe, it, expect } from "vitest";

describe("MyComponent", () => {
  it("should work correctly", () => {
    expect(true).toBe(true);
  });
});
```

### Running Tests

```bash
npm test                  # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
```

### Coverage Report

After running `npm run test:coverage`:

- Open `coverage/index.html` in browser
- View detailed coverage metrics

---

## ✅ Pre-commit Checklist

Before committing, these checks automatically run:

- [ ] TypeScript compiles without errors
- [ ] No ESLint errors
- [ ] Code is properly formatted (Prettier)
- [ ] Staged files pass linting

**If any fail**, the commit is blocked. Fix issues and try again!

---

## 🚦 CI/CD Pipeline Flow

```
Push to Branch
    ↓
GitHub Actions Triggered
    ↓
┌─────────────────────────────┐
│  CI Workflow (Always runs)  │
├─────────────────────────────┤
│ 1. Type Check               │
│ 2. Lint                     │
│ 3. Format Check             │
│ 4. Run Tests                │
│ 5. Generate Coverage        │
│ 6. Build Project            │
└─────────────────────────────┘
    ↓
┌──────────────────────────────┐
│ Deploy Workflow (main only)  │
├──────────────────────────────┤
│ 1. Run Validation            │
│ 2. Build                     │
│ 3. Deploy to Firebase        │
│ 4. Update Firestore Rules    │
│ 5. Update Storage Rules      │
└──────────────────────────────┘
    ↓
🎉 Deployed!
```

---

## 🐛 Troubleshooting

### Husky not working

```bash
rm -rf .husky
npm run prepare
chmod +x .husky/pre-commit
```

### Tests failing

```bash
npm run test -- --reporter=verbose
```

### CI failing on GitHub

1. Check workflow runs in Actions tab
2. View detailed logs
3. Verify all secrets are set
4. Check Node version compatibility

### Build errors

```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📈 Best Practices

### 1. Commit Often

- Small, focused commits
- Descriptive commit messages
- Use conventional commits

### 2. Run Tests Locally

```bash
npm run validate
```

### 3. Check CI Before Merging

- Ensure all checks pass
- Review coverage reports
- Fix any warnings

### 4. Keep Dependencies Updated

```bash
npm outdated
npm update
```

---

## 🎯 Conventional Commits

Use semantic commit messages:

```
feat: add 2D game mode
fix: resolve leaderboard sorting issue
docs: update CI/CD guide
style: format code with prettier
refactor: simplify dictionary helper
test: add leaderboard tests
chore: update dependencies
```

---

## 🔄 Workflow Examples

### Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feature/2d-game

# Make changes
# ...

# Stage changes
git add .

# Commit (triggers Husky)
git commit -m "feat: add 2D game mode"

# Push (triggers CI)
git push origin feature/2d-game

# Create PR on GitHub
# CI runs automatically

# Merge to main (triggers Deploy)
```

### Hotfix Workflow

```bash
# Create hotfix branch
git checkout -b hotfix/critical-bug

# Fix the bug
# ...

# Commit
git commit -m "fix: resolve critical scoring bug"

# Push
git push origin hotfix/critical-bug

# Create PR, merge, deploy
```

---

## 📚 Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Vitest Documentation](https://vitest.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Phaser Documentation](https://phaser.io/docs)

---

## 🎉 You're All Set!

Your project now has:

- ✅ Automated code quality checks
- ✅ Pre-commit hooks
- ✅ Continuous integration
- ✅ Automated deployment
- ✅ 2D game mode
- ✅ Comprehensive testing

**Every commit is validated, every push is tested, and every merge to main is deployed automatically!** 🚀
