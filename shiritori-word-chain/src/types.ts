export interface WordChainItem {
  id: string;
  word: string;
  romaji: string;
  kanji?: string;
  hiragana: string;
  meaning: string;
  lastChar: string; // Last kana syllable, e.g. "ら" or "こ"
  lastCharRomaji: string; // e.g. "ra" or "ko"
  speaker: "player" | "opponent";
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: "Mei-chan" | "Jarrel" | "Neko-chan" | "Bot";
  text: string;
  japaneseTranslation?: string;
  timestamp: string;
  isSticker?: boolean;
}

export interface LibraryWordInfo {
  word: string;
  kanji?: string;
  hiragana: string;
  katakana?: string;
  romaji: string;
  category: string;
  meaning: string;
  shiritoriRuleCheck: {
    valid: boolean;
    reason: string;
    startsWith: string;
    endsWith: string;
    endsInN: boolean;
  };
}

export interface GameSession {
  gameMode: "ai" | "friend";
  playerName: string;
  opponentName: string;
  playerAvatar: string;
  opponentAvatar: string;
  playerScore: number;
  opponentScore: number;
  chain: WordChainItem[];
  turn: "player" | "opponent";
  streak: number;
  timeLeft: number; // in seconds, starting at 30
  powerups: {
    wordHints: number;
    pointShields: number;
  };
}
