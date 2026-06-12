// lib/shiritori.js
// Pure game logic — no Firebase, no React. Easy to unit test.

// Small kana normalize to their full-size sound for chaining (standard house rule).
const SMALL_TO_LARGE = {
  "ゃ": "や", "ゅ": "ゆ", "ょ": "よ",
  "ぁ": "あ", "ぃ": "い", "ぅ": "う", "ぇ": "え", "ぉ": "お",
  "っ": "つ", "ゎ": "わ",
};

// Convert katakana to hiragana so チェーン and ちぇーん chain identically.
export function toHiragana(str) {
  return str.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

// Accept only hiragana, katakana, and the long-vowel mark ー.
export function isKanaOnly(str) {
  return /^[\u3041-\u3096\u30a1-\u30fa\u30fc]+$/.test(str);
}

// The kana the NEXT word must start with.
// Rules: skip trailing ー (long vowel), promote small kana (しゃ → や).
export function getChainKana(word) {
  const w = toHiragana(word.trim());
  let i = w.length - 1;
  while (i > 0 && w[i] === "ー") i--;
  const kana = w[i];
  return SMALL_TO_LARGE[kana] || kana;
}

// First kana of a word, normalized for comparison.
export function getFirstKana(word) {
  return toHiragana(word.trim())[0];
}

export function endsInN(word) {
  return getChainKana(word) === "ん";
}

/**
 * Validate a move.
 * @returns {{ ok: boolean, reason?: string }}
 */
export function validateWord(rawWord, requiredKana, usedWords) {
  const word = rawWord.trim();

  if (!word) {
    return { ok: false, reason: "ことばを入れてね — type a word first." };
  }
  if (!isKanaOnly(word)) {
    return {
      ok: false,
      reason: "Kana only (ひらがな・カタカナ) — no kanji or romaji for v1.",
    };
  }
  if (word.length < 2) {
    return { ok: false, reason: "Words must be at least 2 kana." };
  }
  if (endsInN(word)) {
    return {
      ok: false,
      reason: "It ends in ん — that loses the game! Pick another word.",
    };
  }
  if (requiredKana && getFirstKana(word) !== toHiragana(requiredKana)) {
    return {
      ok: false,
      reason: `Must start with 「${requiredKana}」.`,
    };
  }
  const normalized = toHiragana(word);
  if (usedWords.some((u) => toHiragana(u.trim()) === normalized)) {
    return { ok: false, reason: "Already used — no repeats." };
  }
  return { ok: true };
}
