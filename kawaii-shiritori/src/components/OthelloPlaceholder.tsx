import React from "react";
import { motion } from "motion/react";
import { CircleDot, ArrowLeft, Hammer, Zap, Users, Brain } from "lucide-react";

interface OthelloPlaceholderProps {
  onBack: () => void;
}

export default function OthelloPlaceholder({ onBack }: OthelloPlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-surface to-tertiary/10 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-body"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Game Selection</span>
        </motion.button>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border-4 border-secondary rounded-3xl p-12 text-center"
        >
          {/* Animated Icon */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex justify-center mb-8"
          >
            <div className="bg-secondary/10 p-8 rounded-full">
              <CircleDot className="w-24 h-24 text-secondary" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-display-game font-black text-on-surface mb-4">
            オセロ
          </h1>
          <h2 className="text-3xl md:text-4xl text-secondary font-body font-bold mb-8">
            Osero (Othello)
          </h2>

          {/* Coming Soon Badge */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block bg-tertiary text-on-tertiary px-8 py-3 rounded-full font-bold text-xl mb-8"
          >
            🚧 Coming Soon 🚧
          </motion.div>

          {/* Description */}
          <p className="text-xl text-on-surface-variant font-body leading-relaxed mb-8 max-w-2xl mx-auto">
            We're building an amazing Othello game experience! Play against AI opponents, challenge friends online, and master the art of strategy.
          </p>

          <p className="text-lg text-on-surface-variant/80 font-body leading-relaxed mb-12 max-w-2xl mx-auto italic">
            素晴らしいオセロゲーム体験を構築中です！AIと対戦したり、友達とオンラインで挑戦したり、戦略の技術をマスターしましょう。
          </p>

          {/* Planned Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
              <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-on-surface mb-2">Smart AI</h3>
              <p className="text-sm text-on-surface-variant">
                Multiple difficulty levels with strategic AI opponents
              </p>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
              <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-on-surface mb-2">Multiplayer</h3>
              <p className="text-sm text-on-surface-variant">
                Play with friends online in real-time matches
              </p>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
              <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-on-surface mb-2">Fast & Smooth</h3>
              <p className="text-sm text-on-surface-variant">
                Beautiful animations and instant move validation
              </p>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
              <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hammer className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-on-surface mb-2">Tutorial Mode</h3>
              <p className="text-sm text-on-surface-variant">
                Learn strategies with interactive tutorials
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-on-surface font-body mb-4">
              Want to play now? Try <strong className="text-primary">しりとり (Shiritori)</strong> while we finish Othello!
            </p>
            <button
              onClick={onBack}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Play Shiritori Instead
            </button>
          </div>
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center bg-surface/50 backdrop-blur-sm border border-outline-variant/20 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-on-surface mb-3">
            🎲 Did You Know? / 知っていましたか？
          </h3>
          <p className="text-on-surface-variant leading-relaxed">
            Othello was invented in Japan in 1973 and named after Shakespeare's play. 
            The Japanese name is <strong>オセロ (Osero)</strong>, but you might also hear 
            <strong> リバーシ (Ribāshi)</strong> for the more generic Reversi game.
          </p>
          <p className="text-on-surface-variant/80 mt-3 italic text-sm">
            Example: <strong>オセロをしましょう。</strong> (Osero o shimashō) - "Let's play Othello."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
