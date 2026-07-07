import { ref, set, get, onValue, runTransaction, serverTimestamp } from "firebase/database";
import { db } from "../firebase";
import type { GameState, PlayedWord } from "../types";
import { validateMove, type RuleSettings, DEFAULT_RULES } from "./shiritori";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no easily-confused chars
const TIMEOUT_GRACE_MS = 2000; // small buffer before either client finalizes a timeout

function randomCode(len = 4): string {
  let c = "";
  // Uses crypto.getRandomValues (not Math.random) so room codes are not predictable.
  const randomValues = new Uint32Array(len);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < len; i++) {
    c += CODE_CHARS[randomValues[i] % CODE_CHARS.length];
  }
  return c;
}

function gameRef(code: string) {
  return ref(db, `games/${code}`);
}

/** Seat index (0/1) for a uid in a game, or -1 if not seated. */
export function seatOf(state: GameState, uid: string): number {
  if (state.seats?.["0"] === uid) return 0;
  if (state.seats?.["1"] === uid) return 1;
  return -1;
}

function usedWordsOf(state: GameState): string[] {
  return (state.words ?? []).map(w => w.word);
}

/** Normalize a raw RTDB snapshot into a fully-shaped GameState. */
function normalize(code: string, raw: any): GameState {
  return {
    code,
    status: raw.status ?? "waiting",
    createdAt: raw.createdAt ?? 0,
    hostUid: raw.hostUid ?? "",
    seats: raw.seats ?? {},
    names: raw.names ?? {},
    turn: raw.turn ?? 0,
    startSeat: raw.startSeat ?? 0,
    currentKana: raw.currentKana ?? null,
    timeLimit: raw.timeLimit ?? 30,
    turnStartedAt: raw.turnStartedAt ?? 0,
    settings: raw.settings ?? DEFAULT_RULES,
    words: raw.words ?? [],
    winnerSeat: raw.winnerSeat ?? null,
    loserSeat: raw.loserSeat ?? null,
    loseReasonCode: raw.loseReasonCode ?? null,
    loseWord: raw.loseWord ?? null,
    rematch: raw.rematch ?? {},
  };
}

/** Create a fresh room and return its code. Retries on the rare code collision. */
export async function createRoom(
  uid: string,
  name: string,
  timeLimit: number,
  settings: RuleSettings
): Promise<string> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = randomCode();
    const snap = await get(gameRef(code));
    if (snap.exists()) continue;

    const initial = {
      code,
      status: "waiting",
      createdAt: serverTimestamp(),
      hostUid: uid,
      seats: { "0": uid },
      names: { "0": name || "Player 1" },
      turn: 0,
      startSeat: 0,
      currentKana: null,
      timeLimit,
      turnStartedAt: 0,
      settings,
      words: [],
      winnerSeat: null,
      loserSeat: null,
      loseReasonCode: null,
      loseWord: null,
      rematch: {},
    };
    await set(gameRef(code), initial);
    return code;
  }
  throw new Error("Could not allocate a room code. Please try again.");
}

export type JoinResult = { ok: true; seat: number } | { ok: false; reason: string };

/** Join an existing room as seat 1 (or rejoin a seat you already hold). */
export async function joinRoom(uid: string, name: string, rawCode: string): Promise<JoinResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, reason: "Enter a room code." };

  const snap = await get(gameRef(code));
  if (!snap.exists()) return { ok: false, reason: `No room "${code}" found.` };

  let result: JoinResult = { ok: false, reason: "Room is full." };

  await runTransaction(gameRef(code), raw => {
    if (!raw) return raw;

    // Rejoining a seat you already hold (e.g. page refresh).
    if (raw.seats?.["0"] === uid) {
      result = { ok: true, seat: 0 };
      return raw;
    }
    if (raw.seats?.["1"] === uid) {
      result = { ok: true, seat: 1 };
      return raw;
    }

    if (raw.seats?.["1"]) {
      result = { ok: false, reason: "Room is full." };
      return; // abort
    }

    raw.seats = { ...(raw.seats ?? {}), "1": uid };
    raw.names = { ...(raw.names ?? {}), "1": name || "Player 2" };
    raw.status = "playing";
    raw.turn = raw.startSeat ?? 0;
    raw.turnStartedAt = Date.now();
    result = { ok: true, seat: 1 };
    return raw;
  });

  return result;
}

/** Subscribe to live room updates. Returns an unsubscribe function. */
export function subscribeRoom(code: string, cb: (state: GameState | null) => void): () => void {
  return onValue(gameRef(code), snap => {
    if (!snap.exists()) {
      cb(null);
      return;
    }
    cb(normalize(code, snap.val()));
  });
}

export type PlayResult = { ok: true } | { ok: false; reason: string };

/** Submit a word on your turn. Validates against `state`, then commits atomically. */
export async function playWord(
  state: GameState,
  uid: string,
  rawWord: string,
  meaning?: string,
  readingKana?: string
): Promise<PlayResult> {
  const seat = seatOf(state, uid);
  if (seat === -1) return { ok: false, reason: "You're not in this game." };
  if (state.status !== "playing") return { ok: false, reason: "Game isn't active." };
  if (state.turn !== seat) return { ok: false, reason: "Not your turn yet." };

  const check = validateMove(
    rawWord,
    state.currentKana,
    usedWordsOf(state),
    state.settings,
    readingKana
  );
  if (!check.ok) return { ok: false, reason: check.reason };

  const word = rawWord.trim();
  const now = Date.now();
  const played: PlayedWord = {
    word,
    romaji: "",
    kana: check.chainKana,
    seat,
    by: uid,
    ts: now,
    ...(meaning ? { meaning } : {}),
  };

  await runTransaction(gameRef(state.code), raw => {
    if (!raw || raw.status !== "playing" || raw.turn !== seat) return; // abort: state moved on
    const words: PlayedWord[] = raw.words ?? [];
    words.push(played);
    raw.words = words;

    if (check.losesByN) {
      raw.status = "finished";
      raw.loserSeat = seat;
      raw.winnerSeat = seat === 0 ? 1 : 0;
      raw.loseReasonCode = "n";
      raw.loseWord = word;
    } else {
      raw.currentKana = check.chainKana;
      raw.turn = seat === 0 ? 1 : 0;
      raw.turnStartedAt = now;
    }
    return raw;
  });

  return { ok: true };
}

/**
 * Finalize a turn that ran out of time. Safe for EITHER client to call — the
 * transaction only commits if the turn really expired and hasn't changed.
 */
export async function finalizeTimeout(state: GameState): Promise<void> {
  await runTransaction(gameRef(state.code), raw => {
    if (!raw || raw.status !== "playing") return;
    const elapsed = Date.now() - (raw.turnStartedAt ?? 0);
    if (elapsed < raw.timeLimit * 1000 + TIMEOUT_GRACE_MS) return; // not expired
    const loser = raw.turn ?? 0;
    raw.status = "finished";
    raw.loserSeat = loser;
    raw.winnerSeat = loser === 0 ? 1 : 0;
    raw.loseReasonCode = "timeout";
    raw.loseWord = null;
    return raw;
  });
}

/** Vote to rematch. When both seats have voted, the board resets and play begins. */
export async function voteRematch(state: GameState, uid: string): Promise<void> {
  const seat = seatOf(state, uid);
  if (seat === -1) return;

  await runTransaction(gameRef(state.code), raw => {
    if (!raw || raw.status !== "finished") return;
    const rematch = { ...(raw.rematch ?? {}), [seat]: true };
    raw.rematch = rematch;

    const bothSeated = raw.seats?.["0"] && raw.seats?.["1"];
    if (bothSeated && rematch["0"] && rematch["1"]) {
      const newStart = (raw.startSeat ?? 0) === 0 ? 1 : 0; // loser-friendly: alternate starter
      raw.startSeat = newStart;
      raw.turn = newStart;
      raw.currentKana = null;
      raw.words = [];
      raw.turnStartedAt = Date.now();
      raw.status = "playing";
      raw.winnerSeat = null;
      raw.loserSeat = null;
      raw.loseReasonCode = null;
      raw.loseWord = null;
      raw.rematch = {};
    }
    return raw;
  });
}
