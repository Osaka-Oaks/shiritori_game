import { describe, it, expect } from "vitest";
import { dictionary } from "../dictionaryHelper";

describe("DictionaryHelper", () => {
  describe("findWord", () => {
    it("should find a word by hiragana", () => {
      const word = dictionary.findWord("いぬ");
      expect(word).toBeDefined();
      expect(word?.romaji).toBe("inu");
      expect(word?.kanji).toBe("犬");
    });

    it("should find a word by romaji", () => {
      const word = dictionary.findWord("neko");
      expect(word).toBeDefined();
      expect(word?.word).toBe("ねこ");
      expect(word?.kanji).toBe("猫");
    });

    it("should find a word by kanji", () => {
      const word = dictionary.findWord("犬");
      expect(word).toBeDefined();
      expect(word?.word).toBe("いぬ");
    });

    it("should return null for non-existent word", () => {
      const word = dictionary.findWord("nonexistent");
      expect(word).toBeNull();
    });
  });

  describe("isValidWord", () => {
    it("should return true for valid words", () => {
      expect(dictionary.isValidWord("いぬ")).toBe(true);
      expect(dictionary.isValidWord("neko")).toBe(true);
      expect(dictionary.isValidWord("犬")).toBe(true);
    });

    it("should return false for invalid words", () => {
      expect(dictionary.isValidWord("invalid")).toBe(false);
      expect(dictionary.isValidWord("xyz")).toBe(false);
    });
  });

  describe("endsInN", () => {
    it("should detect words ending in ん", () => {
      expect(dictionary.endsInN("ほん")).toBe(true);
      expect(dictionary.endsInN("らいおん")).toBe(true);
    });

    it("should detect words ending in ン", () => {
      expect(dictionary.endsInN("リザードン")).toBe(true);
    });

    it("should detect words ending in n (romaji)", () => {
      expect(dictionary.endsInN("hon")).toBe(true);
      expect(dictionary.endsInN("raion")).toBe(true);
    });

    it("should return false for words not ending in n", () => {
      expect(dictionary.endsInN("いぬ")).toBe(false);
      expect(dictionary.endsInN("neko")).toBe(false);
    });
  });

  describe("getWordsByStartSound", () => {
    it("should return words starting with specified sound", () => {
      const words = dictionary.getWordsByStartSound("あ");
      expect(words.length).toBeGreaterThan(0);
      expect(words.every(w => w.startSound === "あ")).toBe(true);
    });

    it("should return empty array for non-existent sound", () => {
      const words = dictionary.getWordsByStartSound("zzz");
      expect(words).toEqual([]);
    });
  });

  describe("getAllWords", () => {
    it("should return all dictionary words", () => {
      const words = dictionary.getAllWords();
      expect(words.length).toBeGreaterThan(400);
    });
  });

  describe("getTotalWordCount", () => {
    it("should return correct total word count", () => {
      const count = dictionary.getTotalWordCount();
      expect(count).toBeGreaterThan(400);
    });
  });

  describe("ON-YOMI support", () => {
    it("should include ON-YOMI readings for kanji words", () => {
      const word = dictionary.findWord("やま");
      expect(word).toBeDefined();
      expect(word?.onyomi).toBeDefined();
      expect(word?.onyomi).toBe("サン/セン");
    });

    it("should work without ON-YOMI for katakana words", () => {
      const word = dictionary.findWord("ピカチュウ");
      expect(word).toBeDefined();
      // Katakana words may not have onyomi
    });
  });
});
