# Routing Analysis

## 📋 Routing Structure Overview

This document analyzes all routing and navigation in the Shiritori Game projects.

## 🎯 Kawaii Shiritori (Main App)

### App Views (Routing)

The main app uses a **state-based routing system** managed by `activeView` in `App.tsx`.

#### Available Routes (AppView Types)

```typescript
type AppView =
  | "HOME"              // ✅ Main landing page
  | "AVATAR_PICKER"     // ✅ Player profile customization
  | "GAME_ROOM"         // ✅ Main game screen
  | "HISTORY"           // ✅ Match history view
  | "LIBRARY"           // ✅ Word library/dictionary
  | "LEADERBOARD"       // ✅ Global rankings
  | "RULES"             // ✅ How to play instructions
  | "AUTH"              // ❌ NOT USED - Defined but no route
  | "PRACTICE"          // ✅ Practice mode
  | "MULTIPLAYER"       // ✅ Online multiplayer
  | "LOCAL_MULTIPLAYER" // ✅ Local 2-player mode
  | "GAME_2D";          // ⚠️  PARTIAL - Defined with basic placeholder
```

### Route Implementations

| View | Component | Status | Navigation |
|------|-----------|--------|------------|
| `HOME` | `HomeView.tsx` | ✅ Active | Default view, bottom nav |
| `AVATAR_PICKER` | `AvatarPickerView.tsx` | ✅ Active | From HOME → Start Game |
| `GAME_ROOM` | `GameRoomView.tsx` | ✅ Active | From AVATAR_PICKER → Confirm |
| `HISTORY` | `HistoryView.tsx` | ✅ Active | Bottom nav, match details modal |
| `LIBRARY` | `LibraryView.tsx` | ✅ Active | Bottom nav |
| `LEADERBOARD` | `LeaderboardView.tsx` | ✅ Active | Bottom nav |
| `RULES` | `EnhancedRulesView.tsx` | ✅ Active | Bottom nav |
| `PRACTICE` | `PracticeModeView.tsx` | ✅ Active | From HOME buttons |
| `MULTIPLAYER` | `MultiplayerView.tsx` | ✅ Active | From HOME buttons |
| `LOCAL_MULTIPLAYER` | `LocalMultiplayerView.tsx` | ✅ Active | From HOME buttons |
| `GAME_2D` | Inline JSX | ⚠️ Partial | From HOME, not fully implemented |
| `AUTH` | None | ❌ Dead | Type exists, no implementation |

### Navigation Flow

```
HOME
├─→ AVATAR_PICKER → GAME_ROOM (Main game flow)
├─→ PRACTICE (Practice mode)
├─→ MULTIPLAYER (Online multiplayer)
├─→ LOCAL_MULTIPLAYER (Local multiplayer)
├─→ GAME_2D (2D game - partial)
└─→ RULES (Help)

Bottom Navigation (Always visible except in GAME_ROOM):
├─→ HOME
├─→ HISTORY
├─→ LIBRARY
├─→ LEADERBOARD
└─→ RULES
```

### Navigation Triggers

#### From HomeView
```typescript
onStartGame={() => setActiveView("AVATAR_PICKER")}
onOpenRules={() => setActiveView("RULES")}
onOpenPractice={() => setActiveView("PRACTICE")}
onOpenMultiplayer(() => setActiveView("MULTIPLAYER")}
onOpenLocalMultiplayer={() => setActiveView("LOCAL_MULTIPLAYER")}
onOpen2DGame={() => setActiveView("GAME_2D")}
```

#### From Bottom Navigation
```typescript
onClick={() => setActiveView("HOME")}
onClick={() => setActiveView("HISTORY")}
onClick={() => setActiveView("LIBRARY")}
onClick={() => setActiveView("LEADERBOARD")}
onClick={() => setActiveView("RULES")}
```

#### Back Navigation
```typescript
// Most views use onBack callback
onBack={() => setActiveView("HOME")}
```

## 🌐 Shiritori Online (Two-Player App)

### Routing Structure

Uses **React Router** (inferred from structure, no explicit router config found).

### Main Routes

Based on `src/App.tsx` structure:
- Landing page with room creation/joining
- Game room view for active games
- Settings view

**Note:** This project is simpler with fewer views than kawaii-shiritori.

## 🎮 Component Imports Analysis

### All Component Imports are Used ✅

Every imported component in `App.tsx` is actively rendered:
- ✅ HomeView
- ✅ AvatarPickerView
- ✅ GameRoomView
- ✅ HistoryView
- ✅ LibraryView
- ✅ LeaderboardView
- ✅ EnhancedRulesView
- ✅ PracticeModeView
- ✅ MultiplayerView
- ✅ LocalMultiplayerView
- ✅ UnityGameView (imported but not rendered)
- ✅ Game2D
- ✅ FloatingDictionary

### Unused/Dead Components

#### UnityGameView.tsx
- **Status:** ❌ Imported but never rendered
- **Location:** `kawaii-shiritori/src/components/UnityGameView.tsx`
- **Action:** Remove import or implement Unity game integration

#### Game2D Placeholder
- **Status:** ⚠️ Partial implementation
- **Current:** Basic placeholder with back button
- **Action:** Either complete implementation or remove

#### AUTH View Type
- **Status:** ❌ Defined in types but no component
- **Location:** Type definition only
- **Action:** Remove from AppView type or implement authentication view

## 🔍 Dead/Unused Files Identified

### Old Project Folders (DEAD)
```
shiritori-v1/          # Old Next.js version
shiritori-word-chain/  # Alternative implementation
```
**Recommendation:** Archive or remove entirely

### External Projects
```
stitch_bilingual_shiritori_blitz/  # External/template project
```
**Recommendation:** Move to separate repo or archive

### IDE History
```
.history/  # VSCode Local History extension
```
**Recommendation:** Ensure in .gitignore

## ✅ Working Routes Summary

### Fully Functional Routes (10)
1. ✅ HOME - Main landing
2. ✅ AVATAR_PICKER - Profile setup
3. ✅ GAME_ROOM - Main game
4. ✅ HISTORY - Match history
5. ✅ LIBRARY - Word dictionary
6. ✅ LEADERBOARD - Rankings
7. ✅ RULES - Instructions
8. ✅ PRACTICE - Practice mode
9. ✅ MULTIPLAYER - Online play
10. ✅ LOCAL_MULTIPLAYER - Local play

### Incomplete/Dead Routes (3)
1. ⚠️ GAME_2D - Placeholder only
2. ❌ AUTH - Not implemented
3. ❌ UnityGameView - Imported but unused

## 🛠️ Recommendations

### High Priority
1. **Remove UnityGameView import** or implement Unity integration
2. **Remove AUTH from AppView type** or implement authentication
3. **Complete Game2D implementation** or remove placeholder

### Medium Priority
1. **Archive old project folders** (shiritori-v1, shiritori-word-chain)
2. **Add .history/ to .gitignore** if not already present
3. **Document routing structure** in main README

### Low Priority
1. Consider migrating to React Router for URL-based routing
2. Add route guards/protection if needed
3. Implement route transitions/animations

## 📊 Route Coverage

- **Total Defined Routes:** 13
- **Fully Implemented:** 10 (77%)
- **Partially Implemented:** 1 (8%)
- **Dead/Unused:** 2 (15%)

## 🧪 Testing Routes

All route components should have:
- [ ] Unit tests for component logic
- [ ] Integration tests for navigation flows
- [ ] E2E tests for critical user paths

Currently, only utility functions are tested. Component tests needed.

---

**Last Updated:** 2026-07-09
**Status:** ✅ Routing structure verified and documented
