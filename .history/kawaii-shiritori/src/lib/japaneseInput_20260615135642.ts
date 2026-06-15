/**
 * Enhanced Japanese Input System
 * - Auto-converts romaji to kana as user types
 * - Dictionary caching for fast lookups
 * - Better validation
 * - Support for both romaji and direct kana input
 */

import dictionary from "../data/dictionary.json";

// Extended romaji to hiragana mapping
const ROMAJI_MAP: { [key: string]: string } = {
  // Vowels
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  
  // K-line
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  kya: "きゃ", kyu: "きゅ", kyo: "きょ",
  
  // S-line
  sa: "さ", shi: "し", su: "す", se: "せ", so: "そ",
  sha: "しゃ", shu: "しゅ", sho: "しょ", si: "し",
  
  // T-line
  ta: "た", chi: "ち", tsu: "つ", te: "て", to: "と",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ", ti: "ち", tu: "つ",
  
  // N-line
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ",
  
  // H-line
  ha: "は", hi: "ひ", fu: "ふ", he: "へ", ho: "ほ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ", hu: "ふ",
  
  // M-line
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  mya: "みゃ", myu: "みゅ", myo: "みょ",
  
  // Y-line
  ya: "や", yu: "ゆ", yo: "よ",
  
  // R-line
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ",
  
  // W-line
  wa: "わ", wi: "ゐ", we: "ゑ", wo: "を", nn: "ん", n: "ん",
  
  // G-line (voiced)
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
  
  // Z-line (voiced)
  za: "ざ", ji: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  ja: "じゃ", ju: "じゅ", jo: "じょ", zi: "じ",
  
  // D-line (voiced)
  da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど",
  
  // B-line (voiced)
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  bya: "びゃ", byu: "びゅ", byo: "びょ",
  
  // P-line (semi-voiced)
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ",
  
  // Special combinations
  la: "ら", li: "り", lu: "る", le: "れ", lo: "ろ",
  va: "ゔぁ", vi: "ゔぃ", vu: "ゔ", ve: "ゔぇ", vo: "ゔぉ",
  fa: "ふぁ", fi: "ふぃ", fe: "ふぇ", fo: "ふぉ",
  
  // Small tsu (double consonants handled separately)
  xtsu: "っ", xtu: "っ", ltsu: "っ", ltu: "っ",
  
  // Small ya, yu, yo
  xya: "ゃ", xyu: "ゅ", xyo: "ょ",
  lya: "ゃ", lyu: "ゅ", lyo: "ょ"
};

// Cache for dictionary lookups
const dictionaryCache = new Map<string, boolean>();
const wordCache = new Map<string, any>();

/**
 * Initialize dictionary cache
 */
export function initializeDictionaryCache() {
  try {
    if (!dictionary || !Array.isArray(dictionary)) {
      console.warn("⚠️ Dictionary not loaded, skipping cache initialization");
      return;
    }

    dictionary.forEach((entry) => {
      if (!entry || !entry.hiragana) return;

      // Cache by hiragana
      dictionaryCache.set(entry.hiragana, true);
      wordCache.set(entry.hiragana, entry);
      
      // Cache by romaji if available
      if (entry.romaji) {
        dictionaryCache.set(entry.romaji.toLowerCase(), true);
        wordCache.set(entry.romaji.toLowerCase(), entry);
      }
      
      // Cache by word name
      if (entry.word) {
        dictionaryCache.set(entry.word.toLowerCase(), true);
        wordCache.set(entry.word.toLowerCase(), entry);
      }
    });
    
    console.log(`✅ Dictionary cache initialized: ${dictionaryCache.size} entries`);
  } catch (error) {
    console.error("❌ Failed to initialize dictionary cache:", error);
  }
}

/**
 * Check if a character is hiragana
 */
export function isHiragana(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 0x3040 && code <= 0x309F;
}

/**
 * Check if a character is katakana
 */
export function isKatakana(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 0x30A0 && code <= 0x30FF;
}

/**
 * Check if a character is kana (hiragana or katakana)
 */
export function isKana(char: string): boolean {
  return isHiragana(char) || isKatakana(char);
}

/**
 * Check if string contains only romaji (English letters)
 */
export function isRomaji(text: string): boolean {
  return /^[a-zA-Z]+$/.test(text);
}

/**
 * Convert romaji to hiragana with real-time conversion
 * This is the enhanced version that handles partial input
 */
export function convertRomajiToHiragana(input: string, autoConvert: boolean = false): string {
  if (!input) return "";
  
  const text = input.toLowerCase().trim();
  let result = "";
  let i = 0;
  
  while (i < text.length) {
    // If it's already kana, keep it
    if (isKana(text[i])) {
      result += text[i];
      i++;
      continue;
    }
    
    // Try matching longest romaji sequence first (3 chars)
    let matched = false;
    
    for (let len = 3; len >= 1; len--) {
      if (i + len <= text.length) {
        const substr = text.substring(i, i + len);
        
        if (ROMAJI_MAP[substr]) {
          result += ROMAJI_MAP[substr];
          i += len;
          matched = true;
          break;
        }
      }
    }
    
    // Check for double consonants (small tsu)
    if (!matched && i + 1 < text.length) {
      const current = text[i];
      const next = text[i + 1];
      
      // Double consonant (e.g., "kk" -> "っk")
      if (current === next && /[bcdfghjklmnpqrstvwxyz]/.test(current)) {
        result += "っ";
        i++;
        matched = true;
        continue;
      }
      
      // Consonant followed by different consonant (e.g., "nk" -> "んk")
      if (current === 'n' && /[bcdfghjklmpqrstvwxyz]/.test(next) && next !== 'y') {
        result += "ん";
        i++;
        matched = true;
        continue;
      }
    }
    
    // If no match found, keep the character (might be partial input)
    if (!matched) {
      if (autoConvert) {
        // In auto-convert mode, skip unconvertible characters
        i++;
      } else {
        // In preview mode, keep them for debugging
        result += text[i];
        i++;
      }
    }
  }
  
  // Clean up any remaining English letters if auto-convert
  if (autoConvert) {
    result = result.replace(/[a-z]/gi, "");
  }
  
  return result;
}

/**
 * Convert hiragana to katakana
 */
export function hiraganaToKatakana(text: string): string {
  return text.split("").map(char => {
    if (isHiragana(char)) {
      const code = char.charCodeAt(0);
      return String.fromCharCode(code + 0x60);
    }
    return char;
  }).join("");
}

/**
 * Validate word against dictionary (uses cache)
 */
export function validateWordInDictionary(word: string): boolean {
  if (!word) return false;
  
  // Check cache first
  if (dictionaryCache.has(word)) {
    return true;
  }
  
  // Check in hiragana form
  const hiragana = convertRomajiToHiragana(word, true);
  if (dictionaryCache.has(hiragana)) {
    return true;
  }
  
  // Check lowercase
  if (dictionaryCache.has(word.toLowerCase())) {
    return true;
  }
  
  return false;
}

/**
 * Get word entry from dictionary (uses cache)
 */
export function getWordFromDictionary(word: string): any | null {
  if (!word) return null;
  
  // Check cache
  if (wordCache.has(word)) {
    return wordCache.get(word);
  }
  
  // Check in hiragana form
  const hiragana = convertRomajiToHiragana(word, true);
  if (wordCache.has(hiragana)) {
    return wordCache.get(hiragana);
  }
  
  // Check lowercase
  const lower = word.toLowerCase();
  if (wordCache.has(lower)) {
    return wordCache.get(lower);
  }
  
  return null;
}

/**
 * Find words starting with specific sound (cached)
 */
export function findWordsStartingWith(sound: string, limit: number = 8): any[] {
  const results: any[] = [];
  
  for (const entry of dictionary) {
    if (entry.hiragana.startsWith(sound)) {
      results.push(entry);
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Smart search in dictionary with multiple strategies
 */
export function searchDictionary(query: string, requiredSound: string = "", limit: number = 8): any[] {
  if (!query || query.length < 1) return [];
  
  const results: any[] = [];
  const seen = new Set<string>();
  
  // Convert query to hiragana for matching
  const hiraganaQuery = convertRomajiToHiragana(query, true);
  const queryLower = query.toLowerCase();
  
  for (const entry of dictionary) {
    // Skip if already found
    if (seen.has(entry.hiragana)) continue;
    
    // Skip if doesn't start with required sound
    if (requiredSound && !entry.hiragana.startsWith(requiredSound)) {
      continue;
    }
    
    // Strategy 1: Exact hiragana match
    if (entry.hiragana === hiraganaQuery) {
      results.unshift(entry); // Add to front
      seen.add(entry.hiragana);
      continue;
    }
    
    // Strategy 2: Hiragana starts with
    if (entry.hiragana.startsWith(hiraganaQuery)) {
      results.push(entry);
      seen.add(entry.hiragana);
      if (results.length >= limit) break;
      continue;
    }
    
    // Strategy 3: Romaji match
    if (entry.romaji && entry.romaji.toLowerCase().startsWith(queryLower)) {
      results.push(entry);
      seen.add(entry.hiragana);
      if (results.length >= limit) break;
      continue;
    }
    
    // Strategy 4: Word name match
    if (entry.word.toLowerCase().startsWith(queryLower)) {
      results.push(entry);
      seen.add(entry.hiragana);
      if (results.length >= limit) break;
      continue;
    }
  }
  
  return results.slice(0, limit);
}

/**
 * Get the last sound (ending mora) of a word
 */
export function getLastSound(word: string): string {
  if (!word) return "";
  
  const hiragana = convertRomajiToHiragana(word, true);
  if (!hiragana) return "";
  
  const lastChar = hiragana[hiragana.length - 1];
  
  // Handle small kana (っ、ゃ、ゅ、ょ) - use second to last
  if (lastChar === "っ" || lastChar === "ゃ" || lastChar === "ゅ" || lastChar === "ょ") {
    if (hiragana.length > 1) {
      return hiragana[hiragana.length - 2];
    }
  }
  
  // Handle 「ん」 ending - use second to last
  if (lastChar === "ん" && hiragana.length > 1) {
    return hiragana[hiragana.length - 2];
  }
  
  return lastChar;
}

/**
 * Validate if word is valid for Shiritori rules
 */
export function validateShiritoriWord(
  word: string,
  requiredStartSound: string,
  usedWords: string[]
): { valid: boolean; reason?: string } {
  if (!word || word.trim().length === 0) {
    return { valid: false, reason: "Word is empty" };
  }
  
  const hiragana = convertRomajiToHiragana(word.trim(), true);
  
  // Check if word is in dictionary
  if (!validateWordInDictionary(hiragana)) {
    return { valid: false, reason: "Word not found in dictionary" };
  }
  
  // Check if word starts with required sound
  if (requiredStartSound && !hiragana.startsWith(requiredStartSound)) {
    return { valid: false, reason: `Word must start with '${requiredStartSound}'` };
  }
  
  // Check if word already used
  if (usedWords.includes(hiragana)) {
    return { valid: false, reason: "Word already used" };
  }
  
  // Check if word ends with ん
  if (hiragana.endsWith("ん")) {
    return { valid: false, reason: "Word cannot end with 'ん'" };
  }
  
  return { valid: true };
}

// Initialize cache on module load
if (typeof window !== "undefined") {
  try {
    initializeDictionaryCache();
  } catch (error) {
    console.error("❌ Failed to initialize on module load:", error);
  }
}

export default {
  convertRomajiToHiragana,
  hiraganaToKatakana,
  validateWordInDictionary,
  getWordFromDictionary,
  findWordsStartingWith,
  searchDictionary,
  getLastSound,
  validateShiritoriWord,
  isHiragana,
  isKatakana,
  isKana,
  isRomaji,
  initializeDictionaryCache
};
