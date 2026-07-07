/**
 * Comprehensive Kanji Dictionary Service
 * Provides detailed kanji information including readings, meanings, and radicals
 */

export interface KanjiInfo {
  character: string;
  onyomi: string[];
  kunyomi: string[];
  meanings: string[];
  grade?: number; // School grade (1-6) or general use
  jlptLevel?: number; // N5 (5) to N1 (1)
  strokeCount: number;
  radical?: string;
  radicalStrokeCount?: number;
  examples: KanjiExample[];
}

export interface KanjiExample {
  word: string;
  reading: string;
  meaning: string;
}

class KanjiDictionaryService {
  private kanjiData: Map<string, KanjiInfo>;

  constructor() {
    this.kanjiData = new Map();
    this.initializeKanji();
  }

  private initializeKanji() {
    // Common JLPT N5-N3 Kanji with comprehensive data
    const commonKanji: KanjiInfo[] = [
      {
        character: "朝",
        onyomi: ["チョウ"],
        kunyomi: ["あさ"],
        meanings: ["morning", "dynasty", "regime"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 12,
        radical: "月",
        examples: [
          { word: "朝", reading: "あさ", meaning: "morning" },
          { word: "朝食", reading: "ちょうしょく", meaning: "breakfast" },
        ],
      },
      {
        character: "雨",
        onyomi: ["ウ"],
        kunyomi: ["あめ", "あま"],
        meanings: ["rain"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 8,
        radical: "雨",
        examples: [
          { word: "雨", reading: "あめ", meaning: "rain" },
          { word: "大雨", reading: "おおあめ", meaning: "heavy rain" },
        ],
      },
      {
        character: "秋",
        onyomi: ["シュウ"],
        kunyomi: ["あき"],
        meanings: ["autumn", "fall"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 9,
        radical: "禾",
        examples: [
          { word: "秋", reading: "あき", meaning: "autumn" },
          { word: "秋分", reading: "しゅうぶん", meaning: "autumnal equinox" },
        ],
      },
      {
        character: "足",
        onyomi: ["ソク"],
        kunyomi: ["あし", "た"],
        meanings: ["foot", "leg", "sufficient"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 7,
        radical: "足",
        examples: [
          { word: "足", reading: "あし", meaning: "foot/leg" },
          { word: "不足", reading: "ふそく", meaning: "shortage" },
        ],
      },
      {
        character: "頭",
        onyomi: ["トウ", "ズ", "ト"],
        kunyomi: ["あたま", "かしら"],
        meanings: ["head", "counter for large animals"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 16,
        radical: "頁",
        examples: [
          { word: "頭", reading: "あたま", meaning: "head" },
          { word: "先頭", reading: "せんとう", meaning: "head/front" },
        ],
      },
      {
        character: "犬",
        onyomi: ["ケン"],
        kunyomi: ["いぬ"],
        meanings: ["dog"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 4,
        radical: "犬",
        examples: [
          { word: "犬", reading: "いぬ", meaning: "dog" },
          { word: "子犬", reading: "こいぬ", meaning: "puppy" },
        ],
      },
      {
        character: "家",
        onyomi: ["カ", "ケ"],
        kunyomi: ["いえ", "や"],
        meanings: ["house", "home", "family"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 10,
        radical: "宀",
        examples: [
          { word: "家", reading: "いえ", meaning: "house" },
          { word: "家族", reading: "かぞく", meaning: "family" },
        ],
      },
      {
        character: "石",
        onyomi: ["セキ", "シャク", "コク"],
        kunyomi: ["いし"],
        meanings: ["stone"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 5,
        radical: "石",
        examples: [
          { word: "石", reading: "いし", meaning: "stone" },
          { word: "石油", reading: "せきゆ", meaning: "oil/petroleum" },
        ],
      },
      {
        character: "色",
        onyomi: ["ショク", "シキ"],
        kunyomi: ["いろ"],
        meanings: ["color"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 6,
        radical: "色",
        examples: [
          { word: "色", reading: "いろ", meaning: "color" },
          { word: "色紙", reading: "しきし", meaning: "colored paper" },
        ],
      },
      {
        character: "海",
        onyomi: ["カイ"],
        kunyomi: ["うみ"],
        meanings: ["sea", "ocean"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 9,
        radical: "水",
        examples: [
          { word: "海", reading: "うみ", meaning: "sea" },
          { word: "海外", reading: "かいがい", meaning: "overseas" },
        ],
      },
      {
        character: "歌",
        onyomi: ["カ"],
        kunyomi: ["うた", "うたう"],
        meanings: ["song", "sing"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 14,
        radical: "欠",
        examples: [
          { word: "歌", reading: "うた", meaning: "song" },
          { word: "歌手", reading: "かしゅ", meaning: "singer" },
        ],
      },
      {
        character: "腕",
        onyomi: ["ワン"],
        kunyomi: ["うで"],
        meanings: ["arm", "ability", "talent"],
        grade: 8,
        jlptLevel: 3,
        strokeCount: 12,
        radical: "肉",
        examples: [
          { word: "腕", reading: "うで", meaning: "arm" },
          { word: "腕前", reading: "うでまえ", meaning: "skill/ability" },
        ],
      },
      {
        character: "牛",
        onyomi: ["ギュウ"],
        kunyomi: ["うし"],
        meanings: ["cow", "ox"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 4,
        radical: "牛",
        examples: [
          { word: "牛", reading: "うし", meaning: "cow" },
          { word: "牛乳", reading: "ぎゅうにゅう", meaning: "milk" },
        ],
      },
      {
        character: "馬",
        onyomi: ["バ"],
        kunyomi: ["うま", "ま"],
        meanings: ["horse"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 10,
        radical: "馬",
        examples: [
          { word: "馬", reading: "うま", meaning: "horse" },
          { word: "馬車", reading: "ばしゃ", meaning: "horse-drawn carriage" },
        ],
      },
      {
        character: "駅",
        onyomi: ["エキ"],
        kunyomi: [],
        meanings: ["station"],
        grade: 3,
        jlptLevel: 5,
        strokeCount: 14,
        radical: "馬",
        examples: [
          { word: "駅", reading: "えき", meaning: "station" },
          { word: "駅前", reading: "えきまえ", meaning: "in front of station" },
        ],
      },
      {
        character: "男",
        onyomi: ["ダン", "ナン"],
        kunyomi: ["おとこ"],
        meanings: ["male", "man"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 7,
        radical: "田",
        examples: [
          { word: "男", reading: "おとこ", meaning: "man" },
          { word: "男性", reading: "だんせい", meaning: "male" },
        ],
      },
      {
        character: "女",
        onyomi: ["ジョ", "ニョ"],
        kunyomi: ["おんな", "め"],
        meanings: ["female", "woman"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 3,
        radical: "女",
        examples: [
          { word: "女", reading: "おんな", meaning: "woman" },
          { word: "女性", reading: "じょせい", meaning: "female" },
        ],
      },
      {
        character: "顔",
        onyomi: ["ガン"],
        kunyomi: ["かお"],
        meanings: ["face"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 18,
        radical: "頁",
        examples: [
          { word: "顔", reading: "かお", meaning: "face" },
          { word: "笑顔", reading: "えがお", meaning: "smile/smiling face" },
        ],
      },
      {
        character: "風",
        onyomi: ["フウ", "フ"],
        kunyomi: ["かぜ", "かざ"],
        meanings: ["wind", "style", "manner"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 9,
        radical: "風",
        examples: [
          { word: "風", reading: "かぜ", meaning: "wind" },
          { word: "台風", reading: "たいふう", meaning: "typhoon" },
        ],
      },
      {
        character: "紙",
        onyomi: ["シ"],
        kunyomi: ["かみ"],
        meanings: ["paper"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 10,
        radical: "糸",
        examples: [
          { word: "紙", reading: "かみ", meaning: "paper" },
          { word: "紙幣", reading: "しへい", meaning: "paper money/bill" },
        ],
      },
      {
        character: "車",
        onyomi: ["シャ"],
        kunyomi: ["くるま"],
        meanings: ["car", "vehicle", "wheel"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 7,
        radical: "車",
        examples: [
          { word: "車", reading: "くるま", meaning: "car" },
          { word: "電車", reading: "でんしゃ", meaning: "train" },
        ],
      },
      {
        character: "薬",
        onyomi: ["ヤク"],
        kunyomi: ["くすり"],
        meanings: ["medicine", "drug"],
        grade: 3,
        jlptLevel: 5,
        strokeCount: 16,
        radical: "艸",
        examples: [
          { word: "薬", reading: "くすり", meaning: "medicine" },
          { word: "薬局", reading: "やっきょく", meaning: "pharmacy" },
        ],
      },
      {
        character: "熊",
        onyomi: ["ユウ"],
        kunyomi: ["くま"],
        meanings: ["bear"],
        grade: 8,
        jlptLevel: 2,
        strokeCount: 14,
        radical: "火",
        examples: [
          { word: "熊", reading: "くま", meaning: "bear" },
          { word: "白熊", reading: "しろくま", meaning: "polar bear" },
        ],
      },
      {
        character: "月",
        onyomi: ["ゲツ", "ガツ"],
        kunyomi: ["つき"],
        meanings: ["moon", "month"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 4,
        radical: "月",
        examples: [
          { word: "月", reading: "つき", meaning: "moon" },
          { word: "一月", reading: "いちがつ", meaning: "January" },
        ],
      },
      {
        character: "火",
        onyomi: ["カ"],
        kunyomi: ["ひ", "ほ"],
        meanings: ["fire"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 4,
        radical: "火",
        examples: [
          { word: "火", reading: "ひ", meaning: "fire" },
          { word: "火曜日", reading: "かようび", meaning: "Tuesday" },
        ],
      },
      {
        character: "水",
        onyomi: ["スイ"],
        kunyomi: ["みず"],
        meanings: ["water"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 4,
        radical: "水",
        examples: [
          { word: "水", reading: "みず", meaning: "water" },
          { word: "水曜日", reading: "すいようび", meaning: "Wednesday" },
        ],
      },
      {
        character: "山",
        onyomi: ["サン", "セン"],
        kunyomi: ["やま"],
        meanings: ["mountain"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 3,
        radical: "山",
        examples: [
          { word: "山", reading: "やま", meaning: "mountain" },
          { word: "富士山", reading: "ふじさん", meaning: "Mt. Fuji" },
        ],
      },
      {
        character: "雪",
        onyomi: ["セツ"],
        kunyomi: ["ゆき"],
        meanings: ["snow"],
        grade: 2,
        jlptLevel: 5,
        strokeCount: 11,
        radical: "雨",
        examples: [
          { word: "雪", reading: "ゆき", meaning: "snow" },
          { word: "雪山", reading: "ゆきやま", meaning: "snowy mountain" },
        ],
      },
      {
        character: "人",
        onyomi: ["ジン", "ニン"],
        kunyomi: ["ひと"],
        meanings: ["person", "people"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 2,
        radical: "人",
        examples: [
          { word: "人", reading: "ひと", meaning: "person" },
          { word: "日本人", reading: "にほんじん", meaning: "Japanese person" },
        ],
      },
      {
        character: "本",
        onyomi: ["ホン"],
        kunyomi: ["もと"],
        meanings: ["book", "origin", "main"],
        grade: 1,
        jlptLevel: 5,
        strokeCount: 5,
        radical: "木",
        examples: [
          { word: "本", reading: "ほん", meaning: "book" },
          { word: "日本", reading: "にほん", meaning: "Japan" },
        ],
      },
      {
        character: "猫",
        onyomi: ["ビョウ"],
        kunyomi: ["ねこ"],
        meanings: ["cat"],
        grade: 8,
        jlptLevel: 3,
        strokeCount: 11,
        radical: "犬",
        examples: [
          { word: "猫", reading: "ねこ", meaning: "cat" },
          { word: "子猫", reading: "こねこ", meaning: "kitten" },
        ],
      },
    ];

    // Index kanji data
    commonKanji.forEach(kanji => {
      this.kanjiData.set(kanji.character, kanji);
    });
  }

  /**
   * Get kanji information
   */
  getKanjiInfo(character: string): KanjiInfo | null {
    return this.kanjiData.get(character) || null;
  }

  /**
   * Decompose word into kanji and get information for each
   */
  getWordKanjiInfo(word: string): KanjiInfo[] {
    const kanjiInfo: KanjiInfo[] = [];

    for (const char of word) {
      const info = this.getKanjiInfo(char);
      if (info) {
        kanjiInfo.push(info);
      }
    }

    return kanjiInfo;
  }

  /**
   * Search kanji by reading
   */
  searchByReading(reading: string): KanjiInfo[] {
    const results: KanjiInfo[] = [];

    this.kanjiData.forEach(kanji => {
      if (
        kanji.onyomi.some(on => on.includes(reading.toUpperCase())) ||
        kanji.kunyomi.some(kun => kun.includes(reading))
      ) {
        results.push(kanji);
      }
    });

    return results;
  }

  /**
   * Get all kanji
   */
  getAllKanji(): KanjiInfo[] {
    return Array.from(this.kanjiData.values());
  }

  /**
   * Get kanji by JLPT level
   */
  getKanjiByJLPT(level: number): KanjiInfo[] {
    return this.getAllKanji().filter(k => k.jlptLevel === level);
  }

  /**
   * Get kanji by grade
   */
  getKanjiByGrade(grade: number): KanjiInfo[] {
    return this.getAllKanji().filter(k => k.grade === grade);
  }
}

export const kanjiDictionary = new KanjiDictionaryService();
