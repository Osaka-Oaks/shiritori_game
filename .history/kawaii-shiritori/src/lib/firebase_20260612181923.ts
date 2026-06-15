import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

// Initialize Firebase Core services
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
