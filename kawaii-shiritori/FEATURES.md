# 🌸 Kawaii Shiritori - Advanced Features Guide

## 📚 Table of Contents
- [Overview](#overview)
- [New Features](#new-features)
- [Dictionary System](#dictionary-system)
- [Practice Mode](#practice-mode)
- [Multiplayer Mode](#multiplayer-mode)
- [Unity WebGL Integration](#unity-webgl-integration)
- [Setup Instructions](#setup-instructions)
- [Strategy Tips](#strategy-tips)

---

## 🎮 Overview

This enhanced version of Kawaii Shiritori includes advanced features for both beginners learning Japanese and experienced players preparing for real matches with native speakers.

---

## ✨ New Features

### 1. **Japanese-English Dictionary (500+ Words)**
- Curated JLPT N5-N3 vocabulary
- Hiragana, Romaji, Kanji, and English translations
- Fast lookup by sound, reading, or translation
- Beginner-friendly word selection

### 2. **Practice Mode**
- **Flashcard Drill**: Learn words for each hiragana character
- **Chain Practice**: Practice continuous word chains
- **Speed Challenge**: 30-second rapid-fire mode
- Real-time feedback and validation
- Streak tracking and statistics
- Strategy tips and hints

### 3. **Multiplayer Mode** (Firebase Ready)
- Create and join game rooms
- 2-4 player support
- Room codes for easy sharing
- Casual and competitive modes
- Real-time turn-based gameplay

### 4. **Unity WebGL Integration**
- 3D game board visualization
- Animated character mascots
- Particle effects for valid words
- Interactive word chain display
- Fullscreen support

### 5. **Dictionary Validation**
- Real-time word validation against dictionary
- Checks for words ending in ん (fatal moves)
- Duplicate word detection
- Sound matching verification

---

## 📖 Dictionary System

### Features
- **500+ curated words** for Shiritori gameplay
- **Indexed by starting sound** for fast lookups
- **Multiple lookup methods**: hiragana, romaji, kanji, or translation
- **Automatic duplicate detection**
- **Safe word suggestions** (excludes words ending in ん)

### Usage Example
```typescript
import { dictionary } from './lib/dictionaryHelper';

// Find a word
const word = dictionary.findWord('ねこ');
// Returns: { word: 'ねこ', romaji: 'neko', kanji: '猫', translation: 'cat', ... }

// Get words starting with a sound
const words = dictionary.getWordsByStartSound('ね');
// Returns: [{ word: 'ねこ', ... }, { word: 'ねずみ', ... }, ...]

// Get random safe word
const randomWord = dictionary.getRandomWordStartingWith('り', ['りんご']);
```

### Dictionary Structure
```json
{
  "word": "ねこ",
  "romaji": "neko",
  "kanji": "猫",
  "translation": "cat",
  "startSound": "ね",
  "endSound": "こ"
}
```

---

## 🎯 Practice Mode

### Three Drill Types

#### 1. **Flashcard Mode**
- Learn words for each hiragana character
- Visual kana display with romaji
- Example words with translations
- Self-paced learning

#### 2. **Chain Practice**
- Practice continuous word chains
- Follow Shiritori rules
- Build muscle memory for quick recall
- Track correct/incorrect answers

#### 3. **Speed Challenge**
- 30-second time limit
- Rapid-fire word submissions
- Score tracking
- Best streak recording

### Statistics Tracked
- ✅ Correct answers
- ❌ Incorrect answers
- 🔥 Current streak
- 🏆 Best streak

### Beginner Strategy Tips
Built-in tips include:
- Learn 5 words per hiragana (~230 words total)
- Avoid words ending in ん (instant loss!)
- Force easy sounds: か, さ, た, な, は, ま
- Focus on categories: animals, food, places

---

## 👥 Multiplayer Mode

### Features
- **Room Creation**: Host games with custom settings
- **Room Codes**: 6-character codes for easy sharing
- **Player Limits**: 2-4 players per room
- **Game Modes**:
  - **Casual**: Relaxed, untimed gameplay
  - **Competitive**: Fast-paced with timers

### How to Play Multiplayer

1. **Create a Room**
   - Click "Multiplayer" from home
   - Choose difficulty and max players
   - Share the 6-digit room code

2. **Join a Room**
   - Enter a friend's room code
   - Or browse available public rooms
   - Wait for host to start

3. **Gameplay**
   - Turn-based word submission
   - Real-time validation
   - Live player status updates

### Firebase Integration

To enable multiplayer, set up Firebase:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Realtime Database
3. Add your config to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 🎮 Unity WebGL Integration

### Features
- **3D Visualization**: Immersive game board
- **Character Animations**: Kawaii mascot reactions
- **Particle Effects**: Celebrations for valid words
- **Smooth Transitions**: Professional polish

### Setup Unity WebGL

1. **Build Your Unity Project**
   ```
   File → Build Settings → WebGL → Build
   ```

2. **Copy Build Files**
   Place these in `public/unity/Build/`:
   - `shiritori.loader.js`
   - `shiritori.data`
   - `shiritori.framework.js`
   - `shiritori.wasm`

3. **Access Unity View**
   The component auto-loads when navigating to Unity-enhanced mode

### React ↔ Unity Communication

```typescript
// Send data to Unity
unityInstance.SendMessage('GameManager', 'OnWordSubmitted', 'ねこ');

// Receive events from Unity (set up in Unity C#)
window.ReactApp.handleUnityEvent({ type: 'wordPlayed', word: 'ねこ' });
```

### Architecture
- **React**: Game logic, UI, Firebase state
- **Unity**: Visual effects, animations, 3D board
- **Firebase**: Multiplayer synchronization

This separation keeps the codebase maintainable and allows independent updates.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- (Optional) Unity 2021.3+ for WebGL builds
- (Optional) Firebase account for multiplayer

### Installation

```bash
# Navigate to project
cd kawaii-shiritori

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Environment Variables

```env
# Gemini AI (for bot opponents)
GEMINI_API_KEY=your_gemini_api_key

# Firebase (for multiplayer)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_DATABASE_URL=your_db_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🎓 Strategy Tips for Native Speaker Games

### Survival Vocabulary (Essential 50 Words)

**Animals**
- いぬ (inu) - dog
- ねこ (neko) - cat
- とり (tori) - bird
- うま (uma) - horse
- さる (saru) - monkey

**Food**
- すし (sushi) - sushi
- りんご (ringo) - apple
- みかん (mikan) - orange ⚠️ (ends in ん!)
- ぱん (pan) - bread ⚠️ (ends in ん!)
- たまご (tamago) - egg

**Places**
- えき (eki) - station
- がっこう (gakkou) - school
- こうえん (kouen) - park
- うみ (umi) - sea
- やま (yama) - mountain

### Safe Ending Sounds
Force these sounds to give yourself easy follow-ups:
- **か (ka)**: かさ, かばん, かめ
- **さ (sa)**: さかな, さくら, さる
- **た (ta)**: たまご, たけ, たぬき
- **な (na)**: なつ, なまえ, なす
- **ま (ma)**: まど, まち, まつり

### Dangerous Sounds to Avoid Ending With
- **ゆ (yu)**: Limited follow-up options
- **ぢ (ji/di)**: Very rare starting sound
- **ぴ (pi)**: Few common words
- **を (wo)**: Almost no words start with this

### Practice Regimen
1. **Week 1-2**: Master 10 words for each of あ, い, う, え, お
2. **Week 3-4**: Learn か-row and さ-row words
3. **Week 5-6**: Practice word chains for 15 min/day
4. **Week 7-8**: Speed drills and competitive practice

---

## 📱 Mobile PWA Support

The app works on mobile browsers with:
- Responsive design
- Touch-optimized controls
- Offline dictionary caching
- PWA installation support

---

## 🚀 Deployment

### Vercel / Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Firebase Hosting
```bash
npm run build
firebase deploy
```

---

## 🎨 Customization

The app uses Tailwind CSS with custom design tokens:
- Primary color: `#f27d26` (orange)
- Secondary color: Emerald
- Dark mode ready
- Kawaii aesthetic with rounded corners and soft shadows

---

## 📝 Credits

- **Dictionary**: JLPT N5-N3 vocabulary curated for gameplay
- **AI**: Google Gemini 3.5 Flash for bot opponents
- **Design**: Kawaii aesthetic with Material Design 3
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4.1
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)

---

## 🐛 Known Issues

1. **Unity WebGL**: Requires manual build setup
2. **Firebase**: Needs configuration before multiplayer works
3. **Mobile**: Some animations may be less smooth on older devices

---

## 📧 Support

For questions or issues:
- Check existing game rooms in multiplayer lobby
- Review practice mode tips
- Consult dictionary for valid words

---

## 🎉 Have Fun!

Whether you're practicing for a real match with native speakers or just enjoying the game, **がんばって！(Good luck!)**

Made with ❤️ for Japanese learners
© 2026 Kawaii Shiritori Duel
