import { validateMove, getFirstKana, getChainKana, DEFAULT_RULES, type RuleSettings } from "./shiritori";
import { DICTIONARY } from "./dictionaryData";
import { WORD_BANK } from "./words";
import { type LevelConfig, jlptAllowed } from "./levels";
import type { DevSettings } from "./devMode";

export interface BotWord {
  kana: string;
  romaji: string;
  meaning: string;
  jlpt?: string;
}

export interface SoloTurn {
  word: string;
  romaji?: string;
  meaning?: string;
  by: "you" | "cpu";
  /** Short feedback shown in the chain (e.g. CPU reply line). */
  feedback?: string;
}

export type SoloStatus = "playing" | "won" | "lost";

export interface SoloState {
  level: LevelConfig;
  chain: SoloTurn[];
  currentKana: string | null;
  turn: "you" | "cpu";
  status: SoloStatus;
  endReason: string;
  lastFeedback: string;
  debugLog: string[];
}

export interface CpuMoveResult {
  state: SoloState;
  message: string;
}

function buildVocab(level: LevelConfig): BotWord[] {
  const map = new Map<string, BotWord>();
  for (const w of WORD_BANK) {
    map.set(w.kana, { kana: w.kana, romaji: w.romaji, meaning: w.meaning });
  }
  for (const d of DICTIONARY) {
    if (!map.has(d.kana)) {
      map.set(d.kana, {
        kana: d.kana,
        romaji: d.romaji,
        meaning: d.en,
        jlpt: d.jlpt,
      });
    }
  }
  return [...map.values()].filter(
    w =>
      w.kana.length >= 2 &&
      getChainKana(w.kana) !== "ん" &&
      jlptAllowed(w.jlpt, level.maxJlpt)
  );
}

const vocabCache = new Map<number, BotWord[]>();

export function getVocabForLevel(level: LevelConfig): BotWord[] {
  if (!vocabCache.has(level.id)) {
    vocabCache.set(level.id, buildVocab(level));
  }
  return vocabCache.get(level.id)!;
}

export function createSoloGame(level: LevelConfig): SoloState {
  return {
    level,
    chain: [],
    currentKana: null,
    turn: "you",
    status: "playing",
    endReason: "",
    lastFeedback: "Say any Japanese word to start!",
    debugLog: [],
  };
}

function log(state: SoloState, dev: DevSettings, line: string): SoloState {
  if (!dev.showDebug) return state;
  return { ...state, debugLog: [...state.debugLog.slice(-19), line] };
}

function endGame(state: SoloState, status: SoloStatus, reason: string): SoloState {
  return { ...state, status, endReason: reason, lastFeedback: reason };
}

function countFollowUps(
  kana: string,
  usedSet: Set<string>,
  vocab: BotWord[],
  rules: RuleSettings
): number {
  return vocab.filter(w => getFirstKana(w.kana) === kana && !usedSet.has(w.kana)).length;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function cpuMove(
  state: SoloState,
  rules: RuleSettings = DEFAULT_RULES,
  dev: DevSettings = { enabled: false, skipTimer: false, instantCpu: false, skipDictionary: false, showDebug: false }
): CpuMoveResult {
  const cfg = state.level;
  const used = state.chain.map(c => c.word);
  const usedSet = new Set(used);
  const vocab = getVocabForLevel(cfg);
  const need = state.currentKana;

  let s = log(state, dev, `CPU turn · need=${need ?? "any"}`);

  let candidates = vocab.filter(
    w => !usedSet.has(w.kana) && (need ? getFirstKana(w.kana) === need : true)
  );

  if (candidates.length === 0) {
    const next = endGame(s, "won", "🎉 CPU is stuck — you win!");
    return { state: next, message: next.endReason };
  }

  if (cfg.giveUpChance > 0 && Math.random() < cfg.giveUpChance) {
    const next = endGame(s, "won", "🎉 CPU gave up — you win!");
    return { state: next, message: next.endReason };
  }

  if (cfg.trap) {
    candidates = [...candidates].sort(
      (a, b) =>
        countFollowUps(getChainKana(a.kana, rules), new Set([...usedSet, a.kana]), vocab, rules) -
        countFollowUps(getChainKana(b.kana, rules), new Set([...usedSet, b.kana]), vocab, rules)
    );
  } else {
    candidates = shuffle(candidates);
  }

  const pick = candidates[0];
  const nextKana = getChainKana(pick.kana, rules);
  const feedback =
    nextKana && nextKana !== "ん"
      ? `🤖 「${pick.kana}」${pick.meaning ? ` (${pick.meaning})` : ""} — your turn! Start with「${nextKana}」`
      : `🤖 「${pick.kana}」${pick.meaning ? ` (${pick.meaning})` : ""}`;

  s = {
    ...s,
    chain: [
      ...s.chain,
      {
        word: pick.kana,
        romaji: pick.romaji,
        meaning: pick.meaning,
        by: "cpu",
        feedback,
      },
    ],
    currentKana: nextKana === "ん" ? s.currentKana : nextKana,
    turn: "you",
    lastFeedback: feedback,
  };

  if (nextKana === "ん") {
    const next = endGame(s, "won", "🎉 CPU ended on ん — you win!");
    return { state: next, message: next.endReason };
  }

  return { state: s, message: feedback };
}

export interface PlayerSubmitResult {
  ok: boolean;
  state: SoloState;
  reason?: string;
  feedback?: string;
}

export function applyPlayerWord(
  state: SoloState,
  rawWord: string,
  rules: RuleSettings = DEFAULT_RULES,
  dev: DevSettings = { enabled: false, skipTimer: false, instantCpu: false, skipDictionary: false, showDebug: false },
  readingKana?: string
): PlayerSubmitResult {
  if (state.status !== "playing" || state.turn !== "you") {
    return { ok: false, state, reason: "Not your turn" };
  }

  const used = state.chain.map(c => c.word);
  const check = validateMove(rawWord, state.currentKana, used, rules, readingKana);
  let s = log(state, dev, `You played: ${rawWord} → ${check.ok ? "ok" : check.reason}`);

  if (!check.ok) {
    return { ok: false, state: { ...s, lastFeedback: check.reason }, reason: check.reason };
  }

  const nextKana = check.chainKana;
  const feedback = check.losesByN
    ? `💥 「${rawWord}」ends in ん — you lose!`
    : `✓ Accepted! CPU is thinking…${nextKana ? ` (next: ${nextKana})` : ""}`;

  s = {
    ...s,
    chain: [...s.chain, { word: rawWord.trim(), by: "you", feedback }],
    lastFeedback: feedback,
  };

  if (check.losesByN) {
    const next = endGame(s, "lost", "💥 Your word ends in ん — you lose!");
    return { ok: true, state: next, feedback: next.endReason };
  }

  s = {
    ...s,
    currentKana: nextKana,
    turn: "cpu",
    lastFeedback: `✓ Nice! CPU is thinking… (next: 「${nextKana}」)`,
  };

  return { ok: true, state: s, feedback: s.lastFeedback };
}

export function attachWordMeta(
  state: SoloState,
  word: string,
  meta: { meaning?: string; romaji?: string }
): SoloState {
  const chain = state.chain.map(t =>
    t.word === word && t.by === "you" ? { ...t, meaning: meta.meaning, romaji: meta.romaji } : t
  );
  return { ...state, chain };
}
