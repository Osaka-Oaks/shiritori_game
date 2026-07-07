import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
  increment,
  serverTimestamp,
  where,
} from "firebase/firestore";

export interface PlayerScore {
  userId: string;
  name: string;
  avatarUrl: string;
  totalScore: number;
  gamesPlayed: number;
  gamesWon: number;
  highestStreak: number;
  totalWordsPlayed: number;
  averageWordLength: number;
  lastPlayedAt: any;
  createdAt: any;
}

export interface GameResult {
  userId: string;
  opponentId: string;
  opponentName: string;
  playerScore: number;
  opponentScore: number;
  winner: "player" | "opponent" | "tie";
  wordsUsed: number;
  difficulty: string;
  duration: number;
  playedAt: any;
}

export class LeaderboardService {
  private leaderboardCollection = "leaderboard";
  private gamesCollection = "games";

  async getPlayerScore(userId: string): Promise<PlayerScore | null> {
    try {
      const docRef = doc(db, this.leaderboardCollection, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as PlayerScore;
      }
      return null;
    } catch (error) {
      console.error("Error fetching player score:", error);
      return null;
    }
  }

  async updatePlayerScore(
    userId: string,
    name: string,
    avatarUrl: string,
    gameResult: {
      score: number;
      won: boolean;
      wordsUsed: number;
      averageWordLength: number;
      streak: number;
    }
  ): Promise<void> {
    try {
      const docRef = doc(db, this.leaderboardCollection, userId);
      const existingDoc = await getDoc(docRef);

      if (existingDoc.exists()) {
        const currentData = existingDoc.data() as PlayerScore;

        await updateDoc(docRef, {
          name,
          avatarUrl,
          totalScore: increment(gameResult.score),
          gamesPlayed: increment(1),
          gamesWon: increment(gameResult.won ? 1 : 0),
          highestStreak: Math.max(currentData.highestStreak || 0, gameResult.streak),
          totalWordsPlayed: increment(gameResult.wordsUsed),
          averageWordLength:
            (currentData.averageWordLength * currentData.totalWordsPlayed +
              gameResult.averageWordLength * gameResult.wordsUsed) /
            (currentData.totalWordsPlayed + gameResult.wordsUsed),
          lastPlayedAt: serverTimestamp(),
        });
      } else {
        await setDoc(docRef, {
          userId,
          name,
          avatarUrl,
          totalScore: gameResult.score,
          gamesPlayed: 1,
          gamesWon: gameResult.won ? 1 : 0,
          highestStreak: gameResult.streak,
          totalWordsPlayed: gameResult.wordsUsed,
          averageWordLength: gameResult.averageWordLength,
          lastPlayedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
      }

      console.log("✅ Player score updated successfully");
    } catch (error) {
      console.error("Error updating player score:", error);
      throw error;
    }
  }

  async saveGameResult(gameResult: GameResult): Promise<void> {
    try {
      const docRef = doc(collection(db, this.gamesCollection));
      await setDoc(docRef, {
        ...gameResult,
        playedAt: serverTimestamp(),
      });

      console.log("✅ Game result saved successfully");
    } catch (error) {
      console.error("Error saving game result:", error);
      throw error;
    }
  }

  async getTopPlayers(limitCount: number = 50): Promise<PlayerScore[]> {
    try {
      const q = query(
        collection(db, this.leaderboardCollection),
        orderBy("totalScore", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const players: PlayerScore[] = [];

      querySnapshot.forEach(doc => {
        players.push(doc.data() as PlayerScore);
      });

      return players;
    } catch (error) {
      console.error("Error fetching top players:", error);
      return [];
    }
  }

  async getPlayerRank(userId: string): Promise<number> {
    try {
      const playerScore = await this.getPlayerScore(userId);
      if (!playerScore) return -1;

      const q = query(
        collection(db, this.leaderboardCollection),
        where("totalScore", ">", playerScore.totalScore)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size + 1;
    } catch (error) {
      console.error("Error calculating player rank:", error);
      return -1;
    }
  }

  async getPlayerGameHistory(userId: string, limitCount: number = 20): Promise<GameResult[]> {
    try {
      const q = query(
        collection(db, this.gamesCollection),
        where("userId", "==", userId),
        orderBy("playedAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const games: GameResult[] = [];

      querySnapshot.forEach(doc => {
        games.push(doc.data() as GameResult);
      });

      return games;
    } catch (error) {
      console.error("Error fetching game history:", error);
      return [];
    }
  }

  calculateScore(
    wordsUsed: number,
    difficulty: "easy" | "medium" | "hard",
    timeRemaining: number,
    won: boolean
  ): number {
    const baseScore = wordsUsed * 10;

    const difficultyMultiplier = {
      easy: 1.0,
      medium: 1.5,
      hard: 2.0,
    };

    const timeBonus = Math.floor(timeRemaining / 5) * 5;
    const winBonus = won ? 100 : 0;

    return Math.floor(baseScore * difficultyMultiplier[difficulty] + timeBonus + winBonus);
  }
}

export const leaderboard = new LeaderboardService();
