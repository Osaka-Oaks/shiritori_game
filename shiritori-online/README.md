# しりとり · Shiritori Online

A bilingual (JP/EN) **two-player Shiritori** word-chain game you can play across
two different phones or computers in real time. Built as a mobile-first **PWA**
(installable on iPhone via _Add to Home Screen_) using **React + TypeScript +
Vite** and **Firebase Realtime Database** for live multiplayer.

This game is already wired to your Firebase project **`shiritori-game-ccaae`**
(anonymous auth + Realtime Database), so it works out of the box.

---

## How to play (the game)

- Each new word must start with the **last kana** of the previous word
  (りんご → ご → ごりら → ら → …).
- **You lose** if your word ends in **ん**, or if your **turn timer** runs out.
- Words that are already used / don't match / aren't kana are rejected — you just
  try again, your turn continues.
- Type **romaji** (it converts live: `sakura` → さくら) or use a Japanese keyboard.
- Full rules are in the in-app **How to play** sheet.

---

## Run it locally

**Prerequisite:** [Node.js](https://nodejs.org) 18+.

```bash
cd shiritori-online
npm install
npm run dev
```

Vite prints a **Local** and a **Network** URL. Open the Network URL
(e.g. `http://192.168.x.x:5173`) on your phone — as long as the phone is on the
same Wi-Fi, you can test real two-device play immediately:

1. **Phone A:** enter a name → **Create a room** → you get a 4-letter code.
2. **Phone B:** enter a name → type the code → **Join** (or open the shared link).
3. Play! Turns, the timer, and the word chain sync live between both devices.

> The Firebase config lives in [`src/firebase.ts`](src/firebase.ts). It's already
> filled in for your project. (Client Firebase keys are safe to ship — access is
> controlled by the database rules below.)

---

## Deploy so anyone can play (Firebase Hosting)

This gives you a public `https://…web.app` URL that works on any phone, anywhere
(not just your Wi-Fi), and is installable to the iPhone home screen.

**One-time setup:**

```bash
npm install -g firebase-tools   # if you don't have it
firebase login                  # log into the Google account that owns the project
```

**Build & deploy:**

```bash
cd shiritori-online
npm run deploy        # = npm run build && firebase deploy
```

The project id is already set in [`.firebaserc`](.firebaserc) to
`shiritori-game-ccaae`. After deploy, Firebase prints your **Hosting URL** —
open it on each phone and tap **Share → Add to Home Screen** to install it.

> `firebase deploy` pushes **both** the web app (Hosting) and the database rules
> in [`database.rules.json`](database.rules.json). To deploy just one:
> `firebase deploy --only hosting` or `firebase deploy --only database`.

---

## How real-time multiplayer works

Each match is a node in the Realtime Database under `games/{ROOMCODE}`:

```
games/
  ABCD/
    status: "waiting" | "playing" | "finished"
    seats:        { 0: <uid>, 1: <uid> }     # who holds each seat
    names:        { 0: "Mei",  1: "Jarrel" }
    turn:         0 | 1                        # whose turn
    currentKana:  "ら"                          # kana the next word must start with
    timeLimit:    30                           # seconds per turn
    turnStartedAt: 1718200000000               # for the countdown
    words:        [ { word, kana, seat, by, ts }, ... ]
    winnerSeat / loserSeat / loseReason
    settings:     { smallKanaLenient, dakutenLenient }
```

- Both clients **subscribe** to their room node ([`subscribeRoom`](src/lib/roomService.ts))
  and re-render on every change.
- Moves, joins, timeouts, and rematches are committed with **transactions** so the
  two devices can't clobber each other (e.g. only the player whose turn it is can
  submit; either device can safely finalize an expired timer).
- All game rules (last-kana chaining, ん detection, small-kana / dakuten house
  rules, repeats) live in pure, testable logic: [`src/lib/shiritori.ts`](src/lib/shiritori.ts).

### Database security rules

[`database.rules.json`](database.rules.json) — only signed-in users (everyone is
signed in anonymously on load) can read/write game data:

```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

This is fine for a casual friends-and-family game. To harden it (e.g. only let
seated players write to their own room, validate field shapes), tighten the rules
and run `firebase deploy --only database`.

---

## Project structure

```
shiritori-online/
├─ index.html                 # PWA meta, fonts, apple-touch-icon
├─ database.rules.json        # Realtime Database security rules
├─ firebase.json / .firebaserc# Hosting + DB deploy config
├─ public/
│  ├─ manifest.webmanifest    # installable PWA manifest
│  └─ icon.svg
└─ src/
   ├─ firebase.ts             # Firebase init + anonymous sign-in
   ├─ types.ts
   ├─ App.tsx                 # auth + routing (home ↔ room)
   ├─ lib/
   │  ├─ shiritori.ts         # pure game rules
   │  ├─ romaji.ts            # romaji→hiragana + speech
   │  ├─ words.ts             # starter word bank (hints)
   │  └─ roomService.ts       # all Realtime Database operations
   └─ components/
      ├─ Home.tsx             # create / join + settings
      ├─ GameRoom.tsx         # the live game board
      └─ Rules.tsx            # how-to-play sheet
```

楽しんで！ Have fun.
