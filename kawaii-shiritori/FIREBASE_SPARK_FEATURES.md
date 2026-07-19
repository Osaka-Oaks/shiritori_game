# 🔥 Firebase Spark Plan - Complete Feature Guide

## 📊 **Your Current Setup**

**Project:** shiritori-game-ccaae  
**Plan:** Spark (Free Forever)  
**Active Users:** 33 anonymous players  
**Last Deploy:** Jun 16, 2026

---

## ✅ **Features You're Using (Free on Spark)**

### 1. **Firebase Hosting** ✅

- **Status:** Active & Deployed
- **URL:** https://shiritori-game-ccaae.web.app
- **Limits:** 10 GB storage, 360 MB/day bandwidth
- **Perfect for:** Static assets, CDN delivery, SPA routing

### 2. **Authentication** ✅

- **Status:** Active (33 anonymous users)
- **Available Methods:**
  - Email/Password ✅
  - Anonymous Auth ✅ (currently using)
  - Google ✅
  - Phone ❌ (Blaze only)
- **Limits:** Unlimited users on Spark

### 3. **Realtime Database** ✅

- **Status:** Active with games structure
- **Limits:** 1 GB storage, 10 GB/month bandwidth, 100 concurrent connections
- **Perfect for:** Live gameplay, presence system, turn-based mechanics

### 4. **Firestore** ✅

- **Status:** Just created (Production mode)
- **Limits:** 1 GB storage, 50K reads/day, 20K writes/day, 20K deletes/day
- **Perfect for:** Leaderboards, stats, game history

### 5. **Cloud Messaging (FCM)** ✅

- **Status:** Active (sent "Welcome to Shiritori Blitz!" campaign)
- **Limits:** Unlimited messages
- **Perfect for:** "Your turn" notifications, game invites

---

## 🚀 **Features You Should Add (Free on Spark)**

### 6. **Remote Config** 🆕 Recommended

- **Status:** Available but not using
- **Limits:** 2000 parameters, unlimited requests
- **Use Cases:**
  ```javascript
  // Enable/disable features without redeploying
  const enableJapaneseOnlyMode = remoteConfig.getBoolean("japanese_only_mode");
  const turnTimerSeconds = remoteConfig.getNumber("turn_timer");
  const maintenanceMode = remoteConfig.getBoolean("maintenance_mode");
  ```

### 7. **Performance Monitoring** 🆕 Recommended

- **Status:** Available but not added
- **Limits:** Free on Spark
- **Benefits:**
  - Track network latency for Realtime Database
  - Monitor page load times
  - Detect slow API calls
  - See actual user performance

### 8. **App Check** 🆕 Recommended

- **Status:** Available but not enabled
- **Limits:** Free on Spark
- **Benefits:**
  - Protect against bots/abuse
  - Works with anonymous auth
  - Prevents API quota abuse

### 9. **A/B Testing** 🆕 Optional

- **Status:** Available with Remote Config
- **Limits:** Free on Spark
- **Use Cases:**
  - Test different turn timer lengths
  - Try different scoring systems
  - Compare UI layouts

---

## ❌ **Features NOT Available on Spark**

### Cloud Functions ❌

- **Requires:** Blaze plan
- **Why you don't need it:**
  - Use Firestore/RTDB security rules instead
  - Client-side validation works fine for word games
  - Presence system works without Functions

### Cloud Storage ❌

- **Requires:** Blaze plan
- **Alternatives on Spark:**
  - Host static assets via Hosting CDN
  - Store small images as base64 in Firestore (<1MB)
  - Use external free CDN (Cloudinary, ImgBB)

### Phone Authentication ❌

- **Requires:** Blaze plan
- **What you have:** Email, Google, Anonymous (all free)

---

## 🎮 **Two-Player Game Enhancements (Free)**

### 1. **Presence System** (Realtime Database)

**File:** `src/lib/presence.ts`

```typescript
import { getDatabase, ref, onValue, onDisconnect, set } from "firebase/database";
import { getAuth } from "firebase/auth";

export class PresenceSystem {
  private db = getDatabase();
  private auth = getAuth();

  // Track online/offline status
  initializePresence() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    const presenceRef = ref(this.db, `presence/${uid}`);
    const connectedRef = ref(this.db, ".info/connected");

    onValue(connectedRef, snapshot => {
      if (snapshot.val() === true) {
        // Set online
        set(presenceRef, {
          online: true,
          lastSeen: Date.now(),
        });

        // Set offline on disconnect
        onDisconnect(presenceRef).set({
          online: false,
          lastSeen: Date.now(),
        });
      }
    });
  }

  // Watch opponent status
  watchOpponent(opponentUid: string, callback: (online: boolean) => void) {
    const presenceRef = ref(this.db, `presence/${opponentUid}`);
    return onValue(presenceRef, snapshot => {
      callback(snapshot.val()?.online || false);
    });
  }
}
```

### 2. **Turn Timer** (Client-side with Rules Validation)

```typescript
export class TurnTimer {
  private timeLimit = 60; // seconds
  private timer: NodeJS.Timeout | null = null;

  startTurn(gameId: string, onTimeout: () => void) {
    const turnStartedAt = Date.now();

    // Update game with turn start time
    update(ref(db, `games/${gameId}`), {
      turnStartedAt,
      timeLimit: this.timeLimit,
    });

    // Client-side countdown
    this.timer = setTimeout(() => {
      onTimeout();
    }, this.timeLimit * 1000);
  }

  stopTurn() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  getRemainingTime(turnStartedAt: number, timeLimit: number): number {
    const elapsed = Date.now() - turnStartedAt;
    const remaining = timeLimit * 1000 - elapsed;
    return Math.max(0, Math.floor(remaining / 1000));
  }
}
```

### 3. **Matchmaking with Room Codes** (No Cloud Functions needed)

```typescript
export class Matchmaking {
  // Create game with random room code
  async createGame(): Promise<string> {
    const code = this.generateRoomCode();
    const gameRef = push(ref(db, "games"));

    await set(gameRef, {
      code,
      hostUid: auth.currentUser!.uid,
      createdAt: Date.now(),
      status: "waiting",
      seats: {
        0: auth.currentUser!.uid,
      },
    });

    // Add to active rooms list
    await set(ref(db, `activeGames/${gameRef.key}`), {
      code,
      hostUid: auth.currentUser!.uid,
      createdAt: Date.now(),
    });

    return code;
  }

  // Join game with room code
  async joinGame(code: string): Promise<string | null> {
    const gamesRef = ref(db, "games");
    const snapshot = await get(gamesRef);

    // Find game with matching code
    let gameId: string | null = null;
    snapshot.forEach(child => {
      if (child.val().code === code && child.val().status === "waiting") {
        gameId = child.key;
      }
    });

    if (gameId) {
      // Join as seat 1
      await update(ref(db, `games/${gameId}`), {
        "seats/1": auth.currentUser!.uid,
        status: "active",
        turn: 0,
        turnStartedAt: Date.now(),
      });

      // Remove from active rooms
      await remove(ref(db, `activeGames/${gameId}`));
    }

    return gameId;
  }

  private generateRoomCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
}
```

### 4. **Anti-Cheat via Security Rules** (Already in database.rules.json)

```json
// Enforces:
// ✅ Players can only claim one seat
// ✅ Can't play both sides
// ✅ Only current turn player can submit words
// ✅ Moves are append-only (can't edit history)
// ✅ Turn can only advance by current player
```

### 5. **Leaderboard** (Firestore)

```typescript
export class Leaderboard {
  async updatePlayerScore(
    userId: string,
    gameResult: {
      won: boolean;
      wordsUsed: number;
      averageWordLength: number;
      streak: number;
    }
  ) {
    const leaderboardRef = doc(firestore, "leaderboard", userId);
    const current = await getDoc(leaderboardRef);

    if (current.exists()) {
      // Update existing
      await updateDoc(leaderboardRef, {
        totalGames: increment(1),
        wins: increment(gameResult.won ? 1 : 0),
        losses: increment(gameResult.won ? 0 : 1),
        totalWords: increment(gameResult.wordsUsed),
        bestStreak:
          gameResult.streak > (current.data().bestStreak || 0)
            ? gameResult.streak
            : current.data().bestStreak,
        lastPlayed: serverTimestamp(),
      });
    } else {
      // Create new
      await setDoc(leaderboardRef, {
        userId,
        totalGames: 1,
        wins: gameResult.won ? 1 : 0,
        losses: gameResult.won ? 0 : 1,
        totalWords: gameResult.wordsUsed,
        bestStreak: gameResult.streak,
        lastPlayed: serverTimestamp(),
      });
    }
  }

  async getTopPlayers(limit: number = 10) {
    const q = query(
      collection(firestore, "leaderboard"),
      orderBy("wins", "desc"),
      orderBy("totalWords", "desc"),
      limit(limit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  }
}
```

---

## 📝 **Deployment Checklist**

### Initial Setup

```bash
# 1. Login to Firebase
npm run firebase:login

# 2. Verify project
firebase projects:list

# 3. Deploy all rules
npm run deploy:rules
```

### Regular Deployment

```bash
# Deploy everything
npm run deploy

# Or selective:
npm run deploy:hosting      # UI only
npm run deploy:firestore    # Firestore rules
npm run deploy:database     # Realtime DB rules
npm run deploy:rules        # Both databases
```

---

## 🔒 **Security Rules Summary**

### Firestore Rules (firestore.rules)

✅ **Users** - Only owner can read/write  
✅ **Leaderboard** - Public read, owner write  
✅ **Games** - Host creates, both players update  
✅ **Moves** - Append-only, immutable history  
✅ **Presence** - Owner only

### Realtime Database Rules (database.rules.json)

✅ **Seats** - Can only claim once, can't play both sides  
✅ **Turn** - Only current player can advance  
✅ **Words** - Append-only, must be your turn  
✅ **Status** - Only players in game can update  
✅ **Presence** - Owner only

---

## 💡 **Best Practices on Spark Plan**

### DO ✅

- Use Realtime Database for live gameplay (faster than Firestore)
- Use Firestore for stats/leaderboards (better queries)
- Enable App Check to prevent abuse
- Use Remote Config for feature flags
- Host dictionary.json as static file on Hosting
- Validate words client-side (your validator is already good)
- Use anonymous auth (unlimited users)
- Monitor usage in Firebase Console

### DON'T ❌

- Don't query large collections repeatedly
- Don't store large files (use external CDN)
- Don't hit 50K reads/day on Firestore (cache locally)
- Don't forget to deploy security rules
- Don't use Cloud Functions (requires Blaze)
- Don't store sensitive data unencrypted

---

## 📊 **Monitoring Usage**

### Check Quotas

```bash
# Open Firebase Console
npm run firebase:open

# Navigate to: Usage & billing
```

### Key Metrics to Watch

| Service           | Limit       | Warning | Action            |
| ----------------- | ----------- | ------- | ----------------- |
| Firestore Reads   | 50K/day     | >40K    | Add caching       |
| Firestore Writes  | 20K/day     | >15K    | Batch writes      |
| RTDB Bandwidth    | 10 GB/month | >8 GB   | Optimize payloads |
| Hosting Bandwidth | 360 MB/day  | >300 MB | Optimize assets   |

---

## 🎯 **Quick Reference Commands**

```bash
# Deploy
npm run deploy                 # Everything
npm run deploy:hosting         # UI only
npm run deploy:firestore      # Firestore rules
npm run deploy:database       # RTDB rules
npm run deploy:rules          # Both databases

# Firebase
npm run firebase:login        # Login
npm run firebase:open         # Open console

# Development
npm run dev                   # Start dev server
npm run build                 # Build for production
```

---

## 🎊 **Your Complete Free Stack**

**Frontend:**

- React 19 + TypeScript 5.8
- Vite 6 + TailwindCSS 4
- Motion (animations)
- Lucide React (icons)

**Backend (All FREE on Spark):**

- Firebase Hosting
- Anonymous Auth
- Realtime Database (live gameplay)
- Firestore (leaderboards, stats)
- Cloud Messaging (notifications)
- Remote Config (feature flags)
- Performance Monitoring
- App Check (security)

**No Cloud Functions needed!** ✅

---

## 📚 **Next Steps**

1. ✅ Deploy database rules: `npm run deploy:database`
2. ✅ Deploy Firestore rules: `npm run deploy:firestore`
3. 🆕 Enable App Check in Console
4. 🆕 Setup Remote Config values
5. 🆕 Add Performance Monitoring SDK
6. 🆕 Implement presence system
7. 🆕 Add turn timer with client-side countdown
8. 🆕 Create room code matchmaking

---

**Everything you need is FREE on Spark plan!** 🎉🔥

No upgrade needed for a fully-featured two-player real-time Shiritori game!
