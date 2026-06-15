import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";
import { getAnalytics, logEvent, setUserProperties, Analytics } from "firebase/analytics";
import { getPerformance, trace, Performance } from "firebase/performance";
import { getRemoteConfig, fetchAndActivate, getValue, RemoteConfig } from "firebase/remote-config";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import firebaseConfig from "./firebase-applet-config.json";

// Initialize Firebase Core services
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Analytics (free on Spark)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
    console.log("✅ Firebase Analytics initialized");
  } catch (error) {
    console.warn("Analytics not available:", error);
  }
}

// Initialize Performance Monitoring (free on Spark)
let performance: Performance | null = null;
if (typeof window !== "undefined") {
  try {
    performance = getPerformance(app);
    console.log("✅ Firebase Performance Monitoring initialized");
  } catch (error) {
    console.warn("Performance Monitoring not available:", error);
  }
}

// Initialize Remote Config (free on Spark)
let remoteConfig: RemoteConfig | null = null;
if (typeof window !== "undefined") {
  try {
    remoteConfig = getRemoteConfig(app);
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
    remoteConfig.defaultConfig = {
      enable_voice_input: true,
      enable_local_multiplayer: true,
      max_hint_count: 3,
      timer_seconds_easy: 40,
      timer_seconds_medium: 25,
      timer_seconds_hard: 15,
      enable_ollama_ai: false,
      feature_unity_mode: false,
    };
    console.log("✅ Firebase Remote Config initialized");
  } catch (error) {
    console.warn("Remote Config not available:", error);
  }
}

// Initialize Cloud Messaging (free on Spark)
let messaging: Messaging | null = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    messaging = getMessaging(app);
    console.log("✅ Firebase Cloud Messaging initialized");
  } catch (error) {
    console.warn("Cloud Messaging not available:", error);
  }
}

export { analytics, performance, remoteConfig, messaging };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Zero-Trust Firestore standard error logger
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error logged: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Background Cloud Customizations Writer helper (with grace fallback)
export async function saveCustomizationsToFirestore(
  userId: string,
  customizations: any,
  name: string,
  avatarUrl: string
) {
  const path = `users/${userId}`;
  
  // Guard clause for safety when using placeholder keys
  if (firebaseConfig.apiKey === "placeholder-api-key") {
    console.log("Using transient guest customizations storage (Firebase is in standby mode)");
    return;
  }

  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      uid: userId,
      name,
      avatarUrl,
      ...customizations,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log("Customizations successfully synced to Firestore online for user:", userId);
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (e) {
      // Gracefully prevent runtime app crashing due to Firestore quota/offline limits
      console.warn("Cloud persistence skipped gracefully due to authorization/quota state.");
    }
  }
}

// ===== ANALYTICS HELPERS =====

/**
 * Track game events with Firebase Analytics
 */
export function trackGameEvent(eventName: string, params?: Record<string, any>) {
  if (!analytics) return;
  
  try {
    logEvent(analytics, eventName, params);
    console.log(`📊 Analytics: ${eventName}`, params);
  } catch (error) {
    console.warn("Analytics event failed:", error);
  }
}

/**
 * Track common game events
 */
export const GameAnalytics = {
  // Game lifecycle
  gameStarted: (mode: string, difficulty?: string) => {
    trackGameEvent("game_started", { mode, difficulty });
  },
  
  gameCompleted: (mode: string, winner: string, duration: number) => {
    trackGameEvent("game_completed", { mode, winner, duration_seconds: duration });
  },
  
  // Word events
  wordSubmitted: (word: string, valid: boolean, hiragana: string) => {
    trackGameEvent("word_submitted", { word, valid, hiragana });
  },
  
  wordValidated: (valid: boolean, reason?: string) => {
    trackGameEvent("word_validated", { valid, reason });
  },
  
  // Feature usage
  voiceInputUsed: (success: boolean) => {
    trackGameEvent("voice_input_used", { success });
  },
  
  hintRequested: (sound: string) => {
    trackGameEvent("hint_requested", { required_sound: sound });
  },
  
  powerupUsed: (powerup: string) => {
    trackGameEvent("powerup_used", { powerup_type: powerup });
  },
  
  // Multiplayer
  localGameStarted: (connectionMethod: string) => {
    trackGameEvent("local_game_started", { connection_method: connectionMethod });
  },
  
  multiplayerJoined: (roomId: string) => {
    trackGameEvent("multiplayer_joined", { room_id: roomId });
  },
  
  // User engagement
  tutorialViewed: (section: string) => {
    trackGameEvent("tutorial_viewed", { section });
  },
  
  achievementUnlocked: (achievement: string) => {
    trackGameEvent("achievement_unlocked", { achievement_name: achievement });
  }
};

/**
 * Set user properties for analytics segmentation
 */
export function setAnalyticsUserProperties(properties: Record<string, any>) {
  if (!analytics) return;
  
  try {
    setUserProperties(analytics, properties);
    console.log("📊 User properties set:", properties);
  } catch (error) {
    console.warn("Set user properties failed:", error);
  }
}

// ===== PERFORMANCE MONITORING HELPERS =====

/**
 * Create a performance trace
 */
export function startPerformanceTrace(traceName: string) {
  if (!performance) return null;
  
  try {
    const t = trace(performance, traceName);
    t.start();
    console.log(`⚡ Performance trace started: ${traceName}`);
    return t;
  } catch (error) {
    console.warn("Performance trace failed:", error);
    return null;
  }
}

/**
 * Common performance traces
 */
export const GamePerformance = {
  // Track word validation time
  trackWordValidation: async <T,>(fn: () => Promise<T>) => {
    const t = startPerformanceTrace("word_validation");
    try {
      const result = await fn();
      t?.stop();
      return result;
    } catch (error) {
      t?.stop();
      throw error;
    }
  },
  
  // Track AI response time
  trackAIResponse: async <T,>(provider: string, fn: () => Promise<T>) => {
    const t = startPerformanceTrace(`ai_response_${provider}`);
    try {
      const result = await fn();
      t?.stop();
      return result;
    } catch (error) {
      t?.stop();
      throw error;
    }
  },
  
  // Track page load
  trackPageLoad: (pageName: string) => {
    const t = startPerformanceTrace(`page_load_${pageName}`);
    // Auto-stop after short delay
    setTimeout(() => t?.stop(), 2000);
  },
  
  // Track game render
  trackGameRender: () => {
    const t = startPerformanceTrace("game_render");
    requestAnimationFrame(() => t?.stop());
  }
};

// ===== REMOTE CONFIG HELPERS =====

/**
 * Fetch and activate remote config
 */
export async function fetchRemoteConfig(): Promise<boolean> {
  if (!remoteConfig) return false;
  
  try {
    const activated = await fetchAndActivate(remoteConfig);
    console.log(`🎛️ Remote Config ${activated ? "activated" : "already active"}`);
    return activated;
  } catch (error) {
    console.warn("Remote Config fetch failed:", error);
    return false;
  }
}

/**
 * Get config value with type safety
 */
export function getConfigValue(key: string, defaultValue: any): any {
  if (!remoteConfig) return defaultValue;
  
  try {
    const value = getValue(remoteConfig, key);
    
    // Parse based on type
    if (typeof defaultValue === "boolean") {
      return value.asBoolean();
    } else if (typeof defaultValue === "number") {
      return value.asNumber();
    } else {
      return value.asString();
    }
  } catch (error) {
    console.warn(`Remote Config get value failed for ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Game feature flags from Remote Config
 */
export const FeatureFlags = {
  isVoiceInputEnabled: () => getConfigValue("enable_voice_input", true),
  isLocalMultiplayerEnabled: () => getConfigValue("enable_local_multiplayer", true),
  getMaxHintCount: () => getConfigValue("max_hint_count", 3),
  getTimerSeconds: (difficulty: string) => {
    const key = `timer_seconds_${difficulty}`;
    const defaults = { easy: 40, medium: 25, hard: 15 };
    return getConfigValue(key, defaults[difficulty as keyof typeof defaults] || 25);
  },
  isOllamaEnabled: () => getConfigValue("enable_ollama_ai", false),
  isUnityModeEnabled: () => getConfigValue("feature_unity_mode", false)
};

// ===== CLOUD MESSAGING (FCM) HELPERS =====

/**
 * Request notification permission and get FCM token
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (!messaging) {
    console.warn("FCM not available");
    return null;
  }
  
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      console.log("✅ Notification permission granted");
      
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: "YOUR_VAPID_KEY" // You'll need to generate this in Firebase Console
      });
      
      console.log("📱 FCM Token:", token);
      return token;
    } else {
      console.log("❌ Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("FCM token request failed:", error);
    return null;
  }
}

/**
 * Listen for foreground messages
 */
export function listenForMessages(callback: (payload: any) => void) {
  if (!messaging) return;
  
  onMessage(messaging, (payload) => {
    console.log("📬 Message received:", payload);
    callback(payload);
  });
}

/**
 * Game-specific notification helpers
 */
export const GameNotifications = {
  // Notify when opponent found
  opponentFound: (opponentName: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Opponent Found!", {
        body: `${opponentName} is ready to play!`,
        icon: "/icon-192.png",
        badge: "/badge-72.png"
      });
    }
  },
  
  // Notify when it's your turn
  yourTurn: () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Your Turn!", {
        body: "Time to play your next word!",
        icon: "/icon-192.png"
      });
    }
  },
  
  // Notify when you win
  gameWon: () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("You Won! 🎉", {
        body: "Congratulations on winning the Shiritori game!",
        icon: "/icon-192.png"
      });
    }
  }
};

// ===== ERROR TRACKING (CRASHLYTICS-LIKE) =====

/**
 * Track errors for debugging
 */
export function trackError(error: Error, context?: Record<string, any>) {
  // Log to Analytics as an error event
  trackGameEvent("error_occurred", {
    error_message: error.message,
    error_stack: error.stack,
    ...context
  });
  
  console.error("🐛 Error tracked:", error, context);
}

/**
 * Track custom errors
 */
export function trackCustomError(message: string, context?: Record<string, any>) {
  trackGameEvent("custom_error", {
    message,
    ...context
  });
  
  console.error("🐛 Custom error:", message, context);
}
