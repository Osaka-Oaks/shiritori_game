import React from "react";
import { MatchHistory } from "../types";
import { Award, Target, Flame, Calendar, Trophy, BarChart3, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

interface HistoryViewProps {
  matches: MatchHistory[];
  onClearHistory: () => void;
  onSelectMatch: (m: MatchHistory) => void;
}

export default function HistoryView({
  matches,
  onClearHistory,
  onSelectMatch
}: HistoryViewProps) {
  // Compute lifetime aggregate stats
  const totalMatches = matches.length;
  const totalWins = matches.filter(m => m.didWin).length;
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;
  
  const totalPoints = matches.reduce((acc, curr) => acc + curr.playerScore, 0);
  const highestChain = matches.reduce((acc, curr) => curr.chainLength > acc ? curr.chainLength : acc, 0);

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-4 pb-24 space-y-6">
      {/* Top Title Info */}
      <div className="text-center space-y-1">
        <h2 className="font-headline text-2xl font-extrabold text-on-surface">Match Statistics</h2>
        <p className="font-body text-on-surface-variant font-medium text-sm">
          Keep track of your lifetime word battles, scores, and win rate
        </p>
      </div>

      {/* Grid of lifetime stats card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 text-center shadow-sm flex flex-col items-center justify-center space-y-1.5">
          <span className="p-2 bg-primary/10 text-primary rounded-xl">
            <Trophy className="w-5 h-5" />
          </span>
          <span className="text-lg font-headline font-extrabold text-on-surface">{totalPoints} pts</span>
          <span className="text-[10px] font-label-caps text-on-surface-variant/80">TOTAL SCORE</span>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 text-center shadow-sm flex flex-col items-center justify-center space-y-1.5">
          <span className="p-2 bg-secondary/10 text-secondary rounded-xl">
            <Target className="w-5 h-5" />
          </span>
          <span className="text-lg font-headline font-extrabold text-on-surface">{winRate}%</span>
          <span className="text-[10px] font-label-caps text-on-surface-variant/80">WIN RATE ({totalWins} / {totalMatches})</span>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 text-center shadow-sm flex flex-col items-center justify-center space-y-1.5">
          <span className="p-2 bg-tertiary/10 text-tertiary rounded-xl">
            <Flame className="w-5 h-5 fill-current" />
          </span>
          <span className="text-lg font-headline font-extrabold text-on-surface">{highestChain} words</span>
          <span className="text-[10px] font-label-caps text-on-surface-variant/80">MAX CHAIN</span>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 text-center shadow-sm flex flex-col items-center justify-center space-y-1.5">
          <span className="p-2 bg-inverse-surface/10 text-inverse-surface rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </span>
          <span className="text-lg font-headline font-extrabold text-on-surface">{totalMatches} duels</span>
          <span className="text-[10px] font-label-caps text-on-surface-variant/80">MATCHES PLAYED</span>
        </div>
      </div>

      {/* Matches feed itemizer list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-label-caps text-xs text-primary font-bold px-1">MATCH HISTORY</h3>
          {matches.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-error font-bold flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear History
            </button>
          )}
        </div>

        {matches.length === 0 ? (
          <div className="bg-surface-container-low border border-dashed border-outline-variant rounded-2xl p-10 text-center space-y-3">
            <span className="text-3xl">🌸</span>
            <h4 className="font-headline font-bold text-sm text-on-surface">No record files exist yet</h4>
            <p className="font-body text-xs text-on-surface-variant max-w-sm mx-auto">
              Ready your brush and launch a word battle duel to build your historical record.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {matches.map((item) => (
              <motion.div
                key={item.id}
                onClick={() => onSelectMatch(item)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="bg-surface-container-lowest rounded-2xl border-2 border-surface-container-highest p-4 flex items-center justify-between shadow-sm cursor-pointer hover:border-primary/35 transition-all group"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="relative">
                    <img
                      alt={item.opponentName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border-2 shadow-sm border-primary/10"
                      src={item.opponentAvatar}
                    />
                    <span className={`absolute -bottom-1 -right-1 text-xs p-1 rounded-full text-on-primary font-bold ${
                      item.didWin ? "bg-secondary" : "bg-error"
                    }`}>
                      {item.didWin ? "W" : "L"}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
                      Opponent: {item.opponentName}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant font-medium flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-outline" />
                      {item.date} • Last word: <span className="font-semibold text-primary font-display-game">{item.fatalWord || "N/A"}</span>
                    </p>
                  </div>
                </div>

                {/* Score badge details */}
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-xs font-label-caps text-on-surface-variant">SCORE</span>
                  <div className="font-headline font-black text-sm tracking-tight text-on-surface group-hover:text-primary transition-colors">
                    {item.playerScore} <span className="text-outline-variant font-medium text-xs">vs</span> {item.opponentScore}
                  </div>
                  <span className="text-[10px] bg-primary-container/20 text-on-primary-container px-2 py-0.5 rounded-full font-body font-bold">
                    Chain: {item.chainLength}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
