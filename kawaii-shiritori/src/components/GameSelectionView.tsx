import React from "react";
import { motion } from "motion/react";
import { Sparkles, CircleDot, ArrowRight, Info } from "lucide-react";

interface GameSelectionViewProps {
  onSelectGame: (game: "shiritori" | "othello") => void;
}

export default function GameSelectionView({ onSelectGame }: GameSelectionViewProps) {
  const [hoveredGame, setHoveredGame] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-tertiary/10 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-display-game font-black text-on-surface mb-4">
            🎮 ゲームを選ぶ
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant font-body">
            Choose Your Game / あなたのゲームを選んでください
          </p>
        </motion.div>

        {/* Game Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Shiritori Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onHoverStart={() => setHoveredGame("shiritori")}
            onHoverEnd={() => setHoveredGame(null)}
            className="relative"
          >
            <button
              onClick={() => onSelectGame("shiritori")}
              className="w-full bg-surface border-4 border-primary rounded-3xl p-8 hover:bg-primary/5 transition-all hover:scale-105 hover:shadow-2xl group"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-6 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="w-16 h-16 text-primary group-hover:animate-pulse" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-display-game font-black text-on-surface mb-3">
                しりとり
              </h2>
              <p className="text-2xl text-primary font-body font-bold mb-4">
                Shiritori
              </p>

              {/* Description */}
              <p className="text-on-surface-variant font-body text-lg mb-6 leading-relaxed">
                Word chain game where each word starts with the last sound of the previous word.
              </p>

              {/* Japanese Description */}
              <p className="text-on-surface-variant/80 font-body text-base mb-6 leading-relaxed italic">
                言葉遊びゲーム。前の言葉の最後の音で始まる言葉を繋げます。
              </p>

              {/* Features */}
              <div className="space-y-2 mb-6 text-left">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Voice Input & Predictive Text</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">AI Opponents & Multiplayer</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">5000+ Japanese Words</span>
                </div>
              </div>

              {/* Play Button */}
              <motion.div
                className="flex items-center justify-center gap-2 text-primary font-bold text-lg"
                animate={hoveredGame === "shiritori" ? { x: [0, 10, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <span>Play Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </button>

            {/* Badge */}
            <div className="absolute -top-4 -right-4 bg-secondary text-on-secondary px-4 py-2 rounded-full font-bold text-sm shadow-lg">
              🔥 Popular
            </div>
          </motion.div>

          {/* Othello Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onHoverStart={() => setHoveredGame("othello")}
            onHoverEnd={() => setHoveredGame(null)}
            className="relative"
          >
            <button
              onClick={() => onSelectGame("othello")}
              className="w-full bg-surface border-4 border-secondary rounded-3xl p-8 hover:bg-secondary/5 transition-all hover:scale-105 hover:shadow-2xl group"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-secondary/10 p-6 rounded-full group-hover:bg-secondary/20 transition-colors">
                  <CircleDot className="w-16 h-16 text-secondary group-hover:animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-display-game font-black text-on-surface mb-3">
                オセロ
              </h2>
              <p className="text-2xl text-secondary font-body font-bold mb-4">
                Osero (Othello)
              </p>

              {/* Description */}
              <p className="text-on-surface-variant font-body text-lg mb-6 leading-relaxed">
                Strategic board game where you flip opponent's pieces by trapping them.
              </p>

              {/* Japanese Description */}
              <p className="text-on-surface-variant/80 font-body text-base mb-6 leading-relaxed italic">
                相手の石を挟んでひっくり返す戦略ボードゲーム。
              </p>

              {/* Features */}
              <div className="space-y-2 mb-6 text-left">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-sm">Classic 8x8 Board</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-sm">AI Opponents</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-sm">Online Multiplayer</span>
                </div>
              </div>

              {/* Play Button */}
              <motion.div
                className="flex items-center justify-center gap-2 text-secondary font-bold text-lg"
                animate={hoveredGame === "othello" ? { x: [0, 10, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <span>Play Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </button>

            {/* Badge */}
            <div className="absolute -top-4 -right-4 bg-tertiary text-on-tertiary px-4 py-2 rounded-full font-bold text-sm shadow-lg">
              🎲 Coming Soon
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface/50 backdrop-blur-sm border-2 border-outline-variant/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-2">
                About These Games
              </h3>
              <div className="space-y-3 text-on-surface-variant">
                <p>
                  <strong className="text-primary">しりとり (Shiritori)</strong> is a classic Japanese word game perfect for learning vocabulary and having fun with friends!
                </p>
                <p>
                  <strong className="text-secondary">オセロ (Osero)</strong> is the Japanese name for Othello/Reversi. Also known as リバーシ (Ribāshi), it's a popular strategy game in Japan.
                </p>
                <p className="text-sm italic">
                  Example: オセロをしましょう。(Osero o shimashō) - "Let's play Othello."
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-on-surface-variant text-sm"
        >
          <p>Built with ❤️ for Japanese language learners</p>
          <p className="mt-2">日本語学習者のために作られました</p>
        </motion.div>
      </div>
    </div>
  );
}
