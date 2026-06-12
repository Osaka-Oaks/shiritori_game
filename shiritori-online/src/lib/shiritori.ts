// Pure Shiritori game logic — no Firebase, no React. Easy to reason about & test.
// Implements the rules from "How to Play Shiritori" (bilingual guide).

export interface RuleSettings {
  // House rules (Section 4 of the guide). Defaults match the most common play.
  smallKanaLenient: boolean; // しゃ -> や (true) vs strict しゃ -> しゃ (false)
  dakutenLenient: boolean; // が can be answered with か, ぱ with は, etc.
}

export const DEFAULT_RULES: RuleSettings = {
  smallKanaLenient: true,
  dakutenLenient: false,
};

// Small kana normalized to their full-size sound for chaining.
const SMALL_TO_LARGE: Record<string, string> = {
  "ゃ": "や", "ゅ": "ゆ", "ょ": "よ",
  "ぁ": "あ", "ぃ": "い", "ぅ": "う", "ぇ": "え", "ぉ": "お",
  "っ": "つ", "ゎ": "わ",
};

// Dakuten / handakuten -> base kana (lenient matching).
const DAKUTEN_TO_BASE: Record<string, string> = {
  "が": "か", "ぎ": "き", "ぐ": "く", "げ": "け", "ご": "こ",
  "ざ": "さ", "じ": "し", "ず": "す", "ぜ": "せ", "ぞ": "そ",
  "だ": "た", "ぢ": "ち", "づ": "つ", "で": "て", "ど": "と",
  "ば": "は", "び": "ひ", "ぶ": "ふ", "べ": "へ", "ぼ": "ほ",
  "ぱ": "は", "ぴ": "ひ", "ぷ": "ふ", "ぺ": "へ", "ぽ": "ほ",
};

// Convert katakana to hiragana so チェーン and ちぇーん chain identically.
export function toHiragana(str: string): string {
  return str.replace(/[ァ-ヶ]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

// Accept only hiragana, katakana, and the long-vowel mark ー.
export function isKanaOnly(str: string): boolean {
  return /^[ぁ-ゖァ-ヺー]+$/.test(str);
}

// The kana the NEXT word must start with.
// Skips a trailing ー (long vowel) and promotes small kana per house rule.
export function getChainKana(word: string, rules: RuleSettings = DEFAULT_RULES): string {
  const w = toHiragana(word.trim());
  let i = w.length - 1;
  while (i > 0 && w[i] === "ー") i--;
  let kana = w[i];
  if (rules.smallKanaLenient && SMALL_TO_LARGE[kana]) kana = SMALL_TO_LARGE[kana];
  return kana;
}

// First kana of a word, normalized to hiragana.
export function getFirstKana(word: string): string {
  return toHiragana(word.trim())[0];
}

export function endsInN(word: string): boolean {
  const w = toHiragana(word.trim());
  let i = w.length - 1;
  while (i > 0 && w[i] === "ー") i--;
  return w[i] === "ん";
}

// Do two kana match as a valid chain link, honoring the dakuten house rule?
function kanaMatches(a: string, b: string, rules: RuleSettings): boolean {
  if (a === b) return true;
  if (rules.dakutenLenient) {
    const baseA = DAKUTEN_TO_BASE[a] ?? a;
    const baseB = DAKUTEN_TO_BASE[b] ?? b;
    return baseA === baseB;
  }
  return false;
}

export type MoveResult =
  | { ok: true; chainKana: string; losesByN: boolean }
  | { ok: false; reason: string };

/**
 * Validate a submitted word.
 * - Wrong-start / repeat / non-kana / too-short  -> rejected (does NOT end your turn).
 * - Ends in ん  -> accepted but flagged `losesByN` (the rule: that move loses the game).
 */
export function validateMove(
  rawWord: string,
  requiredKana: string | null,
  usedWords: string[],
  rules: RuleSettings = DEFAULT_RULES
): MoveResult {
  const word = rawWord.trim();

  if (!word) return { ok: false, reason: "Type a word first. / ことばを入れてね" };

  if (!isKanaOnly(word)) {
    return {
      ok: false,
      reason: "Kana only (ひらがな・カタカナ) — convert romaji or use kanaの入力.",
    };
  }
  if (word.length < 2) {
    return { ok: false, reason: "Words must be at least 2 kana. / 2文字以上で" };
  }

  if (requiredKana) {
    const need = toHiragana(requiredKana);
    if (!kanaMatches(getFirstKana(word), need, rules)) {
      return { ok: false, reason: `Must start with「${requiredKana}」` };
    }
  }

  const normalized = toHiragana(word);
  if (usedWords.some((u) => toHiragana(u.trim()) === normalized)) {
    return { ok: false, reason: "Already used — no repeats. / もう使ったよ" };
  }

  return {
    ok: true,
    chainKana: getChainKana(word, rules),
    losesByN: endsInN(word),
  };
}
