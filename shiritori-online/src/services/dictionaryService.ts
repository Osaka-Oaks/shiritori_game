/**
 * Dictionary Service
 * Provides search functionality for both English and Japanese dictionaries
 */

export interface DictionaryEntry {
  word: string;
  translation?: string;
  romaji?: string;
  definition?: string;
  type?: "noun" | "verb" | "adjective" | "adverb";
  difficulty?: "easy" | "medium" | "hard";
  frequency?: number;
  examples?: string[];
}

// English Dictionary (expandable)
const englishDictionary: DictionaryEntry[] = [
  {
    word: "apple",
    definition: "A round fruit with red, yellow, or green skin and white flesh",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "elephant",
    definition: "A very large animal with a trunk, large ears, and tusks",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "tiger",
    definition: "A large wild cat with orange fur and black stripes",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "rabbit",
    definition: "A small animal with long ears and soft fur",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "turtle",
    definition: "A reptile with a hard shell on its back",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "egg",
    definition: "An oval object laid by birds, containing a baby bird",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "grape",
    definition: "A small round fruit that grows in bunches",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "elephant",
    definition: "A very large gray mammal with a trunk",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "table",
    definition: "A piece of furniture with a flat top and legs",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "dog",
    definition: "A common four-legged animal kept as a pet",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "cat",
    definition: "A small furry animal often kept as a pet",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "bird",
    definition: "An animal with feathers and wings that can usually fly",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "fish",
    definition: "An animal that lives in water and breathes through gills",
    type: "noun",
    difficulty: "easy",
  },
  { word: "house", definition: "A building where people live", type: "noun", difficulty: "easy" },
  {
    word: "book",
    definition: "A set of printed pages bound together",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "tree",
    definition: "A tall plant with a wooden trunk and branches",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "sun",
    definition: "The star at the center of our solar system",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "moon",
    definition: "The natural satellite that orbits Earth",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "star",
    definition: "A luminous celestial body visible in the night sky",
    type: "noun",
    difficulty: "easy",
  },
  {
    word: "water",
    definition: "A clear liquid essential for life",
    type: "noun",
    difficulty: "easy",
  },
];

// Japanese Dictionary (expandable)
const japaneseDictionary: DictionaryEntry[] = [
  {
    word: "いぬ",
    romaji: "inu",
    translation: "dog",
    type: "noun",
    difficulty: "easy",
    examples: ["犬を飼っています"],
  },
  {
    word: "ねこ",
    romaji: "neko",
    translation: "cat",
    type: "noun",
    difficulty: "easy",
    examples: ["猫が好きです"],
  },
  {
    word: "さくら",
    romaji: "sakura",
    translation: "cherry blossom",
    type: "noun",
    difficulty: "easy",
    examples: ["桜が咲いています"],
  },
  { word: "ゴリラ", romaji: "gorira", translation: "gorilla", type: "noun", difficulty: "easy" },
  {
    word: "りんご",
    romaji: "ringo",
    translation: "apple",
    type: "noun",
    difficulty: "easy",
    examples: ["りんごを食べる"],
  },
  { word: "ぬま", romaji: "numa", translation: "swamp", type: "noun", difficulty: "medium" },
  {
    word: "まち",
    romaji: "machi",
    translation: "town",
    type: "noun",
    difficulty: "easy",
    examples: ["町を歩く"],
  },
  { word: "ちず", romaji: "chizu", translation: "map", type: "noun", difficulty: "easy" },
  { word: "ずし", romaji: "zushi", translation: "sushi", type: "noun", difficulty: "easy" },
  { word: "しか", romaji: "shika", translation: "deer", type: "noun", difficulty: "easy" },
  { word: "かめ", romaji: "kame", translation: "turtle", type: "noun", difficulty: "easy" },
  { word: "めがね", romaji: "megane", translation: "glasses", type: "noun", difficulty: "easy" },
  { word: "ネコ", romaji: "neko", translation: "cat (katakana)", type: "noun", difficulty: "easy" },
  { word: "カレー", romaji: "karee", translation: "curry", type: "noun", difficulty: "easy" },
  { word: "コーヒー", romaji: "koohii", translation: "coffee", type: "noun", difficulty: "easy" },
  { word: "サッカー", romaji: "sakkaa", translation: "soccer", type: "noun", difficulty: "easy" },
  {
    word: "にわとり",
    romaji: "niwatori",
    translation: "chicken",
    type: "noun",
    difficulty: "medium",
  },
  { word: "きしゃ", romaji: "kisha", translation: "train", type: "noun", difficulty: "medium" },
  { word: "やま", romaji: "yama", translation: "mountain", type: "noun", difficulty: "easy" },
  { word: "うみ", romaji: "umi", translation: "sea", type: "noun", difficulty: "easy" },
  { word: "そら", romaji: "sora", translation: "sky", type: "noun", difficulty: "easy" },
  { word: "かわ", romaji: "kawa", translation: "river", type: "noun", difficulty: "easy" },
  { word: "はな", romaji: "hana", translation: "flower", type: "noun", difficulty: "easy" },
  { word: "き", romaji: "ki", translation: "tree", type: "noun", difficulty: "easy" },
];

/**
 * Search English dictionary
 */
export function searchEnglishDictionary(query: string, limit: number = 10): DictionaryEntry[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const results = englishDictionary.filter(
    entry =>
      entry.word.toLowerCase().includes(lowerQuery) ||
      entry.definition?.toLowerCase().includes(lowerQuery)
  );

  // Sort by relevance (exact match first, then starts with, then contains)
  results.sort((a, b) => {
    const aWord = a.word.toLowerCase();
    const bWord = b.word.toLowerCase();

    if (aWord === lowerQuery) return -1;
    if (bWord === lowerQuery) return 1;

    if (aWord.startsWith(lowerQuery) && !bWord.startsWith(lowerQuery)) return -1;
    if (bWord.startsWith(lowerQuery) && !aWord.startsWith(lowerQuery)) return 1;

    return aWord.localeCompare(bWord);
  });

  return results.slice(0, limit);
}

/**
 * Search Japanese dictionary
 * Searches by: kana, romaji, or English translation
 */
export function searchJapaneseDictionary(query: string, limit: number = 10): DictionaryEntry[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const results = japaneseDictionary.filter(
    entry =>
      entry.word.includes(query) || // Kana search
      entry.romaji?.toLowerCase().includes(lowerQuery) || // Romaji search
      entry.translation?.toLowerCase().includes(lowerQuery) // English translation search
  );

  // Sort by relevance
  results.sort((a, b) => {
    // Exact match priority
    if (a.word === query) return -1;
    if (b.word === query) return 1;

    if (a.romaji?.toLowerCase() === lowerQuery) return -1;
    if (b.romaji?.toLowerCase() === lowerQuery) return 1;

    // Starts with priority
    if (a.word.startsWith(query) && !b.word.startsWith(query)) return -1;
    if (b.word.startsWith(query) && !a.word.startsWith(query)) return 1;

    if (
      a.romaji?.toLowerCase().startsWith(lowerQuery) &&
      !b.romaji?.toLowerCase().startsWith(lowerQuery)
    )
      return -1;
    if (
      b.romaji?.toLowerCase().startsWith(lowerQuery) &&
      !a.romaji?.toLowerCase().startsWith(lowerQuery)
    )
      return 1;

    return a.word.localeCompare(b.word);
  });

  return results.slice(0, limit);
}

/**
 * Search both dictionaries
 */
export function searchBothDictionaries(query: string, limit: number = 10): DictionaryEntry[] {
  const englishResults = searchEnglishDictionary(query, Math.ceil(limit / 2));
  const japaneseResults = searchJapaneseDictionary(query, Math.ceil(limit / 2));

  return [...englishResults, ...japaneseResults].slice(0, limit);
}

/**
 * Get word by exact match
 */
export function getWord(
  word: string,
  language: "english" | "japanese"
): DictionaryEntry | undefined {
  const dictionary = language === "english" ? englishDictionary : japaneseDictionary;
  return dictionary.find(entry => entry.word.toLowerCase() === word.toLowerCase());
}

/**
 * Get random words for suggestions
 */
export function getRandomWords(
  language: "english" | "japanese",
  count: number = 5
): DictionaryEntry[] {
  const dictionary = language === "english" ? englishDictionary : japaneseDictionary;
  const shuffled = [...dictionary].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get words starting with a specific character
 */
export function getWordsStartingWith(
  char: string,
  language: "english" | "japanese"
): DictionaryEntry[] {
  const dictionary = language === "english" ? englishDictionary : japaneseDictionary;
  const lowerChar = char.toLowerCase();

  return dictionary.filter(
    entry =>
      entry.word.toLowerCase().startsWith(lowerChar) ||
      (language === "japanese" && entry.romaji?.toLowerCase().startsWith(lowerChar))
  );
}

/**
 * Add custom word (for future extensibility)
 */
export function addCustomWord(entry: DictionaryEntry, language: "english" | "japanese"): void {
  const dictionary = language === "english" ? englishDictionary : japaneseDictionary;

  // Check if word already exists
  const exists = dictionary.some(e => e.word.toLowerCase() === entry.word.toLowerCase());
  if (!exists) {
    dictionary.push(entry);
  }
}

/**
 * Load external dictionary (for future API integration)
 */
export async function loadExternalDictionary(url: string): Promise<DictionaryEntry[]> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to load external dictionary:", error);
    return [];
  }
}

/**
 * Get dictionary stats
 */
export function getDictionaryStats(): {
  english: number;
  japanese: number;
  total: number;
} {
  return {
    english: englishDictionary.length,
    japanese: japaneseDictionary.length,
    total: englishDictionary.length + japaneseDictionary.length,
  };
}

export default {
  searchEnglishDictionary,
  searchJapaneseDictionary,
  searchBothDictionaries,
  getWord,
  getRandomWords,
  getWordsStartingWith,
  addCustomWord,
  loadExternalDictionary,
  getDictionaryStats,
};
