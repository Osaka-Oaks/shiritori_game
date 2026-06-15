export type AppView = 
  | "HOME" 
  | "AVATAR_PICKER" 
  | "GAME_ROOM" 
  | "HISTORY" 
  | "LIBRARY" 
  | "LEADERBOARD" 
  | "RULES"
  | "AUTH"
  | "PRACTICE"
  | "MULTIPLAYER";

export interface AppCustomizations {
  accentColor: string;
  gridStyle: 'dense' | 'sparse' | 'dot' | 'none';
  font: 'Space Grotesk' | 'Playfair Display' | 'JetBrains Mono';
  headingStyle: 'uppercase' | 'normal';
  layoutDensity: 'compact' | 'standard' | 'spacious';
}

export const DEFAULT_CUSTOMIZATIONS: AppCustomizations = {
  accentColor: '#f27d26',
  gridStyle: 'sparse',
  font: 'Space Grotesk',
  headingStyle: 'uppercase',
  layoutDensity: 'standard'
};

export interface PlayedWord {
  word: string;
  translation: string;
  kanji: string;
  hiragana: string;
  katakana: string;
  romaji: string;
  startSound: string;
  endSound: string;
  speaker: "player" | "opponent";
}

export interface PlayerProfile {
  name: string;
  avatarUrl: string;
}

export interface OpponentBot {
  id: string;
  name: string;
  avatarUrl: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
}

export interface MatchHistory {
  id: string;
  opponentName: string;
  opponentAvatar: string;
  date: string;
  playerScore: number;
  opponentScore: number;
  chainLength: number;
  fatalWord: string;
  didWin: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatarUrl: string;
  score: number;
  isCurrentUser?: boolean;
}

export interface WordHint {
  word: string;
  translation: string;
  hiragana: string;
  romaji: string;
}
