import React from "react";
import { dictionary } from "../lib/dictionaryHelper";
import { BookOpen, Target, Zap, Volume2, RefreshCw, CheckCircle2, XCircle, Trophy, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { speakWord } from "../utils";

type PracticeDifficulty = "beginner" | "intermediate" | "advanced";
type DrillType = "flashcard" | "chain" | "speed";

interface PracticeStats {
  correct: number;
  incorrect: number;
  streak: number;
  bestStreak: number;
}

export default function PracticeModeView() {
  const [difficulty, setDifficulty] = React.useState<PracticeDifficulty>("beginner");
  const [drillType, setDrillType] = React.useState<DrillType>("flashcard");
  const [isActive, setIsActive] = React.useState(false);
  const [currentSound, setCurrentSound] = React.useState<string>("あ");
  const [userInput, setUserInput] = React.useState("");
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; message: string } | null>(null);
  const [stats, setStats] = React.useState<PracticeStats>({ correct: 0, incorrect: 0, streak: 0, bestStreak: 0 });
  const [suggestedWords, setSuggestedWords] = React.useState<string[]>([]);
  const [timeLeft, setTimeLeft] = React.useState(30);
  const [isTimerActive, setIsTimerActive] = React.useState(false);

  const hiraganaChart = [
    { sound: "あ", romaji: "a" }, { sound: "い", romaji: "i" }, { sound: "う", romaji: "u" }, { sound: "え", romaji: "e" }, { sound: "お", romaji: "o" },
    { sound: "か", romaji: "ka" }, { sound: "き", romaji: "ki" }, { sound: "く", romaji: "ku" }, { sound: "け", romaji: "ke" }, { sound: "こ", romaji: "ko" },
    { sound: "さ", romaji: "sa" }, { sound: "し", romaji: "shi" }, { sound: "す", romaji: "su" }, { sound: "せ", romaji: "se" }, { sound: "そ", romaji: "so" },
    { sound: "た", romaji: "ta" }, { sound: "ち", romaji: "chi" }, { sound: "つ", romaji: "tsu" }, { sound: "て", romaji: "te" }, { sound: "と", romaji: "to" },
    { sound: "な", romaji: "na" }, { sound: "に", romaji: "ni" }, { sound: "ぬ", romaji: "nu" }, { sound: "ね", romaji: "ne" }, { sound: "の", romaji: "no" },
    { sound: "は", romaji: "ha" }, { sound: "ひ", romaji: "hi" }, { sound: "ふ", romaji: "fu" }, { sound: "へ", romaji: "he" }, { sound: "ほ", romaji: "ho" },
    { sound: "ま", romaji: "ma" }, { sound: "み", romaji: "mi" }, { sound: "む", romaji: "mu" }, { sound: "め", romaji: "me" }, { sound: "も", romaji: "mo" },
    { sound: "や", romaji: "ya" }, { sound: "ゆ", romaji: "yu" }, { sound: "よ", romaji: "yo" },
    { sound: "ら", romaji: "ra" }, { sound: "り", romaji: "ri" }, { sound: "る", romaji: "ru" }, { sound: "れ", romaji: "re" }, { sound: "ろ", romaji: "ro" },
    { sound: "わ", romaji: "wa" }
  ];

  React.useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTimerActive) {
      handleTimeout();
    }
  }, [isTimerActive, timeLeft]);

  const handleStartPractice = () => {
    setIsActive(true);
    setStats({ correct: 0, incorrect: 0, streak: 0, bestStreak: 0 });
    setFeedback(null);
    generateNewChallenge();
    
    if (drillType === "speed") {
      setIsTimerActive(true);
      setTimeLeft(30);
    }
  };

  const generateNewChallenge = () => {
    const randomIndex = Math.floor(Math.random() * hiraganaChart.length);
    const sound = hiraganaChart[randomIndex].sound;
    setCurrentSound(sound);
    
    const words = dictionary.getWordsByStartSound(sound);
    const suggested = words.slice(0, 5).map(w => `${w.word} (${w.translation})`);
    setSuggestedWords(suggested);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = userInput.trim();
    if (!trimmed) return;

    const foundWord = dictionary.findWord(trimmed);
    
    if (foundWord && foundWord.startSound === currentSound) {
      if (dictionary.endsInN(foundWord.word)) {
        setFeedback({ type: "error", message: `⚠️ "${foundWord.word}" ends in ん! This would lose the game!` });
        updateStats(false);
      } else {
        setFeedback({ type: "success", message: `✨ Perfect! "${foundWord.kanji || foundWord.word}" (${foundWord.translation})` });
        speakWord(foundWord.word);
        updateStats(true);
      }
    } else if (foundWord) {
      setFeedback({ type: "error", message: `❌ Wrong starting sound! "${foundWord.word}" starts with "${foundWord.startSound}", need "${currentSound}"` });
      updateStats(false);
    } else {
      setFeedback({ type: "error", message: `❌ Word not found in dictionary. Try another word!` });
      updateStats(false);
    }

    setUserInput("");
    setTimeout(() => {
      setFeedback(null);
      if (drillType !== "speed") {
        generateNewChallenge();
      }
    }, 2000);
  };

  const updateStats = (correct: boolean) => {
    setStats(prev => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: correct ? prev.incorrect : prev.incorrect + 1,
      streak: correct ? prev.streak + 1 : 0,
      bestStreak: correct ? Math.max(prev.bestStreak, prev.streak + 1) : prev.bestStreak
    }));
  };

  const handleTimeout = () => {
    setIsTimerActive(false);
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsTimerActive(false);
    setUserInput("");
    setFeedback(null);
    setTimeLeft(30);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      
      <header className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Target className="w-8 h-8 text-primary" />
          <h1 className="font-headline font-black text-3xl text-primary">Practice Mode</h1>
        </div>
        <p className="text-sm text-on-surface-variant font-body">
          Train your vocabulary before playing with native speakers!
        </p>
      </header>

      {!isActive ? (
        <div className="space-y-6">
          <section className="bg-surface-container rounded-3xl p-6 border-2 border-primary/20 shadow-md space-y-4">
            <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
              <Zap className="w-5 h-5 text-tertiary-container fill-current" />
              Choose Your Drill
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setDrillType("flashcard")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  drillType === "flashcard"
                    ? "border-primary bg-primary/10"
                    : "border-outline-variant/20 bg-surface hover:border-primary/40"
                }`}
              >
                <BookOpen className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-headline font-bold text-sm">Flashcard Mode</h3>
                <p className="text-xs text-on-surface-variant mt-1">Learn words for each hiragana</p>
              </button>

              <button
                onClick={() => setDrillType("chain")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  drillType === "chain"
                    ? "border-primary bg-primary/10"
                    : "border-outline-variant/20 bg-surface hover:border-primary/40"
                }`}
              >
                <Target className="w-6 h-6 text-secondary mb-2" />
                <h3 className="font-headline font-bold text-sm">Chain Practice</h3>
                <p className="text-xs text-on-surface-variant mt-1">Practice continuous chains</p>
              </button>

              <button
                onClick={() => setDrillType("speed")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  drillType === "speed"
                    ? "border-primary bg-primary/10"
                    : "border-outline-variant/20 bg-surface hover:border-primary/40"
                }`}
              >
                <Zap className="w-6 h-6 text-tertiary-container fill-current mb-2" />
                <h3 className="font-headline font-bold text-sm">Speed Challenge</h3>
                <p className="text-xs text-on-surface-variant mt-1">30 seconds rapid fire</p>
              </button>
            </div>
          </section>

          <section className="bg-surface-container rounded-3xl p-6 border-2 border-outline-variant/20 shadow-sm space-y-3">
            <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-tertiary-container fill-current" />
              Strategy Tips
            </h2>
            <ul className="space-y-2 text-sm text-on-surface-variant font-body">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Learn 5 words for each hiragana character (~230 words total)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Avoid words ending in ん (n) - instant game over!</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Force easy sounds: か, さ, た, な, は, ま</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Focus on common categories: animals, food, places</span>
              </li>
            </ul>
          </section>

          <button
            onClick={handleStartPractice}
            className="w-full bg-primary text-on-primary font-headline font-black text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="w-6 h-6" />
            Start Practice Session
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-surface-container rounded-2xl p-3 text-center border border-outline-variant/10">
              <span className="text-xs text-on-surface-variant font-label-caps block">CORRECT</span>
              <span className="text-2xl font-headline font-bold text-secondary">{stats.correct}</span>
            </div>
            <div className="bg-surface-container rounded-2xl p-3 text-center border border-outline-variant/10">
              <span className="text-xs text-on-surface-variant font-label-caps block">WRONG</span>
              <span className="text-2xl font-headline font-bold text-error">{stats.incorrect}</span>
            </div>
            <div className="bg-surface-container rounded-2xl p-3 text-center border border-outline-variant/10">
              <span className="text-xs text-on-surface-variant font-label-caps block">STREAK</span>
              <span className="text-2xl font-headline font-bold text-primary">{stats.streak}</span>
            </div>
            <div className="bg-surface-container rounded-2xl p-3 text-center border border-outline-variant/10">
              <span className="text-xs text-on-surface-variant font-label-caps block">BEST</span>
              <span className="text-2xl font-headline font-bold text-tertiary-container">{stats.bestStreak}</span>
            </div>
          </div>

          {drillType === "speed" && (
            <div className="bg-error-container/20 border-2 border-error rounded-2xl p-4 text-center">
              <span className="text-sm font-label-caps text-error">TIME REMAINING</span>
              <div className="text-4xl font-headline font-black text-error mt-1">{timeLeft}s</div>
            </div>
          )}

          <div className="bg-surface-container-highest rounded-3xl p-8 text-center border-4 border-primary shadow-lg">
            <p className="text-sm font-label-caps text-on-surface-variant mb-2">FIND A WORD STARTING WITH:</p>
            <div className="bg-primary text-on-primary rounded-full w-24 h-24 mx-auto flex items-center justify-center font-display-game font-black text-5xl mb-2 shadow-xl">
              {currentSound}
            </div>
            <p className="text-xs text-outline font-body">
              ({hiraganaChart.find(h => h.sound === currentSound)?.romaji})
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter word in hiragana or romaji..."
              className="w-full bg-surface border-2 border-primary rounded-xl py-4 px-6 text-on-surface font-body font-bold placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
              autoFocus
            />
            <button
              type="submit"
              disabled={!userInput.trim()}
              className="w-full bg-secondary text-on-secondary font-headline font-bold py-3 px-6 rounded-xl shadow-md hover:bg-opacity-90 disabled:opacity-50 transition-all"
            >
              Check Answer
            </button>
          </form>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
                  feedback.type === "success"
                    ? "bg-secondary-container/20 border-secondary"
                    : "bg-error-container/20 border-error"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-error flex-shrink-0" />
                )}
                <p className={`text-sm font-body font-bold ${
                  feedback.type === "success" ? "text-secondary" : "text-error"
                }`}>
                  {feedback.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-surface-container rounded-2xl p-4 border border-primary/10">
            <p className="text-xs font-label-caps text-primary font-bold mb-2 flex items-center gap-1">
              <Lightbulb className="w-4 h-4 fill-current" />
              EXAMPLE WORDS FOR {currentSound}:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedWords.length > 0 ? (
                suggestedWords.map((word, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-surface px-3 py-1.5 rounded-full border border-outline-variant/20 text-on-surface-variant font-body"
                  >
                    {word}
                  </span>
                ))
              ) : (
                <span className="text-xs text-outline italic">No example words available</span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setFeedback(null);
                generateNewChallenge();
              }}
              className="flex-1 bg-surface border-2 border-outline-variant/20 text-on-surface font-body font-bold py-3 px-4 rounded-xl hover:border-primary/40 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Skip
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-error text-on-error font-body font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all"
            >
              End Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
