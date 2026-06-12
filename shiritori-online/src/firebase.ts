import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Config for the "shiritori-game-ccaae" project. Client Firebase keys are safe to
// ship — access is controlled by the Realtime Database rules (database.rules.json).
// You can override any value with a matching VITE_FIREBASE_* var in a .env file.
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyAOr3y32r7OG1EfX6728LRK4hR7rHV7x_k",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "shiritori-game-ccaae.firebaseapp.com",
  databaseURL:
    env.VITE_FIREBASE_DATABASE_URL ||
    "https://shiritori-game-ccaae-default-rtdb.firebaseio.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "shiritori-game-ccaae",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "shiritori-game-ccaae.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "324507601155",
  appId: env.VITE_FIREBASE_APP_ID || "1:324507601155:web:d69804f7cf3dba96ec4136",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

/** Resolves with the current user's uid, signing in anonymously if needed. */
export function ensureSignedIn(): Promise<string> {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsub();
        resolve(user.uid);
      }
    });
    if (!auth.currentUser) {
      signInAnonymously(auth).catch((err) => {
        unsub();
        reject(err);
      });
    }
  });
}
