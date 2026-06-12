/**
 * Simple Romaji to Hiragana character mapper to support English keyboard keyboards easily.
 */
const ROMAJI_TO_HIRAGANA: { [key: string]: string } = {
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  sa: "さ", shi: "し", su: "す", se: "せ", so: "そ",
  ta: "た", chi: "ち", tsu: "つ", te: "て", to: "と",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", fu: "ふ", he: "へ", ho: "ほ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ら", // ra/ri/ru/re/ro
  wa: "わ", wo: "を", n: "ん",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  za: "ざ", ji: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  da: "だ", de: "で", do: "ど",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  kya: "きゃ", kyu: "きゅ", kyo: "きょ",
  sha: "しゃ", shu: "しゅ", sho: "しょ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ",
  mya: "みゃ", myu: "みゅ", myo: "みょ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ",
  gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
  bya: "びゃ", byu: "びゅ", byo: "びょ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ"
};

/**
 * Converts standard romaji text to Hiragana mapping
 */
export function convertRomajiToHiragana(text: string): string {
  let temp = text.toLowerCase().trim();
  let result = "";
  let i = 0;
  
  while (i < temp.length) {
    if (i + 3 <= temp.length && ROMAJI_TO_HIRAGANA[temp.substring(i, i + 3)]) {
      result += ROMAJI_TO_HIRAGANA[temp.substring(i, i + 3)];
      i += 3;
    } else if (i + 2 <= temp.length && ROMAJI_TO_HIRAGANA[temp.substring(i, i + 2)]) {
      result += ROMAJI_TO_HIRAGANA[temp.substring(i, i + 2)];
      i += 2;
    } else if (ROMAJI_TO_HIRAGANA[temp[i]]) {
      result += ROMAJI_TO_HIRAGANA[temp[i]];
      i += 1;
    } else {
      // Keep it (could be Hiragana/Katakana or other character typed directly)
      result += temp[i];
      i += 1;
    }
  }

  // Double consonants support (e.g. "rappa" -> "らっぱ", replace doubling character with small 'tsu' 「っ」)
  let finalized = "";
  for (let idx = 0; idx < result.length; idx++) {
    const char = result[idx];
    const nextChar = result[idx + 1];
    // If double consonant in English alphabet standard
    if (char >= 'a' && char <= 'z' && char === nextChar) {
      finalized += "っ";
    } else {
      finalized += char;
    }
  }
  
  // Clean alphabet symbols
  return finalized.replace(/[a-z]/gi, "");
}

/**
 * Speak word out loud using Web Speech Synthesis API in ja-JP locale
 */
export function speakWord(text: string) {
  if ("speechSynthesis" in window) {
    // Cancel currently speaking instances
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}
