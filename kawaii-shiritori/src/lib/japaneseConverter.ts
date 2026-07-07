/**
 * Japanese Text Converter
 * Convert between Hiragana, Katakana, and Kanji
 * Supports all three writing systems for word input
 */

export interface ConversionResult {
  hiragana: string;
  katakana: string;
  kanji?: string;
  romaji?: string;
  originalForm: "hiragana" | "katakana" | "kanji" | "mixed";
}

// Character mappings
const HIRAGANA_TO_KATAKANA: Record<string, string> = {
  あ: "ア",
  い: "イ",
  う: "ウ",
  え: "エ",
  お: "オ",
  か: "カ",
  き: "キ",
  く: "ク",
  け: "ケ",
  こ: "コ",
  が: "ガ",
  ぎ: "ギ",
  ぐ: "グ",
  げ: "ゲ",
  ご: "ゴ",
  さ: "サ",
  し: "シ",
  す: "ス",
  せ: "セ",
  そ: "ソ",
  ざ: "ザ",
  じ: "ジ",
  ず: "ズ",
  ぜ: "ゼ",
  ぞ: "ゾ",
  た: "タ",
  ち: "チ",
  つ: "ツ",
  て: "テ",
  と: "ト",
  だ: "ダ",
  ぢ: "ヂ",
  づ: "ヅ",
  で: "デ",
  ど: "ド",
  な: "ナ",
  に: "ニ",
  ぬ: "ヌ",
  ね: "ネ",
  の: "ノ",
  は: "ハ",
  ひ: "ヒ",
  ふ: "フ",
  へ: "ヘ",
  ほ: "ホ",
  ば: "バ",
  び: "ビ",
  ぶ: "ブ",
  べ: "ベ",
  ぼ: "ボ",
  ぱ: "パ",
  ぴ: "ピ",
  ぷ: "プ",
  ぺ: "ペ",
  ぽ: "ポ",
  ま: "マ",
  み: "ミ",
  む: "ム",
  め: "メ",
  も: "モ",
  や: "ヤ",
  ゆ: "ユ",
  よ: "ヨ",
  ら: "ラ",
  り: "リ",
  る: "ル",
  れ: "レ",
  ろ: "ロ",
  わ: "ワ",
  を: "ヲ",
  ん: "ン",
  ゃ: "ャ",
  ゅ: "ュ",
  ょ: "ョ",
  ぁ: "ァ",
  ぃ: "ィ",
  ぅ: "ゥ",
  ぇ: "ェ",
  ぉ: "ォ",
  っ: "ッ",
  ゎ: "ヮ",
  ー: "ー",
  "゛": "゛",
  "゜": "゜",
};

const KATAKANA_TO_HIRAGANA: Record<string, string> = Object.fromEntries(
  Object.entries(HIRAGANA_TO_KATAKANA).map(([k, v]) => [v, k])
);

const HIRAGANA_TO_ROMAJI: Record<string, string> = {
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  が: "ga",
  ぎ: "gi",
  ぐ: "gu",
  げ: "ge",
  ご: "go",
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  ざ: "za",
  じ: "ji",
  ず: "zu",
  ぜ: "ze",
  ぞ: "zo",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  だ: "da",
  ぢ: "ji",
  づ: "zu",
  で: "de",
  ど: "do",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ひ: "hi",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ぼ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぷ: "pu",
  ぺ: "pe",
  ぽ: "po",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  を: "wo",
  ん: "n",
  ゃ: "ya",
  ゅ: "yu",
  ょ: "yo",
  っ: "tsu",
  ー: "-",
};

class JapaneseConverter {
  /**
   * Convert hiragana to katakana
   */
  hiraganaToKatakana(text: string): string {
    return text
      .split("")
      .map(char => HIRAGANA_TO_KATAKANA[char] || char)
      .join("");
  }

  /**
   * Convert katakana to hiragana
   */
  katakanaToHiragana(text: string): string {
    return text
      .split("")
      .map(char => KATAKANA_TO_HIRAGANA[char] || char)
      .join("");
  }

  /**
   * Convert hiragana to romaji
   */
  hiraganaToRomaji(text: string): string {
    let result = "";
    let i = 0;

    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1];

      // Check for small ya/yu/yo combinations
      if (nextChar && ["ゃ", "ゅ", "ょ"].includes(nextChar)) {
        const combo = char + nextChar;
        result += this.getComboRomaji(combo);
        i += 2;
        continue;
      }

      // Check for small tsu (doubles next consonant)
      if (char === "っ" && nextChar) {
        const nextRomaji = HIRAGANA_TO_ROMAJI[nextChar];
        if (nextRomaji) {
          result += nextRomaji[0]; // Double the consonant
        }
        i++;
        continue;
      }

      result += HIRAGANA_TO_ROMAJI[char] || char;
      i++;
    }

    return result;
  }

  /**
   * Get romaji for character combinations
   */
  private getComboRomaji(combo: string): string {
    const comboMap: Record<string, string> = {
      きゃ: "kya",
      きゅ: "kyu",
      きょ: "kyo",
      ぎゃ: "gya",
      ぎゅ: "gyu",
      ぎょ: "gyo",
      しゃ: "sha",
      しゅ: "shu",
      しょ: "sho",
      じゃ: "ja",
      じゅ: "ju",
      じょ: "jo",
      ちゃ: "cha",
      ちゅ: "chu",
      ちょ: "cho",
      にゃ: "nya",
      にゅ: "nyu",
      にょ: "nyo",
      ひゃ: "hya",
      ひゅ: "hyu",
      ひょ: "hyo",
      びゃ: "bya",
      びゅ: "byu",
      びょ: "byo",
      ぴゃ: "pya",
      ぴゅ: "pyu",
      ぴょ: "pyo",
      みゃ: "mya",
      みゅ: "myu",
      みょ: "myo",
      りゃ: "rya",
      りゅ: "ryu",
      りょ: "ryo",
    };

    return comboMap[combo] || combo;
  }

  /**
   * Detect the type of Japanese text
   */
  detectScriptType(text: string): "hiragana" | "katakana" | "kanji" | "mixed" | "other" {
    if (!text) return "other";

    const hiraganaPattern = /^[\u3040-\u309F]+$/;
    const katakanaPattern = /^[\u30A0-\u30FF]+$/;
    const kanjiPattern = /^[\u4E00-\u9FAF]+$/;

    const hasHiragana = /[\u3040-\u309F]/.test(text);
    const hasKatakana = /[\u30A0-\u30FF]/.test(text);
    const hasKanji = /[\u4E00-\u9FAF]/.test(text);

    // Pure types
    if (hiraganaPattern.test(text)) return "hiragana";
    if (katakanaPattern.test(text)) return "katakana";
    if (kanjiPattern.test(text)) return "kanji";

    // Mixed
    if (hasHiragana || hasKatakana || hasKanji) return "mixed";

    return "other";
  }

  /**
   * Normalize text to hiragana for comparison
   */
  normalizeToHiragana(text: string): string {
    const scriptType = this.detectScriptType(text);

    switch (scriptType) {
      case "katakana":
        return this.katakanaToHiragana(text);
      case "hiragana":
        return text;
      case "mixed":
        // Convert katakana parts to hiragana, keep kanji
        return text
          .split("")
          .map(char => {
            if (/[\u30A0-\u30FF]/.test(char)) {
              return KATAKANA_TO_HIRAGANA[char] || char;
            }
            return char;
          })
          .join("");
      default:
        return text;
    }
  }

  /**
   * Convert any Japanese text to all forms
   */
  convertToAllForms(text: string, kanji?: string): ConversionResult {
    const scriptType = this.detectScriptType(text);

    let hiragana: string;
    let katakana: string;

    switch (scriptType) {
      case "hiragana":
        hiragana = text;
        katakana = this.hiraganaToKatakana(text);
        break;
      case "katakana":
        katakana = text;
        hiragana = this.katakanaToHiragana(text);
        break;
      case "kanji":
      case "mixed":
        // For kanji/mixed, we need the reading from dictionary
        // Use provided kanji parameter or original text
        hiragana = text; // Will need dictionary lookup for accurate reading
        katakana = this.hiraganaToKatakana(text);
        break;
      default:
        hiragana = text;
        katakana = text;
    }

    const romaji = this.hiraganaToRomaji(hiragana);

    return {
      hiragana,
      katakana,
      kanji: kanji || (scriptType === "kanji" ? text : undefined),
      romaji,
      originalForm: scriptType,
    };
  }

  /**
   * Check if text is valid Japanese
   */
  isValidJapanese(text: string): boolean {
    const validPattern = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAFー]+$/;
    return validPattern.test(text);
  }

  /**
   * Get all possible forms of a word (for dictionary lookup)
   */
  getAllForms(text: string): string[] {
    const forms = new Set<string>();
    forms.add(text);

    const scriptType = this.detectScriptType(text);

    switch (scriptType) {
      case "hiragana":
        forms.add(this.hiraganaToKatakana(text));
        break;
      case "katakana":
        forms.add(this.katakanaToHiragana(text));
        break;
      case "kanji":
      case "mixed":
        // Keep original
        break;
    }

    return Array.from(forms);
  }

  /**
   * Get ending sound for Shiritori (always in hiragana)
   */
  getEndingSound(text: string): string {
    const normalized = this.normalizeToHiragana(text);
    if (!normalized) return "";

    const lastChar = normalized.charAt(normalized.length - 1);
    const secondLastChar = normalized.charAt(normalized.length - 2);

    // Check for small ya/yu/yo combinations
    if (secondLastChar && ["ゃ", "ゅ", "ょ"].includes(lastChar)) {
      return secondLastChar + lastChar;
    }

    return lastChar;
  }

  /**
   * Get starting sound for Shiritori (always in hiragana)
   */
  getStartingSound(text: string): string {
    const normalized = this.normalizeToHiragana(text);
    if (!normalized) return "";

    const firstChar = normalized.charAt(0);
    const secondChar = normalized.charAt(1);

    // Check for small ya/yu/yo combinations
    if (secondChar && ["ゃ", "ゅ", "ょ"].includes(secondChar)) {
      return firstChar + secondChar;
    }

    return firstChar;
  }

  /**
   * Format word for display (show all available forms)
   */
  formatForDisplay(hiragana: string, katakana?: string, kanji?: string): string {
    const forms: string[] = [];

    if (kanji) forms.push(kanji);
    forms.push(hiragana);
    if (katakana && katakana !== hiragana) forms.push(katakana);

    return forms.join(" / ");
  }
}

// Singleton instance
export const japaneseConverter = new JapaneseConverter();

// Convenience exports
export const hiraganaToKatakana = (text: string) => japaneseConverter.hiraganaToKatakana(text);
export const katakanaToHiragana = (text: string) => japaneseConverter.katakanaToHiragana(text);
export const normalizeToHiragana = (text: string) => japaneseConverter.normalizeToHiragana(text);
export const detectScriptType = (text: string) => japaneseConverter.detectScriptType(text);
export const isValidJapanese = (text: string) => japaneseConverter.isValidJapanese(text);
export const getAllForms = (text: string) => japaneseConverter.getAllForms(text);
export const getEndingSound = (text: string) => japaneseConverter.getEndingSound(text);
export const getStartingSound = (text: string) => japaneseConverter.getStartingSound(text);

export default japaneseConverter;
