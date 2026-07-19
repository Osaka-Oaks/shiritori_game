import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirebaseWebConfig } from "./lib/firebase-env";

const firebaseConfig = getFirebaseWebConfig();

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

/** Resolves with the current user's uid, signing in anonymously if needed. */
export function ensureSignedIn(): Promise<string> {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        unsub();
        resolve(user.uid);
      }
    });
    if (!auth.currentUser) {
      signInAnonymously(auth).catch(err => {
        unsub();
        reject(err);
      });
    }
  });
}
