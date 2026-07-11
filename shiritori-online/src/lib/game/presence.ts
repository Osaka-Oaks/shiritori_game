import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/database";
import { db, auth } from "../../firebase";

/**
 * Ensure user is authenticated before database operations.
 */
function ensureAuth(): void {
  if (!auth.currentUser) {
    throw new Error("Authentication required. Please wait for sign-in to complete.");
  }
}

export interface PresenceState {
  online: boolean;
  lastSeen: number;
  inGame?: string;
}

/** Mark this player online; auto-offline on disconnect/tab close. */
export function initPresence(uid: string, gameCode?: string): () => void {
  ensureAuth(); // Verify authentication before database operation

  const presenceRef = ref(db, `presence/${uid}`);
  const connectedRef = ref(db, ".info/connected");

  const unsub = onValue(connectedRef, snap => {
    if (snap.val() !== true) return;

    const payload: PresenceState = {
      online: true,
      lastSeen: Date.now(),
      ...(gameCode ? { inGame: gameCode } : {}),
    };

    set(presenceRef, payload);
    onDisconnect(presenceRef).set({ online: false, lastSeen: serverTimestamp() });
  });

  return () => {
    unsub();
    set(presenceRef, { online: false, lastSeen: Date.now() });
  };
}

/** Watch an opponent's presence (online / last seen). */
export function watchPresence(uid: string, cb: (state: PresenceState | null) => void): Unsubscribe {
  return onValue(ref(db, `presence/${uid}`), snap => {
    cb(snap.exists() ? (snap.val() as PresenceState) : null);
  });
}

/** Send a quick emoji reaction visible to both players (writes to reactions/{code}/{seat}). */
export async function sendReaction(gameCode: string, seat: number, emoji: string): Promise<void> {
  await set(ref(db, `reactions/${gameCode}/${seat}`), emoji.slice(0, 8));
}

export function watchReactions(
  gameCode: string,
  cb: (reactions: Record<string, string>) => void
): Unsubscribe {
  return onValue(ref(db, `reactions/${gameCode}`), snap => {
    cb(snap.exists() ? (snap.val() as Record<string, string>) : {});
  });
}
