## 🔄 Migration to Monorepo - Step-by-Step Guide

This guide will help you migrate from the current monolithic structure to a modular monorepo.

---

## 📋 Pre-Migration Checklist

- [ ] Backup your current code: `git commit -am "Backup before monorepo migration"`
- [ ] Create migration branch: `git checkout -b migrate/monorepo`
- [ ] Install PNPM: `npm install -g pnpm`
- [ ] Review package dependencies
- [ ] Note current working features

---

## 🚀 Migration Steps

### Phase 1: Setup Monorepo Structure (30 min)

#### 1. Create Package Directories

```bash
mkdir -p packages/{shared,core,ui,firebase,game-2d,app}
```

#### 2. Initialize PNPM Workspaces

Already created: `pnpm-workspace.yaml`

#### 3. Create Package.json for Each Package

Run this script to create initial package.json files:

```bash
#!/bin/bash
# create-package-jsons.sh

PACKAGES=("shared" "core" "ui" "firebase" "game-2d" "app")

for pkg in "${PACKAGES[@]}"; do
  cat > "packages/$pkg/package.json" <<EOF
{
  "name": "@shiritori/$pkg",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext ts,tsx",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
EOF

  # Create basic tsconfig.json
  cat > "packages/$pkg/tsconfig.json" <<EOF
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF

  # Create src directory
  mkdir -p "packages/$pkg/src"
  mkdir -p "packages/$pkg/tests"

  echo "✅ Created @shiritori/$pkg"
done
```

---

### Phase 2: Move Code to Packages (1-2 hours)

#### Package: @shiritori/shared

**Purpose:** Shared utilities, types, constants

**Move these files:**

```bash
# Types
mv src/types.ts packages/shared/src/types/

# Logger (already created)
# packages/shared/src/logger/index.ts ✅

# Constants
mkdir -p packages/shared/src/constants
# Move any constants

# Utilities
mkdir -p packages/shared/src/utils
# Move utility functions
```

#### Package: @shiritori/core

**Purpose:** Game logic, dictionary, validation

**Move these files:**

```bash
# Dictionary
mv src/lib/dictionaryHelper.ts packages/core/src/dictionary/
mv src/lib/multiDictionary.ts packages/core/src/dictionary/
mv src/lib/kanjiDictionary.ts packages/core/src/dictionary/
mv src/lib/wordValidator.ts packages/core/src/validation/
mv src/data/dictionary.json packages/core/src/data/

# Tests
mv src/lib/__tests__/dictionaryHelper.test.ts packages/core/tests/dictionary/
mv src/lib/__tests__/wordValidator.test.ts packages/core/tests/validation/
mv src/lib/__tests__/leaderboard.test.ts packages/core/tests/
```

**Create index.ts:**

```typescript
// packages/core/src/index.ts
export * from "./dictionary/dictionaryHelper";
export * from "./dictionary/multiDictionary";
export * from "./dictionary/kanjiDictionary";
export * from "./validation/wordValidator";
```

#### Package: @shiritori/firebase

**Purpose:** Firebase services

**Move these files:**

```bash
# Firebase
mv src/lib/firebase.ts packages/firebase/src/
mv src/lib/leaderboard.ts packages/firebase/src/
mv src/lib/firebase-applet-config.json packages/firebase/src/
mv firebase.json packages/firebase/
mv firestore.rules packages/firebase/
mv firestore.indexes.json packages/firebase/
mv storage.rules packages/firebase/
```

**Create index.ts:**

```typescript
// packages/firebase/src/index.ts
export * from "./firebase";
export * from "./leaderboard";
```

#### Package: @shiritori/ui

**Purpose:** React components

**Move these files:**

```bash
# Components
mv src/components/ packages/ui/src/

# Create index.ts
cat > packages/ui/src/index.ts <<EOF
export * from './components/HomeView';
export * from './components/GameRoomView';
export * from './components/AvatarPickerView';
export * from './components/HistoryView';
export * from './components/LibraryView';
export * from './components/LeaderboardView';
export * from './components/EnhancedRulesView';
export * from './components/PracticeModeView';
export * from './components/MultiplayerView';
export * from './components/LocalMultiplayerView';
export * from './components/UnityGameView';
EOF
```

#### Package: @shiritori/game-2d

**Purpose:** 2D Phaser game

**Move these files:**

```bash
# Game 2D
mv src/components/Game2D.tsx packages/game-2d/src/

# Create index.ts
cat > packages/game-2d/src/index.ts <<EOF
export { default as Game2D } from './Game2D';
EOF
```

#### Package: @shiritori/app

**Purpose:** Main application

**Move these files:**

```bash
# Main app files
mv src/App.tsx packages/app/src/
mv src/main.tsx packages/app/src/
mv index.html packages/app/
mv public/ packages/app/
mv vite.config.ts packages/app/
```

**Update imports in App.tsx:**

```typescript
// packages/app/src/App.tsx
import { HomeView, GameRoomView /* ... */ } from "@shiritori/ui";
import { Game2D } from "@shiritori/game-2d";
import { leaderboard, auth } from "@shiritori/firebase";
import { wordValidator } from "@shiritori/core";
import type { AppView, PlayerProfile } from "@shiritori/shared";
```

---

### Phase 3: Update Dependencies (30 min)

#### 1. Update Root package.json

```json
{
  "name": "shiritori-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "pnpm --filter @shiritori/app dev",
    "build:all": "pnpm -r build",
    "test:all": "pnpm -r test",
    "lint:all": "pnpm -r lint",
    "typecheck:all": "pnpm -r typecheck",
    "clean:all": "pnpm -r clean",
    "debug:core": "./tools/scripts/debug-module.sh core",
    "debug:ui": "./tools/scripts/debug-module.sh ui",
    "check:all": "./tools/scripts/check-all-modules.sh"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3"
  }
}
```

#### 2. Add Workspace Dependencies

```bash
# Add core to ui
pnpm --filter @shiritori/ui add @shiritori/core@workspace:* @shiritori/shared@workspace:*

# Add core to game-2d
pnpm --filter @shiritori/game-2d add @shiritori/core@workspace:* @shiritori/shared@workspace:*

# Add shared to firebase
pnpm --filter @shiritori/firebase add @shiritori/shared@workspace:*

# Add all to app
pnpm --filter @shiritori/app add @shiritori/core@workspace:* @shiritori/ui@workspace:* @shiritori/firebase@workspace:* @shiritori/game-2d@workspace:* @shiritori/shared@workspace:*
```

#### 3. Install Dependencies

```bash
pnpm install
```

---

### Phase 4: Update CI/CD (15 min)

CI workflows are already created in `.github/workflows/`:

- ✅ `ci-core.yml`
- ✅ `ci-ui.yml`
- ✅ `ci-firebase.yml`
- ✅ `ci-status.yml`

Create remaining workflows:

```bash
# Copy ci-core.yml template for game-2d
cp .github/workflows/ci-core.yml .github/workflows/ci-game2d.yml
# Edit and replace "core" with "game-2d"

# Copy for shared
cp .github/workflows/ci-core.yml .github/workflows/ci-shared.yml
# Edit and replace "core" with "shared"

# Copy for app
cp .github/workflows/ci-core.yml .github/workflows/ci-app.yml
# Edit and replace "core" with "app"
```

---

### Phase 5: Test Migration (30 min)

#### 1. Build All Packages

```bash
pnpm build:all
```

Expected output:

```
@shiritori/shared: Build successful
@shiritori/core: Build successful
@shiritori/firebase: Build successful
@shiritori/ui: Build successful
@shiritori/game-2d: Build successful
@shiritori/app: Build successful
```

#### 2. Run All Tests

```bash
pnpm test:all
```

#### 3. Run Health Check

```bash
chmod +x tools/scripts/check-all-modules.sh
./tools/scripts/check-all-modules.sh
```

#### 4. Start Dev Server

```bash
pnpm dev
```

Visit `http://localhost:3000` and test:

- ✅ Home page loads
- ✅ Game starts correctly
- ✅ Dictionary validation works
- ✅ Firebase connects
- ✅ 2D game mode works

---

### Phase 6: Debug Any Issues (Variable)

If any module fails, use debug script:

```bash
chmod +x tools/scripts/debug-module.sh
./tools/scripts/debug-module.sh <module-name>
```

Common issues and fixes:

**Issue: Import errors**

```
Fix: Update import paths to use @shiritori/* packages
From: import { dictionary } from '../lib/dictionaryHelper'
To: import { dictionary } from '@shiritori/core'
```

**Issue: Missing dependencies**

```bash
# Add missing dependency to specific package
pnpm --filter @shiritori/<package> add <dependency>
```

**Issue: Build errors**

```bash
# Clean and rebuild
pnpm --filter @shiritori/<package> clean
pnpm --filter @shiritori/<package> build
```

---

## ✅ Post-Migration Checklist

- [ ] All packages build successfully
- [ ] All tests pass
- [ ] Dev server runs correctly
- [ ] Features work as before
- [ ] CI/CD pipelines green
- [ ] Documentation updated
- [ ] Team notified

---

## 📊 Verification Commands

```bash
# Check package structure
tree packages/ -L 2

# Check dependencies
pnpm list --depth 0

# Run health check
./tools/scripts/check-all-modules.sh

# Test individual module
./tools/scripts/debug-module.sh core

# Build all
pnpm build:all

# Test all
pnpm test:all

# Start app
pnpm dev
```

---

## 🔄 Rollback Plan

If migration fails:

```bash
# 1. Switch back to original branch
git checkout main

# 2. Delete migration branch
git branch -D migrate/monorepo

# 3. Restore backups if needed
git restore .

# 4. Document issues for future attempt
```

---

## 📈 Benefits After Migration

### ✅ Isolation

- Each module can be developed independently
- Clear boundaries between features
- Easy to test in isolation

### ✅ Performance

- Only changed modules run CI
- Parallel testing
- Faster builds (incremental)

### ✅ Debugging

- Module-specific error logs
- Clear error attribution
- Targeted debugging tools

### ✅ Scalability

- Easy to add new modules
- Can extract modules to separate repos
- Clear dependency graph

### ✅ Team Collaboration

- Multiple devs work on different modules
- Reduced merge conflicts
- Clear module ownership

---

## 🎯 Next Steps After Migration

1. **Setup Error Monitoring**

   ```typescript
   import { createLogger } from "@shiritori/shared/logger";
   const logger = createLogger("core");
   logger.error("Something went wrong", { details });
   ```

2. **Add Error Dashboard to App**

   ```tsx
   import { ErrorDashboard } from "@shiritori/shared/components";
   // Add to admin/debug view
   ```

3. **Configure CI Notifications**
   - Setup Slack/Discord webhooks
   - Get notified of module failures

4. **Document Module APIs**
   - Create README for each package
   - Document exports and usage

5. **Setup Module Versioning**
   - Use changests or lerna
   - Semantic versioning per module

---

## 🆘 Getting Help

**Debug a module:**

```bash
./tools/scripts/debug-module.sh <module>
```

**View module errors:**

- Open app → Dev Tools → Console
- Navigate to Error Dashboard (if added)
- Check `/tmp/<module>.log` files

**Check CI status:**

- GitHub → Actions tab
- View per-module workflow runs

---

**Estimated Total Migration Time: 3-4 hours**

Good luck with the migration! 🚀
