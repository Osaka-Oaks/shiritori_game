/**
 * AI Agent System for Shiritori Game
 * Supports multiple AI providers: Gemini (existing), Ollama (free local), Dictionary (free fallback)
 */

export type AIProvider = "gemini" | "ollama" | "dictionary";

export interface ShiritoriAgentConfig {
  provider: AIProvider;
  ollamaUrl?: string;
  model?: string;
}

export interface WordValidationResult {
  valid: boolean;
  word: string;
  hiragana: string;
  kanji?: string;
  romaji: string;
  translation: string;
  startSound: string;
  endSound: string;
  reason?: string;
  hint?: string;
  endsInN: boolean;
}

export interface OpponentMoveResult {
  word: string;
  hiragana: string;
  kanji?: string;
  katakana?: string;
  romaji: string;
  translation: string;
  startSound: string;
  endSound: string;
  reason?: string;
}

/**
 * Shiritori AI Agent Class
 * Abstracts different AI providers with a unified interface
 */
export class ShiritoriAgent {
  private config: ShiritoriAgentConfig;

  constructor(config: ShiritoriAgentConfig) {
    this.config = config;
  }

  /**
   * Validate a word using the configured AI provider
   */
  async validateWord(word: string): Promise<WordValidationResult> {
    switch (this.config.provider) {
      case "gemini":
        return this.validateWithGemini(word);
      case "ollama":
        return this.validateWithOllama(word);
      case "dictionary":
        return this.validateWithDictionary(word);
      default:
        throw new Error(`Unknown AI provider: ${this.config.provider}`);
    }
  }

  /**
   * Get AI opponent's next move
   */
  async getOpponentMove(
    lastSound: string,
    difficulty: "easy" | "medium" | "hard",
    playedWords: string[]
  ): Promise<OpponentMoveResult> {
    switch (this.config.provider) {
      case "gemini":
        return this.getOpponentMoveGemini(lastSound, difficulty, playedWords);
      case "ollama":
        return this.getOpponentMoveOllama(lastSound, difficulty, playedWords);
      case "dictionary":
        return this.getOpponentMoveDictionary(lastSound, playedWords);
      default:
        throw new Error(`Unknown AI provider: ${this.config.provider}`);
    }
  }

  /**
   * Get hints for the player
   */
  async getHints(requiredSound: string, playedWords: string[]): Promise<string[]> {
    switch (this.config.provider) {
      case "gemini":
        return this.getHintsGemini(requiredSound, playedWords);
      case "ollama":
        return this.getHintsOllama(requiredSound, playedWords);
      case "dictionary":
        return this.getHintsDictionary(requiredSound, playedWords);
      default:
        return [];
    }
  }

  // ===== GEMINI PROVIDER (EXISTING) =====
  
  private async validateWithGemini(word: string): Promise<WordValidationResult> {
    const response = await fetch("/api/gemini/evaluate-word", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word })
    });

    if (!response.ok) {
      throw new Error("Gemini validation failed");
    }

    return response.json();
  }

  private async getOpponentMoveGemini(
    lastSound: string,
    difficulty: string,
    playedWords: string[]
  ): Promise<OpponentMoveResult> {
    const response = await fetch("/api/gemini/opponent-turn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastSound, difficulty, playedWords })
    });

    if (!response.ok) {
      throw new Error("Gemini opponent move failed");
    }

    return response.json();
  }

  private async getHintsGemini(requiredSound: string, playedWords: string[]): Promise<string[]> {
    const response = await fetch("/api/gemini/word-hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requiredSound, usedWords: playedWords })
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.hints || [];
  }

  // ===== OLLAMA PROVIDER (FREE LOCAL AI) =====
  
  private async validateWithOllama(word: string): Promise<WordValidationResult> {
    const ollamaUrl = this.config.ollamaUrl || "http://localhost:11434";
    const model = this.config.model || "qwen3";

    const prompt = `You are a Japanese language expert. Validate this Japanese word for Shiritori game.

Word: ${word}

Return JSON only with this exact format:
{
  "valid": true or false,
  "word": "${word}",
  "hiragana": "hiragana version",
  "kanji": "kanji version if exists, otherwise empty",
  "romaji": "romaji version",
  "translation": "English meaning",
  "startSound": "first kana sound",
  "endSound": "last kana sound",
  "reason": "explanation if invalid",
  "endsInN": true if ends in ん
}

Rules:
- Word must be a real Japanese noun
- Provide accurate hiragana, romaji, and English translation
- Check if word ends in ん (N sound)`;

    try {
      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          format: "json"
        })
      });

      if (!response.ok) {
        throw new Error("Ollama request failed");
      }

      const data = await response.json();
      const result = JSON.parse(data.response);
      
      return {
        valid: result.valid || false,
        word: result.word || word,
        hiragana: result.hiragana || "",
        kanji: result.kanji || "",
        romaji: result.romaji || word,
        translation: result.translation || "Unknown",
        startSound: result.startSound || "",
        endSound: result.endSound || "",
        reason: result.reason,
        endsInN: result.endsInN || false
      };
    } catch (error) {
      console.error("Ollama validation error:", error);
      // Fallback to dictionary
      return this.validateWithDictionary(word);
    }
  }

  private async getOpponentMoveOllama(
    lastSound: string,
    difficulty: string,
    playedWords: string[]
  ): Promise<OpponentMoveResult> {
    const ollamaUrl = this.config.ollamaUrl || "http://localhost:11434";
    const model = this.config.model || "qwen3";

    const prompt = `You are a Shiritori game AI opponent.

Required starting sound: ${lastSound}
Difficulty: ${difficulty}
Already used words: ${playedWords.join(", ")}

Choose a valid Japanese word that:
1. Starts with sound: ${lastSound}
2. Is a common noun
3. Has NOT been used yet
4. Does NOT end in ん

Return JSON only:
{
  "word": "chosen word",
  "hiragana": "hiragana",
  "kanji": "kanji if exists",
  "katakana": "katakana",
  "romaji": "romaji",
  "translation": "English meaning",
  "startSound": "starting kana",
  "endSound": "ending kana",
  "reason": "why you chose this word"
}`;

    try {
      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          format: "json"
        })
      });

      if (!response.ok) {
        throw new Error("Ollama opponent move failed");
      }

      const data = await response.json();
      const result = JSON.parse(data.response);
      
      return {
        word: result.word || "neko",
        hiragana: result.hiragana || "ねこ",
        kanji: result.kanji,
        katakana: result.katakana,
        romaji: result.romaji || "neko",
        translation: result.translation || "cat",
        startSound: result.startSound || lastSound,
        endSound: result.endSound || "こ",
        reason: result.reason
      };
    } catch (error) {
      console.error("Ollama opponent move error:", error);
      // Fallback to dictionary
      return this.getOpponentMoveDictionary(lastSound, playedWords);
    }
  }

  private async getHintsOllama(requiredSound: string, playedWords: string[]): Promise<string[]> {
    const ollamaUrl = this.config.ollamaUrl || "http://localhost:11434";
    const model = this.config.model || "qwen3";

    const prompt = `Give 3 Japanese words that start with: ${requiredSound}

Exclude these already used: ${playedWords.join(", ")}

Return JSON only:
{
  "hints": ["word1", "word2", "word3"]
}`;

    try {
      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          format: "json"
        })
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const result = JSON.parse(data.response);
      return result.hints || [];
    } catch (error) {
      console.error("Ollama hints error:", error);
      return this.getHintsDictionary(requiredSound, playedWords);
    }
  }

  // ===== DICTIONARY PROVIDER (FREE FALLBACK) =====
  
  private async validateWithDictionary(word: string): Promise<WordValidationResult> {
    // Load dictionary from your existing dictionary.json
    try {
      const response = await fetch("/src/data/dictionary.json");
      const dictionary = await response.json();
      
      const normalizedWord = word.toLowerCase();
      const found = dictionary.find((entry: any) => 
        entry.word?.toLowerCase() === normalizedWord ||
        entry.hiragana === word ||
        entry.romaji?.toLowerCase() === normalizedWord
      );

      if (found) {
        return {
          valid: true,
          word: found.word || found.romaji,
          hiragana: found.hiragana,
          kanji: found.kanji,
          romaji: found.romaji,
          translation: found.translation,
          startSound: found.startSound || found.hiragana[0],
          endSound: found.endSound || found.hiragana[found.hiragana.length - 1],
          endsInN: found.endSound === "ん" || false
        };
      }

      return {
        valid: false,
        word,
        hiragana: "",
        romaji: word,
        translation: "Unknown word",
        startSound: "",
        endSound: "",
        reason: "Word not found in dictionary",
        endsInN: false
      };
    } catch (error) {
      console.error("Dictionary validation error:", error);
      return {
        valid: false,
        word,
        hiragana: "",
        romaji: word,
        translation: "Error loading dictionary",
        startSound: "",
        endSound: "",
        reason: "Dictionary not available",
        endsInN: false
      };
    }
  }

  private async getOpponentMoveDictionary(
    lastSound: string,
    playedWords: string[]
  ): Promise<OpponentMoveResult> {
    try {
      const response = await fetch("/src/data/dictionary.json");
      const dictionary = await response.json();
      
      const validWords = dictionary.filter((entry: any) =>
        entry.startSound === lastSound &&
        entry.endSound !== "ん" &&
        !playedWords.includes(entry.word) &&
        !playedWords.includes(entry.hiragana)
      );

      if (validWords.length === 0) {
        // No valid words, return default
        return {
          word: "neko",
          hiragana: "ねこ",
          kanji: "猫",
          katakana: "ネコ",
          romaji: "neko",
          translation: "cat",
          startSound: "ね",
          endSound: "こ"
        };
      }

      const chosen = validWords[Math.floor(Math.random() * validWords.length)];
      
      return {
        word: chosen.word || chosen.romaji,
        hiragana: chosen.hiragana,
        kanji: chosen.kanji,
        katakana: chosen.katakana,
        romaji: chosen.romaji,
        translation: chosen.translation,
        startSound: chosen.startSound,
        endSound: chosen.endSound
      };
    } catch (error) {
      console.error("Dictionary opponent move error:", error);
      return {
        word: "neko",
        hiragana: "ねこ",
        romaji: "neko",
        translation: "cat",
        startSound: "ね",
        endSound: "こ"
      };
    }
  }

  private async getHintsDictionary(requiredSound: string, playedWords: string[]): Promise<string[]> {
    try {
      const response = await fetch("/src/data/dictionary.json");
      const dictionary = await response.json();
      
      const hints = dictionary
        .filter((entry: any) =>
          entry.startSound === requiredSound &&
          !playedWords.includes(entry.word) &&
          !playedWords.includes(entry.hiragana)
        )
        .slice(0, 3)
        .map((entry: any) => `${entry.word} (${entry.hiragana}) = ${entry.translation}`);
      
      return hints;
    } catch (error) {
      console.error("Dictionary hints error:", error);
      return [];
    }
  }
}

// ===== AGENT FACTORY =====

/**
 * Create a Shiritori AI agent with the specified configuration
 */
export function createShiritoriAgent(config?: Partial<ShiritoriAgentConfig>): ShiritoriAgent {
  const defaultConfig: ShiritoriAgentConfig = {
    provider: "gemini", // Default to existing Gemini
    ollamaUrl: "http://localhost:11434",
    model: "qwen3"
  };

  return new ShiritoriAgent({ ...defaultConfig, ...config });
}

// ===== HOOKS FOR REACT COMPONENTS =====

/**
 * React hook for using the AI agent
 */
export function useShiritoriAgent(provider: AIProvider = "gemini") {
  const agent = React.useMemo(() => {
    return createShiritoriAgent({ provider });
  }, [provider]);

  return agent;
}

// For compatibility with React
import React from "react";
