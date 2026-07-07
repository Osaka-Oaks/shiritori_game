// Japanese input helpers — hiragana, katakana, and kanji support.

import { toHiragana } from "./shiritori";

/** Accept hiragana, katakana, kanji, and the long-vowel mark. */
export function isJapaneseInput(str: string): boolean {
  return /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFFー]+$/.test(str.trim());
}

/** Detect the primary script used in a word. */
export function detectScript(str: string): "hiragana" | "katakana" | "kanji" | "mixed" {
  const s = str.trim();
  const hasHira = /[\u3040-\u309F]/.test(s);
  const hasKata = /[\u30A0-\u30FF]/.test(s);
  const hasKanji = /[\u4E00-\u9FFF]/.test(s);
  if (hasKanji && !hasHira && !hasKata) return "kanji";
  if (hasHira && !hasKata && !hasKanji) return "hiragana";
  if (hasKata && !hasHira && !hasKanji) return "katakana";
  return "mixed";
}

/** Normalize kana portions to hiragana; kanji are left as-is. */
export function normalizeJapanese(str: string): string {
  return toHiragana(str.trim());
}

/** Whether chain rules need an async reading lookup (kanji or mixed input). */
export function needsReadingLookup(word: string): boolean {
  return /[\u4E00-\u9FFF]/.test(word.trim());
}
