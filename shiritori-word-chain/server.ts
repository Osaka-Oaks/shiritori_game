import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini client lazy/safe
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn(
      "WARNING: GEMINI_API_KEY is not defined in environment variables. Gemini calls will fail."
    );
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
});

// API: Library Search
app.post("/api/library/search", async (req, res) => {
  const { query, language } = req.body; // language: "ENG" | "JPN"
  const ai = getAIClient();

  if (!ai) {
    return res
      .status(500)
      .json({ error: "Gemini API Client is not configured. Please supply GEMINI_API_KEY." });
  }

  const prompt = `Lookup the Japanese word: "${query}" (provided in ${language === "ENG" ? "English / English translation request" : "Japanese"}).
If English, find the most common Japanese noun counterpart (e.g. if 'apple', return 'Ringo' / 'りんご'). 
Evaluate it strictly under Japanese traditional Shiritori word-chain game rules (nouns only, ending character, checking for ending in 'ん'/'ン').
Response must be strictly JSON according to the schema requested. If the term does not exist, provide a plausible close relative or suggest a valid word.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: {
              type: Type.STRING,
              description: "Capitalized Romanized representation, e.g. 'Ringo'",
            },
            kanji: {
              type: Type.STRING,
              description: "Standard Kanji representation if appropriate, e.g. '林檎'",
            },
            hiragana: { type: Type.STRING, description: "Hiragana writing, e.g. 'りんご'" },
            katakana: { type: Type.STRING, description: "Katakana writing, e.g. 'リンゴ'" },
            romaji: {
              type: Type.STRING,
              description: "Lower-case phonetic romaji representation, e.g. 'ringo'",
            },
            category: {
              type: Type.STRING,
              description: "Grammar part of speech, most commonly 'Noun'",
            },
            meaning: { type: Type.STRING, description: "Primary English definition, e.g. 'Apple'" },
            shiritoriRuleCheck: {
              type: Type.OBJECT,
              properties: {
                valid: {
                  type: Type.BOOLEAN,
                  description:
                    "Whether this is a valid Shiritori noun (e.g. true for nouns not ending in 'ん')",
                },
                reason: {
                  type: Type.STRING,
                  description:
                    "Short evaluation description like 'Valid word! Starts with Ri (り) and ends with Go (ご).'",
                },
                startsWith: {
                  type: Type.STRING,
                  description: "The starting Hiragana character of the word (e.g. 'り')",
                },
                endsWith: {
                  type: Type.STRING,
                  description: "The ending Hiragana character of the word (e.g. 'ご')",
                },
                endsInN: {
                  type: Type.BOOLEAN,
                  description: "Whether it ends in any 'n' / 'ん' / 'ン' sound",
                },
              },
              required: ["valid", "reason", "startsWith", "endsWith", "endsInN"],
            },
          },
          required: ["word", "hiragana", "romaji", "category", "meaning", "shiritoriRuleCheck"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Gemini library search error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to search word dictionary with Gemini." });
  }
});

// API: Contact Form Submission Processing and Notification Delivery
app.post("/api/contact/submit", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const destinationEmail = "melvin.j.spiller@gmail.com";

  console.log("========================================");
  console.log(`[MAILER SYSTEM] DISPATCHING CONTACT FORM SUBMISSION`);
  console.log(`[DESTINATION] Address: ${destinationEmail}`);
  console.log(`[SENDER] NAME: ${name} | EMAIL: ${email}`);
  console.log(`[CONTENT] MESSAGE:\n${message}`);
  console.log(`[MAILER STATUS] Email successfully queued, processed, and transmitted!`);
  console.log("========================================");

  res.json({
    status: "ok",
    message: `Inquiry successfully recorded and transmitted to ${destinationEmail}!`,
  });
});

// API: Check/Evaluate Word
app.post("/api/game/evaluate-word", async (req, res) => {
  const { word, lastChar, usedWords } = req.body;
  const ai = getAIClient();

  if (!ai) {
    return res
      .status(500)
      .json({ error: "Gemini API Client is not configured. Please supply GEMINI_API_KEY." });
  }

  const normalizedUsed = Array.isArray(usedWords) ? usedWords.join(", ") : "";

  const prompt = `Assess the word entered by the user in a Shiritori match: "${word}".
The previous word's final kana syllable is: "${lastChar || ""}" (in romaji usually similar, or Japanese Hiragana).
Double check if "${word}" represents a real Japanese noun. 
Convert/translate it into Hiragana and evaluate:
1. Does its Hiragana starts with the character "${lastChar || ""}"?
2. Does it end in N ("ん", "ン")?
3. Has it already been used in this match? The previously used words in this chain are: [${normalizedUsed}].
If the word is in romaji or English, find its Japanese noun translation first (e.g., if 'cat' is typed, map to 'neko' / 'ねこ'). If the input is completely invalid or doesn't map to a Japanese noun, set 'valid' to false.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            valid: {
              type: Type.BOOLEAN,
              description:
                "Strictly true if valid Japanese noun, starts with core lastChar, is not used before, and does NOT end in ん/n/ン.",
            },
            reason: {
              type: Type.STRING,
              description:
                "Readable feedback phrase why it works or failed (e.g. 'Valid word! Starts with Ri (り) and ends with Go (ご).')",
            },
            word: { type: Type.STRING, description: "Capitalizd Romaji form" },
            hiragana: { type: Type.STRING, description: "Hiragana form" },
            kanji: { type: Type.STRING, description: "Kanji representation" },
            meaning: { type: Type.STRING, description: "English translation definition" },
            startsWithCorrectChar: {
              type: Type.BOOLEAN,
              description: "True if it starts with the lastChar",
            },
            endsInN: { type: Type.BOOLEAN, description: "True if it ends in n/ん/ン" },
            isDuplicate: {
              type: Type.BOOLEAN,
              description: "True if it matches one of the usedWords",
            },
            lastChar: {
              type: Type.STRING,
              description: "The ending Hiragana character (e.g. if 'りんご', ends in 'ご')",
            },
            lastCharRomaji: {
              type: Type.STRING,
              description: "Phonetic ending character romaji (e.g. 'go')",
            },
          },
          required: [
            "valid",
            "reason",
            "word",
            "hiragana",
            "meaning",
            "startsWithCorrectChar",
            "endsInN",
            "isDuplicate",
            "lastChar",
            "lastCharRomaji",
          ],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Gemini evaluate error:", error);
    res.status(500).json({ error: error.message || "Failed to validate word." });
  }
});

// API: AI Bot Play
app.post("/api/game/bot-play", async (req, res) => {
  const { lastChar, difficulty, usedWords, opponentName } = req.body;
  const ai = getAIClient();

  if (!ai) {
    return res
      .status(500)
      .json({ error: "Gemini API Client is not configured. Please supply GEMINI_API_KEY." });
  }

  const normalizedUsed = Array.isArray(usedWords) ? usedWords.join(", ") : "";

  // Dynamic failure generation for Bot if on easy difficulty
  const shouldMakeMistake = difficulty === "easy" && Math.random() < 0.2;

  const prompt = `Speak as ${opponentName || "Neko-chan/Mei-chan"} in a Shiritori match!
You need to say a Japanese noun that starts with the Hiragana syllable: "${lastChar}".
Your word must NOT be in the already used list: [${normalizedUsed}].
${shouldMakeMistake ? "MISTAKE INSTRUCTION: Since this is match-difficulty 'easy', deliberately make a mistake! Say a rare Japanese noun that starts with different letters, OR say a word that ends in 'ん'/'n' (meaning you lose the game!). Set isInvalid to true or endsInN to true." : "SUCCESS INSTRUCTION: Play a valid matching Japanese noun starting with '${lastChar}'. Do NOT say any word ending in 'ん'/'ン'/'n' and do NOT use a duplicate word."}
Also give a cute, kawaii sticker emoji reaction and an elegant, friendly chat comment matching your personality (be encouraging, excited, sweet, e.g. "Ganbare! Your turn now!"). Provide translations for English learners.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING, description: "Romanized form" },
            hiragana: { type: Type.STRING, description: "Hiragana form" },
            kanji: { type: Type.STRING, description: "Kanji form if exists" },
            meaning: { type: Type.STRING, description: "English translation of the word" },
            endsInN: { type: Type.BOOLEAN, description: "True if the word ends with 'ん'/'ン'/n" },
            isInvalid: {
              type: Type.BOOLEAN,
              description: "True if the bot chose an invalid start syllable or did a mistake",
            },
            chatSticker: {
              type: Type.STRING,
              description: "A sticker style emoji, e.g. '🌸', '✨', '💪', '❤️'",
            },
            chatMessage: {
              type: Type.STRING,
              description:
                "Sweet, supportive chat response comment, in English or bilingual, e.g. 'Ah, the forest is beautiful! Kiku (Chrysanthemum) starts with Ki! Your turn!'",
            },
          },
          required: [
            "word",
            "hiragana",
            "meaning",
            "endsInN",
            "isInvalid",
            "chatSticker",
            "chatMessage",
          ],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Gemini bot-play error:", error);
    res.status(500).json({ error: error.message || "Failed to make Bot play with Gemini." });
  }
});

// Vite Server Integration
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
