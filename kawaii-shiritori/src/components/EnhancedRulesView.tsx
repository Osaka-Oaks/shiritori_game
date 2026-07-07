import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  Star,
  ShieldAlert,
  BadgeCheck,
  Clock,
  Award,
  BookOpen,
  Target,
  Lightbulb,
  TrendingUp,
  Trophy,
  Brain,
  Zap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

type TabType = "basic" | "strategy" | "advanced" | "scoring";

export default function EnhancedRulesView() {
  const [activeTab, setActiveTab] = React.useState<TabType>("basic");

  const tabs = [
    { id: "basic" as TabType, label: "📚 Basic", color: "bg-primary" },
    { id: "strategy" as TabType, label: "🎯 Strategy", color: "bg-secondary" },
    { id: "advanced" as TabType, label: "⚡ Advanced", color: "bg-tertiary-container" },
    { id: "scoring" as TabType, label: "🏆 Scoring", color: "bg-yellow-500" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-4 pb-24 space-y-6">
      {/* Header with Hero Image */}
      <div className="relative bg-surface-container-lowest rounded-3xl border-2 border-surface-container-highest overflow-hidden shadow-lg">
        <div className="h-44 md:h-56 overflow-hidden relative">
          <img
            alt="Cherry blossoms street"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJwgPec6oOGAfeCrKKGCYllgQtMZyLyokc-U9przoTfttWlpgGUdlKdCQa8fLHX9CGg4tZNWwVCqLf67gc66SW425Lkd5bB2tH_qgo1GnX7w2SYvsOtYQ8r3e_OELxeC3utr7MXG5M7pwZ5MGTuLoahU3Jn5SB73oE4LDD9Cy1ms75Wb6wmrhuMN-Lz-XHsEp4tAzolpeUM44GcYkiF_PyMENG4gZoS1SEGcirH6SasHpQJYpIxhqh5jbB4xHuk9oRfusTaWv_OU4G"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
        </div>

        <div className="p-6 text-center space-y-3">
          <h1 className="font-headline text-4xl font-black text-on-surface">しりとり Rules</h1>
          <p className="font-body text-sm font-medium text-on-surface-variant max-w-lg mx-auto">
            Master the Japanese word-chain game from beginner to native level 🌸
          </p>

          {/* Tab Navigation */}
          <div className="flex gap-2 justify-center flex-wrap pt-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-headline font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? `${tab.color} text-white shadow-md scale-105`
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "basic" && <BasicRulesContent key="basic" />}
        {activeTab === "strategy" && <StrategyContent key="strategy" />}
        {activeTab === "advanced" && <AdvancedContent key="advanced" />}
        {activeTab === "scoring" && <ScoringContent key="scoring" />}
      </AnimatePresence>
    </div>
  );
}

// ===== BASIC RULES TAB =====
function BasicRulesContent() {
  const rules = [
    {
      title: "1. Japanese Nouns Only",
      desc: "Words must be standard Japanese nouns (hiragana/katakana). No verbs, adjectives, or particles!",
      icon: <BadgeCheck className="w-5 h-5 text-secondary" />,
      bg: "bg-secondary-container/10 border-secondary/20",
    },
    {
      title: "2. Word Chain Rule",
      desc: "Your word must start with the last sound of the previous word. Example: ねこ (neko) → こめ (kome)",
      icon: <Star className="w-5 h-5 text-tertiary-container" />,
      bg: "bg-tertiary-container/20 border-tertiary-container/30",
    },
    {
      title: "3. Never End in ん (N)",
      desc: "No Japanese words start with ん, so ending with it means INSTANT LOSS! Avoid: らいおん, みかん, ぱん",
      icon: <ShieldAlert className="w-5 h-5 text-error" />,
      bg: "bg-error-container/25 border-error/20",
    },
    {
      title: "4. No Repeating Words",
      desc: "You cannot repeat any word already used in this match. Keep track of the history!",
      icon: <Clock className="w-5 h-5 text-primary" />,
      bg: "bg-primary-container/15 border-primary/20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="font-label-caps text-xs text-primary font-bold px-1">OFFICIAL RULES</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule, idx) => (
          <motion.div
            key={idx}
            className={`p-5 rounded-2xl border-2 ${rule.bg} flex flex-col space-y-2 shadow-sm text-left`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-surface rounded-xl shadow-xs inline-flex">{rule.icon}</span>
              <h4 className="font-headline font-bold text-sm text-on-surface">{rule.title}</h4>
            </div>
            <p className="font-body text-xs text-on-surface-variant font-medium leading-relaxed">
              {rule.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Example Chain */}
      <section className="bg-surface-container rounded-2xl p-5 border border-primary/10 text-left space-y-3 shadow-md">
        <h4 className="font-headline font-bold text-base text-primary flex items-center gap-2">
          <Award className="w-5 h-5" />
          Example Word Chain
        </h4>
        <div className="flex flex-wrap items-center gap-2 font-display-game font-bold text-sm">
          <span className="px-3 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
            さくら (sakura) 🌸
          </span>
          <span className="text-primary font-body font-medium text-xs">→ ends in ら</span>
          <span className="px-3 py-2 bg-primary/10 text-primary rounded-xl shadow-xs">
            らっぱ (rappa) 🎺
          </span>
          <span className="text-secondary font-body font-medium text-xs">→ ends in ぱ</span>
          <span className="px-3 py-2 bg-secondary/10 text-secondary rounded-xl shadow-xs">
            ぱんだ (panda) 🐼
          </span>
          <CheckCircle2 className="w-5 h-5 text-secondary" />
        </div>

        <div className="flex flex-wrap items-center gap-2 font-display-game font-bold text-sm pt-2">
          <span className="px-3 py-2 bg-error/10 text-error rounded-xl border-2 border-error shadow-xs">
            みかん (mikan) 🍊
          </span>
          <AlertCircle className="w-5 h-5 text-error" />
          <span className="text-error font-body font-medium text-xs">
            FATAL! Ends in ん = Game Over
          </span>
        </div>
      </section>
    </motion.div>
  );
}

// ===== STRATEGY TAB =====
function StrategyContent() {
  const safeWords = [
    { kana: "あ", words: ["あさ (morning)", "あめ (rain)", "あき (autumn)"] },
    { kana: "い", words: ["いぬ (dog)", "いえ (house)", "いし (stone)"] },
    { kana: "う", words: ["うみ (sea)", "うた (song)", "うま (horse)"] },
    { kana: "か", words: ["かさ (umbrella)", "かめ (turtle)", "かお (face)"] },
    { kana: "さ", words: ["さかな (fish)", "さくら (cherry)", "さる (monkey)"] },
    { kana: "た", words: ["たまご (egg)", "たけ (bamboo)", "たぬき (raccoon)"] },
    { kana: "な", words: ["なつ (summer)", "なまえ (name)", "なす (eggplant)"] },
    { kana: "ま", words: ["まど (window)", "まち (town)", "まつり (festival)"] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="bg-secondary-container/20 rounded-2xl p-5 border-2 border-secondary text-left space-y-3">
        <h3 className="font-headline font-bold text-lg text-secondary flex items-center gap-2">
          <Target className="w-6 h-6" />
          Goal: Stay Alive Longer
        </h3>
        <p className="text-sm text-on-surface font-body">
          When playing with a native speaker, your first goal isn't to win—it's to{" "}
          <strong>survive longer</strong> and build vocabulary through real practice.
        </p>
      </div>

      <section className="space-y-3">
        <h4 className="font-headline font-bold text-base text-primary flex items-center gap-2">
          <Lightbulb className="w-5 h-5 fill-current" />
          Learn Safe Starter Words
        </h4>
        <p className="text-xs text-on-surface-variant font-body">
          Memorize 3-5 words for each common kana. This gives you ~150-200 words total—enough to
          compete!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {safeWords.map((group, idx) => (
            <div
              key={idx}
              className="bg-surface-container rounded-xl p-4 border border-primary/10 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="bg-primary text-on-primary rounded-full w-8 h-8 flex items-center justify-center font-display-game font-black text-lg">
                  {group.kana}
                </span>
                <h5 className="font-headline font-bold text-sm text-on-surface">
                  Starting with {group.kana}
                </h5>
              </div>
              <ul className="space-y-1 text-xs text-on-surface-variant font-body pl-1">
                {group.words.map((word, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span className="text-secondary">•</span>
                    {word}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-tertiary-container/20 rounded-2xl p-5 border border-tertiary-container/30 space-y-3">
        <h4 className="font-headline font-bold text-base text-tertiary-container flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Force Easy Sounds
        </h4>
        <p className="text-sm text-on-surface font-body">
          Try to end your words with these "safe" sounds that have many follow-up options:
        </p>
        <div className="flex flex-wrap gap-2">
          {["か", "さ", "た", "な", "は", "ま", "ら"].map(sound => (
            <span
              key={sound}
              className="bg-tertiary-container text-white rounded-lg px-3 py-1.5 font-display-game font-bold text-sm shadow-sm"
            >
              {sound}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-error-container/20 rounded-2xl p-5 border-2 border-error space-y-3">
        <h4 className="font-headline font-bold text-base text-error flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          Dangerous Endings to Avoid
        </h4>
        <div className="space-y-2 text-sm text-on-surface font-body">
          <p>
            <strong className="text-error">ん (N)</strong> - INSTANT LOSS! Never end with this.
          </p>
          <p>
            <strong>ゆ, ぢ, ぴ, ぎ</strong> - Very few follow-up words. Risky!
          </p>
          <p>
            <strong>を (wo)</strong> - Almost no words start with this.
          </p>
        </div>
      </section>
    </motion.div>
  );
}

// ===== ADVANCED TAB =====
function AdvancedContent() {
  const levels = [
    {
      level: "Level 1: Beginner",
      rules: ["Romaji allowed", "No timer", "Hints allowed", "Common nouns only"],
      icon: <Star className="w-5 h-5 text-green-500" />,
    },
    {
      level: "Level 2: Normal",
      rules: ["Hiragana/katakana only", "20-second timer", "No hints", "Nouns only"],
      icon: <Target className="w-5 h-5 text-blue-500" />,
    },
    {
      level: "Level 3: Speed Battle",
      rules: ["10-second timer", "Must say meaning", "No loanwords", "3+ kana minimum"],
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
    },
    {
      level: "Level 4: Native Challenge",
      rules: ["5-second timer", "Kanji required", "Category limits", "Final 2-kana mode"],
      icon: <Brain className="w-5 h-5 text-purple-500" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="bg-tertiary-container/20 rounded-2xl p-5 border-2 border-tertiary-container text-left">
        <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-tertiary-container" />
          Advanced Game Modes
        </h3>
        <p className="text-sm text-on-surface-variant font-body">
          As you improve, try these harder variations to challenge yourself and reach native-level
          play!
        </p>
      </div>

      <div className="space-y-4">
        {levels.map((levelData, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface-container rounded-2xl p-5 border border-outline-variant/20 shadow-sm space-y-3"
          >
            <div className="flex items-center gap-3">
              {levelData.icon}
              <h4 className="font-headline font-bold text-base text-on-surface">
                {levelData.level}
              </h4>
            </div>
            <ul className="space-y-1.5 pl-1">
              {levelData.rules.map((rule, i) => (
                <li
                  key={i}
                  className="text-sm text-on-surface-variant font-body flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <section className="bg-primary-container/10 rounded-2xl p-5 border border-primary/20 space-y-3">
        <h4 className="font-headline font-bold text-base text-primary flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Final 2-Kana Mode (Expert)
        </h4>
        <p className="text-sm text-on-surface font-body mb-3">
          Instead of matching just the last sound, match the <strong>last TWO sounds</strong>. Much
          harder!
        </p>
        <div className="bg-surface rounded-xl p-4 font-display-game space-y-2">
          <p className="text-sm text-on-surface">
            さく<strong className="text-primary text-base">ら</strong> → Next must start with{" "}
            <strong className="text-primary text-base">くら</strong>
          </p>
          <p className="text-xs text-on-surface-variant">
            Examples: <strong>くら</strong>げ (jellyfish), <strong>くら</strong>す (class)
          </p>
        </div>
      </section>
    </motion.div>
  );
}

// ===== SCORING TAB =====
function ScoringContent() {
  const scoring = [
    { action: "Valid word", points: "+50", color: "text-secondary" },
    { action: "Word with kanji", points: "+20", color: "text-secondary" },
    { action: "Answer under 5 sec", points: "+30", color: "text-secondary" },
    { action: "Rare word (4+ kana)", points: "+40", color: "text-secondary" },
    { action: "Force opponent into ん", points: "+100", color: "text-yellow-500" },
    { action: "Invalid word", points: "-50", color: "text-error" },
    { action: "Repeated word", points: "-75", color: "text-error" },
    { action: "Ends in ん", points: "LOSE", color: "text-error font-black" },
    { action: "Use hint", points: "-10", color: "text-outline" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="bg-yellow-500/20 rounded-2xl p-5 border-2 border-yellow-500 text-left">
        <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2 mb-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Point System
        </h3>
        <p className="text-sm text-on-surface-variant font-body">
          Earn points for valid words, speed, and strategy. First to 500 points or last one standing
          wins!
        </p>
      </div>

      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/20 shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/20">
              <th className="text-left py-2 font-headline font-bold text-sm text-primary">
                Action
              </th>
              <th className="text-right py-2 font-headline font-bold text-sm text-primary">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {scoring.map((item, idx) => (
              <tr key={idx} className="border-b border-outline-variant/10">
                <td className="py-3 font-body text-sm text-on-surface">{item.action}</td>
                <td className={`py-3 text-right font-headline font-bold text-sm ${item.color}`}>
                  {item.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="bg-primary-container/10 rounded-2xl p-5 border border-primary/20 space-y-3">
        <h4 className="font-headline font-bold text-base text-primary flex items-center gap-2">
          <Lightbulb className="w-5 h-5 fill-current" />
          Power-ups & Hints
        </h4>
        <div className="space-y-2 text-sm text-on-surface font-body">
          <p>
            <strong>💡 Word Hint</strong> - Get 3 suggested words (costs 10 points)
          </p>
          <p>
            <strong>🛡️ Shield</strong> - One-time protection from timer loss
          </p>
          <p>
            <strong>⏱️ Time Bonus</strong> - Answer in under 5 seconds for +30 points
          </p>
        </div>
      </section>

      <div className="bg-surface-container-highest rounded-2xl p-5 border border-outline-variant/10 text-center">
        <p className="text-xs text-on-surface-variant font-body italic">
          💡 Pro tip: Aim for consistent valid words over risky rare words. Survival {">"} style!
        </p>
      </div>
    </motion.div>
  );
}
