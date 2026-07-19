/**
 * LINE Friends Characters & Stickers
 * Popular characters from LINE messaging app
 */

export interface LineCharacter {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  avatarUrl: string;
  difficulty: "easy" | "medium" | "hard";
  personality: string;
  catchphrase: string;
}

export interface LineSticker {
  id: string;
  characterId: string;
  name: string;
  emotion: "happy" | "sad" | "excited" | "angry" | "surprised" | "love" | "thinking";
  imageUrl: string;
  soundEffect?: string;
}

// LINE Friends Characters
export const LINE_CHARACTERS: LineCharacter[] = [
  {
    id: "brown",
    name: "Brown",
    nameJa: "ブラウン",
    description: "A reliable and caring bear who loves his friends",
    avatarUrl: "https://stickershop.line-scdn.net/stickershop/v1/product/1/LINEStorePC/main.png",
    difficulty: "easy",
    personality: "Gentle and kind",
    catchphrase: "Let's play together!",
  },
  {
    id: "cony",
    name: "Cony",
    nameJa: "コニー",
    description: "A cheerful and energetic rabbit who loves fashion",
    avatarUrl: "https://stickershop.line-scdn.net/stickershop/v1/product/2/LINEStorePC/main.png",
    difficulty: "easy",
    personality: "Cheerful and fashionable",
    catchphrase: "Yay! So cute!",
  },
  {
    id: "sally",
    name: "Sally",
    nameJa: "サリー",
    description: "A cute chick who is always cheerful",
    avatarUrl: "https://stickershop.line-scdn.net/stickershop/v1/product/3/LINEStorePC/main.png",
    difficulty: "easy",
    personality: "Innocent and playful",
    catchphrase: "Peep peep!",
  },
  {
    id: "moon",
    name: "Moon",
    nameJa: "ムーン",
    description: "A cool and mysterious moon character",
    avatarUrl: "https://stickershop.line-scdn.net/stickershop/v1/product/4/LINEStorePC/main.png",
    difficulty: "medium",
    personality: "Cool and calm",
    catchphrase: "Meh...",
  },
  {
    id: "james",
    name: "James",
    nameJa: "ジェームズ",
    description: "A sophisticated gentleman with style",
    avatarUrl: "https://stickershop.line-scdn.net/stickershop/v1/product/5/LINEStorePC/main.png",
    difficulty: "medium",
    personality: "Elegant and refined",
    catchphrase: "Quite splendid!",
  },
  {
    id: "jessica",
    name: "Jessica",
    nameJa: "ジェシカ",
    description: "A fashionable cat who loves shopping",
    avatarUrl: "https://stickershop.line-scdn.net/stickershop/v1/product/6/LINEStorePC/main.png",
    difficulty: "medium",
    personality: "Stylish and confident",
    catchphrase: "Fabulous!",
  },
  {
    id: "leonard",
    name: "Leonard",
    nameJa: "レナード",
    description: "A smart and strategic frog",
    avatarUrl: "https://stickershop.line-scdn.net/stickershop/v1/product/7/LINEStorePC/main.png",
    difficulty: "hard",
    personality: "Intelligent and calculating",
    catchphrase: "Hmmm... Interesting.",
  },
  {
    id: "boss",
    name: "Boss",
    nameJa: "ボス",
    description: "A tiny but mighty character",
    avatarUrl: "https://stickershop.line-scdn.net/stickershop/v1/product/8/LINEStorePC/main.png",
    difficulty: "hard",
    personality: "Small but fierce",
    catchphrase: "I'm the boss!",
  },
];

// LINE Stickers for gameplay feedback
export const LINE_STICKERS: LineSticker[] = [
  // Brown stickers
  {
    id: "brown_happy",
    characterId: "brown",
    name: "Happy Brown",
    emotion: "happy",
    imageUrl: "/stickers/brown-happy.png",
    soundEffect: "happy",
  },
  {
    id: "brown_thinking",
    characterId: "brown",
    name: "Thinking Brown",
    emotion: "thinking",
    imageUrl: "/stickers/brown-thinking.png",
    soundEffect: "think",
  },
  {
    id: "brown_excited",
    characterId: "brown",
    name: "Excited Brown",
    emotion: "excited",
    imageUrl: "/stickers/brown-excited.png",
    soundEffect: "excited",
  },

  // Cony stickers
  {
    id: "cony_love",
    characterId: "cony",
    name: "Love Cony",
    emotion: "love",
    imageUrl: "/stickers/cony-love.png",
    soundEffect: "love",
  },
  {
    id: "cony_surprised",
    characterId: "cony",
    name: "Surprised Cony",
    emotion: "surprised",
    imageUrl: "/stickers/cony-surprised.png",
    soundEffect: "surprise",
  },
  {
    id: "cony_happy",
    characterId: "cony",
    name: "Happy Cony",
    emotion: "happy",
    imageUrl: "/stickers/cony-happy.png",
    soundEffect: "happy",
  },

  // Sally stickers
  {
    id: "sally_excited",
    characterId: "sally",
    name: "Excited Sally",
    emotion: "excited",
    imageUrl: "/stickers/sally-excited.png",
    soundEffect: "excited",
  },
  {
    id: "sally_happy",
    characterId: "sally",
    name: "Happy Sally",
    emotion: "happy",
    imageUrl: "/stickers/sally-happy.png",
    soundEffect: "chirp",
  },

  // Moon stickers
  {
    id: "moon_thinking",
    characterId: "moon",
    name: "Thinking Moon",
    emotion: "thinking",
    imageUrl: "/stickers/moon-thinking.png",
    soundEffect: "think",
  },
  {
    id: "moon_sad",
    characterId: "moon",
    name: "Sad Moon",
    emotion: "sad",
    imageUrl: "/stickers/moon-sad.png",
    soundEffect: "sad",
  },
];

// Get stickers for a character
export function getCharacterStickers(characterId: string): LineSticker[] {
  return LINE_STICKERS.filter(sticker => sticker.characterId === characterId);
}

// Get random sticker for emotion
export function getRandomStickerForEmotion(emotion: LineSticker["emotion"]): LineSticker | null {
  const stickers = LINE_STICKERS.filter(s => s.emotion === emotion);
  if (stickers.length === 0) return null;
  return stickers[Math.floor(Math.random() * stickers.length)];
}

// Get character by ID
export function getLineCharacter(id: string): LineCharacter | undefined {
  return LINE_CHARACTERS.find(char => char.id === id);
}

// Convert LINE characters to bot opponents format
export function lineCharacterToBotOpponent(character: LineCharacter) {
  return {
    id: `line_${character.id}`,
    name: character.name,
    avatarUrl: character.avatarUrl,
    difficulty: character.difficulty,
    description: `${character.description} ${character.catchphrase}`,
  };
}

export default {
  characters: LINE_CHARACTERS,
  stickers: LINE_STICKERS,
  getCharacterStickers,
  getRandomStickerForEmotion,
  getLineCharacter,
  lineCharacterToBotOpponent,
};
