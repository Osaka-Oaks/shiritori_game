import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getAuth, Auth } from "firebase/auth";
import { getFirebaseWebConfig } from "./firebase-env";

let app: FirebaseApp;
let database: Database;
let auth: Auth;

export function initFirebase() {
  const firebaseConfig = getFirebaseWebConfig();

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
  } else {
    app = getApps()[0];
    database = getDatabase(app);
    auth = getAuth(app);
  }

  return { app, database, auth };
}

export { app, database, auth };
