# 📁 File Organization & Naming Conventions

Complete guide to project structure, file organization, and naming conventions for the Shiritori Game monorepo.

---

## 🎯 Overview

This document provides:
- ✅ Current file structure visualization
- ✅ Naming conventions for all file types
- ✅ Directory organization standards
- ✅ Component categorization
- ✅ Best practices for scalability

---

## 📊 Current Project Structure

```
shiritori-game/
├── 📄 Root Configuration Files
│   ├── package.json                 # Monorepo workspace config
│   ├── .gitignore                   # Git exclusions
│   ├── .prettierrc.json             # Code formatting rules
│   ├── .npmrc                       # NPM configuration
│   ├── syncpack.config.cjs          # Dependency sync config
│   └── .nvmrc                       # Node version lock
│
├── 📖 Documentation (Root Level)
│   ├── README.md                    # Main project README
│   ├── CI_CD_PIPELINE.md            # CI/CD documentation
│   ├── DEPLOYMENT_GUIDE.md          # Deployment instructions
│   ├── DEPENDENCY_MONITORING_SETUP.md
│   ├── DEPS_QUICK_REF.md            # Dependency commands
│   ├── COMPLETE_CI_CD_SETUP.md      # Complete CI/CD guide
│   ├── CI_CD_QUICK_START.md         # Quick start guide
│   ├── PROJECT_MANAGEMENT.md        # Project automation
│   ├── COMPLETE_SETUP_SUMMARY.md    # Full system overview
│   ├── TRACKING_SYSTEM_COMPLETE.md  # Tracking documentation
│   ├── IDE_TRACKING_GUIDE.md        # IDE integration
│   ├── HASHTAGS_LABELS_GUIDE.md     # Deployment labels
│   └── FILE_ORGANIZATION_GUIDE.md   # This file
│
├── 🔧 Scripts (Root Level)
│   ├── scripts/
│   │   ├── validate-json.sh         # JSON syntax validation
│   │   ├── format-json.sh           # JSON formatting
│   │   ├── security-check.sh        # Security scans
│   │   ├── test-firebase-url.sh     # Firebase URL testing
│   │   ├── deploy-with-tags.sh      # Tagged deployments
│   │   ├── optimize-build.sh        # Build optimization
│   │   ├── deps-report.mjs          # Dependency reporting
│   │   ├── pre-deploy-check.sh      # Pre-deployment validation
│   │   ├── test-deployment.sh       # Deployment testing
│   │   └── git-hooks/               # Git hooks
│   │       ├── pre-commit           # Pre-commit validation
│   │       └── commit-msg           # Commit message validation
│   │
├── ⚙️ GitHub Configuration
│   ├── .github/
│   │   ├── workflows/               # CI/CD workflows
│   │   │   ├── ci.yml               # Main CI pipeline
│   │   │   ├── ci-optimized.yml     # Optimized CI
│   │   │   ├── security.yml         # Security scanning
│   │   │   ├── deploy-and-test.yml  # Manual deployment
│   │   │   ├── deploy-with-labels.yml # Labeled deployment
│   │   │   ├── project-automation.yml # Issue/PR automation
│   │   │   ├── scheduled-tasks.yml   # Cron jobs
│   │   │   ├── commit-tracking.yml   # Commit tracking
│   │   │   ├── status-dashboard.yml  # Status dashboard
│   │   │   └── cron-jobs.yml         # Legacy cron
│   │   │
│   │   ├── ISSUE_TEMPLATE/          # Issue templates
│   │   │   ├── bug_report.yml       # Bug reports
│   │   │   ├── feature_request.yml  # Feature requests
│   │   │   ├── work_item.yml        # Work items
│   │   │   ├── dev_test.yml         # Dev tests
│   │   │   └── config.yml           # Template config
│   │   │
│   │   ├── COMMIT_CONVENTIONS.md    # Commit standards
│   │   ├── BRANCHING.md             # Branching strategy
│   │   └── labels.yml               # Label definitions
│   │
├── 🎮 shiritori-online/             # Realtime multiplayer app
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Game.tsx             # Main game component
│   │   │   ├── Room.tsx             # Game room
│   │   │   └── ...                  # Other components
│   │   ├── lib/                     # Utility libraries
│   │   │   ├── firebase.ts          # Firebase config
│   │   │   └── ...                  # Other utilities
│   │   ├── App.tsx                  # Root app component
│   │   └── main.tsx                 # Entry point
│   ├── public/                      # Static assets
│   ├── firebase.json                # Firebase hosting config
│   ├── database.rules.json          # Realtime DB rules
│   ├── package.json                 # App dependencies
│   └── README.md                    # App documentation
│
├── 🌸 kawaii-shiritori/             # Feature-rich single-player app
│   ├── src/
│   │   ├── components/              # React components (18 files)
│   │   │   ├── App Integration
│   │   │   │   ├── HomeView.tsx           # Landing page
│   │   │   │   ├── AuthView.tsx           # Authentication
│   │   │   │   └── SettingsView.tsx       # Settings panel
│   │   │   │
│   │   │   ├── Game Views
│   │   │   │   ├── Game2D.tsx             # 2D game mode
│   │   │   │   ├── UnityGameView.tsx      # 3D Unity mode
│   │   │   │   ├── PracticeModeView.tsx   # Practice mode
│   │   │   │   ├── LocalMultiplayerView.tsx # Local multiplayer
│   │   │   │   ├── MultiplayerView.tsx    # Online multiplayer
│   │   │   │   └── GameRoomView.tsx       # Game room
│   │   │   │
│   │   │   ├── Feature Panels
│   │   │   │   ├── LeaderboardView.tsx    # Leaderboards
│   │   │   │   ├── HistoryView.tsx        # Game history
│   │   │   │   ├── LibraryView.tsx        # Word library
│   │   │   │   ├── RulesView.tsx          # Game rules
│   │   │   │   └── EnhancedRulesView.tsx  # Enhanced rules
│   │   │   │
│   │   │   ├── UI Components
│   │   │   │   ├── FloatingDictionary.tsx # PiP dictionary ✨
│   │   │   │   ├── VoiceInputButton.tsx   # Voice input
│   │   │   │   ├── CustomizerPanel.tsx    # Theme customizer
│   │   │   │   └── AvatarPickerView.tsx   # Avatar selection
│   │   │   │
│   │   ├── lib/                     # Libraries (15 files)
│   │   │   ├── Core Game Logic
│   │   │   │   ├── wordValidator.ts       # Word validation
│   │   │   │   ├── dictionaryHelper.ts    # Dictionary ops
│   │   │   │   ├── japaneseConverter.ts   # JP conversion
│   │   │   │   └── multiDictionary.ts     # Multi-dict support
│   │   │   │
│   │   │   ├── Data Management
│   │   │   │   ├── kanjiDictionary.ts     # Kanji data
│   │   │   │   ├── lineCharacters.ts      # LINE stickers
│   │   │   │   └── advancedCache.ts       # Caching system
│   │   │   │
│   │   │   ├── Firebase Integration
│   │   │   │   ├── firebase.ts            # Firebase SDK
│   │   │   │   ├── firebase-config.ts     # Config
│   │   │   │   ├── leaderboard.ts         # Leaderboard API
│   │   │   │   └── realtimeSync.ts        # Real-time sync
│   │   │   │
│   │   │   ├── Performance & UX
│   │   │   │   ├── performanceOptimizer.tsx # Performance
│   │   │   │   ├── soundEffects.ts        # Audio
│   │   │   │   └── aiAgent.ts             # AI opponent
│   │   │   │
│   │   ├── lib/__tests__/           # Unit tests (4 files)
│   │   │   ├── dictionaryHelper.test.ts
│   │   │   ├── japaneseConverter.test.ts
│   │   │   ├── leaderboard.test.ts
│   │   │   └── wordValidator.test.ts
│   │   │
│   │   ├── data/                    # Static data
│   │   │   └── dictionary.json      # 15,000+ word dictionary
│   │   │
│   │   ├── test/                    # Test configuration
│   │   │   └── setup.ts             # Vitest setup
│   │   │
│   │   ├── types.ts                 # TypeScript types
│   │   ├── utils.ts                 # Utility functions
│   │   ├── App.tsx                  # Root component
│   │   └── main.tsx                 # Entry point
│   │
│   ├── public/                      # Static assets
│   │   ├── images/                  # Images
│   │   ├── sounds/                  # Sound effects
│   │   └── ...                      # Other assets
│   │
│   ├── tools/                       # Development tools
│   │   └── scripts/                 # Build scripts
│   │
│   ├── packages/                    # Shared packages
│   │   └── shared/                  # Shared code
│   │
│   ├── Configuration Files
│   │   ├── firebase.json            # Firebase hosting
│   │   ├── firestore.rules          # Firestore security
│   │   ├── firestore.indexes.json   # Firestore indexes
│   │   ├── package.json             # Dependencies
│   │   ├── tsconfig.json            # TypeScript config
│   │   ├── vite.config.ts           # Vite build config
│   │   ├── vitest.config.ts         # Vitest test config
│   │   └── .eslintrc.cjs            # ESLint rules
│   │
│   └── Documentation
│       ├── README.md                # App documentation
│       └── FLOATING_DICTIONARY_GUIDE.md # Dictionary guide ✨
│
├── 🎲 shiritori-word-chain/         # Word chain variant
├── 📦 shiritori-v1/                 # Legacy version
└── 🎨 stitch_bilingual_shiritori_blitz/ # Design assets
```

---

## 📝 Naming Conventions

### Files

#### **React Components**
```
Format: PascalCase + descriptive name + file type

✅ Good Examples:
- FloatingDictionary.tsx      # UI widget
- HomeView.tsx                 # Full-page view
- VoiceInputButton.tsx         # Interactive button
- EnhancedRulesView.tsx        # Enhanced version
- LocalMultiplayerView.tsx     # Specific game mode

❌ Bad Examples:
- floatingdictionary.tsx       # Wrong case
- dictionary.tsx               # Too generic
- Dict.tsx                     # Abbreviated
- floating-dictionary.tsx      # Kebab case (use for CSS)
- FloatingDict.tsx             # Abbreviated
```

#### **TypeScript Libraries**
```
Format: camelCase + descriptive name

✅ Good Examples:
- wordValidator.ts             # Clear purpose
- dictionaryHelper.ts          # Helper functions
- japaneseConverter.ts         # Conversion utility
- advancedCache.ts             # Feature-specific
- performanceOptimizer.tsx     # TSX if uses JSX

❌ Bad Examples:
- WordValidator.ts             # Should be camelCase
- dict.ts                      # Too short
- helper.ts                    # Too generic
- util.ts                      # Overly generic
```

#### **Test Files**
```
Format: [fileName].test.ts

✅ Good Examples:
- dictionaryHelper.test.ts     # Matches source file
- wordValidator.test.ts        # Clear what's tested
- japaneseConverter.test.ts    # Descriptive

❌ Bad Examples:
- test.ts                      # Too generic
- dictionary.spec.ts           # Use .test.ts
- dictionaryHelperTest.ts      # Missing dot
```

#### **Configuration Files**
```
Format: lowercase + extension or dot-prefixed

✅ Good Examples:
- firebase.json                # Service config
- package.json                 # Standard
- .prettierrc.json             # Dot-prefixed tool config
- .eslintrc.cjs                # Config with extension
- vite.config.ts               # Tool config with TS

❌ Bad Examples:
- Firebase.json                # Capitalize only acronyms
- packageJSON.json             # Redundant
- prettierrc.json              # Missing dot
```

#### **Scripts**
```
Format: kebab-case.sh or camelCase.mjs

✅ Good Examples:
- validate-json.sh             # Clear action
- test-firebase-url.sh         # Descriptive
- deploy-with-tags.sh          # Action + detail
- deps-report.mjs              # JavaScript module

❌ Bad Examples:
- validate_json.sh             # Use hyphens
- test.sh                      # Too generic
- validateJson.sh              # Wrong case for bash
```

#### **Documentation**
```
Format: UPPERCASE_SNAKE_CASE.md or Title_Case.md

✅ Good Examples:
- README.md                    # Standard
- DEPLOYMENT_GUIDE.md          # All caps + underscores
- FILE_ORGANIZATION_GUIDE.md   # Descriptive
- CI_CD_PIPELINE.md            # Acronyms preserved

❌ Bad Examples:
- readme.md                    # Should be uppercase
- deployment-guide.md          # Use underscores
- file_org.md                  # Abbreviated
```

---

## 📂 Directory Structure

### Component Organization

```
src/components/
├── Views/                     # Full-page views
│   ├── HomeView.tsx
│   ├── GameRoomView.tsx
│   └── LeaderboardView.tsx
│
├── Game/                      # Game-specific components
│   ├── Game2D.tsx
│   ├── UnityGameView.tsx
│   └── PracticeModeView.tsx
│
├── UI/                        # Reusable UI components
│   ├── FloatingDictionary.tsx
│   ├── VoiceInputButton.tsx
│   └── CustomizerPanel.tsx
│
└── Features/                  # Feature-specific components
    ├── AuthView.tsx
    ├── HistoryView.tsx
    └── LibraryView.tsx
```

### Library Organization

```
src/lib/
├── game/                      # Core game logic
│   ├── wordValidator.ts
│   ├── dictionaryHelper.ts
│   └── japaneseConverter.ts
│
├── data/                      # Data management
│   ├── kanjiDictionary.ts
│   ├── multiDictionary.ts
│   └── advancedCache.ts
│
├── firebase/                  # Firebase integration
│   ├── firebase.ts
│   ├── firebase-config.ts
│   ├── leaderboard.ts
│   └── realtimeSync.ts
│
├── performance/               # Performance utilities
│   ├── performanceOptimizer.tsx
│   └── soundEffects.ts
│
└── ai/                        # AI features
    └── aiAgent.ts
```

---

## 🏷️ Component Categorization

### By Type

#### **1. View Components (Full Pages)**
**Naming:** `[Feature]View.tsx`
**Purpose:** Complete page layouts
**Examples:**
- `HomeView.tsx` - Landing page
- `GameRoomView.tsx` - Game room
- `LeaderboardView.tsx` - Leaderboard page
- `HistoryView.tsx` - Game history
- `SettingsView.tsx` - Settings panel

#### **2. Game Components**
**Naming:** `[GameType][Mode].tsx`
**Purpose:** Game mode implementations
**Examples:**
- `Game2D.tsx` - 2D game
- `UnityGameView.tsx` - 3D Unity game
- `PracticeModeView.tsx` - Practice mode
- `LocalMultiplayerView.tsx` - Local multiplayer
- `MultiplayerView.tsx` - Online multiplayer

#### **3. UI Components**
**Naming:** `[Function][ComponentType].tsx`
**Purpose:** Reusable UI elements
**Examples:**
- `FloatingDictionary.tsx` - Dictionary widget
- `VoiceInputButton.tsx` - Voice button
- `CustomizerPanel.tsx` - Theme customizer
- `AvatarPickerView.tsx` - Avatar picker

#### **4. Feature Components**
**Naming:** `[Feature]View.tsx`
**Purpose:** Specific features
**Examples:**
- `AuthView.tsx` - Authentication
- `RulesView.tsx` - Game rules
- `EnhancedRulesView.tsx` - Enhanced rules
- `LibraryView.tsx` - Word library

---

## 🎯 Best Practices

### File Naming

✅ **DO:**
- Use descriptive, clear names
- Follow case conventions strictly
- Include version if multiple (e.g., `EnhancedRulesView.tsx`)
- Match test files to source files
- Use standard extensions

❌ **DON'T:**
- Abbreviate unnecessarily
- Use generic names (e.g., `helper.ts`, `util.ts`)
- Mix naming conventions
- Use special characters (except hyphen, underscore, dot)
- Create overly long names (>40 characters)

### Directory Organization

✅ **DO:**
- Group related files together
- Create subdirectories at 5+ files
- Use consistent structure across apps
- Keep flat structure when possible
- Document structure in README

❌ **DON'T:**
- Create deep nesting (max 3-4 levels)
- Mix unrelated files
- Create empty directories
- Use unclear directory names

### Component Structure

✅ **DO:**
```typescript
// FloatingDictionary.tsx
import React, { useState } from 'react';
import { Icon } from 'lucide-react';

interface FloatingDictionaryProps {
  onClose?: () => void;
}

export default function FloatingDictionary({ onClose }: FloatingDictionaryProps) {
  // Component logic
  return (
    // JSX
  );
}
```

❌ **DON'T:**
```typescript
// Bad: Multiple exports, no types
export const FloatingDictionary = (props) => {
  // Logic
};

export const OtherComponent = () => {
  // Logic
};
```

---

## 📊 File Type Reference

| Extension | Purpose | Example |
|-----------|---------|---------|
| `.tsx` | React component with JSX | `FloatingDictionary.tsx` |
| `.ts` | TypeScript file | `wordValidator.ts` |
| `.test.ts` | Unit test file | `wordValidator.test.ts` |
| `.json` | JSON data/config | `dictionary.json` |
| `.md` | Markdown documentation | `README.md` |
| `.yml` | YAML workflow/config | `ci.yml` |
| `.sh` | Shell script | `validate-json.sh` |
| `.mjs` | ES Module JavaScript | `deps-report.mjs` |
| `.cjs` | CommonJS JavaScript | `.eslintrc.cjs` |

---

## 🔄 Migration Guide

### Reorganizing Existing Files

**Before making changes:**
1. ✅ Run tests: `npm test`
2. ✅ Check builds: `npm run build`
3. ✅ Commit current state
4. ✅ Create new branch for reorganization

**Steps:**
1. Create new directory structure
2. Move files one by one
3. Update imports
4. Run tests after each move
5. Commit incrementally

**Example:**
```bash
# 1. Create structure
mkdir -p src/components/{Views,Game,UI,Features}

# 2. Move files
git mv src/components/HomeView.tsx src/components/Views/

# 3. Update imports in affected files

# 4. Test
npm test

# 5. Commit
git commit -m "refactor: organize components into Views directory"
```

---

## ✅ Verification Checklist

### Before Committing Reorganization

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No broken imports
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Prettier formatting applied
- [ ] Documentation updated
- [ ] Git history preserved (use `git mv`)

### Integration Test

```bash
# Full validation
npm run ci:full

# Quick validation
npm run ci:fast
```

---

## 🎓 Quick Reference

### Component Naming Patterns

| Type | Pattern | Example |
|------|---------|---------|
| Page View | `[Name]View.tsx` | `HomeView.tsx` |
| Game Mode | `[Type][Mode].tsx` | `Game2D.tsx` |
| UI Widget | `[Function][Type].tsx` | `FloatingDictionary.tsx` |
| Button | `[Action]Button.tsx` | `VoiceInputButton.tsx` |
| Panel | `[Feature]Panel.tsx` | `CustomizerPanel.tsx` |

### File Organization Commands

```bash
# Find all components
find src/components -name "*.tsx"

# List by type
ls src/components/*View.tsx

# Count files
find src -name "*.tsx" | wc -l

# Check for naming issues
find src -name "*[A-Z]*" -name "*.ts" ! -name "*.tsx"
```

---

## 🎉 Summary

Your project now has:

✅ **Clear naming conventions** - PascalCase, camelCase, kebab-case  
✅ **Organized structure** - Logical grouping  
✅ **Component categories** - Views, Game, UI, Features  
✅ **File type standards** - Consistent extensions  
✅ **Best practices** - Do's and don'ts  
✅ **Migration guide** - Safe reorganization  
✅ **Verification checklist** - Ensure nothing breaks  

**Follow these conventions for maintainable, scalable code!** 📁✨

---

*Last updated: July 2026*  
*Version: 1.0*  
*Status: ✅ Production Ready*
