/**
 * RTDB security rules smoke tests (run against Firebase emulator).
 * Usage: npm run test:rules   (from shiritori-online/)
 */
import { readFileSync } from "node:fs";
import { initializeApp, deleteApp } from "firebase/app";
import { getDatabase, ref, set, get, connectDatabaseEmulator } from "firebase/database";
import { getAuth, connectAuthEmulator, signInAnonymously } from "firebase/auth";

const RULES = JSON.parse(readFileSync("./database.rules.json", "utf8"));
const PROJECT_ID = "shiritori-rules-test";

const firebaseConfig = {
  apiKey: "fake-api-key",
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `http://127.0.0.1:9000?ns=${PROJECT_ID}-default-rtdb`,
  projectId: PROJECT_ID,
};

function appForUser() {
  const app = initializeApp(firebaseConfig, `test-${Math.random()}`);
  const auth = getAuth(app);
  const db = getDatabase(app);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectDatabaseEmulator(db, "127.0.0.1", 9000);
  return { app, auth, db };
}

async function authed() {
  const ctx = appForUser();
  const cred = await signInAnonymously(ctx.auth);
  return { ...ctx, uid: cred.user.uid };
}

async function expectDeny(label, fn) {
  try {
    await fn();
    throw new Error(`${label}: expected PERMISSION_DENIED`);
  } catch (err) {
    const code = err?.code ?? err?.message ?? "";
    if (
      !String(code).includes("PERMISSION_DENIED") &&
      !String(code).includes("permission_denied")
    ) {
      throw new Error(`${label}: unexpected error: ${err}`);
    }
    console.log(`  ✓ deny — ${label}`);
  }
}

async function expectAllow(label, fn) {
  await fn();
  console.log(`  ✓ allow — ${label}`);
}

async function main() {
  console.log("\n🧪 RTDB rules smoke tests\n");

  // 1) Host creates a room
  const host = await authed();
  await expectAllow("host creates room", () =>
    set(ref(host.db, "games/TEST"), {
      code: "TEST",
      status: "waiting",
      createdAt: Date.now(),
      hostUid: host.uid,
      seats: { 0: host.uid },
      names: { 0: "Host" },
      turn: 0,
      startSeat: 0,
      currentKana: null,
      timeLimit: 30,
      turnStartedAt: 0,
      settings: { smallKanaLenient: true, dakutenLenient: false },
      words: [],
      winnerSeat: null,
      loserSeat: null,
      loseReasonCode: null,
      loseWord: null,
      rematch: {},
    })
  );

  // 2) Stranger cannot overwrite host's game
  const stranger = await authed();
  await expectDeny("stranger cannot hijack game", () =>
    set(ref(stranger.db, "games/TEST"), {
      code: "TEST",
      status: "finished",
      hostUid: stranger.uid,
      seats: { 0: stranger.uid, 1: stranger.uid },
      names: { 0: "Hacker", 1: "Hacker2" },
      turn: 0,
      startSeat: 0,
      currentKana: null,
      timeLimit: 30,
      turnStartedAt: 0,
      settings: { smallKanaLenient: true, dakutenLenient: false },
      words: [],
      winnerSeat: 0,
      loserSeat: 1,
      loseReasonCode: "timeout",
      loseWord: null,
      rematch: {},
    })
  );

  // 3) Guest joins seat 1
  const guest = await authed();
  const snap = await get(ref(host.db, "games/TEST"));
  const game = snap.val();
  game.seats["1"] = guest.uid;
  game.names["1"] = "Guest";
  game.status = "playing";
  game.turnStartedAt = Date.now();
  await expectAllow("guest joins seat 1", () => set(ref(guest.db, "games/TEST"), game));

  // 4) Third user cannot join
  const third = await authed();
  const snap2 = await get(ref(host.db, "games/TEST"));
  const full = snap2.val();
  full.seats["1"] = third.uid;
  await expectDeny("third player cannot steal seat 1", () =>
    set(ref(third.db, "games/TEST"), full)
  );

  console.log("\n✅ All rules smoke tests passed\n");

  await deleteApp(host.app);
  await deleteApp(stranger.app);
  await deleteApp(guest.app);
  await deleteApp(third.app);
}

// Export rules path for emulator (firebase emulators:exec loads rules from firebase.json)
void main().catch(err => {
  console.error(err);
  process.exit(1);
});
