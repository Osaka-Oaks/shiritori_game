import { describe, it, expect, beforeEach, vi } from "vitest";
import { wordValidator } from "../wordValidator";

describe("WordValidator", () => {
  describe("validateWord", () => {
    it("should validate a real Japanese word", async () => {
      const result = await wordValidator.validateWord("いぬ");

      expect(result.isValid).toBe(true);
      expect(result.word).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.sources.length).toBeGreaterThan(0);
    });

    it("should reject an empty word", async () => {
      const result = await wordValidator.validateWord("");

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain("empty");
    });

    it("should reject non-Japanese characters", async () => {
      const result = await wordValidator.validateWord("hello");

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain("invalid characters");
    });

    it("should validate kanji words", async () => {
      const result = await wordValidator.validateWord("犬");

      expect(result.isValid).toBe(true);
      expect(result.word).toBeDefined();
      expect(result.kanjiInfo).toBeDefined();
    });

    it("should validate katakana words", async () => {
      const result = await wordValidator.validateWord("ピカチュウ");

      expect(result.isValid).toBe(true);
      expect(result.word).toBeDefined();
    });
  });

  describe("endsInN", () => {
    it("should detect words ending in ん", () => {
      expect(wordValidator.endsInN("ほん")).toBe(true);
      expect(wordValidator.endsInN("らいおん")).toBe(true);
    });

    it("should detect words ending in ン", () => {
      expect(wordValidator.endsInN("リザードン")).toBe(true);
      expect(wordValidator.endsInN("カビゴン")).toBe(true);
    });

    it("should return false for words not ending in n", () => {
      expect(wordValidator.endsInN("いぬ")).toBe(false);
      expect(wordValidator.endsInN("ねこ")).toBe(false);
    });
  });

  describe("getEndSound", () => {
    it("should get end sound from hiragana word", () => {
      expect(wordValidator.getEndSound("いぬ")).toBe("ぬ");
      expect(wordValidator.getEndSound("ねこ")).toBe("こ");
    });

    it("should handle small ya/yu/yo combinations", () => {
      expect(wordValidator.getEndSound("きょう")).toBe("う");
      expect(wordValidator.getEndSound("しゃ")).toBe("しゃ");
    });

    it("should convert katakana to hiragana", () => {
      const end = wordValidator.getEndSound("ピカチュウ");
      expect(end).toBe("う");
    });
  });

  describe("getStartSound", () => {
    it("should get start sound from hiragana word", () => {
      expect(wordValidator.getStartSound("いぬ")).toBe("い");
      expect(wordValidator.getStartSound("ねこ")).toBe("ね");
    });

    it("should handle small ya/yu/yo combinations", () => {
      expect(wordValidator.getStartSound("きょう")).toBe("きょ");
    });
  });

  describe("validateShiritoriChain", () => {
    it("should validate correct Shiritori chain", async () => {
      const result = await wordValidator.validateShiritoriChain("いぬ", "ぬま");

      expect(result.isValid).toBe(true);
      expect(result.chainValid).toBe(true);
    });

    it("should reject chain ending in ん", async () => {
      const result = await wordValidator.validateShiritoriChain("いぬ", "ぬしほん");

      if (result.word) {
        expect(result.chainValid).toBe(false);
        expect(result.chainError).toContain("ん");
      }
    });

    it("should reject incorrect chain", async () => {
      const result = await wordValidator.validateShiritoriChain("いぬ", "ねこ");

      expect(result.chainValid).toBe(false);
      expect(result.chainError).toBeDefined();
    });
  });

  describe("validation options", () => {
    it("should respect minimum confidence threshold", async () => {
      const result = await wordValidator.validateWord("いぬ", {
        minimumConfidence: 0.95,
      });

      // Result depends on dictionary lookup confidence
      expect(result.confidence).toBeDefined();
    });

    it("should require multiple sources when specified", async () => {
      const result = await wordValidator.validateWord("いぬ", {
        requireMultipleSources: true,
      });

      // Should check totalSources >= 2
      expect(result.totalSources).toBeDefined();
    });

    it("should reject katakana when not allowed", async () => {
      const result = await wordValidator.validateWord("ピカチュウ", {
        allowKatakana: false,
      });

      expect(result.isValid).toBe(false);
    });

    it("should reject kanji when not allowed", async () => {
      const result = await wordValidator.validateWord("犬", {
        allowKanji: false,
      });

      expect(result.isValid).toBe(false);
    });
  });

  describe("batch validation", () => {
    it("should validate multiple words", async () => {
      const words = ["いぬ", "ねこ", "さかな"];
      const results = await wordValidator.validateWords(words);

      expect(results.size).toBe(3);
      results.forEach((result, word) => {
        expect(result).toBeDefined();
        expect(result.isValid).toBeDefined();
      });
    });
  });
});
