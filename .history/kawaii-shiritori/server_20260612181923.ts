import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy-loaded Gemini Client with correct header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback high-quality static dictionary for offline support or key missing states
const FALLBACK_WORDS = [
  {
    word: "Ringo",
    translation: "Apple",
    kanji: "林檎",
    hiragana: "りんご",
    katakana: "リンゴ",
    romaji: "ringo",
    startSound: "り",
    endSound: "ご",
    endsInN: false,
  },
  {
    word: "Gorira",
    translation: "Gorilla",
    kanji: "ゴリラ",
    hiragana: "ごりら",
    katakana: "ゴリラ",
    romaji: "gorira",
    startSound: "ご",
    endSound: "ら",
    endsInN: false,
  },
  {
    word: "Rappa",
    translation: "Trumpet",
    kanji: "喇叭",
    hiragana: "らっぱ",
    katakana: "ラッパ",
    romaji: "rappa",
    startSound: "ら",
    endSound: "ぱ",
    endsInN: false,
  },
  {
    word: "Inu",
    translation: "Dog",
    kanji: "犬",
    hiragana: "いぬ",
    katakana: "イヌ",
    romaji: "inu",
    startSound: "い",
    endSound: "ぬ",
    endsInN: false,
  },
  {
    word: "Neko",
    translation: "Cat",
    kanji: "猫",
    hiragana: "ねこ",
    katakana: "ネコ",
    romaji: "neko",
    startSound: "ね",
    endSound: "こ",
    endsInN: false,
  },
  {
    word: "Sakura",
    translation: "Cherry Blossom",
    kanji: "桜",
    hiragana: "さくら",
    katakana: "サクラ",
    romaji: "sakura",
    startSound: "さ",
    endSound: "ら",
    endsInN: false,
  },
  {
    word: "Raion",
    translation: "Lion",
    kanji: "ライオン",
    hiragana: "らいおん",
    katakana: "ライオン",
    romaji: "raion",
    startSound: "ら",
    endSound: "ん",
    endsInN: true,
  }, // fatal
  {
    word: "Mikan",
    translation: "Mandarin Orange",
    kanji: "蜜柑",
    hiragana: "みかん",
    katakana: "ミカン",
    romaji: "mikan",
    startSound: "み",
    endSound: "ん",
    endsInN: true,
  }, // fatal
  {
    word: "Kuma",
    translation: "Bear",
    kanji: "熊",
    hiragana: "くま",
    katakana: "クマ",
    romaji: "kuma",
    startSound: "く",
    endSound: "ま",
    endsInN: false,
  },
  {
    word: "Matsuri",
    translation: "Festival",
    kanji: "祭り",
    hiragana: "まつり",
    katakana: "マツリ",
    romaji: "matsuri",
    startSound: "ま",
    endSound: "り",
    endsInN: false,
  },
  {
    word: "Risu",
    translation: "Squirrel",
    kanji: "栗鼠",
    hiragana: "りす",
    katakana: "リス",
    romaji: "risu",
    startSound: "り",
    endSound: "す",
    endsInN: false,
  },
  {
    word: "Suika",
    translation: "Watermelon",
    kanji: "西瓜",
    hiragana: "すいか",
    katakana: "スイカ",
    romaji: "suika",
    startSound: "す",
    endSound: "か",
    endsInN: false,
  },
  {
    word: "Kasa",
    translation: "Umbrella",
    kanji: "傘",
    hiragana: "かさ",
    katakana: "カサ",
    romaji: "kasa",
    startSound: "か",
    endSound: "さ",
    endsInN: false,
  },
  {
    word: "Saru",
    translation: "Monkey",
    kanji: "猿",
    hiragana: "さる",
    katakana: "サル",
    romaji: "saru",
    startSound: "さ",
    endSound: "る",
    endsInN: false,
  },
  {
    word: "Ruka",
    translation: "Orca / Dolphin",
    kanji: "イルカ",
    hiragana: "いるか",
    katakana: "イルカ",
    romaji: "iruka",
    startSound: "い",
    endSound: "か",
    endsInN: false,
  },
  {
    word: "Kamisama",
    translation: "God / Deity",
    kanji: "神様",
    hiragana: "かみさま",
    katakana: "カミサマ",
    romaji: "kamisama",
    startSound: "か",
    endSound: "ま",
    endsInN: false,
  },
  {
    word: "Umi",
    translation: "Sea / Ocean",
    kanji: "海",
    hiragana: "うみ",
    katakana: "ウミ",
    romaji: "umi",
    startSound: "う",
    endSound: "み",
    endsInN: false,
  },
  {
    word: "Yama",
    translation: "Mountain",
    kanji: "山",
    hiragana: "やま",
    katakana: "ヤマ",
    romaji: "yama",
    startSound: "や",
    endSound: "ま",
    endsInN: false,
  },
  {
    word: "Machi",
    translation: "Town / City",
    kanji: "町",
    hiragana: "まち",
    katakana: "マチ",
    romaji: "machi",
    startSound: "ま",
    endSound: "ち",
    endsInN: false,
  },
  {
    word: "Chizu",
    translation: "Map",
    kanji: "地図",
    hiragana: "ちず",
    katakana: "チズ",
    romaji: "chizu",
    startSound: "ち",
    endSound: "ず",
    endsInN: false,
  },
  {
    word: "Zubon",
    translation: "Trousers",
    kanji: "ズボン",
    hiragana: "ずぼん",
    katakana: "ズボン",
    romaji: "zubon",
    startSound: "ず",
    endSound: "ん",
    endsInN: true,
  },
];

// Helper to check if a word is in Hiragana, or simple romaji conversion
function kanaToLastChar(hiragana: string): string {
  if (!hiragana) return "";
  const cleaned = hiragana.trim();
  // Handle small kana (e.g. ゃ, ゅ, ょ, ぃ) or long vowel marks (ー)
  let last = cleaned[cleaned.length - 1];
  if (last === "ー" && cleaned.length > 1) {
    last = cleaned[cleaned.length - 2]; // use the sound before the dash
  }
  // Convert small kana to big equivalent for matching
  const smallToBig: { [key: string]: string } = {
    ぁ: "あ",
    ぃ: "い",
    ぅ: "う",
    ぇ: "え",
    ぉ: "お",
    ゃ: "や",
    ゅ: "ゆ",
    ょ: "よ",
    っ: "つ",
  };
  return smallToBig[last] || last;
}

// 1. Evaluate Word API
app.post("/api/gemini/evaluate-word", async (req, res) => {
  const { word } = req.body;
  if (!word || typeof word !== "string") {
    return res.status(400).json({ error: "Missing or invalid word property" });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a Japanese Language Professor and an official Referee for the Shiritori Word Chain game. 
Analyze the input word "${word}" which may be in Romaji, Kanji, Hiragana, or Katakana.
Determine if it is a valid, recognized Japanese noun. Verbs, Adjectives, Adverbs, and Particles are strictly FORBIDDEN in Shiritori.
Assess the first sound and last sound in Hiragana.
Check if it ends in 'N' (ん/ン), which is a fatal losing move.
Produce output strictly structured matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Evaluate the word: ${word}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING, description: "The original queried word." },
            isValid: {
              type: Type.BOOLEAN,
              description: "True if the word is a valid Japanese noun suitable for Shiritori.",
            },
            reason: {
              type: Type.STRING,
              description:
                "Explanation of validity: e.g. Valid word, starts with Ri and ends with Go, or Forbidden: verbs are not allowed.",
            },
            translation: { type: Type.STRING, description: "The English translation of the word." },
            kanji: {
              type: Type.STRING,
              description: "The Kanji representation if appropriate, otherwise empty string.",
            },
            hiragana: { type: Type.STRING, description: "The Hiragana spelling of the word." },
            katakana: { type: Type.STRING, description: "The Katakana spelling of the word." },
            romaji: { type: Type.STRING, description: "Spelling in English alphabet letters." },
            startSound: {
              type: Type.STRING,
              description: "The exact starting Hiragana character.",
            },
            endSound: {
              type: Type.STRING,
              description:
                "The exact ending Hiragana character (excluding small modifier letters if resolved).",
            },
            endsInN: {
              type: Type.BOOLEAN,
              description: "True if the word ends with 'ん' or 'ン'.",
            },
          },
          required: [
            "word",
            "isValid",
            "reason",
            "translation",
            "kanji",
            "hiragana",
            "katakana",
            "romaji",
            "startSound",
            "endSound",
            "endsInN",
          ],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (error: any) {
    console.warn("Gemini evaluation error, using fallback matching strategy:", error.message);

    // Graceful offline fallback logic
    const lowerInput = word.toLowerCase().trim();
    const matched = FALLBACK_WORDS.find(
      w =>
        w.word.toLowerCase() === lowerInput || w.hiragana === lowerInput || w.kanji === lowerInput
    );

    if (matched) {
      return res.json({
        word,
        isValid: !matched.endsInN,
        reason: matched.endsInN
          ? "Ends in 'ん' (N) which is a game-over condition!"
          : `Valid noun! Starts with ${matched.startSound} and ends with ${matched.endSound}.`,
        translation: matched.translation,
        kanji: matched.kanji,
        hiragana: matched.hiragana,
        katakana: matched.katakana,
        romaji: matched.romaji,
        startSound: matched.startSound,
        endSound: matched.endSound,
        endsInN: matched.endsInN,
      });
    }

    // Generic fallback heuristic for typing input
    // If it ends in n/ ん/ ン, it's invalid.
    const endsInN =
      lowerInput.endsWith("n") || lowerInput.endsWith("ん") || lowerInput.endsWith("ン");
    return res.json({
      word,
      isValid: !endsInN,
      reason: endsInN ? "Ends in 'N'!" : "Spelled in Romaji/Kana. Assumed valid noun.",
      translation: word,
      kanji: "",
      hiragana: word,
      katakana: word,
      romaji: word,
      startSound: word[0] || "",
      endSound: word[word.length - 1] || "",
      endsInN,
    });
  }
});

// 2. Opponent Turn (AI Bot Move) API
app.post("/api/gemini/opponent-turn", async (req, res) => {
  const { lastSound, difficulty, playedWords } = req.body;

  if (!lastSound || typeof lastSound !== "string") {
    return res.status(400).json({ error: "Missing lastSound sound syllable" });
  }

  const playedList = Array.isArray(playedWords) ? playedWords : [];

  try {
    const ai = getGeminiClient();
    const personalityPrompt =
      difficulty === "easy"
        ? "You are Usagi Chan, a friendly little rabbit who plays very simple, childish everyday Japanese nouns. Keep words short (2-3 syllables)."
        : difficulty === "hard"
          ? "You are Neko Master, an expert cat gamer who plays highly challenging, sophisticated, long Japanese nouns. Impress the player!"
          : "You are Inu Sensei, the wise shiba dog who plays balanced, standard, and interesting Japanese nouns.";

    const systemPrompt = `${personalityPrompt} 
Play the Shiritori game. You MUST output exactly ONE valid Japanese noun that:
1. STARTS with the Hiragana sound "${lastSound}".
2. Does NOT end in 'ん' (ん/ン/N syllable) because that causes you to lose of course.
3. Is NOT in the list of played words: [${playedList.join(", ")}].
Provide the word, its details, and its Hiragana representation. Output must strictly conform to the expected JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Provide a Japanese noun starting with "${lastSound}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING, description: "The Japanese word to play." },
            translation: { type: Type.STRING, description: "English translation of the word." },
            kanji: { type: Type.STRING, description: "Kanji mapping." },
            hiragana: { type: Type.STRING, description: "Exact Hiragana writing." },
            katakana: { type: Type.STRING, description: "Exact Katakana writing." },
            romaji: { type: Type.STRING, description: "The romaji reading." },
            startSound: { type: Type.STRING, description: "The Hiragana sound it starts with." },
            endSound: {
              type: Type.STRING,
              description: "The last sound (Hiragana) that the next player must match.",
            },
            reason: {
              type: Type.STRING,
              description:
                "A cute dialogue sentence in character explaining why they played this word.",
            },
          },
          required: [
            "word",
            "translation",
            "kanji",
            "hiragana",
            "katakana",
            "romaji",
            "startSound",
            "endSound",
            "reason",
          ],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (error: any) {
    console.warn("Gemini opponent turn failed, pulling from offline dict:", error.message);

    // Filter local dictionary for matching available starting letter
    const options = FALLBACK_WORDS.filter(
      w =>
        !w.endsInN &&
        !playedList.map(pw => pw.toLowerCase()).includes(w.word.toLowerCase()) &&
        !playedList.map(pw => pw.toLowerCase()).includes(w.hiragana) &&
        (w.startSound === lastSound || w.romaji.startsWith(lastSound.toLowerCase()))
    );

    if (options.length > 0) {
      // Pick random suited option
      const choice = options[Math.floor(Math.random() * options.length)];
      return res.json({
        word: choice.word,
        translation: choice.translation,
        kanji: choice.kanji,
        hiragana: choice.hiragana,
        katakana: choice.katakana,
        romaji: choice.romaji,
        startSound: choice.startSound,
        endSound: choice.endSound,
        reason: `Woof! I fetched the word "${choice.word}" from my memory bank!`,
      });
    }

    // Ultimate fallback if nothing fits
    const backupWord = `Ringo`;
    return res.json({
      word: backupWord,
      translation: "Apple",
      kanji: "林檎",
      hiragana: "りんご",
      katakana: "リンゴ",
      romaji: "ringo",
      startSound: "り",
      endSound: "ご",
      reason: "Ah! I didn't see a clear fit, so I offered Ringo!",
    });
  }
});

// 3. Hints API
app.post("/api/gemini/word-hint", async (req, res) => {
  const { lastSound } = req.body;
  if (!lastSound || typeof lastSound !== "string") {
    return res.status(400).json({ error: "Missing lastSound" });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a helpful language model assisting a student in Japanese Shiritori word chain game.
Generate 3 distinct, valid Japanese nouns starting with the Hiragana letter "${lastSound}".
Make sure none of them end in 'ん' (N).
For each, provide the word, its English translation, Hiragana reading, and Romaji. Output must be strictly compliant with the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Provide 3 hints starting with "${lastSound}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  translation: { type: Type.STRING },
                  hiragana: { type: Type.STRING },
                  romaji: { type: Type.STRING },
                },
                required: ["word", "translation", "hiragana", "romaji"],
              },
            },
          },
          required: ["hints"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (error: any) {
    console.warn("Gemini hints API error, pulling fallback suggestions:", error.message);
    // filter static ones
    const localHints = FALLBACK_WORDS.filter(w => !w.endsInN && w.startSound === lastSound).slice(
      0,
      3
    );
    const hints = localHints.map(lh => ({
      word: lh.word,
      translation: lh.translation,
      hiragana: lh.hiragana,
      romaji: lh.romaji,
    }));

    if (hints.length === 0) {
      // populate dummy
      hints.push({ word: "Ringo", translation: "Apple", hiragana: "りんご", romaji: "ringo" });
    }

    return res.json({ hints });
  }
});

// Vite & Static file serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
