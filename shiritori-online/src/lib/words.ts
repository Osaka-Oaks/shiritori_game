// Starter word bank from the rules guide (Section 7) + a few extras, used to
// power the optional "hint" button. Each entry is a safe, common noun.

export interface BankWord {
  kana: string;
  romaji: string;
  meaning: string;
}

export const WORD_BANK: BankWord[] = [
  { kana: "ねこ", romaji: "neko", meaning: "cat" },
  { kana: "いぬ", romaji: "inu", meaning: "dog" },
  { kana: "さくら", romaji: "sakura", meaning: "cherry blossom" },
  { kana: "すし", romaji: "sushi", meaning: "sushi" },
  { kana: "とり", romaji: "tori", meaning: "bird" },
  { kana: "りす", romaji: "risu", meaning: "squirrel" },
  { kana: "うみ", romaji: "umi", meaning: "sea" },
  { kana: "やま", romaji: "yama", meaning: "mountain" },
  { kana: "みず", romaji: "mizu", meaning: "water" },
  { kana: "かさ", romaji: "kasa", meaning: "umbrella" },
  { kana: "しか", romaji: "shika", meaning: "deer" },
  { kana: "さかな", romaji: "sakana", meaning: "fish" },
  { kana: "なす", romaji: "nasu", meaning: "eggplant" },
  { kana: "すいか", romaji: "suika", meaning: "watermelon" },
  { kana: "くるま", romaji: "kuruma", meaning: "car" },
  { kana: "たまご", romaji: "tamago", meaning: "egg" },
  { kana: "はな", romaji: "hana", meaning: "flower" },
  { kana: "つき", romaji: "tsuki", meaning: "moon" },
  { kana: "ほし", romaji: "hoshi", meaning: "star" },
  { kana: "そら", romaji: "sora", meaning: "sky" },
  { kana: "こども", romaji: "kodomo", meaning: "child" },
  { kana: "もも", romaji: "momo", meaning: "peach" },
  { kana: "らくだ", romaji: "rakuda", meaning: "camel" },
  { kana: "るすばん", romaji: "rusuban", meaning: "house-sitting" },
  { kana: "ぞう", romaji: "zou", meaning: "elephant" },
  { kana: "うさぎ", romaji: "usagi", meaning: "rabbit" },
  { kana: "ぎゅうにゅう", romaji: "gyuunyuu", meaning: "milk" },
  { kana: "えき", romaji: "eki", meaning: "station" },
  { kana: "きつね", romaji: "kitsune", meaning: "fox" },
  { kana: "ねぎ", romaji: "negi", meaning: "green onion" },
  { kana: "とけい", romaji: "tokei", meaning: "clock" },
  { kana: "いす", romaji: "isu", meaning: "chair" },
  { kana: "つくえ", romaji: "tsukue", meaning: "desk" },
  { kana: "えんぴつ", romaji: "enpitsu", meaning: "pencil" },
  { kana: "あめ", romaji: "ame", meaning: "rain / candy" },
  { kana: "めがね", romaji: "megane", meaning: "glasses" },
  { kana: "ねずみ", romaji: "nezumi", meaning: "mouse" },
  { kana: "まど", romaji: "mado", meaning: "window" },
  { kana: "ドア", romaji: "doa", meaning: "door" },
  { kana: "ぬま", romaji: "numa", meaning: "swamp" },
];

import { getFirstKana, toHiragana, getChainKana, DEFAULT_RULES } from "./shiritori";

/**
 * Pick a hint word that starts with the required kana, isn't already used,
 * and doesn't end in ん. Returns null if nothing fits.
 */
export function findHint(
  requiredKana: string | null,
  usedWords: string[]
): BankWord | null {
  const used = new Set(usedWords.map((w) => toHiragana(w.trim())));
  const need = requiredKana ? toHiragana(requiredKana) : null;

  for (const entry of WORD_BANK) {
    if (used.has(toHiragana(entry.kana))) continue;
    if (need && getFirstKana(entry.kana) !== need) continue;
    if (getChainKana(entry.kana, DEFAULT_RULES) === "ん") continue;
    return entry;
  }
  return null;
}
