# 🔥 Firebase Services Integration Guide

## ✅ What You Already Have

Your Shiritori Game is already using:
- ✅ **Firebase Hosting** - Deployed at shiritori-game-ccaae.web.app
- ✅ **Realtime Database** - For multiplayer game state
- ✅ **Firestore** - For user profiles and customizations
- ✅ **Authentication** - Anonymous auth enabled

## 🆕 What We Just Added (All FREE on Spark Plan)

### 1. 📊 **Firebase Analytics**
### 2. ⚡ **Performance Monitoring**
### 3. 🎛️ **Remote Config**
### 4. 📱 **Cloud Messaging (FCM)**
### 5. 🐛 **Error Tracking**

---

## 📊 Firebase Analytics (FREE)

### What It Does
Tracks user behavior, game events, and engagement metrics.

### What We Track

**Game Lifecycle:**
- `game_started` - When a game begins
- `game_completed` - When a game ends (with winner & duration)

**Word Events:**
- `word_submitted` - Every word played
- `word_validated` - Validation results

**Features Used:**
- `voice_input_used` - Voice typing usage
- `hint_requested` - Hint system usage
- `powerup_used` - Power-up activation

**Multiplayer:**
- `local_game_started` - Local multiplayer sessions
- `multiplayer_joined` - Online multiplayer joins

**Engagement:**
- `tutorial_viewed` - Rules/tutorial views
- `achievement_unlocked` - Achievements earned

### How to Use

**Import:**
```typescript
import { GameAnalytics } from '@/lib/firebase';
```

**Track Events:**
```typescript
// When game starts
GameAnalytics.gameStarted("bot_match", "easy");

// When word is submitted
GameAnalytics.wordSubmitted("neko", true, "ねこ");

// When voice input is used
GameAnalytics.voiceInputUsed(true);

// When game ends
GameAnalytics.gameCompleted("bot_match", "player", 120);
```

### View Analytics Dashboard

1. Go to: https://console.firebase.google.com/project/shiritori-game-ccaae/analytics
2. Click **Dashboard** to see:
   - Active users
   - Engagement metrics
   - User retention
   - Event counts
3. Click **Events** to see all tracked events
4. Click **DebugView** for real-time event testing

### Cost
**100% FREE** - Unlimited events and reporting on Spark plan

---

## ⚡ Performance Monitoring (FREE)

### What It Does
Tracks app performance metrics like load times, network requests, and custom traces.

### What We Track

**Custom Traces:**
- `word_validation` - Time to validate a word
- `ai_response_gemini` - Gemini AI response time
- `ai_response_ollama` - Ollama AI response time
- `page_load_*` - Page load performance
- `game_render` - Render performance

**Automatic Tracking:**
- Page load times
- Network requests
- HTTP/S latency

### How to Use

**Import:**
```typescript
import { GamePerformance } from '@/lib/firebase';
```

**Track Performance:**
```typescript
// Wrap word validation
const result = await GamePerformance.trackWordValidation(async () => {
  return await fetch('/api/gemini/evaluate-word', { ... });
});

// Track AI response time
const move = await GamePerformance.trackAIResponse('gemini', async () => {
  return await fetch('/api/gemini/opponent-turn', { ... });
});

// Track page load
GamePerformance.trackPageLoad('game_room');
```

### View Performance Dashboard

1. Go to: https://console.firebase.google.com/project/shiritori-game-ccaae/performance
2. See metrics for:
   - Page load times
   - Network requests
   - Custom traces
   - User sessions

### Cost
**100% FREE** on Spark plan

---

## 🎛️ Remote Config (FREE)

### What It Does
Change app behavior without deploying new code. Enable/disable features remotely.

### Features You Can Control

**Feature Flags:**
```typescript
{
  enable_voice_input: true,          // Voice typing on/off
  enable_local_multiplayer: true,    // Local play on/off
  max_hint_count: 3,                 // How many hints available
  timer_seconds_easy: 40,            // Easy mode timer
  timer_seconds_medium: 25,          // Medium mode timer
  timer_seconds_hard: 15,            // Hard mode timer
  enable_ollama_ai: false,           // Ollama AI on/off
  feature_unity_mode: false          // Unity mode on/off
}
```

### How to Use

**Import:**
```typescript
import { FeatureFlags, fetchRemoteConfig } from '@/lib/firebase';
```

**Fetch Config (on app start):**
```typescript
// In App.tsx useEffect
React.useEffect(() => {
  fetchRemoteConfig();
}, []);
```

**Use Feature Flags:**
```typescript
// Check if voice input enabled
if (FeatureFlags.isVoiceInputEnabled()) {
  // Show voice button
}

// Get timer seconds based on difficulty
const timerSeconds = FeatureFlags.getTimerSeconds("easy"); // 40

// Check if Ollama AI enabled
if (FeatureFlags.isOllamaEnabled()) {
  // Use Ollama instead of Gemini
}
```

### Setup in Firebase Console

1. Go to: https://console.firebase.google.com/project/shiritori-game-ccaae/config
2. Click **Add parameter**
3. Add each config key with default value
4. Click **Publish changes**
5. Changes go live immediately (clients refresh every 1 hour)

### A/B Testing with Remote Config

You can create **experiments** to test features:
1. Go to Remote Config
2. Click **Create experiment**
3. Choose feature flag to test
4. Set variants (e.g., 50% with voice, 50% without)
5. Monitor which performs better

### Cost
**100% FREE** - Up to 300 parameters on Spark plan

---

## 📱 Cloud Messaging (FCM) - FREE

### What It Does
Send push notifications to users even when app is closed.

### Setup Steps

#### 1. Generate VAPID Key

1. Go to: https://console.firebase.google.com/project/shiritori-game-ccaae/settings/cloudmessaging
2. Click **Web Push certificates**
3. Click **Generate key pair**
4. Copy the key (starts with `B...`)
5. Update in `src/lib/firebase.ts`:

```typescript
const token = await getToken(messaging, {
  vapidKey: "YOUR_VAPID_KEY_HERE" // Paste your key
});
```

#### 2. Request Permission

**Import:**
```typescript
import { requestNotificationPermission, listenForMessages } from '@/lib/firebase';
```

**Request on app load:**
```typescript
// In App.tsx
React.useEffect(() => {
  const setupNotifications = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      console.log("FCM Token:", token);
      // Save token to database for sending notifications later
    }
  };
  
  setupNotifications();
  
  // Listen for foreground messages
  listenForMessages((payload) => {
    console.log("Message received:", payload);
    // Show in-app notification
  });
}, []);
```

#### 3. Send Notifications

**From Firebase Console:**
1. Go to: https://console.firebase.google.com/project/shiritori-game-ccaae/notification
2. Click **Send your first message**
3. Enter notification details
4. Select target (all users or specific segments)
5. Click **Publish**

**Programmatically (requires backend):**
```typescript
// This would be in your backend/Cloud Functions
await admin.messaging().send({
  token: userFCMToken,
  notification: {
    title: "Opponent Found!",
    body: "Sarah is ready to play!",
  },
  data: {
    type: "opponent_found",
    opponentId: "abc123"
  }
});
```

### Game Notifications

**Use built-in helpers:**
```typescript
import { GameNotifications } from '@/lib/firebase';

// Notify when opponent found
GameNotifications.opponentFound("Sarah");

// Notify when it's player's turn
GameNotifications.yourTurn();

// Notify when player wins
GameNotifications.gameWon();
```

### Cost
**100% FREE** - Unlimited messages on Spark plan

---

## 🐛 Error Tracking (FREE)

### What It Does
Tracks errors and crashes for debugging. Like Crashlytics but using Analytics.

### How to Use

**Import:**
```typescript
import { trackError, trackCustomError } from '@/lib/firebase';
```

**Track Errors:**
```typescript
try {
  // Your code
  const result = await someRiskyOperation();
} catch (error) {
  trackError(error as Error, {
    context: "word_validation",
    word: "neko",
    userId: auth.currentUser?.uid
  });
}

// Or track custom errors
if (invalidCondition) {
  trackCustomError("Invalid game state", {
    gameState: currentState,
    expectedState: "PLAYING"
  });
}
```

### View Errors

1. Go to Analytics Dashboard
2. Click **Events**
3. Filter by event name: `error_occurred` or `custom_error`
4. See error details, frequency, and affected users

### Cost
**100% FREE** as part of Analytics

---

## 🔐 App Check (Security)

### What It Does
Protects your backend APIs from abuse and unauthorized clients.

### Setup (Recommended for Production)

1. Go to: https://console.firebase.google.com/project/shiritori-game-ccaae/appcheck
2. Click **Apps** → **Web**
3. Choose verification method:
   - **reCAPTCHA v3** (easiest)
   - **reCAPTCHA Enterprise** (better)
4. Register your domain
5. Copy site key

6. Add to your app:
```typescript
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// In firebase.ts
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('YOUR_SITE_KEY'),
  isTokenAutoRefreshEnabled: true
});
```

### Cost
**FREE** for reCAPTCHA v3 (1M verifications/month)

---

## 📈 Analytics Dashboard Overview

### Available Reports (All FREE)

**Dashboard:**
- Active users (today, 7 days, 30 days)
- User engagement
- Revenue (if you add in-app purchases later)
- Retention cohorts
- User properties

**Events:**
- All custom events you track
- Event counts and trends
- Top events by volume
- Event parameters

**Audiences:**
- Create user segments
- Target specific user groups
- Use for A/B testing
- Use for targeted notifications

**DebugView:**
- Real-time event tracking
- Test your analytics
- See events as they happen
- Debug event parameters

### Enable DebugView

**On Local Development:**
```typescript
// Set before initializing Analytics
window['GA_DEBUG_MODE'] = true;
```

**View:**
Go to: https://console.firebase.google.com/project/shiritori-game-ccaae/analytics/app/web:d69804f7cf3dba96ec4136/debugview

---

## 🚀 Quick Implementation Checklist

### 1. Analytics ✅ (Already Added)
- [x] Import GameAnalytics
- [ ] Track game_started in App.tsx
- [ ] Track word_submitted in GameRoomView.tsx
- [ ] Track voice_input_used in VoiceInputButton.tsx
- [ ] View in Firebase Console

### 2. Performance Monitoring ✅ (Already Added)
- [x] Import GamePerformance
- [ ] Wrap API calls with trackAIResponse
- [ ] Add trackPageLoad to route changes
- [ ] View metrics in Firebase Console

### 3. Remote Config ✅ (Already Added)
- [x] Import FeatureFlags
- [ ] Call fetchRemoteConfig on app start
- [ ] Replace hard-coded values with FeatureFlags
- [ ] Set up parameters in Firebase Console

### 4. Cloud Messaging 🔧 (Needs VAPID Key)
- [x] Import requestNotificationPermission
- [ ] Generate VAPID key in Firebase Console
- [ ] Update firebase.ts with your VAPID key
- [ ] Request permission on app start
- [ ] Test notifications

### 5. Error Tracking ✅ (Already Added)
- [x] Import trackError
- [ ] Add try-catch blocks with trackError
- [ ] View errors in Analytics

---

## 💻 Code Examples

### Example 1: Add Analytics to GameRoomView

```typescript
import { GameAnalytics } from '@/lib/firebase';

// In GameRoomView.tsx
React.useEffect(() => {
  // Track game start
  GameAnalytics.gameStarted("bot_match", selectedBot.difficulty);
  
  return () => {
    // Track game completion on unmount
    const winner = playerScore > opponentScore ? "player" : "opponent";
    const duration = Math.floor((Date.now() - startTime) / 1000);
    GameAnalytics.gameCompleted("bot_match", winner, duration);
  };
}, []);

// When word is submitted
const handleSubmitWord = async () => {
  const result = await validateWord(playerInput);
  
  // Track submission
  GameAnalytics.wordSubmitted(playerInput, result.valid, result.hiragana);
};

// When hint is used
const handleRequestHint = () => {
  GameAnalytics.hintRequested(lastSound);
  // ... rest of hint logic
};
```

### Example 2: Add Performance Tracking

```typescript
import { GamePerformance } from '@/lib/firebase';

// Wrap API call
const validateWord = async (word: string) => {
  return await GamePerformance.trackAIResponse('gemini', async () => {
    const response = await fetch('/api/gemini/evaluate-word', {
      method: 'POST',
      body: JSON.stringify({ word })
    });
    return response.json();
  });
};
```

### Example 3: Use Remote Config

```typescript
import { FeatureFlags, fetchRemoteConfig } from '@/lib/firebase';

// In App.tsx
React.useEffect(() => {
  // Fetch on mount
  fetchRemoteConfig();
}, []);

// In GameRoomView.tsx
const maxHints = FeatureFlags.getMaxHintCount(); // Gets value from Remote Config
const [hintCount, setHintCount] = React.useState(maxHints);

const timerSeconds = FeatureFlags.getTimerSeconds(selectedBot.difficulty);
const [timeLeft, setTimeLeft] = React.useState(timerSeconds);
```

### Example 4: Add Notifications

```typescript
import { requestNotificationPermission, GameNotifications } from '@/lib/firebase';

// In App.tsx
React.useEffect(() => {
  requestNotificationPermission().then(token => {
    if (token) {
      console.log("Notifications enabled:", token);
    }
  });
}, []);

// When opponent connects (Local Multiplayer)
const handleDeviceConnected = (device: NearbyDevice) => {
  setConnectedDevice(device);
  GameNotifications.opponentFound(device.name);
};
```

---

## 📦 Required Dependencies

All Firebase packages are **already included** in your project!

**Current packages:**
```json
{
  "firebase": "^10.7.1",
  "@firebase/analytics": "included",
  "@firebase/performance": "included",
  "@firebase/remote-config": "included",
  "@firebase/messaging": "included"
}
```

No additional installation needed! ✅

---

## 🎯 Recommended Next Steps

### Phase 1: Analytics (Easy)
1. ✅ Already integrated
2. Add tracking calls to GameRoomView
3. Add tracking to HomeView
4. View dashboard after playing a few games

### Phase 2: Performance (Easy)
1. ✅ Already integrated
2. Wrap API calls with performance traces
3. View metrics in console

### Phase 3: Remote Config (Medium)
1. ✅ Already integrated
2. Set up parameters in Firebase Console
3. Replace hard-coded values with FeatureFlags
4. Test A/B experiments

### Phase 4: Notifications (Medium)
1. Generate VAPID key
2. Update firebase.ts
3. Request permission on app load
4. Test sending notifications

### Phase 5: App Check (Advanced)
1. Set up reCAPTCHA v3
2. Add App Check SDK
3. Verify backend requests

---

## 🔗 Useful Links

**Your Firebase Project:**
- Console: https://console.firebase.google.com/project/shiritori-game-ccaae
- Analytics: https://console.firebase.google.com/project/shiritori-game-ccaae/analytics
- Performance: https://console.firebase.google.com/project/shiritori-game-ccaae/performance
- Remote Config: https://console.firebase.google.com/project/shiritori-game-ccaae/config
- Cloud Messaging: https://console.firebase.google.com/project/shiritori-game-ccaae/notification

**Documentation:**
- Analytics: https://firebase.google.com/docs/analytics/get-started?platform=web
- Performance: https://firebase.google.com/docs/perf-mon/get-started-web
- Remote Config: https://firebase.google.com/docs/remote-config/get-started?platform=web
- FCM: https://firebase.google.com/docs/cloud-messaging/js/client

---

## ⚠️ Spark Plan Limitations

### What You CAN'T Use (Requires Blaze)
- ❌ Cloud Functions (serverless backend)
- ❌ Many Extensions (require Functions)
- ❌ Outbound network calls from backend

### What You CAN Use (All FREE)
- ✅ Analytics (unlimited)
- ✅ Performance Monitoring (unlimited)
- ✅ Remote Config (300 parameters)
- ✅ Cloud Messaging (unlimited)
- ✅ Hosting (10GB storage)
- ✅ Realtime Database (1GB storage)
- ✅ Firestore (1GB storage)
- ✅ Authentication (unlimited users)
- ✅ Crashlytics (free)
- ✅ Test Lab (5/day)
- ✅ App Distribution (unlimited)
- ✅ A/B Testing (unlimited)

---

## 🎉 Summary

### What You Have Now

✅ **Analytics** - Track every game event
✅ **Performance Monitoring** - Optimize app speed
✅ **Remote Config** - Control features remotely
✅ **Cloud Messaging** - Send push notifications
✅ **Error Tracking** - Debug issues easily
✅ **Crashlytics-like** - Error reporting via Analytics

### What It Costs

**$0.00 per month** - Everything is FREE on Spark plan!

### What You Get

- Real-time user analytics
- Performance insights
- A/B testing capability
- Push notifications
- Remote feature flags
- Error tracking
- All without upgrading to paid plan

**Your game now has enterprise-level monitoring and engagement tools!** 🚀

がんばってください！🔥
