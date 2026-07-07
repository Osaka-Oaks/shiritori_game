# 📦 Dependencies & Package Management Guide

## 📊 **Current Package Overview**

### Production Dependencies (12 packages)

| Package                | Version   | Purpose                  | Critical     |
| ---------------------- | --------- | ------------------------ | ------------ |
| `@google/genai`        | ^2.4.0    | Gemini AI integration    | 🟡 Optional  |
| `@tailwindcss/vite`    | ^4.1.14   | TailwindCSS styling      | ✅ Required  |
| `@vitejs/plugin-react` | ^5.0.4    | React + Vite integration | ✅ Required  |
| `lucide-react`         | ^0.546.0  | Icon library             | ✅ Required  |
| `react`                | ^19.0.1   | UI framework             | ✅ Required  |
| `react-dom`            | ^19.0.1   | React DOM renderer       | ✅ Required  |
| `vite`                 | ^6.2.3    | Build tool               | ✅ Required  |
| `express`              | ^4.21.2   | Server framework         | 🟡 Optional  |
| `dotenv`               | ^17.2.3   | Environment variables    | 🟡 Optional  |
| `motion`               | ^12.23.24 | Animation library        | ✅ Required  |
| `firebase`             | ^11.0.2   | Firebase SDK             | ✅ Required  |
| `phaser`               | ^3.70.0   | 2D game engine           | 🟢 Game mode |

### Development Dependencies (22 packages)

| Package                            | Version  | Purpose            | Can Remove?   |
| ---------------------------------- | -------- | ------------------ | ------------- |
| `@types/node`                      | ^22.14.0 | Node.js types      | No            |
| `@types/express`                   | ^4.17.21 | Express types      | If no server  |
| `@types/react`                     | ^19.0.0  | React types        | No            |
| `@types/react-dom`                 | ^19.0.0  | React DOM types    | No            |
| `@typescript-eslint/eslint-plugin` | ^7.0.0   | TypeScript linting | Recommended   |
| `@typescript-eslint/parser`        | ^7.0.0   | TypeScript parser  | Recommended   |
| `@vitest/ui`                       | ^1.2.0   | Test UI            | Optional      |
| `@vitest/coverage-v8`              | ^1.2.0   | Test coverage      | Optional      |
| `@testing-library/react`           | ^16.0.0  | React testing      | Optional      |
| `@testing-library/jest-dom`        | ^6.1.5   | DOM matchers       | Optional      |
| `autoprefixer`                     | ^10.4.21 | CSS prefixes       | With Tailwind |
| `esbuild`                          | ^0.25.0  | JS bundler         | For server    |
| `eslint`                           | ^8.57.0  | Code linting       | Recommended   |
| `eslint-config-prettier`           | ^9.1.0   | ESLint + Prettier  | Recommended   |
| `eslint-plugin-react`              | ^7.33.2  | React linting      | Recommended   |
| `eslint-plugin-react-hooks`        | ^4.6.0   | Hooks linting      | Recommended   |
| `eslint-plugin-react-refresh`      | ^0.4.5   | HMR linting        | Recommended   |
| `husky`                            | ^9.0.0   | Git hooks          | Optional      |
| `jsdom`                            | ^24.0.0  | DOM for testing    | With tests    |
| `lint-staged`                      | ^15.2.0  | Stage linting      | Optional      |
| `prettier`                         | ^3.2.0   | Code formatting    | Recommended   |
| `tailwindcss`                      | ^4.1.14  | CSS framework      | Required      |
| `tsx`                              | ^4.21.0  | TS execution       | For dev       |
| `typescript`                       | ~5.8.2   | Type checking      | Required      |
| `vitest`                           | ^1.2.0   | Testing            | Optional      |

---

## 🎯 **Framework Stack**

### Core Framework

```
React 19.0.1 (UI)
  ↓
TypeScript 5.8.2 (Type safety)
  ↓
Vite 6.2.3 (Build tool)
```

### Styling

```
TailwindCSS 4.1.14 (Utility-first CSS)
  ↓
Autoprefixer 10.4.21 (Browser compatibility)
```

### Backend (Optional)

```
Express 4.21.2 (Server)
  ↓
Firebase 11.0.2 (Database + Auth + Hosting)
```

### Game Engine (Optional)

```
Phaser 3.70.0 (2D game mode)
```

### Animation

```
Motion 12.23.24 (Framer Motion)
```

---

## 📈 **Version Management**

### Check for Updates

```bash
# Check outdated packages
npm outdated

# Interactive update
npx npm-check-updates -i

# Update all minor/patch versions
npx npm-check-updates -u

# Install updates
npm install --legacy-peer-deps
```

### Specific Package Updates

```bash
# Update React (major version)
npm install react@latest react-dom@latest --legacy-peer-deps

# Update Vite (minor version)
npm install vite@^6 --save-dev --legacy-peer-deps

# Update TypeScript (patch version)
npm install typescript@~5.8 --save-dev --legacy-peer-deps
```

---

## 🔍 **Dependency Audit**

### Security Check

```bash
# Check vulnerabilities
npm audit

# Fix automatically (with caution)
npm audit fix

# Force fix (risky)
npm audit fix --force

# Detailed report
npm audit --json > audit-report.json
```

### Analyze Bundle Size

```bash
# Build and analyze
npm run build

# Check dist size
du -sh dist/*

# Detailed bundle analysis
npx vite-bundle-visualizer
```

---

## 🗑️ **Clean Up Unused Dependencies**

### Find Unused Packages

```bash
# Install depcheck
npm install -g depcheck

# Run analysis
depcheck

# Remove unused (example)
npm uninstall @vitest/ui --save-dev
```

### Packages You Can Probably Remove

If not using:

- **`@vitest/ui`** - Only needed if you use test UI
- **`@vitest/coverage-v8`** - Only for test coverage reports
- **`@testing-library/*`** - Only if you write tests
- **`husky`** + **`lint-staged`** - Only for git hooks
- **`express`** - Only if you need server-side rendering
- **`phaser`** - Only for 2D game mode

---

## 📝 **Version Constraints Explained**

### Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH
  ^     ^     ^
  |     |     └─ Bug fixes
  |     └─────── New features (backwards compatible)
  └───────────── Breaking changes
```

### Version Prefixes

| Prefix    | Meaning          | Example    | Allows      |
| --------- | ---------------- | ---------- | ----------- |
| `^`       | Compatible       | `^19.0.1`  | 19.x.x      |
| `~`       | Patch updates    | `~5.8.2`   | 5.8.x       |
| No prefix | Exact            | `19.0.1`   | 19.0.1 only |
| `>=`      | Greater or equal | `>=19.0.0` | 19.0.0+     |
| `*`       | Any version      | `*`        | Latest      |

### Your Current Constraints

```json
"react": "^19.0.1"        // Allows 19.x.x (good)
"typescript": "~5.8.2"    // Allows 5.8.x only (safe)
"vite": "^6.2.3"          // Allows 6.x.x (good)
```

---

## 🔄 **Dependency Update Strategy**

### Safe Update Schedule

**Weekly:**

- Patch versions (`~`)
- Security fixes

**Monthly:**

- Minor versions (`^`)
- New features

**Quarterly:**

- Major versions
- Framework upgrades

### Testing After Updates

```bash
# 1. Update dependencies
npm update --legacy-peer-deps

# 2. Run type check
npm run type-check

# 3. Run linter
npm run lint

# 4. Run tests
npm test

# 5. Build
npm run build

# 6. Test locally
npm run dev
```

---

## 🛡️ **Lock File Management**

### package-lock.json

**Purpose:**

- Locks exact versions for all dependencies
- Ensures reproducible builds
- Includes transitive dependencies

**When to commit:**

- ✅ Always commit `package-lock.json`
- ✅ Update after `npm install`
- ❌ Don't manually edit

**Regenerate:**

```bash
rm -f package-lock.json
npm install --legacy-peer-deps
```

---

## 📦 **Package Manager Comparison**

### npm vs pnpm vs yarn

| Feature    | npm               | pnpm           | yarn      |
| ---------- | ----------------- | -------------- | --------- |
| Speed      | Medium            | Fast           | Fast      |
| Disk space | High              | Low            | Medium    |
| Monorepo   | Yes               | Excellent      | Yes       |
| Lock file  | package-lock.json | pnpm-lock.yaml | yarn.lock |

**Current:** You're using **npm** ✅

**Consider switching to pnpm:**

```bash
npm install -g pnpm
pnpm install
pnpm run dev
```

---

## 🎯 **Recommended package.json Structure**

### Organized by Purpose

```json
{
  "dependencies": {
    // Core Framework
    "react": "^19.0.1",
    "react-dom": "^19.0.1",

    // Build Tools
    "vite": "^6.2.3",
    "@vitejs/plugin-react": "^5.0.4",

    // Styling
    "tailwindcss": "^4.1.14",
    "@tailwindcss/vite": "^4.1.14",

    // UI Libraries
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",

    // Backend
    "firebase": "^11.0.2",
    "express": "^4.21.2",

    // Game
    "phaser": "^3.70.0",

    // AI
    "@google/genai": "^2.4.0"
  },

  "devDependencies": {
    // TypeScript
    "typescript": "~5.8.2",
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.0",

    // Linting
    "eslint": "^8.57.0",
    "prettier": "^3.2.0",

    // Testing (optional)
    "vitest": "^1.2.0"
  }
}
```

---

## 🔗 **Dependency Tree**

### Visualize Dependencies

```bash
# Show dependency tree
npm list

# Show only production deps
npm list --prod

# Show specific package
npm list react

# Max depth 2
npm list --depth=2

# Output to file
npm list > deps-tree.txt
```

---

## 💡 **Best Practices**

### ✅ DO

- Keep `package-lock.json` in version control
- Use `^` for most dependencies
- Update regularly (security!)
- Run `npm audit` before deploy
- Document why each package is needed
- Use `--legacy-peer-deps` for React 19

### ❌ DON'T

- Manually edit `package-lock.json`
- Use `*` or `latest` in production
- Install packages globally (except tools)
- Mix package managers (npm + yarn)
- Ignore security warnings
- Skip testing after updates

---

## 🚀 **Quick Commands**

```bash
# Install all dependencies
npm install --legacy-peer-deps

# Add new package
npm install <package> --legacy-peer-deps

# Add dev dependency
npm install <package> --save-dev --legacy-peer-deps

# Remove package
npm uninstall <package>

# Update specific package
npm update <package> --legacy-peer-deps

# Check for updates
npm outdated

# Security audit
npm audit

# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# List installed packages
npm list --depth=0
```

---

## 📊 **Dependency Graph**

```
Your App
├─ react (UI framework)
│  └─ react-dom (DOM renderer)
├─ vite (build tool)
│  ├─ @vitejs/plugin-react
│  └─ esbuild (bundler)
├─ tailwindcss (styling)
│  └─ autoprefixer
├─ firebase (backend)
│  └─ firestore, auth, hosting
├─ motion (animations)
├─ lucide-react (icons)
├─ phaser (game engine)
└─ @google/genai (AI)
```

---

## 🎊 **Summary**

**Total Packages:** 34 (12 prod + 22 dev)  
**Critical:** 8 packages  
**Optional:** 26 packages  
**Bundle Size:** ~2MB (after build)  
**Update Frequency:** Monthly recommended  
**Security:** Run `npm audit` weekly

**Your stack is modern and well-maintained!** ✅
