/**
 * Authentication Debugging Utilities
 * Use these in browser console to diagnose PERMISSION_DENIED errors
 */

import { auth } from "../firebase";
import { ref, get } from "firebase/database";
import { db } from "../firebase";

/**
 * Check current authentication state
 * Usage in console: import('./utils/debug-auth').then(m => m.checkAuth())
 */
export function checkAuth() {
  console.log("🔐 Authentication Status:");
  console.log("  Current User:", auth.currentUser);
  console.log("  UID:", auth.currentUser?.uid || "NOT SIGNED IN");
  console.log("  Is Anonymous:", auth.currentUser?.isAnonymous);
  console.log("  Email:", auth.currentUser?.email || "N/A");
  console.log("  Auth Ready:", !!auth.currentUser);

  if (!auth.currentUser) {
    console.error("❌ NO USER SIGNED IN - This will cause PERMISSION_DENIED!");
    console.log("💡 Solution: Wait for sign-in or call ensureSignedIn()");
  } else {
    console.log("✅ User is authenticated");
  }

  return {
    authenticated: !!auth.currentUser,
    uid: auth.currentUser?.uid,
    isAnonymous: auth.currentUser?.isAnonymous,
  };
}

/**
 * Test database read permission
 */
export async function testDatabaseRead() {
  console.log("🔍 Testing Database Read Permission...");

  if (!auth.currentUser) {
    console.error("❌ Cannot test - no user signed in");
    return false;
  }

  try {
    const testRef = ref(db, "games");
    const snapshot = await get(testRef);
    console.log("✅ Database READ successful");
    console.log("  Games exist:", snapshot.exists());
    console.log("  Data:", snapshot.val());
    return true;
  } catch (error: any) {
    console.error("❌ Database READ failed:", error.message);
    console.error("  Error code:", error.code);

    if (error.code === "PERMISSION_DENIED") {
      console.log("🔥 PERMISSION_DENIED detected!");
      console.log("  Possible causes:");
      console.log("  1. User not authenticated (check auth.currentUser)");
      console.log("  2. Security rules not deployed");
      console.log("  3. Anonymous auth not enabled in Firebase Console");
      console.log("  4. Wrong Firebase project");
    }

    return false;
  }
}

/**
 * Test database write permission
 */
export async function testDatabaseWrite() {
  console.log("🔍 Testing Database Write Permission...");

  if (!auth.currentUser) {
    console.error("❌ Cannot test - no user signed in");
    return false;
  }

  try {
    const testRef = ref(db, `presence/${auth.currentUser.uid}`);
    await get(testRef);
    console.log("✅ Database WRITE test completed");
    console.log("  Note: Write permissions depend on security rules");
    return true;
  } catch (error: any) {
    console.error("❌ Database access failed:", error.message);
    return false;
  }
}

/**
 * Complete diagnostic check
 */
export async function runDiagnostics() {
  console.log("🏥 Running Firebase Diagnostics...\n");

  const authStatus = checkAuth();
  console.log("\n");

  if (authStatus.authenticated) {
    await testDatabaseRead();
    console.log("\n");
    await testDatabaseWrite();
  } else {
    console.warn("⚠️ Skipping database tests - user not authenticated");
    console.log("💡 Refresh the page and wait 2 seconds, then run diagnostics again");
  }

  console.log("\n✅ Diagnostics complete");
}

/**
 * Monitor auth state changes
 */
export function watchAuth() {
  console.log("👁️ Watching authentication state changes...");
  console.log("(Run stopWatchingAuth() to stop)\n");

  const unsubscribe = auth.onAuthStateChanged(user => {
    console.log(`[${new Date().toLocaleTimeString()}] Auth state changed:`, {
      authenticated: !!user,
      uid: user?.uid,
      isAnonymous: user?.isAnonymous,
    });
  });

  // Store unsubscribe function globally for easy access
  (window as any).__stopWatchingAuth = unsubscribe;

  console.log("💡 Run stopWatchingAuth() to stop monitoring");

  return unsubscribe;
}

/**
 * Stop watching auth
 */
export function stopWatchingAuth() {
  const unsub = (window as any).__stopWatchingAuth;
  if (unsub) {
    unsub();
    delete (window as any).__stopWatchingAuth;
    console.log("✅ Stopped watching auth state");
  } else {
    console.log("⚠️ No active auth watcher found");
  }
}

// Make functions available globally for console access
if (typeof window !== "undefined") {
  (window as any).debugAuth = {
    checkAuth,
    testDatabaseRead,
    testDatabaseWrite,
    runDiagnostics,
    watchAuth,
    stopWatchingAuth,
  };

  console.log("🛠️ Debug utilities loaded!");
  console.log("💡 Run in console: debugAuth.runDiagnostics()");
}

export default {
  checkAuth,
  testDatabaseRead,
  testDatabaseWrite,
  runDiagnostics,
  watchAuth,
  stopWatchingAuth,
};
