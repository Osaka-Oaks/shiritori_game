# shiritori-online — source layout & naming

This document tracks folder organization and naming conventions for easier navigation and CI path filters.

## Directory tree

```
src/
├── App.tsx                 # Root view router (home / room / solo)
├── main.tsx                # React entry
├── firebase.ts             # Firebase client init
├── settings.tsx            # i18n + theme settings provider
├── types.ts                # Shared TypeScript types
├── index.css               # Global styles
│
├── components/
│   ├── dictionary/         # Lookup UI (non-blocking PiP)
│   │   └── FloatingDictionary.tsx
│   ├── game/               # Playable screens
│   │   ├── Home.tsx
│   │   ├── GameRoom.tsx
│   │   └── SinglePlayer.tsx
│   └── shell/              # Overlays & chrome
│       ├── Welcome.tsx
│       ├── Rules.tsx
│       ├── Petals.tsx
│       └── LoveNote.tsx
│
└── lib/
    ├── dictionary/         # Word data & search
    │   ├── dictionary-data.ts   # Local JP–EN dictionary + search
    │   ├── lookup.ts            # Jisho API lookup (online)
    │   └── word-bank.ts         # Hint word bank
    ├── game/               # Game rules & multiplayer
    │   ├── shiritori.ts         # Chain rules, validation
    │   ├── solo-engine.ts       # CPU opponent logic
    │   ├── levels.ts            # Solo difficulty levels 1–5
    │   ├── room-service.ts      # Firebase Realtime DB rooms
    │   └── presence.ts          # Online presence
    ├── japanese/           # Text processing
    │   ├── japanese.ts          # Script detection, readings
    │   └── romaji.ts            # Romaji ↔ kana, TTS
    └── dev/
        └── dev-mode.ts          # ?dev=1 developer tools
```

## Naming conventions

| Kind | Convention | Example |
|------|------------|---------|
| Folders | `kebab-case`, grouped by domain | `lib/game/`, `components/shell/` |
| Lib modules | `kebab-case.ts` | `room-service.ts`, `solo-engine.ts` |
| React components | `PascalCase.tsx` | `FloatingDictionary.tsx` |
| CSS classes | `kebab-case`, prefixed by feature | `dict-pip`, `dict-fab` |
| localStorage keys | `snake_case` with app prefix | `shiritori_dict_pip_pos` |

## Dictionary PiP behavior

- **FAB** (`📖`) — fixed bottom-right; fades slightly during active games.
- **PiP window** — draggable, no backdrop; game stays clickable underneath.
- **Ghost mode** — see-through body; only the title bar captures clicks.
- **Auto-ghost** — when `isPlaying` (room or solo view), panel fades automatically.
- **Controls** — minimize, ghost toggle, hide (Esc also hides).
- **Position** — persisted in `localStorage` (`shiritori_dict_pip_pos`).

## Import paths

Use explicit relative paths from the file's location, e.g.:

```ts
import { validateMove } from "../../lib/game/shiritori";
import FloatingDictionary from "./components/dictionary/FloatingDictionary";
```

## Validate after structural changes

```bash
cd shiritori-online && npm run validate
# or from repo root:
npm run ci:fast
```
