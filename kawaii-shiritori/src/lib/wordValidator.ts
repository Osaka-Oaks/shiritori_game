/**
 * Word Validator - Cross-references multiple Japanese dictionaries
 * to ensure only real words are accepted
 * Supports Hiragana, Katakana, and Kanji input
 */

import { multiDictionary, ValidatedWord, DictionaryLookupResult } from "./multiDictionary";
import { kanjiDictionary } from "./kanjiDictionary";
import {
  japaneseConverter,
  getAllForms,
  normalizeToHiragana,
  isValidJapanese,
  detectScriptType,
} from "./japaneseConverter";

export interface ValidationResult {
  isValid: boolean;
  word: ValidatedWord | null;
  confidence: number;
  sources: string[];
  totalSources: number;
  errorMessage?: string;
  suggestions?: string[];
  kanjiInfo?: any[];
}

export interface ValidationOptions {
  requireMultipleSources?: boolean; // Require 2+ sources
  minimumConfidence?: number; // 0-1 scale
  allowKatakana?: boolean;
  allowKanji?: boolean;
  strictMode?: boolean; // Require high confidence
}

const DEFAULT_OPTIONS: ValidationOptions = {
  requireMultipleSources: false,
  minimumConfidence: 0.6,
  allowKatakana: true,
  allowKanji: true,
  strictMode: false,
};

class WordValidatorService {
  /**
   * Validate a Japanese word across multiple dictionaries
   */
  async validateWord(
    word: string,
    options: ValidationOptions = DEFAULT_OPTIONS
  ): Promise<ValidationResult> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Basic validation
    if (!word || word.trim().length === 0) {
      return {
        isValid: false,
        word: null,
        confidence: 0,
        sources: [],
        totalSources: 0,
        errorMessage: "Word is empty",
      };
    }

    // Check if valid Japanese characters
    if (!isValidJapanese(word)) {
      return {
        isValid: false,
        word: null,
        confidence: 0,
        sources: [],
        totalSources: 0,
        errorMessage: "Word contains invalid characters (must be hiragana, katakana, or kanji)",
      };
    }

    const scriptType = detectScriptType(word);
    if (!opts.allowKatakana && (scriptType === "katakana" || /[\u30A0-\u30FF]/.test(word))) {
      return {
        isValid: false,
        word: null,
        confidence: 0,
        sources: [],
        totalSources: 0,
        errorMessage: "Katakana input is not allowed",
      };
    }
    if (!opts.allowKanji && (scriptType === "kanji" || /[\u4E00-\u9FAF]/.test(word))) {
      return {
        isValid: false,
        word: null,
        confidence: 0,
        sources: [],
        totalSources: 0,
        errorMessage: "Kanji input is not allowed",
      };
    }

    // Get all possible forms (hiragana, katakana) for lookup
    const wordForms = getAllForms(word);
    const normalizedWord = normalizeToHiragana(word);

    // Try to find word in any of its forms
    let lookupResult: DictionaryLookupResult | null = null;

    for (const form of wordForms) {
      const result = await multiDictionary.validateWord(form);
      if (result.found) {
        lookupResult = result;
        break;
      }
    }

    // If not found in any form, try normalized form
    if (!lookupResult || !lookupResult.found) {
      lookupResult = await multiDictionary.validateWord(normalizedWord);
    }

    if (!lookupResult.found || !lookupResult.word) {
      // Try to provide suggestions
      const suggestions = await this.getSuggestions(word);

      return {
        isValid: false,
        word: null,
        confidence: 0,
        sources: [],
        totalSources: 0,
        errorMessage: "Word not found in dictionaries",
        suggestions: suggestions.slice(0, 5),
      };
    }

    const validatedWord = lookupResult.word;

    // Check confidence threshold
    if (validatedWord.confidence < opts.minimumConfidence) {
      return {
        isValid: false,
        word: validatedWord,
        confidence: validatedWord.confidence,
        sources: validatedWord.sources,
        totalSources: lookupResult.totalSources,
        errorMessage: `Confidence too low (${validatedWord.confidence.toFixed(2)})`,
      };
    }

    // Check multiple sources requirement
    if (opts.requireMultipleSources && lookupResult.totalSources < 2) {
      return {
        isValid: false,
        word: validatedWord,
        confidence: validatedWord.confidence,
        sources: validatedWord.sources,
        totalSources: lookupResult.totalSources,
        errorMessage: "Word found in only one source (requires verification)",
      };
    }

    // Strict mode check
    if (opts.strictMode && !validatedWord.isVerified) {
      return {
        isValid: false,
        word: validatedWord,
        confidence: validatedWord.confidence,
        sources: validatedWord.sources,
        totalSources: lookupResult.totalSources,
        errorMessage: "Word not verified in multiple sources",
      };
    }

    // Get kanji information if word contains kanji
    const kanjiInfo = this.extractKanjiInfo(word);

    return {
      isValid: true,
      word: validatedWord,
      confidence: validatedWord.confidence,
      sources: validatedWord.sources,
      totalSources: lookupResult.totalSources,
      kanjiInfo: kanjiInfo.length > 0 ? kanjiInfo : undefined,
    };
  }

  /**
   * Batch validate multiple words
   */
  async validateWords(
    words: string[],
    options?: ValidationOptions
  ): Promise<Map<string, ValidationResult>> {
    const results = new Map<string, ValidationResult>();

    for (const word of words) {
      const result = await this.validateWord(word, options);
      results.set(word, result);
    }

    return results;
  }

  /**
   * Extract kanji information from word
   */
  private extractKanjiInfo(word: string): any[] {
    const kanjiInfo: any[] = [];

    for (const char of word) {
      const info = kanjiDictionary.getKanjiInfo(char);
      if (info) {
        kanjiInfo.push({
          character: info.character,
          onyomi: info.onyomi,
          kunyomi: info.kunyomi,
          meanings: info.meanings,
          strokeCount: info.strokeCount,
        });
      }
    }

    return kanjiInfo;
  }

  /**
   * Get word suggestions for similar words
   */
  private async getSuggestions(word: string): Promise<string[]> {
    const suggestions: string[] = [];

    // Get suggestions based on first character
    if (word.length > 0) {
      const firstChar = word.charAt(0);
      const results = await multiDictionary.getSuggestions(firstChar, 10);
      suggestions.push(...results.map(r => r.word));
    }

    return suggestions;
  }

  /**
   * Check if word ends in ん (not allowed in Shiritori)
   * Works with hiragana, katakana, or kanji input
   */
  endsInN(word: string): boolean {
    const normalized = normalizeToHiragana(word);
    const lastChar = normalized.charAt(normalized.length - 1);
    return lastChar === "ん";
  }

  /**
   * Get the ending sound for Shiritori chaining
   * Works with hiragana, katakana, or kanji input
   */
  getEndSound(word: string): string {
    return japaneseConverter.getEndingSound(word);
  }

  /**
   * Get the starting sound for Shiritori chaining
   * Works with hiragana, katakana, or kanji input
   */
  getStartSound(word: string): string {
    return japaneseConverter.getStartingSound(word);
  }

  /**
   * Validate Shiritori chain (word follows previous word)
   */
  async validateShiritoriChain(
    previousWord: string,
    currentWord: string,
    options?: ValidationOptions
  ): Promise<ValidationResult & { chainValid: boolean; chainError?: string }> {
    // Validate the current word first
    const validation = await this.validateWord(currentWord, options);

    if (!validation.isValid) {
      return {
        ...validation,
        chainValid: false,
        chainError: validation.errorMessage,
      };
    }

    // Check if current word ends in ん
    if (this.endsInN(currentWord)) {
      return {
        ...validation,
        chainValid: false,
        chainError: "Word cannot end in ん (n)",
      };
    }

    // Check if words connect properly
    const previousEnd = this.getEndSound(previousWord);
    const currentStart = this.getStartSound(currentWord);

    if (previousEnd !== currentStart) {
      return {
        ...validation,
        chainValid: false,
        chainError: `Word must start with "${previousEnd}" (ends with "${previousEnd}" from previous word)`,
      };
    }

    return {
      ...validation,
      chainValid: true,
    };
  }

  /**
   * Get statistics about validation
   */
  getValidationStats() {
    return multiDictionary.getCacheStats();
  }

  /**
   * Clear validation cache
   */
  clearCache() {
    multiDictionary.clearCache();
  }
}

export const wordValidator = new WordValidatorService();
