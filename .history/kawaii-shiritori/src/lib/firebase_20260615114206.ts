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
