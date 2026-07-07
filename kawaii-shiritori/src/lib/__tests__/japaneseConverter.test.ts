import { describe, it, expect } from "vitest";
import {
  japaneseConverter,
  hiraganaToKatakana,
  katakanaToHiragana,
  normalizeToHiragana,
  detectScriptType,
  isValidJapanese,
  getAllForms,
  getEndingSound,
  getStartingSound,
} from "../japaneseConverter";

describe("Japanese Converter", () => {
  describe("hiraganaToKatakana", () => {
    it("should convert hiragana to katakana", () => {
      expect(hiraganaToKatakana("いぬ")).toBe("イヌ");
      expect(hiraganaToKatakana("ねこ")).toBe("ネコ");
      expect(hiraganaToKatakana("さかな")).toBe("サカナ");
    });

    it("should handle combinations", () => {
      expect(hiraganaToKatakana("きょう")).toBe("キョウ");
      expect(hiraganaToKatakana("しゃ")).toBe("シャ");
    });

    it("should handle small tsu", () => {
      expect(hiraganaToKatakana("がっこう")).toBe("ガッコウ");
    });
  });

  describe("katakanaToHiragana", () => {
    it("should convert katakana to hiragana", () => {
      expect(katakanaToHiragana("イヌ")).toBe("いぬ");
      expect(katakanaToHiragana("ネコ")).toBe("ねこ");
      expect(katakanaToHiragana("ピカチュウ")).toBe("ぴかちゅう");
    });

    it("should handle long vowels", () => {
      expect(katakanaToHiragana("ラーメン")).toBe("らーめん");
    });
  });

  describe("normalizeToHiragana", () => {
    it("should keep hiragana as is", () => {
      expect(normalizeToHiragana("いぬ")).toBe("いぬ");
    });

    it("should convert katakana to hiragana", () => {
      expect(normalizeToHiragana("イヌ")).toBe("いぬ");
      expect(normalizeToHiragana("ピカチュウ")).toBe("ぴかちゅう");
    });

    it("should handle mixed text", () => {
      expect(normalizeToHiragana("いイぬヌ")).toBe("いいぬぬ");
    });

    it("should preserve kanji", () => {
      expect(normalizeToHiragana("犬")).toBe("犬");
    });
  });

  describe("detectScriptType", () => {
    it("should detect hiragana", () => {
      expect(detectScriptType("いぬ")).toBe("hiragana");
      expect(detectScriptType("ねこ")).toBe("hiragana");
    });

    it("should detect katakana", () => {
      expect(detectScriptType("イヌ")).toBe("katakana");
      expect(detectScriptType("ピカチュウ")).toBe("katakana");
    });

    it("should detect kanji", () => {
      expect(detectScriptType("犬")).toBe("kanji");
      expect(detectScriptType("猫")).toBe("kanji");
    });

    it("should detect mixed text", () => {
      expect(detectScriptType("いぬイヌ")).toBe("mixed");
      expect(detectScriptType("犬ねこ")).toBe("mixed");
    });

    it("should detect non-Japanese", () => {
      expect(detectScriptType("dog")).toBe("other");
      expect(detectScriptType("123")).toBe("other");
    });
  });

  describe("isValidJapanese", () => {
    it("should accept hiragana", () => {
      expect(isValidJapanese("いぬ")).toBe(true);
      expect(isValidJapanese("ねこ")).toBe(true);
    });

    it("should accept katakana", () => {
      expect(isValidJapanese("イヌ")).toBe(true);
      expect(isValidJapanese("ピカチュウ")).toBe(true);
    });

    it("should accept kanji", () => {
      expect(isValidJapanese("犬")).toBe(true);
      expect(isValidJapanese("猫")).toBe(true);
    });

    it("should accept mixed", () => {
      expect(isValidJapanese("いぬイヌ")).toBe(true);
      expect(isValidJapanese("犬ねこ")).toBe(true);
    });

    it("should reject non-Japanese", () => {
      expect(isValidJapanese("dog")).toBe(false);
      expect(isValidJapanese("123")).toBe(false);
      expect(isValidJapanese("abc")).toBe(false);
    });

    it("should accept long vowel mark", () => {
      expect(isValidJapanese("ラーメン")).toBe(true);
    });
  });

  describe("getAllForms", () => {
    it("should return hiragana and katakana for hiragana input", () => {
      const forms = getAllForms("いぬ");
      expect(forms).toContain("いぬ");
      expect(forms).toContain("イヌ");
      expect(forms.length).toBe(2);
    });

    it("should return katakana and hiragana for katakana input", () => {
      const forms = getAllForms("イヌ");
      expect(forms).toContain("イヌ");
      expect(forms).toContain("いぬ");
      expect(forms.length).toBe(2);
    });

    it("should return only kanji for kanji input", () => {
      const forms = getAllForms("犬");
      expect(forms).toContain("犬");
      expect(forms.length).toBe(1);
    });
  });

  describe("getEndingSound", () => {
    it("should get ending sound from hiragana", () => {
      expect(getEndingSound("いぬ")).toBe("ぬ");
      expect(getEndingSound("ねこ")).toBe("こ");
      expect(getEndingSound("さかな")).toBe("な");
    });

    it("should get ending sound from katakana (normalized)", () => {
      expect(getEndingSound("イヌ")).toBe("ぬ");
      expect(getEndingSound("ネコ")).toBe("こ");
    });

    it("should handle combinations", () => {
      expect(getEndingSound("きょう")).toBe("う");
      expect(getEndingSound("しゃ")).toBe("しゃ");
    });

    it("should handle ん", () => {
      expect(getEndingSound("ほん")).toBe("ん");
      expect(getEndingSound("らいおん")).toBe("ん");
    });

    it("should convert katakana to hiragana", () => {
      expect(getEndingSound("ピカチュウ")).toBe("う");
    });
  });

  describe("getStartingSound", () => {
    it("should get starting sound from hiragana", () => {
      expect(getStartingSound("いぬ")).toBe("い");
      expect(getStartingSound("ねこ")).toBe("ね");
      expect(getStartingSound("さかな")).toBe("さ");
    });

    it("should get starting sound from katakana (normalized)", () => {
      expect(getStartingSound("イヌ")).toBe("い");
      expect(getStartingSound("ネコ")).toBe("ね");
    });

    it("should handle combinations", () => {
      expect(getStartingSound("きょう")).toBe("きょ");
      expect(getStartingSound("しゃ")).toBe("しゃ");
    });

    it("should convert katakana to hiragana", () => {
      expect(getStartingSound("カメ")).toBe("か");
    });
  });

  describe("convertToAllForms", () => {
    it("should convert hiragana to all forms", () => {
      const result = japaneseConverter.convertToAllForms("いぬ");
      expect(result.hiragana).toBe("いぬ");
      expect(result.katakana).toBe("イヌ");
      expect(result.originalForm).toBe("hiragana");
      expect(result.romaji).toBeDefined();
    });

    it("should convert katakana to all forms", () => {
      const result = japaneseConverter.convertToAllForms("イヌ");
      expect(result.hiragana).toBe("いぬ");
      expect(result.katakana).toBe("イヌ");
      expect(result.originalForm).toBe("katakana");
    });

    it("should include kanji if provided", () => {
      const result = japaneseConverter.convertToAllForms("いぬ", "犬");
      expect(result.kanji).toBe("犬");
    });
  });

  describe("hiraganaToRomaji", () => {
    it("should convert basic hiragana to romaji", () => {
      expect(japaneseConverter.hiraganaToRomaji("いぬ")).toBe("inu");
      expect(japaneseConverter.hiraganaToRomaji("ねこ")).toBe("neko");
      expect(japaneseConverter.hiraganaToRomaji("さかな")).toBe("sakana");
    });

    it("should handle combinations", () => {
      expect(japaneseConverter.hiraganaToRomaji("きょう")).toBe("kyou");
      expect(japaneseConverter.hiraganaToRomaji("しゃ")).toBe("sha");
    });
  });
});
