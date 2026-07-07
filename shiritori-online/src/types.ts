import type { RuleSettings } from "./lib/game/shiritori";

export type GameStatus = "waiting" | "playing" | "finished";

export interface PlayedWord {
  word: string; // the kana word as played
  romaji: string; // romaji reading (may be empty)
  kana: string; // the chain kana this word produces (what the next word must start with)
  seat: number; // 0 or 1 — who played it
  by: string; // uid
  ts: number; // client timestamp (ms)
  meaning?: string; // English meaning from dictionary lookup
}

export interface GameState {
  code: string;
  status: GameStatus;
  createdAt: number;
  hostUid: string;
  seats: Record<string, string>; // { "0": uid, "1": uid }
  names: Record<string, string>; // { "0": name, "1": name }
  turn: number; // seat whose turn it is
  startSeat: number; // who made the first move this round (alternates on rematch)
  currentKana: string | null; // required first kana for next word (null on first move)
  timeLimit: number; // seconds per turn
  turnStartedAt: number; // ms epoch when the current turn began
  settings: RuleSettings;
  words: PlayedWord[];
  winnerSeat: number | null;
  loserSeat: number | null;
  loseReasonCode: "n" | "timeout" | null; // rendered client-side for i18n
  loseWord: string | null; // the offending word, for the "ends in ん" message
  rematch: Record<string, boolean>; // { "0": true } seats that voted rematch
}
