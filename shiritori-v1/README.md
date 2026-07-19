# しりとり for two — v1

Two-phone real-time Shiritori. Next.js (App Router) + Firebase Firestore.
Firestore is the source of truth: pages render live snapshots and write moves;
nothing game-critical lives only in local state.

## Setup (one time, ~15 min)

### 1. Create the Next.js project and drop these files in

```bash
npx create-next-app@latest shiritori-game
# Answers: TypeScript? No · ESLint? Yes · Tailwind? No · src/? No · App Router? Yes · Turbopack? Yes · import alias? No

cd shiritori-game
npm install firebase
```

Then copy this scaffold's `app/` and `lib/` folders over the generated ones
(replace `app/page.js`, `app/layout.js`, `app/globals.css`), and copy
`.env.local.example` and `firestore.rules` into the project root.

### 2. Create the Firebase project

1. Go to https://console.firebase.google.com → **Add project** (Analytics: off).
2. **Build → Firestore Database → Create database** → Start in production mode → pick `us-central1` (or nearest).
3. **Rules tab** → paste the contents of `firestore.rules` → Publish.
4. **Project settings (gear) → Your apps → Web (</>)** → register an app →
   copy the config values into `.env.local`:

```bash
cp .env.local.example .env.local
# then paste each value
```

### 3. Run it

```bash
npm run dev
```

Open http://localhost:3000 on your computer. To test from two phones on the
same Wi-Fi: `npm run dev -- -H 0.0.0.0`, then visit `http://<your-LAN-IP>:3000`.

### 4. Deploy (free)

```bash
npm i -g vercel
vercel
```

Add the six `NEXT_PUBLIC_FIREBASE_*` variables in the Vercel dashboard
(**Project → Settings → Environment Variables**), then `vercel --prod`.
Send the URL to your wife; she taps **Share → Add to Home Screen** and it
behaves like an app.

## How to play

1. Both open the site. One taps **Create room**, gets a 4-letter code.
2. The other enters the code and **Join room**.
3. Take turns. Each word must start with the previous word's chain kana.

Rules enforced in `lib/shiritori.js`:

- kana only (hiragana/katakana; katakana normalized to hiragana for matching)
- no repeats
- small-kana promotion: しゃ chains to や
- trailing ー skipped: ラッカー chains to か
- words ending in ん are blocked with a warning (v1 is friendly mode —
  flip `endsInN` handling in the room page to make it an instant loss)

## File map

```
app/
  layout.js              font + global CSS
  globals.css            theme (aizome indigo / vermillion)
  page.js                create / join room
  room/[roomId]/page.js  live game: listeners + turn logic
lib/
  firebase.js            Firestore init from env vars
  shiritori.js           pure game rules (unit-testable, no React/Firebase)
firestore.rules          append-only word history, rooms open by code
```

## v2 ideas (in rough order of payoff)

1. Game-over flow when someone plays ん (status: "ended", loser banner, rematch button)
2. "Meaning" field per word for English learning
3. Dictionary check via Jisho API
4. Turn timer
