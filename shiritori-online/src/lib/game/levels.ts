/** Solo / practice difficulty levels (1 = easiest). */

export type LevelId = 1 | 2 | 3 | 4 | 5;

export interface LevelConfig {
  id: LevelId;
  emoji: string;
  label: string;
  blurb: string;
  timer: number;
  thinkMs: number;
  giveUpChance: number;
  trap: boolean;
  /** CPU vocabulary capped at this JLPT band (undefined = all words). */
  maxJlpt?: "N5" | "N4" | "N3";
  /** Player words must pass Jisho / dictionary lookup. */
  requireDictionary: boolean;
}

export const LEVELS: Record<LevelId, LevelConfig> = {
  1: {
    id: 1,
    emoji: "🌱",
    label: "Level 1 · Beginner",
    blurb: "N5 words · slow CPU · gentle",
    timer: 60,
    thinkMs: 1800,
    giveUpChance: 0.35,
    trap: false,
    maxJlpt: "N5",
    requireDictionary: false,
  },
  2: {
    id: 2,
    emoji: "🌿",
    label: "Level 2 · Easy",
    blurb: "N5–N4 · relaxed timer",
    timer: 45,
    thinkMs: 1400,
    giveUpChance: 0.2,
    trap: false,
    maxJlpt: "N4",
    requireDictionary: false,
  },
  3: {
    id: 3,
    emoji: "🔥",
    label: "Level 3 · Medium",
    blurb: "Full vocab · balanced",
    timer: 30,
    thinkMs: 1000,
    giveUpChance: 0,
    trap: false,
    requireDictionary: false,
  },
  4: {
    id: 4,
    emoji: "💀",
    label: "Level 4 · Hard",
    blurb: "CPU sets traps · fast",
    timer: 20,
    thinkMs: 600,
    giveUpChance: 0,
    trap: true,
    requireDictionary: false,
  },
  5: {
    id: 5,
    emoji: "👑",
    label: "Level 5 · Expert",
    blurb: "Dictionary check · ruthless CPU",
    timer: 15,
    thinkMs: 450,
    giveUpChance: 0,
    trap: true,
    requireDictionary: true,
  },
};

export const LEVEL_LIST: LevelConfig[] = [1, 2, 3, 4, 5].map(id => LEVELS[id as LevelId]);

const JLPT_RANK: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 };

export function jlptAllowed(wordJlpt: string | undefined, maxJlpt: string | undefined): boolean {
  if (!maxJlpt) return true;
  if (!wordJlpt) return true;
  return (JLPT_RANK[wordJlpt] ?? 99) <= (JLPT_RANK[maxJlpt] ?? 99);
}

export function parseLevelId(raw: string | null | undefined): LevelId | null {
  const n = Number(raw);
  if (n >= 1 && n <= 5) return n as LevelId;
  const legacy: Record<string, LevelId> = { easy: 2, medium: 3, hard: 4 };
  if (raw && legacy[raw]) return legacy[raw];
  return null;
}
