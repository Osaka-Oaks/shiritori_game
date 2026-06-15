import React from "react";
import { PlayerProfile, MatchHistory } from "../types";
import { motion } from "motion/react";
import { Play, BookOpen, RefreshCw, ChevronRight, User, Cpu, Target } from "lucide-react";

interface HomeViewProps {
  profile: PlayerProfile;
  matches: MatchHistory[];
  onStartGame: () => void;
  onOpenRules: () => void;
  onSelectMatch: (m: MatchHistory) => void;
  onOpenPractice?: () => void;
  onOpenMultiplayer?: () => void;
}

const KANA_LIST = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ'];

export default function HomeView({
  profile,
  matches,
  onStartGame,
  onOpenRules,
  onSelectMatch,
  onOpenPractice,
}: HomeViewProps) {
  // Generate random static positions for background kana floating
  const floatingKana = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, idx) => ({
      char: KANA_LIST[idx % KANA_LIST.length],
      left: `${(idx * 7 + 10) % 90}%`,
      top: `${(idx * 11 + 15) % 85}%`,
      duration: 15 + (idx % 5) * 5,
      delay: -(idx % 3) * 3,
    }));
  }, []);

  return (
    <div className="relative flex-grow flex flex-col items-center justify-center py-4 px-4 overflow-hidden min-h-[80vh]">
      {/* Floating Kana Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 select-none overflow-hidden bg-surface">
        {floatingKana.map((kana, i) => (
          <motion.span
            key={i}
            className="absolute font-display-game text-3xl md:text-5xl text-primary/10 font-bold"
            style={{ left: kana.left, top: kana.top }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: kana.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: kana.delay,
            }}
          >
            {kana.char}
          </motion.span>
        ))}
      </div>

      {/* Main Home Canvas Column */}
      <div className="w-full max-w-md flex flex-col items-center z-10 text-center space-y-6">
        {/* Animated Hero Mascot */}
        <div className="relative mb-2 border border-white/10 p-5 bg-surface-container-low relative w-full flex items-center justify-center">
          <span className="absolute top-1.5 left-2 text-[8px] font-mono text-primary tracking-[3px]">FIG. 01 // INDEXED_NEKO</span>
          <span className="absolute bottom-1.5 right-2 text-[8px] font-mono text-white/30 tracking-widest">SCALE: 1:1</span>
          <div className="absolute right-3 top-3 w-2 h-2 rounded-none bg-primary animate-pulse" />
          <motion.div
            className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center cursor-pointer"
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              alt="Joyful waves Neko mascot waving paw"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter grayscale brightness-110 hue-rotate-15 contrast-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIJc9i78oxQtXLO6jntI_gb7v5BsmQoj1Ob5iJJQ4QKgi9iDe75MVwk7ltKFhLauudOLcp5cnroV-fzaoRiole6HOYnVlaq7zXvw64tNk6SfIKR0YkRDFxp61SwTxK-HXhhpFjswctK230zFEEUXSzcFnzSauKbRJsGcHHoZqfh88VWfgAXT5CBtxsf8nYUrjdJKVRwPckM4NVzpGHc3lKUlWi-X1XrHCDl9VWVM8GBiaHgHCnvRa8NNuyDfPFn1VTn_UACWBg53oO"
            />
          </motion.div>
        </div>

        {/* Brand Headline tagline */}
        <div className="space-y-2">
          <span className="struct-index text-xs tracking-[4px] uppercase block">No. 01 // ARCHITECTURAL LEDGER</span>
          <h2 className="font-headline text-5xl md:text-7xl font-black text-white tracking-[-3px] leading-none uppercase">
            SHIRI<span className="text-primary">TORI</span>
          </h2>
          <p className="font-body text-on-surface-variant font-medium text-xs tracking-wider uppercase opacity-80 max-w-sm mx-auto">
            Play the striking Japanese word-chain game within an immersive structured workspace.
          </p>
        </div>

        {/* Core Quick Action Buttons */}
        <div className="w-full space-y-3 px-4 pt-1">
          <motion.button
            onClick={onStartGame}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="squish-btn w-full bg-primary text-on-primary font-display-game font-bold py-3.5 px-6 rounded-none flex items-center justify-center gap-3 transition-all cursor-pointer text-sm uppercase tracking-widest"
          >
            <Play className="fill-current w-4 h-4" />
            Play bot match
          </motion.button>

          <motion.button
            onClick={onOpenPractice}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="squish-btn w-full bg-secondary text-on-secondary font-display-game font-bold py-3 px-6 rounded-none flex items-center justify-center gap-3 transition-all cursor-pointer text-xs uppercase tracking-widest border border-secondary/40"
          >
            <Target className="w-4 h-4" />
            Practice Mode
          </motion.button>

          <motion.button
            onClick={onOpenRules}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="squish-btn w-full bg-surface-container-high text-white font-display-game font-bold py-3 px-6 rounded-none flex items-center justify-center gap-3 transition-all cursor-pointer text-xs uppercase tracking-widest border border-white/20"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            How to Play
          </motion.button>
        </div>

        {/* Recent Active Matches Feed */}
        <section className="w-full px-2 pt-4">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant text-xs">RECENT GAMES</h3>
            <span onClick={onStartGame} className="text-xs text-primary font-bold hover:underline cursor-pointer">
              New Game
            </span>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-3 shadow-soft border border-primary/5 space-y-2.5">
            {matches.length === 0 ? (
              <div className="py-6 text-center text-xs text-on-surface-variant/50 font-body">
                No active games yet. Press Play to start!
              </div>
            ) : (
              matches.slice(0, 3).map((match, i) => (
                <motion.div
                  key={match.id || i}
                  onClick={() => onSelectMatch(match)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl hover:bg-primary-container/10 transition-colors cursor-pointer border border-outline-variant/20 shadow-sm group"
                >
                  <div className="flex items-center gap-3 text-left">
                    <img
                      alt={match.opponentName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary/10 shadow-sm"
                      src={match.opponentAvatar}
                    />
                    <div>
                      <p className="font-body text-on-surface font-bold text-sm tracking-tight">
                        {match.opponentName}
                      </p>
                      <p className="text-[11px] text-on-surface-variant/80 font-medium">
                        {match.didWin ? "Match finished • You won!" : `Active • Last: ${match.fatalWord || "Ringo"}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!match.didWin && <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
                    <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
