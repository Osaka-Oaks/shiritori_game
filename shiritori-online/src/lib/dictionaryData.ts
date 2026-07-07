import { toHiragana } from "./shiritori";

/** A learner-friendly dictionary entry. Bilingual so both JP and EN learners win. */
export interface DictEntry {
  kana: string; // hiragana/katakana headword
  romaji: string; // romaji reading
  kanji?: string; // kanji form, when it exists
  en: string; // English meaning(s)
  pos: string; // part of speech, e.g. "noun", "verb", "adjective"
  jlpt?: "N5" | "N4" | "N3" | "N2" | "N1"; // rough JLPT level
  cat: string; // category, for browsing
}

/**
 * A curated, offline dictionary that powers the in-app floating lookup.
 * Kept intentionally broad (common, kid-safe nouns/verbs/adjectives across
 * categories) so learners get instant results with no network. For the long
 * tail, the UI offers a "Search on Jisho" deep link.
 */
export const DICTIONARY: DictEntry[] = [
  // ── Animals ─────────────────────────────────────────────
  { kana: "いぬ", romaji: "inu", kanji: "犬", en: "dog", pos: "noun", jlpt: "N5", cat: "animals" },
  { kana: "ねこ", romaji: "neko", kanji: "猫", en: "cat", pos: "noun", jlpt: "N5", cat: "animals" },
  {
    kana: "とり",
    romaji: "tori",
    kanji: "鳥",
    en: "bird",
    pos: "noun",
    jlpt: "N5",
    cat: "animals",
  },
  {
    kana: "さかな",
    romaji: "sakana",
    kanji: "魚",
    en: "fish",
    pos: "noun",
    jlpt: "N5",
    cat: "animals",
  },
  {
    kana: "うま",
    romaji: "uma",
    kanji: "馬",
    en: "horse",
    pos: "noun",
    jlpt: "N4",
    cat: "animals",
  },
  { kana: "うし", romaji: "ushi", kanji: "牛", en: "cow", pos: "noun", jlpt: "N4", cat: "animals" },
  { kana: "ぶた", romaji: "buta", kanji: "豚", en: "pig", pos: "noun", jlpt: "N4", cat: "animals" },
  { kana: "うさぎ", romaji: "usagi", kanji: "兎", en: "rabbit", pos: "noun", cat: "animals" },
  { kana: "きつね", romaji: "kitsune", kanji: "狐", en: "fox", pos: "noun", cat: "animals" },
  { kana: "たぬき", romaji: "tanuki", en: "raccoon dog", pos: "noun", cat: "animals" },
  { kana: "ぞう", romaji: "zou", kanji: "象", en: "elephant", pos: "noun", cat: "animals" },
  { kana: "らくだ", romaji: "rakuda", en: "camel", pos: "noun", cat: "animals" },
  { kana: "りす", romaji: "risu", en: "squirrel", pos: "noun", cat: "animals" },
  { kana: "しか", romaji: "shika", kanji: "鹿", en: "deer", pos: "noun", cat: "animals" },
  { kana: "ねずみ", romaji: "nezumi", en: "mouse; rat", pos: "noun", cat: "animals" },
  { kana: "くま", romaji: "kuma", kanji: "熊", en: "bear", pos: "noun", cat: "animals" },
  { kana: "さる", romaji: "saru", kanji: "猿", en: "monkey", pos: "noun", cat: "animals" },
  { kana: "とら", romaji: "tora", kanji: "虎", en: "tiger", pos: "noun", cat: "animals" },
  { kana: "かめ", romaji: "kame", kanji: "亀", en: "turtle", pos: "noun", cat: "animals" },
  { kana: "へび", romaji: "hebi", kanji: "蛇", en: "snake", pos: "noun", cat: "animals" },

  // ── Food & drink ────────────────────────────────────────
  { kana: "すし", romaji: "sushi", kanji: "寿司", en: "sushi", pos: "noun", cat: "food" },
  {
    kana: "ごはん",
    romaji: "gohan",
    kanji: "ご飯",
    en: "rice; meal",
    pos: "noun",
    jlpt: "N5",
    cat: "food",
  },
  { kana: "パン", romaji: "pan", en: "bread", pos: "noun", jlpt: "N5", cat: "food" },
  {
    kana: "たまご",
    romaji: "tamago",
    kanji: "卵",
    en: "egg",
    pos: "noun",
    jlpt: "N5",
    cat: "food",
  },
  { kana: "にく", romaji: "niku", kanji: "肉", en: "meat", pos: "noun", jlpt: "N5", cat: "food" },
  {
    kana: "やさい",
    romaji: "yasai",
    kanji: "野菜",
    en: "vegetable",
    pos: "noun",
    jlpt: "N5",
    cat: "food",
  },
  {
    kana: "くだもの",
    romaji: "kudamono",
    kanji: "果物",
    en: "fruit",
    pos: "noun",
    jlpt: "N5",
    cat: "food",
  },
  {
    kana: "りんご",
    romaji: "ringo",
    kanji: "林檎",
    en: "apple",
    pos: "noun",
    jlpt: "N5",
    cat: "food",
  },
  { kana: "みかん", romaji: "mikan", en: "mandarin orange", pos: "noun", cat: "food" },
  { kana: "もも", romaji: "momo", kanji: "桃", en: "peach", pos: "noun", cat: "food" },
  { kana: "すいか", romaji: "suika", en: "watermelon", pos: "noun", cat: "food" },
  { kana: "なす", romaji: "nasu", kanji: "茄子", en: "eggplant", pos: "noun", cat: "food" },
  { kana: "ねぎ", romaji: "negi", en: "green onion", pos: "noun", cat: "food" },
  { kana: "みず", romaji: "mizu", kanji: "水", en: "water", pos: "noun", jlpt: "N5", cat: "food" },
  {
    kana: "おちゃ",
    romaji: "ocha",
    kanji: "お茶",
    en: "tea",
    pos: "noun",
    jlpt: "N5",
    cat: "food",
  },
  { kana: "コーヒー", romaji: "koohii", en: "coffee", pos: "noun", jlpt: "N5", cat: "food" },
  {
    kana: "ぎゅうにゅう",
    romaji: "gyuunyuu",
    kanji: "牛乳",
    en: "milk",
    pos: "noun",
    jlpt: "N4",
    cat: "food",
  },
  { kana: "ラーメン", romaji: "raamen", en: "ramen", pos: "noun", cat: "food" },
  { kana: "うどん", romaji: "udon", en: "udon noodles", pos: "noun", cat: "food" },
  { kana: "カレー", romaji: "karee", en: "curry", pos: "noun", cat: "food" },
  { kana: "てんぷら", romaji: "tenpura", kanji: "天ぷら", en: "tempura", pos: "noun", cat: "food" },
  {
    kana: "たこやき",
    romaji: "takoyaki",
    en: "takoyaki (octopus balls)",
    pos: "noun",
    cat: "food",
  },
  { kana: "ケーキ", romaji: "keeki", en: "cake", pos: "noun", cat: "food" },
  { kana: "あめ", romaji: "ame", en: "candy; rain", pos: "noun", cat: "food" },

  // ── Nature ──────────────────────────────────────────────
  {
    kana: "やま",
    romaji: "yama",
    kanji: "山",
    en: "mountain",
    pos: "noun",
    jlpt: "N5",
    cat: "nature",
  },
  {
    kana: "かわ",
    romaji: "kawa",
    kanji: "川",
    en: "river",
    pos: "noun",
    jlpt: "N5",
    cat: "nature",
  },
  {
    kana: "うみ",
    romaji: "umi",
    kanji: "海",
    en: "sea; ocean",
    pos: "noun",
    jlpt: "N5",
    cat: "nature",
  },
  { kana: "そら", romaji: "sora", kanji: "空", en: "sky", pos: "noun", jlpt: "N5", cat: "nature" },
  {
    kana: "つき",
    romaji: "tsuki",
    kanji: "月",
    en: "moon",
    pos: "noun",
    jlpt: "N5",
    cat: "nature",
  },
  { kana: "ほし", romaji: "hoshi", kanji: "星", en: "star", pos: "noun", cat: "nature" },
  { kana: "ひ", romaji: "hi", kanji: "火", en: "fire", pos: "noun", jlpt: "N5", cat: "nature" },
  { kana: "き", romaji: "ki", kanji: "木", en: "tree", pos: "noun", jlpt: "N5", cat: "nature" },
  {
    kana: "はな",
    romaji: "hana",
    kanji: "花",
    en: "flower",
    pos: "noun",
    jlpt: "N5",
    cat: "nature",
  },
  {
    kana: "さくら",
    romaji: "sakura",
    kanji: "桜",
    en: "cherry blossom",
    pos: "noun",
    cat: "nature",
  },
  { kana: "あめ", romaji: "ame", kanji: "雨", en: "rain", pos: "noun", jlpt: "N5", cat: "nature" },
  { kana: "ゆき", romaji: "yuki", kanji: "雪", en: "snow", pos: "noun", jlpt: "N5", cat: "nature" },
  { kana: "かぜ", romaji: "kaze", kanji: "風", en: "wind", pos: "noun", jlpt: "N4", cat: "nature" },
  { kana: "いし", romaji: "ishi", kanji: "石", en: "stone", pos: "noun", cat: "nature" },
  { kana: "ぬま", romaji: "numa", kanji: "沼", en: "swamp; marsh", pos: "noun", cat: "nature" },

  // ── Seasons & time ──────────────────────────────────────
  { kana: "はる", romaji: "haru", kanji: "春", en: "spring", pos: "noun", jlpt: "N5", cat: "time" },
  {
    kana: "なつ",
    romaji: "natsu",
    kanji: "夏",
    en: "summer",
    pos: "noun",
    jlpt: "N5",
    cat: "time",
  },
  {
    kana: "あき",
    romaji: "aki",
    kanji: "秋",
    en: "autumn; fall",
    pos: "noun",
    jlpt: "N5",
    cat: "time",
  },
  { kana: "ふゆ", romaji: "fuyu", kanji: "冬", en: "winter", pos: "noun", jlpt: "N5", cat: "time" },
  { kana: "あさ", romaji: "asa", kanji: "朝", en: "morning", pos: "noun", jlpt: "N5", cat: "time" },
  { kana: "よる", romaji: "yoru", kanji: "夜", en: "night", pos: "noun", jlpt: "N5", cat: "time" },
  {
    kana: "きょう",
    romaji: "kyou",
    kanji: "今日",
    en: "today",
    pos: "noun",
    jlpt: "N5",
    cat: "time",
  },
  {
    kana: "あした",
    romaji: "ashita",
    kanji: "明日",
    en: "tomorrow",
    pos: "noun",
    jlpt: "N5",
    cat: "time",
  },

  // ── Home & objects ──────────────────────────────────────
  {
    kana: "いえ",
    romaji: "ie",
    kanji: "家",
    en: "house; home",
    pos: "noun",
    jlpt: "N5",
    cat: "home",
  },
  { kana: "ドア", romaji: "doa", en: "door", pos: "noun", jlpt: "N5", cat: "home" },
  { kana: "まど", romaji: "mado", kanji: "窓", en: "window", pos: "noun", jlpt: "N5", cat: "home" },
  { kana: "いす", romaji: "isu", kanji: "椅子", en: "chair", pos: "noun", jlpt: "N5", cat: "home" },
  {
    kana: "つくえ",
    romaji: "tsukue",
    kanji: "机",
    en: "desk",
    pos: "noun",
    jlpt: "N5",
    cat: "home",
  },
  {
    kana: "とけい",
    romaji: "tokei",
    kanji: "時計",
    en: "clock; watch",
    pos: "noun",
    jlpt: "N5",
    cat: "home",
  },
  {
    kana: "かさ",
    romaji: "kasa",
    kanji: "傘",
    en: "umbrella",
    pos: "noun",
    jlpt: "N5",
    cat: "home",
  },
  { kana: "めがね", romaji: "megane", kanji: "眼鏡", en: "glasses", pos: "noun", cat: "home" },
  {
    kana: "えんぴつ",
    romaji: "enpitsu",
    kanji: "鉛筆",
    en: "pencil",
    pos: "noun",
    jlpt: "N5",
    cat: "school",
  },
  { kana: "ほん", romaji: "hon", kanji: "本", en: "book", pos: "noun", jlpt: "N5", cat: "school" },
  { kana: "かばん", romaji: "kaban", en: "bag", pos: "noun", jlpt: "N5", cat: "home" },

  // ── People & body ───────────────────────────────────────
  {
    kana: "ひと",
    romaji: "hito",
    kanji: "人",
    en: "person",
    pos: "noun",
    jlpt: "N5",
    cat: "people",
  },
  {
    kana: "こども",
    romaji: "kodomo",
    kanji: "子供",
    en: "child",
    pos: "noun",
    jlpt: "N5",
    cat: "people",
  },
  {
    kana: "ともだち",
    romaji: "tomodachi",
    kanji: "友達",
    en: "friend",
    pos: "noun",
    jlpt: "N5",
    cat: "people",
  },
  {
    kana: "せんせい",
    romaji: "sensei",
    kanji: "先生",
    en: "teacher",
    pos: "noun",
    jlpt: "N5",
    cat: "people",
  },
  { kana: "て", romaji: "te", kanji: "手", en: "hand", pos: "noun", jlpt: "N5", cat: "body" },
  {
    kana: "あし",
    romaji: "ashi",
    kanji: "足",
    en: "foot; leg",
    pos: "noun",
    jlpt: "N5",
    cat: "body",
  },
  { kana: "め", romaji: "me", kanji: "目", en: "eye", pos: "noun", jlpt: "N5", cat: "body" },
  { kana: "みみ", romaji: "mimi", kanji: "耳", en: "ear", pos: "noun", jlpt: "N5", cat: "body" },

  // ── Places ──────────────────────────────────────────────
  {
    kana: "がっこう",
    romaji: "gakkou",
    kanji: "学校",
    en: "school",
    pos: "noun",
    jlpt: "N5",
    cat: "places",
  },
  {
    kana: "としょかん",
    romaji: "toshokan",
    kanji: "図書館",
    en: "library",
    pos: "noun",
    jlpt: "N5",
    cat: "places",
  },
  {
    kana: "びょういん",
    romaji: "byouin",
    kanji: "病院",
    en: "hospital",
    pos: "noun",
    jlpt: "N5",
    cat: "places",
  },
  {
    kana: "えき",
    romaji: "eki",
    kanji: "駅",
    en: "station",
    pos: "noun",
    jlpt: "N5",
    cat: "places",
  },
  {
    kana: "みせ",
    romaji: "mise",
    kanji: "店",
    en: "shop; store",
    pos: "noun",
    jlpt: "N5",
    cat: "places",
  },
  {
    kana: "こうえん",
    romaji: "kouen",
    kanji: "公園",
    en: "park",
    pos: "noun",
    jlpt: "N5",
    cat: "places",
  },

  // ── Transport ───────────────────────────────────────────
  {
    kana: "くるま",
    romaji: "kuruma",
    kanji: "車",
    en: "car",
    pos: "noun",
    jlpt: "N5",
    cat: "transport",
  },
  {
    kana: "でんしゃ",
    romaji: "densha",
    kanji: "電車",
    en: "train",
    pos: "noun",
    jlpt: "N5",
    cat: "transport",
  },
  {
    kana: "ひこうき",
    romaji: "hikouki",
    kanji: "飛行機",
    en: "airplane",
    pos: "noun",
    jlpt: "N5",
    cat: "transport",
  },
  {
    kana: "じてんしゃ",
    romaji: "jitensha",
    kanji: "自転車",
    en: "bicycle",
    pos: "noun",
    jlpt: "N5",
    cat: "transport",
  },
  { kana: "バス", romaji: "basu", en: "bus", pos: "noun", jlpt: "N5", cat: "transport" },
  {
    kana: "ふね",
    romaji: "fune",
    kanji: "船",
    en: "boat; ship",
    pos: "noun",
    jlpt: "N4",
    cat: "transport",
  },

  // ── Hobbies ─────────────────────────────────────────────
  {
    kana: "えいが",
    romaji: "eiga",
    kanji: "映画",
    en: "movie",
    pos: "noun",
    jlpt: "N5",
    cat: "hobbies",
  },
  {
    kana: "おんがく",
    romaji: "ongaku",
    kanji: "音楽",
    en: "music",
    pos: "noun",
    jlpt: "N5",
    cat: "hobbies",
  },
  { kana: "サッカー", romaji: "sakkaa", en: "soccer", pos: "noun", cat: "hobbies" },
  { kana: "テニス", romaji: "tenisu", en: "tennis", pos: "noun", cat: "hobbies" },
  {
    kana: "やきゅう",
    romaji: "yakyuu",
    kanji: "野球",
    en: "baseball",
    pos: "noun",
    cat: "hobbies",
  },
  { kana: "スキー", romaji: "sukii", en: "skiing", pos: "noun", cat: "hobbies" },
  { kana: "うた", romaji: "uta", kanji: "歌", en: "song", pos: "noun", jlpt: "N5", cat: "hobbies" },

  // ── Colors & adjectives ─────────────────────────────────
  {
    kana: "あかい",
    romaji: "akai",
    kanji: "赤い",
    en: "red",
    pos: "adjective",
    jlpt: "N5",
    cat: "adjectives",
  },
  {
    kana: "あおい",
    romaji: "aoi",
    kanji: "青い",
    en: "blue",
    pos: "adjective",
    jlpt: "N5",
    cat: "adjectives",
  },
  {
    kana: "しろい",
    romaji: "shiroi",
    kanji: "白い",
    en: "white",
    pos: "adjective",
    jlpt: "N5",
    cat: "adjectives",
  },
  {
    kana: "おおきい",
    romaji: "ookii",
    kanji: "大きい",
    en: "big",
    pos: "adjective",
    jlpt: "N5",
    cat: "adjectives",
  },
  {
    kana: "ちいさい",
    romaji: "chiisai",
    kanji: "小さい",
    en: "small",
    pos: "adjective",
    jlpt: "N5",
    cat: "adjectives",
  },
  {
    kana: "たかい",
    romaji: "takai",
    kanji: "高い",
    en: "tall; expensive",
    pos: "adjective",
    jlpt: "N5",
    cat: "adjectives",
  },
  {
    kana: "はやい",
    romaji: "hayai",
    kanji: "早い",
    en: "fast; early",
    pos: "adjective",
    jlpt: "N5",
    cat: "adjectives",
  },
  { kana: "かわいい", romaji: "kawaii", en: "cute", pos: "adjective", cat: "adjectives" },

  // ── Verbs ───────────────────────────────────────────────
  {
    kana: "たべる",
    romaji: "taberu",
    kanji: "食べる",
    en: "to eat",
    pos: "verb",
    jlpt: "N5",
    cat: "verbs",
  },
  {
    kana: "のむ",
    romaji: "nomu",
    kanji: "飲む",
    en: "to drink",
    pos: "verb",
    jlpt: "N5",
    cat: "verbs",
  },
  {
    kana: "みる",
    romaji: "miru",
    kanji: "見る",
    en: "to see; to watch",
    pos: "verb",
    jlpt: "N5",
    cat: "verbs",
  },
  {
    kana: "いく",
    romaji: "iku",
    kanji: "行く",
    en: "to go",
    pos: "verb",
    jlpt: "N5",
    cat: "verbs",
  },
  {
    kana: "くる",
    romaji: "kuru",
    kanji: "来る",
    en: "to come",
    pos: "verb",
    jlpt: "N5",
    cat: "verbs",
  },
  {
    kana: "はなす",
    romaji: "hanasu",
    kanji: "話す",
    en: "to speak",
    pos: "verb",
    jlpt: "N5",
    cat: "verbs",
  },
  {
    kana: "よむ",
    romaji: "yomu",
    kanji: "読む",
    en: "to read",
    pos: "verb",
    jlpt: "N5",
    cat: "verbs",
  },
  {
    kana: "あそぶ",
    romaji: "asobu",
    kanji: "遊ぶ",
    en: "to play",
    pos: "verb",
    jlpt: "N5",
    cat: "verbs",
  },

  // ── Pop culture (katakana) ──────────────────────────────
  { kana: "ピカチュウ", romaji: "pikachuu", en: "Pikachu (Pokémon)", pos: "name", cat: "pop" },
  { kana: "フシギダネ", romaji: "fushigidane", en: "Bulbasaur (Pokémon)", pos: "name", cat: "pop" },
  { kana: "ヒトカゲ", romaji: "hitokage", en: "Charmander (Pokémon)", pos: "name", cat: "pop" },
  { kana: "ゼニガメ", romaji: "zenigame", en: "Squirtle (Pokémon)", pos: "name", cat: "pop" },
  { kana: "イーブイ", romaji: "iibui", en: "Eevee (Pokémon)", pos: "name", cat: "pop" },
  { kana: "リザードン", romaji: "rizaadon", en: "Charizard (Pokémon)", pos: "name", cat: "pop" },
  { kana: "ミュウツー", romaji: "myuutsuu", en: "Mewtwo (Pokémon)", pos: "name", cat: "pop" },
  {
    kana: "レオナルド",
    romaji: "reonarudo",
    en: "Leonardo (Ninja Turtle)",
    pos: "name",
    cat: "pop",
  },
  { kana: "ラファエル", romaji: "rafaeru", en: "Raphael (Ninja Turtle)", pos: "name", cat: "pop" },
  {
    kana: "ミケランジェロ",
    romaji: "mikeranjero",
    en: "Michelangelo (Ninja Turtle)",
    pos: "name",
    cat: "pop",
  },
  { kana: "ドナテロ", romaji: "donatero", en: "Donatello (Ninja Turtle)", pos: "name", cat: "pop" },
];

export interface DictSearchResult extends DictEntry {
  score: number;
}

const isLatin = (s: string) => /^[a-zA-Z\s'-]+$/.test(s);

/**
 * Search the offline dictionary by kana, romaji, kanji, or English meaning.
 * Ranks exact matches first, then prefix matches, then substring matches, so
 * the most relevant entry is always at the top. Returns up to `limit` results.
 */
export function searchDictionary(query: string, limit = 20): DictSearchResult[] {
  const raw = query.trim();
  if (!raw) return [];

  const lower = raw.toLowerCase();
  const kanaQuery = toHiragana(raw);
  const latin = isLatin(raw);

  const results: DictSearchResult[] = [];

  for (const entry of DICTIONARY) {
    const kana = toHiragana(entry.kana);
    const romaji = entry.romaji.toLowerCase();
    const kanji = entry.kanji ?? "";
    const en = entry.en.toLowerCase();

    let score = 0;

    if (latin) {
      // English / romaji search
      const enWords = en.split(/[;,()]\s*|\s+/).filter(Boolean);
      if (romaji === lower || enWords.includes(lower)) score = 100;
      else if (romaji.startsWith(lower) || enWords.some(w => w.startsWith(lower))) score = 70;
      else if (en.includes(lower) || romaji.includes(lower)) score = 40;
    } else {
      // Japanese search (kana or kanji)
      if (kana === kanaQuery || kanji === raw) score = 100;
      else if (kana.startsWith(kanaQuery) || kanji.startsWith(raw)) score = 70;
      else if (kana.includes(kanaQuery) || (kanji && kanji.includes(raw))) score = 40;
    }

    if (score > 0) results.push({ ...entry, score });
  }

  return results
    .sort((a, b) => b.score - a.score || a.romaji.localeCompare(b.romaji))
    .slice(0, limit);
}

/** A Jisho.org deep link for the long tail — opens the full dictionary in a new tab. */
export function jishoUrl(query: string): string {
  return `https://jisho.org/search/${encodeURIComponent(query.trim())}`;
}
