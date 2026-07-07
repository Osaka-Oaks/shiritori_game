# 🚀 Performance & Real-time Features Guide

## Overview

Your Shiritori game now includes:

- ✅ LINE Friends characters & stickers
- ✅ Sound effects with on/off toggle
- ✅ Advanced caching (IndexedDB)
- ✅ Performance monitoring
- ✅ Real-time multiplayer (WebSocket)
- ✅ Lag prevention system
- ✅ Response time optimization

---

## 🎨 LINE Friends Characters

### Characters Added (8 Total)

1. **Brown** (ブラウン) - Reliable bear - Easy
2. **Cony** (コニー) - Cheerful rabbit - Easy
3. **Sally** (サリー) - Cute chick - Easy
4. **Moon** (ムーン) - Cool moon - Medium
5. **James** (ジェームズ) - Sophisticated gentleman - Medium
6. **Jessica** (ジェシカ) - Fashionable cat - Medium
7. **Leonard** (レナード) - Smart frog - Hard
8. **Boss** (ボス) - Tiny but mighty - Hard

### Usage

```typescript
import { LINE_CHARACTERS, getLineCharacter } from "./lib/lineCharacters";

// Get all characters
const characters = LINE_CHARACTERS;

// Get specific character
const brown = getLineCharacter("brown");

// Convert to bot opponent
import { lineCharacterToBotOpponent } from "./lib/lineCharacters";
const bot = lineCharacterToBotOpponent(brown);
```

### Stickers

10+ emotional stickers for gameplay feedback:

- 😊 Happy
- 😢 Sad
- 😮 Surprised
- 💭 Thinking
- ❤️ Love
- 🎉 Excited

```typescript
import { getRandomStickerForEmotion } from "./lib/lineCharacters";

// Get random sticker for emotion
const happySticker = getRandomStickerForEmotion("happy");
```

---

## 🔊 Sound Effects System

### Features

- ✅ 17 different sound effects
- ✅ Master volume control
- ✅ Individual toggles (effects, music, notifications)
- ✅ LocalStorage persistence
- ✅ Preloading critical sounds
- ✅ Lazy loading optional sounds

### Sound Types

**UI Sounds:**

- `click` - Button clicks
- `whoosh` - Page transitions
- `pop` - Modal open/close
- `ding` - Success actions

**Game Feedback:**

- `correct` - Valid word
- `incorrect` - Invalid word
- `error` - Error message
- `success` - Achievement

**Game Results:**

- `win` - Game victory
- `lose` - Game defeat

**Emotions (LINE stickers):**

- `happy`, `sad`, `excited`, `think`, `love`, `surprise`, `chirp`

### Usage

```typescript
import { soundManager, playSound } from "./lib/soundEffects";

// Initialize (call once at app start)
await soundManager.initialize();

// Play sound
soundManager.play("correct");
// or
playSound("correct");

// Play with delay
soundManager.playWithDelay("win", 500);

// Configure
soundManager.setEnabled(true);
soundManager.setVolume(0.7); // 0-1
soundManager.setSoundEffects(true);
soundManager.setMusic(false);
soundManager.setNotifications(true);

// Stop all sounds
soundManager.stopAll();

// Check if enabled
if (soundManager.isEnabled()) {
  soundManager.play("click");
}
```

### React Hook

```tsx
import { useSoundManager } from "./lib/soundEffects";

function MyComponent() {
  const { config, play, setEnabled, setVolume } = useSoundManager();

  return (
    <div>
      <button onClick={() => play("click")}>Click Me</button>
      <input
        type="range"
        value={config.volume}
        onChange={e => setVolume(parseFloat(e.target.value))}
      />
    </div>
  );
}
```

---

## 💾 Advanced Caching System

### Features

- ✅ IndexedDB for persistent storage
- ✅ Memory cache for speed
- ✅ LRU/LFU/FIFO eviction strategies
- ✅ TTL (time-to-live) support
- ✅ Automatic cache warmup
- ✅ Batch operations
- ✅ Fallback to memory-only

### Cache Types

**4 Specialized Caches:**

1. **gameCache** - Game state (7 days TTL, 5000 max)
2. **wordCache** - Dictionary words (30 days TTL, 10000 max)
3. **apiCache** - API responses (24 hours TTL, 1000 max)
4. **assetCache** - Images/assets (7 days TTL, 500 max)

### Usage

```typescript
import { gameCache, wordCache, apiCache } from "./lib/advancedCache";

// Set cache entry
await gameCache.set("player_state", playerData);
await wordCache.set("word_いぬ", wordData, 7 * 24 * 60 * 60 * 1000); // Custom TTL

// Get cache entry
const data = await gameCache.get<PlayerState>("player_state");

// Check existence
const exists = await gameCache.has("player_state");

// Delete entry
await gameCache.delete("player_state");

// Clear all
await gameCache.clear();

// Batch operations
await wordCache.setMany([
  { key: "word1", value: data1 },
  { key: "word2", value: data2 },
]);

const results = await wordCache.getMany(["word1", "word2"]);

// Get statistics
const stats = await gameCache.getStats();
console.log("Cache size:", stats.size);
console.log("Memory size:", stats.memorySize);
console.log("Hit rate:", stats.hitRate);
```

### Benefits

- **Instant access** - Memory cache < 1ms
- **Persistent** - Data survives page reload
- **Offline support** - Works without internet
- **Automatic eviction** - Manages memory efficiently
- **Smart warmup** - Preloads frequent data

---

## ⚡ Performance Monitoring

### Metrics Tracked

- **FPS** (Frames Per Second)
- **Frame Time** (milliseconds)
- **Response Time** (user interaction delay)
- **Render Time** (component render duration)
- **Memory Usage** (heap size)
- **Lag Detection** (automatic)

### Usage

```typescript
import { performanceOptimizer } from "./lib/performanceOptimizer";

// Get current metrics
const metrics = performanceOptimizer.getMetrics();
console.log("FPS:", metrics.fps);
console.log("Response:", metrics.responseTime);
console.log("Lag:", metrics.lag);

// Measure response time
const startTime = performance.now();
// ... user action ...
performanceOptimizer.measureResponseTime("button_click", startTime);

// Measure render time
const renderStart = performance.now();
// ... component render ...
performanceOptimizer.measureRenderTime("GameRoom", renderStart);

// Get performance alerts
const alerts = performanceOptimizer.getAlerts("high");
alerts.forEach(alert => {
  console.warn(alert.message);
});
```

### React Hooks

```tsx
import { usePerformanceMonitor } from "./lib/performanceOptimizer";

function PerformanceDashboard() {
  const metrics = usePerformanceMonitor();

  return (
    <div>
      <div>FPS: {metrics.fps}</div>
      <div>Response: {metrics.responseTime}ms</div>
      <div>Status: {metrics.lag ? "⚠️ Lag" : "✅ Smooth"}</div>
    </div>
  );
}
```

### HOC for Component Tracking

```tsx
import { withPerformanceTracking } from "./lib/performanceOptimizer";

// Automatically track render time
const TrackedComponent = withPerformanceTracking(MyComponent, "MyComponent");
```

### Optimization Utilities

```typescript
// Debounce expensive operations
const debouncedSearch = performanceOptimizer.debounce(
  searchFunction,
  300 // ms
);

// Throttle frequent events
const throttledScroll = performanceOptimizer.throttle(
  handleScroll,
  100 // ms
);

// Batch DOM updates
performanceOptimizer.batchDOMUpdates([
  () => (element1.style.color = "red"),
  () => (element2.textContent = "Updated"),
  () => element3.classList.add("active"),
]);

// Lazy load images
performanceOptimizer.lazyLoadImage(imgElement, imageUrl);

// Preload critical assets
await performanceOptimizer.preloadAssets(["/images/hero.png", "/images/logo.png"]);
```

---

## 🌐 Real-time Multiplayer

### Features

- ✅ WebSocket connection
- ✅ Auto-reconnection with exponential backoff
- ✅ Heartbeat/ping-pong
- ✅ Latency tracking
- ✅ Optimistic updates
- ✅ State synchronization
- ✅ Player presence tracking

### Usage

```typescript
import { realtimeSync } from "./lib/realtimeSync";

// Connect to game room
await realtimeSync.connect("room_123", "player_abc");

// Listen to events
const unsubscribe = realtimeSync.on("state", state => {
  console.log("Game state updated:", state);
});

// Send move (optimistic update)
await realtimeSync.sendMove("いぬ");

// Get connection status
const status = realtimeSync.getConnectionStatus();
// 'disconnected' | 'connecting' | 'connected' | 'reconnecting'

// Get latency
const latency = realtimeSync.getLatency();
console.log("Ping:", latency, "ms");

// Disconnect
realtimeSync.disconnect();
```

### React Hook

```tsx
import { useRealtimeSync } from "./lib/realtimeSync";

function MultiplayerGame({ roomId }: { roomId: string }) {
  const { connected, latency, gameState, sendMove } = useRealtimeSync(roomId);

  return (
    <div>
      <div>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</div>
      <div>Latency: {latency}ms</div>
      <div>Players: {gameState?.players.length}</div>
      <button onClick={() => sendMove("ねこ")}>Play Word</button>
    </div>
  );
}
```

### Optimistic Updates

Moves appear instantly, then confirmed/rollback:

```typescript
// Player sees their move immediately
sendMove("いぬ"); // Shows instantly

// Meanwhile:
// 1. Sent to server
// 2. Server validates
// 3. Confirms or rejects
// 4. Rollback if rejected
```

### Connection Management

- **Auto-reconnect** - 5 attempts with exponential backoff
- **Heartbeat** - Ping every 10 seconds
- **Latency** - Tracked on every pong
- **State sync** - Cached locally for offline access

---

## 🚫 Lag Prevention

### Strategies Implemented

**1. Caching**

- IndexedDB for persistent data
- Memory cache for hot data
- Preloading critical assets

**2. Performance Monitoring**

- Real-time FPS tracking
- Response time measurement
- Automatic lag detection

**3. Optimization**

- Debouncing expensive operations
- Throttling frequent events
- Batching DOM updates
- Lazy loading images
- Virtualized lists

**4. Real-time Optimization**

- Optimistic updates
- State prediction
- Connection pooling
- Automatic reconnection

**5. Code Optimization**

- React.memo for components
- useMemo for expensive computations
- useCallback for stable references
- Code splitting
- Tree shaking

### Lag Detection

```typescript
const metrics = performanceOptimizer.getMetrics();

if (metrics.lag) {
  // FPS < 30
  // Show warning to user
  // Disable animations
  // Reduce quality
}

if (metrics.responseTime > 100) {
  // Response too slow
  // Queue operations
  // Show loading indicator
}
```

---

## 📊 Response Time Optimization

### Targets

| Metric        | Target | Acceptable | Poor   |
| ------------- | ------ | ---------- | ------ |
| FPS           | 60     | 30-59      | <30    |
| Response Time | <50ms  | <100ms     | >100ms |
| Render Time   | <16ms  | <33ms      | >33ms  |
| Latency       | <50ms  | <100ms     | >100ms |

### Optimization Techniques

**1. Async Operations**

```typescript
import { measureAsyncOperation } from "./lib/performanceOptimizer";

const result = await measureAsyncOperation(() => fetch("/api/validate"), "api_validate");
```

**2. Component Optimization**

```tsx
import React, { memo, useMemo, useCallback } from "react";

const OptimizedComponent = memo(({ data }) => {
  const processed = useMemo(() => processData(data), [data]);
  const handler = useCallback(() => handleAction(), []);

  return <div>{processed}</div>;
});
```

**3. Lazy Loading**

```tsx
const Game2D = React.lazy(() => import("./components/Game2D"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Game2D />
    </Suspense>
  );
}
```

**4. Virtual Scrolling**

```tsx
const visibleItems = performanceOptimizer.virtualizeList(allItems, { start: 0, end: 50 });
```

---

## 🎮 Settings UI

### Features

**Audio Settings:**

- Master audio toggle
- Volume slider (0-100%)
- Sound effects toggle
- Background music toggle
- Notifications toggle
- Test sound button

**Performance Dashboard:**

- Real-time FPS display
- Response time graph
- Render time metrics
- Memory usage indicator
- Lag status indicator
- Color-coded alerts (green/yellow/red)

### Integration

```tsx
import SettingsView from "./components/SettingsView";

function App() {
  const [view, setView] = useState("home");

  if (view === "settings") {
    return <SettingsView onBack={() => setView("home")} />;
  }

  return <HomeView onOpenSettings={() => setView("settings")} />;
}
```

---

## 🔧 Configuration

### Sound Configuration

```typescript
// Default configuration
{
  enabled: true,
  volume: 0.7,
  soundEffects: true,
  music: false,
  notifications: true,
}

// Saved in: localStorage.soundConfig
```

### Cache Configuration

```typescript
// Custom cache instance
import AdvancedCache from "./lib/advancedCache";

const myCache = new AdvancedCache({
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
  maxSize: 5000,
  strategy: "LRU", // or 'LFU' or 'FIFO'
});
```

### Performance Thresholds

```typescript
// In performanceOptimizer.ts
private readonly FPS_THRESHOLD = 30;
private readonly FRAME_TIME_THRESHOLD = 33.33;
private readonly RESPONSE_TIME_THRESHOLD = 100;
private readonly RENDER_TIME_THRESHOLD = 16.67;
```

---

## 📈 Monitoring & Analytics

### Performance Alerts

```typescript
// Get all alerts
const allAlerts = performanceOptimizer.getAlerts();

// Get high severity only
const criticalAlerts = performanceOptimizer.getAlerts("high");

// Clear alerts
performanceOptimizer.clearAlerts();
```

### Cache Statistics

```typescript
const stats = await wordCache.getStats();
console.log({
  totalSize: stats.size,
  inMemory: stats.memorySize,
  hitRate: stats.hitRate,
});
```

### Connection Monitoring

```typescript
realtimeSync.on("latency", latency => {
  console.log("Current latency:", latency, "ms");
});

realtimeSync.on("connected", () => {
  console.log("✅ Connected");
});

realtimeSync.on("disconnected", () => {
  console.log("❌ Disconnected");
});

realtimeSync.on("reconnecting", () => {
  console.log("🔄 Reconnecting...");
});
```

---

## 🎯 Best Practices

### 1. Initialize Early

```typescript
// In App.tsx or main.tsx
import { soundManager } from "./lib/soundEffects";
import { performanceOptimizer } from "./lib/performanceOptimizer";

async function initializeApp() {
  await soundManager.initialize();
  performanceOptimizer.startMonitoring();
}

initializeApp();
```

### 2. Cache Strategically

```typescript
// Cache expensive API calls
const getCachedWord = async (word: string) => {
  const cached = await wordCache.get(word);
  if (cached) return cached;

  const result = await fetchWordFromAPI(word);
  await wordCache.set(word, result);
  return result;
};
```

### 3. Measure Everything

```typescript
// Track all user interactions
const handleClick = async () => {
  const startTime = performance.now();
  await doExpensiveOperation();
  performanceOptimizer.measureResponseTime("expensive_op", startTime);
};
```

### 4. Optimize Renders

```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* ... */}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.data.id === nextProps.data.id;
});
```

### 5. Handle Offline Gracefully

```typescript
if (!navigator.onLine) {
  // Use cached data
  const cachedState = await gameCache.get("last_state");
  if (cachedState) {
    loadState(cachedState);
  }
}
```

---

## 🚀 Performance Checklist

- [ ] Sound system initialized
- [ ] Performance monitoring started
- [ ] Critical assets preloaded
- [ ] Cache warmed up
- [ ] Real-time connection established
- [ ] Optimistic updates enabled
- [ ] Error handlers in place
- [ ] Analytics tracking
- [ ] Offline fallbacks configured
- [ ] User settings persisted

---

## 🎊 Summary

Your game now has:

✅ **LINE Friends** - 8 characters + 10+ stickers  
✅ **Sound System** - 17 effects with full control  
✅ **Advanced Caching** - IndexedDB + memory  
✅ **Performance Monitoring** - Real-time metrics  
✅ **Real-time Multiplayer** - WebSocket with optimistic updates  
✅ **Lag Prevention** - Multiple strategies  
✅ **Response Optimization** - <100ms target  
✅ **Settings UI** - Complete control panel

**Result:** Ultra-fast, lag-free multiplayer experience! 🚀🎮✨

---

**Run this to test:**

```typescript
import { soundManager } from "./lib/soundEffects";
import { performanceOptimizer } from "./lib/performanceOptimizer";

// Initialize
await soundManager.initialize();
soundManager.play("success");

// Check performance
const metrics = performanceOptimizer.getMetrics();
console.log("FPS:", metrics.fps);
console.log("No lag:", !metrics.lag);
```

🎉 **Enjoy your optimized game!** 🎉
