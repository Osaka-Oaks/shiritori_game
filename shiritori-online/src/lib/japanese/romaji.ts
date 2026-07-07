// Romaji -> Hiragana helper so players can type on an English keyboard,
// plus a small text-to-speech helper using the Web Speech API.

const ROMAJI_TO_HIRAGANA: Record<string, string> = {
  a: "あ",
  i: "い",
  u: "う",
  e: "え",
  o: "お",
  ka: "か",
  ki: "き",
  ku: "く",
  ke: "け",
  ko: "こ",
  ga: "が",
  gi: "ぎ",
  gu: "ぐ",
  ge: "げ",
  go: "ご",
  sa: "さ",
  shi: "し",
  si: "し",
  su: "す",
  se: "せ",
  so: "そ",
  za: "ざ",
  ji: "じ",
  zi: "じ",
  zu: "ず",
  ze: "ぜ",
  zo: "ぞ",
  ta: "た",
  chi: "ち",
  ti: "ち",
  tsu: "つ",
  tu: "つ",
  te: "て",
  to: "と",
  da: "だ",
  di: "ぢ",
  du: "づ",
  de: "で",
  do: "ど",
  na: "な",
  ni: "に",
  nu: "ぬ",
  ne: "ね",
  no: "の",
  ha: "は",
  hi: "ひ",
  fu: "ふ",
  hu: "ふ",
  he: "へ",
  ho: "ほ",
  ba: "ば",
  bi: "び",
  bu: "ぶ",
  be: "べ",
  bo: "ぼ",
  pa: "ぱ",
  pi: "ぴ",
  pu: "ぷ",
  pe: "ぺ",
  po: "ぽ",
  ma: "ま",
  mi: "み",
  mu: "む",
  me: "め",
  mo: "も",
  ya: "や",
  yu: "ゆ",
  yo: "よ",
  ra: "ら",
  ri: "り",
  ru: "る",
  re: "れ",
  ro: "ろ",
  wa: "わ",
  wo: "を",
  n: "ん",
  nn: "ん",
  kya: "きゃ",
  kyu: "きゅ",
  kyo: "きょ",
  sha: "しゃ",
  shu: "しゅ",
  sho: "しょ",
  cha: "ちゃ",
  chu: "ちゅ",
  cho: "ちょ",
  nya: "にゃ",
  nyu: "にゅ",
  nyo: "にょ",
  hya: "ひゃ",
  hyu: "ひゅ",
  hyo: "ひょ",
  mya: "みゃ",
  myu: "みゅ",
  myo: "みょ",
  rya: "りゃ",
  ryu: "りゅ",
  ryo: "りょ",
  gya: "ぎゃ",
  gyu: "ぎゅ",
  gyo: "ぎょ",
  ja: "じゃ",
  ju: "じゅ",
  jo: "じょ",
  bya: "びゃ",
  byu: "びゅ",
  byo: "びょ",
  pya: "ぴゃ",
  pyu: "ぴゅ",
  pyo: "ぴょ",
  fa: "ふぁ",
  fi: "ふぃ",
  fe: "ふぇ",
  fo: "ふぉ",
  "-": "ー",
};

const VOWELS = new Set(["a", "i", "u", "e", "o"]);

/**
 * Convert a mixed romaji/kana string to hiragana.
 * Handles digraphs (kya), small-tsu doubling (kk -> っ), and trailing "n".
 * Any kana already typed is passed through untouched.
 */
export function romajiToHiragana(text: string): string {
  const s = text.toLowerCase();
  let out = "";
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    // Pass through anything that isn't a romaji letter (e.g. already-typed kana).
    if (!/[a-z-]/.test(ch)) {
      out += text[i]; // keep original-case char (kana)
      i++;
      continue;
    }

    // Sokuon: doubled consonant (not "nn") -> っ
    if (ch !== "n" && !VOWELS.has(ch) && s[i + 1] === ch) {
      out += "っ";
      i++;
      continue;
    }

    // "n" before a consonant (not y) -> ん
    if (ch === "n") {
      const next = s[i + 1];
      if (next === undefined || (!VOWELS.has(next) && next !== "y" && next !== "n")) {
        out += "ん";
        i++;
        continue;
      }
      if (next === "n") {
        out += "ん";
        i += 2;
        continue;
      }
    }

    // Greedy match: 3, then 2, then 1 char.
    let matched = false;
    for (const len of [3, 2, 1]) {
      const slice = s.slice(i, i + len);
      if (ROMAJI_TO_HIRAGANA[slice]) {
        out += ROMAJI_TO_HIRAGANA[slice];
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Unconvertible leftover (e.g. a lone consonant being typed) — drop it
      // so it doesn't pollute the kana string; the user will finish the syllable.
      i++;
    }
  }

  return out;
}

/** Speak a word aloud in Japanese, if the browser supports speech synthesis. */
export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch {
    /* no-op */
  }
}
