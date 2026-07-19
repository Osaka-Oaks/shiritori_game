<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# しりとり (Shiritori) - Kawaii Word Chain Game 🎌

A beautiful, educational Japanese word-chain game with **AI-powered bots**, **real-time multiplayer**, and an **integrated learning dictionary**!

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vite.dev/)

View your app in AI Studio: https://ai.studio/apps/48a4de95-5e32-4754-be3d-a10235e072e0

---

## ✨ Features

### 🎮 **Multiple Game Modes**

- 🤖 **Practice Mode** - Play against 9 themed AI bots (Pokémon, Ninja Turtles, etc.)
- 👥 **Multiplayer** - Challenge friends online with room codes
- 📱 **Local Multiplayer** - Bluetooth/WiFi Direct for face-to-face games
- 🎯 **2D Platform Game** - Phaser.js mini-game with falling words

### 📚 **NEW: Floating Dictionary Widget**

- 🔍 **Instant word lookup** without leaving the game
- 🔊 **Audio pronunciation** (Japanese text-to-speech)
- 🏷️ **JLPT level tags** (N5-N1)
- 📊 **Common word indicators**
- 🖱️ **Draggable & resizable** window
- 🌐 **Powered by Jisho.org API** (180,000+ entries)

[📖 Dictionary Documentation](./DICTIONARY_FEATURE.md) | [🚀 Quick Start Guide](./DICTIONARY_QUICK_START.md)

### 🎓 **Educational Features**

- 📖 **Word Library** - Browse 550+ Japanese words
- 📊 **Leaderboards** - Track your progress
- 🏆 **Match History** - Review past games
- 🎯 **JLPT-aligned vocabulary** - Learn test-relevant words

### 🔥 **Firebase Integration**

- ☁️ **Cloud Hosting** - Global CDN delivery
- 🔒 **Anonymous Auth** - No signup required
- 💾 **Realtime Database** - Live game state
- 📊 **Firestore** - Persistent stats & leaderboards
- 📬 **Cloud Messaging** - Push notifications
- ⚡ **Performance Monitoring** - Track game speed

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+
- **Firebase CLI** (optional, for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/JorelFuji/shiritori_game.git
cd shiritori_game/kawaii-shiritori

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Setup

Create `.env.local` file with your API keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 📦 Available Scripts

```bash
npm run dev              # Start dev server (Vite)
npm run build            # Build for production
npm run preview          # Preview production build
npm test                 # Run Vitest tests
npm run lint             # Check code quality
npm run format           # Format with Prettier

# Firebase Deployment
npm run deploy                  # Deploy everything
npm run deploy:hosting          # Deploy web app only
npm run deploy:firestore        # Deploy Firestore rules
npm run deploy:database         # Deploy Realtime DB rules
npm run deploy:rules            # Deploy all security rules

# Dependency Management
npm run deps:check              # Check dependency health
npm run deps:update             # Interactive update wizard
npm run deps:list               # List all packages
npm run clean:check             # Scan for personal references
```

---

## 🎮 How to Play

### Basic Rules (しりとり)

1. **Players take turns** saying Japanese words
2. **Each word must start** with the last kana of the previous word
3. **Words ending in ん (n)** lose the game
4. **No repeating** previously used words
5. **First to fail** loses!

**Example Chain:**

```
さくら (sakura) → らーめん (ramen) → めん (men) → んー... YOU LOSE! ❌
```

### Difficulty Levels

- 🟢 **Easy** - Common everyday words (JLPT N5-N4)
- 🟡 **Medium** - Mixed vocabulary with strategy (JLPT N3-N2)
- 🔴 **Hard** - Advanced words, kanji, technical terms (JLPT N1)

---

## 📚 Using the Dictionary

### Quick Access

1. Click the **📖 floating button** (bottom-right corner)
2. Type any Japanese word or English term
3. Press **Enter** or click **🔍 Search**

### Features

- **Instant lookup** - Results in <300ms
- **Audio playback** - Click 🔊 to hear pronunciation
- **JLPT tags** - See difficulty levels (N5-N1)
- **Multiple meanings** - All definitions shown
- **Draggable** - Move it anywhere on screen
- **Expandable** - See more results

[📖 Full Dictionary Guide](./DICTIONARY_FEATURE.md)

---

## 🏗️ Project Structure

```
kawaii-shiritori/
├── src/
│   ├── components/          # React components
│   │   ├── FloatingDictionary.tsx  # NEW: Dictionary widget
│   │   ├── GameRoomView.tsx        # Main game interface
│   │   ├── MultiplayerView.tsx     # Online multiplayer
│   │   └── ...
│   ├── lib/                 # Utilities & services
│   │   ├── firebase.ts      # Firebase config
│   │   ├── dictionary.ts    # Word validation
│   │   └── shiritori.ts     # Game logic
│   ├── data/                # Static data
│   │   └── dictionary.json  # 550+ word database
│   └── types.ts             # TypeScript definitions
│
├── docs/                    # Documentation
│   ├── DICTIONARY_FEATURE.md
│   ├── DICTIONARY_QUICK_START.md
│   ├── FIREBASE_SPARK_FEATURES.md
│   └── ...
│
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
├── database.rules.json      # Realtime DB rules
└── package.json             # Dependencies & scripts
```

---

## 🔧 Tech Stack

### Frontend

- ⚛️ **React 19** - UI framework
- 📘 **TypeScript 5.6** - Type safety
- ⚡ **Vite 6** - Build tool
- 🎨 **Tailwind CSS v4** - Styling
- 🎭 **Framer Motion** - Animations
- 🎮 **Phaser 3** - 2D game engine

### Backend (Firebase)

- ☁️ **Hosting** - CDN delivery
- 🔒 **Authentication** - Anonymous auth
- 💾 **Realtime Database** - Live game state
- 📊 **Firestore** - Persistent storage
- 📬 **Cloud Messaging** - Push notifications
- ⚡ **Performance Monitoring** - Analytics

### APIs & Services

- 🔤 **Jisho.org API** - Dictionary lookups
- 🤖 **Google Gemini AI** - Bot intelligence
- 🗣️ **Web Speech API** - Japanese TTS

---

## 🔒 Firebase Security Rules

### Realtime Database

```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": "auth != null",
        ".write": "auth != null && (
          !data.exists() ||
          data.child('seats/0').val() === auth.uid ||
          data.child('seats/1').val() === auth.uid
        )"
      }
    }
  }
}
```

### Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /playerStats/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

[🔒 Complete Rules Documentation](./FIREBASE_SPARK_FEATURES.md)

---

## 🚀 Deployment

### Deploy to Firebase

1. **Install Firebase CLI:**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**

   ```bash
   firebase login
   ```

3. **Initialize project:**

   ```bash
   firebase init
   # Select: Hosting, Firestore, Realtime Database
   ```

4. **Deploy everything:**

   ```bash
   npm run deploy
   ```

5. **Or deploy selectively:**
   ```bash
   npm run deploy:hosting    # Web app only
   npm run deploy:rules      # Security rules only
   ```

Your app will be live at: `https://your-project-id.web.app`

---

## 📊 Firebase Spark Plan (FREE)

This app is designed to work **entirely on Firebase's free Spark plan**:

| Service         | Free Quota    | Usage  |
| --------------- | ------------- | ------ |
| Hosting         | 360 MB/day    | ~10 MB |
| Firestore       | 50K reads/day | ~100   |
| Realtime DB     | 1 GB stored   | ~10 MB |
| Auth            | Unlimited     | ✅     |
| Cloud Messaging | Unlimited     | ✅     |

**No credit card required!** 🎉

[📊 Spark Plan Guide](./FIREBASE_SPARK_FEATURES.md)

---

## 🎓 Learning Resources

### For Beginners

- 📖 [Dictionary Quick Start](./DICTIONARY_QUICK_START.md)
- 🎮 Play Easy Mode bots (Usagi Chan, Pikachu)
- 🏷️ Filter by JLPT N5 words
- 🔊 Use audio pronunciation

### For Intermediate

- 📚 Explore Medium difficulty bots
- 🎯 Target JLPT N4-N3 vocabulary
- 📖 Read all word definitions
- 🗣️ Practice with multiplayer

### For Advanced

- 🔥 Challenge Hard mode bots (Mewtwo, Neko Master)
- 📚 Study JLPT N2-N1 words
- 🎮 Use Japanese-only mode
- 🏆 Compete on leaderboards

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- ✅ ESLint + Prettier enforced
- ✅ TypeScript strict mode
- ✅ Conventional commits
- ✅ Tests required for new features

---

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- 📚 **Jisho.org** - Dictionary API
- 🎨 **Material Design 3** - Design system
- 🎮 **Phaser** - Game engine
- 🔥 **Firebase** - Backend infrastructure
- 🤖 **Google Gemini** - AI intelligence
- 🎌 **Japanese learners** - Worldwide community

---

## 📬 Contact & Support

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/JorelFuji/shiritori_game/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/JorelFuji/shiritori_game/discussions)
- 📧 **Email:** support@shiritori-game.com

---

## 🌟 Star History

If you find this project helpful, please give it a ⭐!

---

**Made with ❤️ for Japanese learners worldwide** 🎌  
_Happy learning through gaming!_ 🎮📚

---

_Last updated: July 2026_  
_Version: 1.0.0_
