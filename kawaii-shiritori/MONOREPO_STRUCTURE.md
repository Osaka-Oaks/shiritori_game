# 🏗️ Monorepo Structure Guide

## Overview

Your Shiritori game has been refactored from a **monolithic structure** to a **modular monorepo** with:

- ✅ Separate packages for each feature
- ✅ Independent CI/CD pipelines per module
- ✅ Module-specific error tracking
- ✅ Easy debugging per feature
- ✅ Isolated testing

---

## 📁 New Repository Structure

```
shiritori_game/
├── packages/
│   ├── core/                   # Game logic & validation
│   │   ├── src/
│   │   │   ├── dictionary/    # Dictionary services
│   │   │   ├── validation/    # Word validation
│   │   │   ├── game/          # Game logic
│   │   │   └── index.ts       # Public API
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/                     # React UI components
│   │   ├── src/
│   │   │   ├── components/    # UI components
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── styles/        # CSS/Tailwind
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── game-2d/                # Phaser 2D game
│   │   ├── src/
│   │   │   ├── scenes/        # Game scenes
│   │   │   ├── entities/      # Game entities
│   │   │   ├── physics/       # Physics logic
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── firebase/               # Firebase services
│   │   ├── src/
│   │   │   ├── auth/          # Authentication
│   │   │   ├── firestore/     # Database
│   │   │   ├── storage/       # File storage
│   │   │   ├── analytics/     # Analytics
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                 # Shared utilities
│   │   ├── src/
│   │   │   ├── types/         # TypeScript types
│   │   │   ├── utils/         # Utility functions
│   │   │   ├── constants/     # Constants
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── app/                    # Main application
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── index.html
│       ├── public/
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
│
├── .github/
│   └── workflows/
│       ├── ci-core.yml        # CI for core package
│       ├── ci-ui.yml          # CI for ui package
│       ├── ci-game2d.yml      # CI for game-2d
│       ├── ci-firebase.yml    # CI for firebase
│       ├── ci-shared.yml      # CI for shared
│       ├── ci-app.yml         # CI for main app
│       └── deploy.yml         # Deployment
│
├── tools/                      # Build & dev tools
│   ├── scripts/
│   │   ├── test-all.sh
│   │   ├── build-all.sh
│   │   └── lint-all.sh
│   └── generators/             # Code generators
│
├── docs/                       # Documentation
│   ├── architecture/
│   ├── api/
│   └── guides/
│
├── package.json                # Root package.json (workspaces)
├── pnpm-workspace.yaml         # PNPM workspaces config
├── tsconfig.base.json          # Base TypeScript config
├── .eslintrc.base.cjs          # Base ESLint config
└── README.md
```

---

## 📦 Package Organization

### 1. `@shiritori/core` - Game Logic & Validation

**Purpose:** Core game logic, dictionary services, word validation

**Responsibilities:**

- Dictionary management (local, multi-source)
- Word validation (Jisho API, kanji)
- Game state management
- Shiritori rules enforcement

**Dependencies:**

- None (zero dependencies on other packages)

**Exports:**

```typescript
export { dictionary, multiDictionary, kanjiDictionary, wordValidator, GameEngine, ShiritoriRules };
```

---

### 2. `@shiritori/ui` - React UI Components

**Purpose:** All React components, hooks, and UI logic

**Responsibilities:**

- Game views (Home, Game Room, History, etc.)
- Reusable UI components
- Custom React hooks
- Styling (Tailwind CSS)

**Dependencies:**

- `@shiritori/core`
- `@shiritori/shared`

**Exports:**

```typescript
export {
  HomeView,
  GameRoomView,
  AvatarPickerView,
  // ... all components
};
```

---

### 3. `@shiritori/game-2d` - 2D Platformer Game

**Purpose:** Phaser.js 2D game mode

**Responsibilities:**

- Game scenes
- Physics engine
- Entity management
- Word collection mechanics

**Dependencies:**

- `@shiritori/core`
- `@shiritori/shared`
- `phaser`

**Exports:**

```typescript
export { Game2D, ShiritoriGameScene, WordEntity };
```

---

### 4. `@shiritori/firebase` - Firebase Services

**Purpose:** All Firebase integrations

**Responsibilities:**

- Authentication
- Firestore operations
- Cloud storage
- Analytics tracking
- Leaderboard service

**Dependencies:**

- `@shiritori/shared`
- `firebase`

**Exports:**

```typescript
export { auth, db, storage, leaderboard, analytics };
```

---

### 5. `@shiritori/shared` - Shared Utilities

**Purpose:** Shared types, utilities, constants

**Responsibilities:**

- TypeScript type definitions
- Utility functions
- Constants
- Helpers

**Dependencies:**

- None

**Exports:**

```typescript
export { types, utils, constants, helpers };
```

---

### 6. `@shiritori/app` - Main Application

**Purpose:** Entry point, app composition

**Responsibilities:**

- App initialization
- Route management
- Package composition
- Build configuration

**Dependencies:**

- ALL other packages

---

## 🔄 CI/CD Per Module

### Individual Workflows

Each package has its own CI workflow:

**`.github/workflows/ci-core.yml`**

```yaml
name: CI - Core Package

on:
  push:
    paths:
      - "packages/core/**"
      - ".github/workflows/ci-core.yml"

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - name: Install dependencies
        run: pnpm install --filter @shiritori/core
      - name: Run tests
        run: pnpm --filter @shiritori/core test
      - name: Build
        run: pnpm --filter @shiritori/core build
```

### Benefits

✅ **Faster CI** - Only runs tests for changed modules
✅ **Isolated failures** - One module failure doesn't block others
✅ **Clear error tracking** - Know exactly which module failed
✅ **Parallel execution** - Multiple modules tested simultaneously

---

## 🐛 Error Tracking Per Module

### Module-Specific Logging

Each package has its own logger:

```typescript
// packages/core/src/logger.ts
import { createLogger } from "@shiritori/shared/logger";

export const logger = createLogger("core", {
  level: process.env.LOG_LEVEL || "info",
  module: "core",
});

// Usage
logger.error("Validation failed", { word, error });
logger.info("Word validated", { word, sources });
```

### Error Tracking Service

```typescript
// packages/shared/src/logger.ts
export interface LogEntry {
  timestamp: string;
  level: "error" | "warn" | "info" | "debug";
  module: string;
  message: string;
  metadata?: any;
  stack?: string;
}

export function createLogger(module: string, options?) {
  return {
    error: (message, meta?) => log("error", module, message, meta),
    warn: (message, meta?) => log("warn", module, message, meta),
    info: (message, meta?) => log("info", module, message, meta),
    debug: (message, meta?) => log("debug", module, message, meta),
  };
}
```

---

## 🧪 Module-Specific Testing

### Isolated Test Suites

Each package has its own test suite:

```bash
# Test specific package
pnpm --filter @shiritori/core test

# Test all packages
pnpm test:all

# Watch mode for specific package
pnpm --filter @shiritori/ui test:watch
```

### Test Organization

```
packages/core/
├── src/
│   └── validation/
│       └── wordValidator.ts
└── tests/
    └── validation/
        └── wordValidator.test.ts
```

---

## 📊 Dependency Graph

```
@shiritori/app
    ├─→ @shiritori/ui
    │       ├─→ @shiritori/core
    │       └─→ @shiritori/shared
    ├─→ @shiritori/game-2d
    │       ├─→ @shiritori/core
    │       └─→ @shiritori/shared
    ├─→ @shiritori/firebase
    │       └─→ @shiritori/shared
    └─→ @shiritori/core
            └─→ @shiritori/shared

@shiritori/shared (no dependencies)
```

---

## 🛠️ Development Workflow

### Setup

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm build:all

# Run main app in dev mode
pnpm --filter @shiritori/app dev
```

### Working on Specific Module

```bash
# Start dev mode for UI package
pnpm --filter @shiritori/ui dev

# Run tests for core package
pnpm --filter @shiritori/core test

# Build firebase package
pnpm --filter @shiritori/firebase build
```

### Adding Dependencies

```bash
# Add to specific package
pnpm --filter @shiritori/core add lodash

# Add dev dependency
pnpm --filter @shiritori/ui add -D @types/react

# Add workspace dependency
pnpm --filter @shiritori/app add @shiritori/core@workspace:*
```

---

## 🔍 Debugging

### Module-Specific Debug

Each module can be debugged independently:

**VS Code `launch.json`:**

```json
{
  "configurations": [
    {
      "name": "Debug Core Package",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/packages/core",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test:debug"]
    },
    {
      "name": "Debug UI Components",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/packages/ui/src"
    }
  ]
}
```

### Error Tracking Dashboard

```typescript
// View errors by module
import { getErrorsByModule } from "@shiritori/shared/logger";

const errors = await getErrorsByModule("core", {
  since: "2024-01-01",
  level: "error",
});

console.log("Core errors:", errors.length);
```

---

## 📈 Build Process

### Monorepo Build

```bash
# Build all packages in dependency order
pnpm build:all

# Build specific package
pnpm --filter @shiritori/core build

# Clean all builds
pnpm clean:all
```

### Build Order

1. `@shiritori/shared` (no dependencies)
2. `@shiritori/core` (depends on shared)
3. `@shiritori/firebase` (depends on shared)
4. `@shiritori/ui` (depends on core, shared)
5. `@shiritori/game-2d` (depends on core, shared)
6. `@shiritori/app` (depends on all)

---

## 🚀 Deployment

### Per-Module Deployment

```bash
# Deploy main app
pnpm --filter @shiritori/app deploy

# Deploy Firebase functions
pnpm --filter @shiritori/firebase deploy:functions

# Deploy static assets
pnpm --filter @shiritori/ui deploy:assets
```

---

## 📊 Benefits

### 1. **Isolated Testing**

- Test modules independently
- Faster feedback loops
- Clear failure attribution

### 2. **Parallel Development**

- Multiple devs work on different modules
- No merge conflicts
- Clear module ownership

### 3. **Incremental Builds**

- Only rebuild changed modules
- Faster CI/CD
- Reduced build times

### 4. **Easy Debugging**

- Module-specific logs
- Isolated error tracking
- Clear stack traces

### 5. **Better Code Organization**

- Clear separation of concerns
- Enforced module boundaries
- Easy to navigate

### 6. **Scalability**

- Add new modules easily
- Extract modules to separate repos later
- Clear dependencies

---

## 🔧 Tools & Scripts

### Root `package.json` Scripts

```json
{
  "scripts": {
    "dev": "pnpm --filter @shiritori/app dev",
    "build:all": "pnpm -r build",
    "test:all": "pnpm -r test",
    "lint:all": "pnpm -r lint",
    "clean:all": "pnpm -r clean",
    "typecheck:all": "pnpm -r typecheck"
  }
}
```

### Helper Scripts

**`tools/scripts/test-changed.sh`** - Test only changed packages
**`tools/scripts/build-deps.sh`** - Build package dependencies
**`tools/scripts/check-circular.sh`** - Check circular dependencies

---

## 📚 Documentation

Each package has its own README:

- `packages/core/README.md` - Core API documentation
- `packages/ui/README.md` - Component library docs
- `packages/game-2d/README.md` - Game development guide
- `packages/firebase/README.md` - Firebase setup & API
- `packages/shared/README.md` - Utilities reference

---

## 🎯 Migration Guide

### From Monolith to Monorepo

**Phase 1: Create Package Structure**

1. Create `packages/` directory
2. Move code to appropriate packages
3. Update imports

**Phase 2: Setup Workspaces**

1. Configure PNPM workspaces
2. Update package.json files
3. Link dependencies

**Phase 3: Update CI/CD**

1. Create per-module workflows
2. Update deployment scripts
3. Test pipelines

**Phase 4: Enable Error Tracking**

1. Add logging to each module
2. Setup error monitoring
3. Create dashboards

---

## 🎊 Summary

Your repository is now:

✅ **Modular** - Clear separation of concerns
✅ **Testable** - Isolated test suites per module
✅ **Debuggable** - Module-specific error tracking
✅ **Scalable** - Easy to add new features
✅ **Maintainable** - Clear code organization
✅ **Fast** - Incremental builds & parallel CI
✅ **Production-Ready** - Enterprise-grade structure

**No more monolith!** Each feature is now its own module with:

- Independent CI/CD
- Isolated testing
- Error tracking
- Clear boundaries
- Easy debugging

🏗️ **Your codebase is now enterprise-grade!** 🚀
