import { DictionaryWord } from "./dictionaryHelper";
import dictionaryData from "../data/dictionary.json";

// Dictionary sources
export enum DictionarySource {
  LOCAL = "local",
  JISHO = "jisho",
  JMDICT = "jmdict",
  WEBLIO = "weblio",
}

export interface ValidatedWord {
  word: string;
  romaji: string;
  kanji?: string;
  onyomi?: string;
  kunyomi?: string;
  translation: string;
  startSound: string;
  endSound: string;
  sources: DictionarySource[];
  isVerified: boolean;
  confidence: number; // 0-1 scale
  definitions?: string[];
  jlptLevel?: string;
  frequency?: number;
}

export interface DictionaryLookupResult {
  found: boolean;
  word: ValidatedWord | null;
  sources: DictionarySource[];
  totalSources: number;
}

class MultiDictionaryService {
  private localDictionary: Map<string, DictionaryWord>;
  private cache: Map<string, ValidatedWord>;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.localDictionary = new Map();
    this.cache = new Map();
    this.initializeLocalDictionary();
    this.loadCache();
  }

  private initializeLocalDictionary() {
    dictionaryData.words.forEach((word: DictionaryWord) => {
      // Index by hiragana
      this.localDictionary.set(word.word, word);
      // Index by romaji
      this.localDictionary.set(word.romaji, word);
      // Index by kanji if exists
      if (word.kanji) {
        this.localDictionary.set(word.kanji, word);
      }
    });
  }

  private loadCache() {
    try {
      const cached = localStorage.getItem("dictionary_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        Object.entries(parsed).forEach(([key, value]) => {
          this.cache.set(key, value as ValidatedWord);
        });
      }
    } catch (error) {
      console.warn("Failed to load dictionary cache:", error);
    }
  }

  private saveCache() {
    try {
      const cacheObj: Record<string, ValidatedWord> = {};
      this.cache.forEach((value, key) => {
        cacheObj[key] = value;
      });
      localStorage.setItem("dictionary_cache", JSON.stringify(cacheObj));
    } catch (error) {
      console.warn("Failed to save dictionary cache:", error);
    }
  }

  /**
   * Validate word across multiple dictionary sources
   */
  async validateWord(word: string): Promise<DictionaryLookupResult> {
    // Check cache first
    const cached = this.cache.get(word);
    if (cached) {
      return {
        found: true,
        word: cached,
        sources: cached.sources,
        totalSources: cached.sources.length,
      };
    }

    const sources: DictionarySource[] = [];
    let validatedWord: ValidatedWord | null = null;

    // 1. Check local dictionary
    const localResult = this.lookupLocal(word);
    if (localResult) {
      sources.push(DictionarySource.LOCAL);
      validatedWord = this.convertToValidated(localResult, [DictionarySource.LOCAL]);
    }

    // 2. Check Jisho API
    try {
      const jishoResult = await this.lookupJisho(word);
      if (jishoResult) {
        sources.push(DictionarySource.JISHO);
        validatedWord = this.mergeResults(validatedWord, jishoResult);
      }
    } catch (error) {
      console.warn("Jisho API lookup failed:", error);
    }

    // 3. Check JMdict (via Jisho)
    // Jisho uses JMdict, so it's already covered

    // Calculate confidence based on number of sources
    if (validatedWord) {
      validatedWord.sources = sources;
      validatedWord.confidence = this.calculateConfidence(sources.length);
      validatedWord.isVerified = sources.length >= 2; // Verified if found in 2+ sources

      // Cache the result
      this.cache.set(word, validatedWord);
      this.saveCache();

      return {
        found: true,
        word: validatedWord,
        sources,
        totalSources: sources.length,
      };
    }

    return {
      found: false,
      word: null,
      sources: [],
      totalSources: 0,
    };
  }

  /**
   * Lookup in local dictionary
   */
  private lookupLocal(word: string): DictionaryWord | null {
    // Try exact match first
    let result = this.localDictionary.get(word);
    if (result) return result;

    // Try normalized forms
    const normalized = this.normalizeWord(word);
    result = this.localDictionary.get(normalized);
    if (result) return result;

    return null;
  }

  /**
   * Lookup via Jisho API
   */
  private async lookupJisho(word: string): Promise<ValidatedWord | null> {
    try {
      const response = await fetch(
        `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(word)}`
      );

      if (!response.ok) {
        throw new Error("Jisho API request failed");
      }

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const entry = data.data[0];

        // Extract Japanese reading
        const japanese = entry.japanese?.[0];
        const senses = entry.senses?.[0];

        if (!japanese) return null;

        const hiragana = japanese.reading || "";
        const kanji = japanese.word || "";

        return {
          word: hiragana,
          romaji: this.toRomaji(hiragana),
          kanji: kanji !== hiragana ? kanji : undefined,
          translation: senses?.english_definitions?.join(", ") || "",
          startSound: this.getStartSound(hiragana),
          endSound: this.getEndSound(hiragana),
          sources: [DictionarySource.JISHO],
          isVerified: true,
          confidence: 0.9,
          definitions: senses?.english_definitions || [],
          jlptLevel: entry.jlpt?.[0] || undefined,
        };
      }

      return null;
    } catch (error) {
      console.error("Jisho lookup error:", error);
      return null;
    }
  }

  /**
   * Convert local dictionary word to validated format
   */
  private convertToValidated(word: DictionaryWord, sources: DictionarySource[]): ValidatedWord {
    return {
      word: word.word,
      romaji: word.romaji,
      kanji: word.kanji || undefined,
      onyomi: word.onyomi || undefined,
      translation: word.translation,
      startSound: word.startSound,
      endSound: word.endSound,
      sources,
      isVerified: true,
      confidence: 1.0,
    };
  }

  /**
   * Merge results from multiple sources
   */
  private mergeResults(existing: ValidatedWord | null, newResult: ValidatedWord): ValidatedWord {
    if (!existing) return newResult;

    return {
      ...existing,
      kanji: existing.kanji || newResult.kanji,
      onyomi: existing.onyomi || newResult.onyomi,
      translation: existing.translation || newResult.translation,
      definitions: [...(existing.definitions || []), ...(newResult.definitions || [])],
      jlptLevel: existing.jlptLevel || newResult.jlptLevel,
      sources: [...existing.sources, ...newResult.sources],
      confidence: Math.max(existing.confidence, newResult.confidence),
      isVerified: true,
    };
  }

  /**
   * Calculate confidence score based on number of sources
   */
  private calculateConfidence(sourceCount: number): number {
    switch (sourceCount) {
      case 0:
        return 0;
      case 1:
        return 0.6;
      case 2:
        return 0.85;
      case 3:
        return 0.95;
      default:
        return 1.0;
    }
  }

  /**
   * Normalize word for matching
   */
  private normalizeWord(word: string): string {
    // Remove spaces and special characters
    return word.trim().toLowerCase();
  }

  /**
   * Get start sound from hiragana word
   */
  private getStartSound(word: string): string {
    if (!word) return "";

    // Handle small tsu and ya/yu/yo combinations
    const firstChar = word.charAt(0);
    const secondChar = word.charAt(1);

    // Check for combinations like きゃ, しゅ, ちょ
    if (secondChar && ["ゃ", "ゅ", "ょ"].includes(secondChar)) {
      return firstChar + secondChar;
    }

    return firstChar;
  }

  /**
   * Get end sound from hiragana word
   */
  private getEndSound(word: string): string {
    if (!word) return "";

    const lastChar = word.charAt(word.length - 1);
    const secondLastChar = word.charAt(word.length - 2);

    // Check for combinations
    if (secondLastChar && ["ゃ", "ゅ", "ょ"].includes(lastChar)) {
      return secondLastChar + lastChar;
    }

    return lastChar;
  }

  /**
   * Simple romaji conversion (basic implementation)
   */
  private toRomaji(hiragana: string): string {
    const romajiMap: Record<string, string> = {
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
      さ: "sa",
      し: "shi",
      す: "su",
      せ: "se",
      そ: "so",
      た: "ta",
      ち: "chi",
      つ: "tsu",
      て: "te",
      と: "to",
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
      が: "ga",
      ぎ: "gi",
      ぐ: "gu",
      げ: "ge",
      ご: "go",
      ざ: "za",
      じ: "ji",
      ず: "zu",
      ぜ: "ze",
      ぞ: "zo",
      だ: "da",
      ぢ: "ji",
      づ: "zu",
      で: "de",
      ど: "do",
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
    };

    let result = "";
    for (const char of hiragana) {
      result += romajiMap[char] || char;
    }
    return result;
  }

  /**
   * Batch validate multiple words
   */
  async validateWords(words: string[]): Promise<Map<string, DictionaryLookupResult>> {
    const results = new Map<string, DictionaryLookupResult>();

    for (const word of words) {
      const result = await this.validateWord(word);
      results.set(word, result);
    }

    return results;
  }

  /**
   * Get word suggestions based on starting sound
   */
  async getSuggestions(startSound: string, limit: number = 10): Promise<ValidatedWord[]> {
    const suggestions: ValidatedWord[] = [];

    // Get from local dictionary first
    dictionaryData.words.forEach((word: DictionaryWord) => {
      if (word.startSound === startSound && suggestions.length < limit) {
        suggestions.push(this.convertToValidated(word, [DictionarySource.LOCAL]));
      }
    });

    return suggestions;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    localStorage.removeItem("dictionary_cache");
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const multiDictionary = new MultiDictionaryService();
