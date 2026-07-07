import { describe, it, expect, vi } from "vitest";

// leaderboard.ts imports db from ./firebase, whose module init throws
// when VITE_FIREBASE_* env vars are absent (e.g. on CI runners). These
// tests only cover pure scoring logic, so stub the module out.
vi.mock("../firebase", () => ({ db: {} }));

import { LeaderboardService } from "../leaderboard";

describe("LeaderboardService", () => {
  const leaderboard = new LeaderboardService();

  describe("calculateScore", () => {
    it("should calculate score correctly for easy difficulty", () => {
      const score = leaderboard.calculateScore(5, "easy", 10, true);
      // baseScore = 5 * 10 = 50
      // difficultyMultiplier = 1.0
      // timeBonus = floor(10/5) * 5 = 10
      // winBonus = 100
      // total = floor(50 * 1.0) + 10 + 100 = 160
      expect(score).toBe(160);
    });

    it("should calculate score correctly for medium difficulty", () => {
      const score = leaderboard.calculateScore(5, "medium", 10, true);
      // baseScore = 5 * 10 = 50
      // difficultyMultiplier = 1.5
      // timeBonus = floor(10/5) * 5 = 10
      // winBonus = 100
      // total = floor(50 * 1.5) + 10 + 100 = 185
      expect(score).toBe(185);
    });

    it("should calculate score correctly for hard difficulty", () => {
      const score = leaderboard.calculateScore(5, "hard", 10, true);
      // baseScore = 5 * 10 = 50
      // difficultyMultiplier = 2.0
      // timeBonus = floor(10/5) * 5 = 10
      // winBonus = 100
      // total = floor(50 * 2.0) + 10 + 100 = 210
      expect(score).toBe(210);
    });

    it("should not add win bonus if lost", () => {
      const score = leaderboard.calculateScore(5, "easy", 10, false);
      // baseScore = 5 * 10 = 50
      // difficultyMultiplier = 1.0
      // timeBonus = floor(10/5) * 5 = 10
      // winBonus = 0
      // total = floor(50 * 1.0) + 10 + 0 = 60
      expect(score).toBe(60);
    });

    it("should handle zero time remaining", () => {
      const score = leaderboard.calculateScore(3, "easy", 0, true);
      // baseScore = 3 * 10 = 30
      // difficultyMultiplier = 1.0
      // timeBonus = floor(0/5) * 5 = 0
      // winBonus = 100
      // total = floor(30 * 1.0) + 0 + 100 = 130
      expect(score).toBe(130);
    });

    it("should handle large word counts", () => {
      const score = leaderboard.calculateScore(20, "hard", 30, true);
      // baseScore = 20 * 10 = 200
      // difficultyMultiplier = 2.0
      // timeBonus = floor(30/5) * 5 = 30
      // winBonus = 100
      // total = floor(200 * 2.0) + 30 + 100 = 530
      expect(score).toBe(530);
    });

    it("should return integer scores", () => {
      const score = leaderboard.calculateScore(7, "medium", 13, true);
      expect(Number.isInteger(score)).toBe(true);
    });
  });
});
