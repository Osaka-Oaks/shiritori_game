import React from "react";
import { PlayerProfile, OpponentBot, PlayedWord, MatchHistory, WordHint } from "../types";
import { convertRomajiToHiragana, speakWord } from "../utils";
import { motion, AnimatePresence } from "motion/react";
import { Home, Lightbulb, Shield, ShieldCheck, ArrowRight, Zap, RefreshCw, X, AlertOctagon, Volume2, Trophy, Loader2 } from "lucide-react";

interface GameRoomProps {
  playerProfile: PlayerProfile;
  selectedBot: OpponentBot;
  onGameFinished: (matches: MatchHistory) => void;
  onExit: () => void;
}

export default function GameRoomView({
  playerProfile,
  selectedBot,
  onGameFinished,
  onExit
}: GameRoomProps) {
  // --- STATE REGISTRY ---
  const [playedWords, setPlayedWords] = React.useState<PlayedWord[]>([
    {
      word: "Ringo",
      translation: "Apple",
      kanji: "林檎",
      hiragana: "りんご",
      katakana: "リンゴ",
      romaji: "ringo",
      startSound: "り",
      endSound: "ご",
      speaker: "opponent"
    }
  ]);

  const [playerScore, setPlayerScore] = React.useState(0);
  const [opponentScore, setOpponentScore] = React.useState(0);
  
  const [currentTurn, setCurrentTurn] = React.useState<"player" | "opponent">("player");
  const [playerInput, setPlayerInput] = React.useState("");
  
  // Powerup state variables
  const [hints, setHints] = React.useState<WordHint[]>([]);
  const [loadingHints, setLoadingHints] = React.useState(false);
  const [showPowerupMenu, setShowPowerupMenu] = React.useState(false);
  const [hasShieldGuard, setHasShieldGuard] = React.useState(true);
  const [shieldActive, setShieldActive] = React.useState(false);
  const [hintCount, setHintCount] = React.useState(3);

  // Timer settings
  const INITIAL_TIME_S = selectedBot.difficulty === "easy" ? 40 : selectedBot.difficulty === "medium" ? 25 : 15;
  const [timeLeft, setTimeLeft] = React.useState(INITIAL_TIME_S);
  
  // Transitional Overlay popups
  const [evaluatingWord, setEvaluatingWord] = React.useState(false);
  const [successState, setSuccessState] = React.useState<{ show: boolean; points: number; word: string } | null>(null);
  const [oopsState, setOopsState] = React.useState<{ show: boolean; msg: string; word: string } | null>(null);
  const [gameOverState, setGameOverState] = React.useState<{ show: boolean; winnerName: string; winnerAvatar: string } | null>(null);

  // Bot Speech Bubble Dialog text
  const [botChat, setBotChat] = React.useState(`Hello, ${playerProfile.name}! I played standard word "Ringo" (りんご). Match the final sound "go" (ご)!`);

  // --- SCIENTIFIC TIMING CHRONO ---
  React.useEffect(() => {
    if (gameOverState?.show || successState?.show || oopsState?.show) return;

    if (timeLeft <= 0) {
      if (currentTurn === "player") {
        if (hasShieldGuard) {
          // auto trigger shield protect!
          setHasShieldGuard(false);
          setShieldActive(true);
          setTimeLeft(INITIAL_TIME_S);
          setBotChat("Woof/Meow! My shield trigger activated to restore your turn timer. Quick thinking!");
          return;
        }
        triggerGameOver("opponent");
      } else {
        // opponent timer out (unlikely but healthy)
        triggerGameOver("player");
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentTurn, hasShieldGuard, successState, oopsState, gameOverState]);

  // Translate text in client preview romaji -> hiragana
  const inputHiraganaPreview = React.useMemo(() => {
    return convertRomajiToHiragana(playerInput);
  }, [playerInput]);

  // Get requested sound syllable
  const requiredLetter = React.useMemo(() => {
    const lastWord = playedWords[playedWords.length - 1];
    return lastWord ? lastWord.endSound : "り";
  }, [playedWords]);

  // --- BOT RESPONSE GENERATION ENGINE ---
  const handleBotTurn = async (currentHistory: PlayedWord[]) => {
    setCurrentTurn("opponent");
    setTimeLeft(INITIAL_TIME_S);
    
    // Find matching syllable for opponent
    const lastWord = currentHistory[currentHistory.length - 1];
    const syllable = lastWord ? lastWord.endSound : "り";
    
    try {
      const response = await fetch("/api/gemini/opponent-turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastSound: syllable,
          difficulty: selectedBot.difficulty,
          playedWords: currentHistory.map(w => w.word)
        })
      });

      if (!response.ok) throw new Error("Bot turn API error");
      const botPlay = await response.json();

      // Check if bot played a fatal word ending in ん (fatal self loss)
      const isFatal = botPlay.endSound === "ん" || botPlay.word.toLowerCase().endsWith("n");

      setTimeout(() => {
        setPlayedWords(prev => [...prev, {
          word: botPlay.word,
          translation: botPlay.translation,
          kanji: botPlay.kanji || "",
          hiragana: botPlay.hiragana || botPlay.word,
          katakana: botPlay.katakana || "",
          romaji: botPlay.romaji || botPlay.word,
          startSound: botPlay.startSound || syllable,
          endSound: botPlay.endSound || "ご",
          speaker: "opponent"
        }]);

        setBotChat(botPlay.reason || `Played word "${botPlay.word}". Match spelling "${botPlay.endSound}"!`);
        speakWord(botPlay.hiragana || botPlay.word);

        if (isFatal) {
          setBotChat(`Oops... I played "${botPlay.word}" which ends in ん/N. I made a fatal mistake and lost!`);
          setTimeout(() => triggerGameOver("player"), 1800);
        } else {
          setOpponentScore(prev => prev + 40);
          setCurrentTurn("player");
          setTimeLeft(INITIAL_TIME_S);
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      setCurrentTurn("player");
    }
  };

  // --- SUBMIT USER WORD ACTION ---
  const handleWordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (evaluatingWord || successState?.show || oopsState?.show) return;

    const trimmedInput = playerInput.trim();
    if (!trimmedInput) return;

    setEvaluatingWord(true);
    // Convert current user romaji to hiragana before passing to Geminis
    const finalWordToCheck = convertRomajiToHiragana(trimmedInput) || trimmedInput;

    try {
      // 1. Check duplicates locally in history to prevent API redundant counts
      const lower = finalWordToCheck.toLowerCase();
      const duplicate = playedWords.some(w => 
        w.word.toLowerCase() === lower || 
        w.hiragana === lower || 
        w.kanji === lower ||
        w.romaji.toLowerCase() === lower
      );

      if (duplicate) {
        setEvaluatingWord(false);
        triggerOopsModal(`You cannot repeat a word! "${finalWordToCheck}" has already been used in this match.`, finalWordToCheck);
        return;
      }

      // 2. Query evaluate API
      const response = await fetch("/api/gemini/evaluate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: finalWordToCheck })
      });

      if (!response.ok) throw new Error("Evaluation failed");
      const checkResult = await response.json();

      setEvaluatingWord(false);

      if (!checkResult.isValid) {
        triggerOopsModal(checkResult.reason || "This is not a recognized Japanese noun suited for Shiritori.", finalWordToCheck);
        return;
      }

      // 3. Chain matching syllable check
      // Syllable check (Hiragana match)
      const correctStart = checkResult.startSound === requiredLetter || 
                           checkResult.startSound.startsWith(requiredLetter) || 
                           requiredLetter.startsWith(checkResult.startSound);

      if (!correctStart) {
        triggerOopsModal(`Phonetic chain breach! Your word starts with "${checkResult.startSound}" but MUST start with last sound "${requiredLetter}".`, finalWordToCheck);
        return;
      }

      // 4. Ends in ん Check (direct loss condition)
      if (checkResult.endsInN) {
        triggerOopsModal(`FATAL ERROR! Your word "${finalWordToCheck}" ends in "ん" / "N". The rules say this causes a direct GAME OVER!`, finalWordToCheck);
        setTimeout(() => {
          setOopsState(null);
          triggerGameOver("opponent");
        }, 3200);
        return;
      }

      // --- ALL VALID: TRIGGER SUCCESS OVERLAY ---
      const pointsScored = 50 + (finalWordToCheck.length * 10);
      setSuccessState({ show: true, points: pointsScored, word: checkResult.kanji || finalWordToCheck });
      speakWord(checkResult.hiragana || finalWordToCheck);
      
      const newSavedWord: PlayedWord = {
        word: checkResult.word,
        translation: checkResult.translation,
        kanji: checkResult.kanji || "",
        hiragana: checkResult.hiragana || finalWordToCheck,
        katakana: checkResult.katakana || "",
        romaji: checkResult.romaji || trimmedInput,
        startSound: checkResult.startSound || requiredLetter,
        endSound: checkResult.endSound,
        speaker: "player"
      };

      const updatedHistory = [...playedWords, newSavedWord];
      setPlayedWords(updatedHistory);
      setPlayerScore(prev => prev + pointsScored);
      
      // Clear input
      setPlayerInput("");
      setHints([]);

      // Automatically transition after success animation overlay
      setTimeout(() => {
        setSuccessState(null);
        handleBotTurn(updatedHistory);
      }, 1600);

    } catch (err) {
      setEvaluatingWord(false);
      triggerOopsModal("Oops! API error evaluating word. Let's assume it was valid!", finalWordToCheck);
    }
  };

  const triggerOopsModal = (msg: string, badWord: string) => {
    setOopsState({ show: true, msg, word: badWord });
  };

  // --- POWERUPS MENU ACTIONS ---
  const handleRequestHint = async () => {
    if (hintCount <= 0 || loadingHints) return;
    setLoadingHints(true);
    setHints([]);

    try {
      const response = await fetch("/api/gemini/word-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastSound: requiredLetter })
      });

      if (!response.ok) throw new Error("Hints fetch failing");
      const resultData = await response.json();
      setHints(resultData.hints || []);
      setHintCount(prev => prev - 1);
    } catch (err) {
      // Offline direct mock population
      setHints([
        { word: `${requiredLetter}ko`, translation: "Quick hint word", hiragana: `${requiredLetter}こ`, romaji: `${requiredLetter}ko` }
      ]);
    } finally {
      setLoadingHints(false);
    }
  };

  // --- GAME OVER SUMMARY RECORDER ---
  const triggerGameOver = (winner: "player" | "opponent") => {
    const isPlayerWin = winner === "player";
    const winnerName = isPlayerWin ? playerProfile.name : selectedBot.name;
    const winnerAvatar = isPlayerWin ? playerProfile.avatarUrl : selectedBot.avatarUrl;

    setGameOverState({ show: true, winnerName, winnerAvatar });

    // Submit log payload record to parent MatchHistory list
    const finalReport: MatchHistory = {
      id: Math.random().toString(),
      opponentName: selectedBot.name,
      opponentAvatar: selectedBot.avatarUrl,
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      playerScore,
      opponentScore,
      chainLength: playedWords.length,
      fatalWord: playedWords[playedWords.length - 1]?.word || "Ringo",
      didWin: isPlayerWin
    };

    onGameFinished(finalReport);
  };

  // Reset local state to Play Again
  const handleRestartDuel = () => {
    setPlayedWords([
      {
        word: "Ringo",
        translation: "Apple",
        kanji: "林檎",
        hiragana: "りんご",
        katakana: "リンゴ",
        romaji: "ringo",
        startSound: "り",
        endSound: "ご",
        speaker: "opponent"
      }
    ]);
    setPlayerScore(0);
    setOpponentScore(0);
    setCurrentTurn("player");
    setPlayerInput("");
    setHints([]);
    setShowPowerupMenu(false);
    setHasShieldGuard(true);
    setShieldActive(false);
    setTimeLeft(INITIAL_TIME_S);
    setSuccessState(null);
    setOopsState(null);
    setGameOverState(null);
    setBotChat(`New game battle launched! Connect current word "Ringo". Play sound syllable "go" (ご)!`);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col min-h-[82vh] relative bg-background select-none pb-24 overflow-hidden pt-2 px-1">
      
      {/* Top turn timer horizontal indicator */}
      <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden shadow-inner absolute top-0 left-0 right-0 z-10">
        <motion.div
          className={`h-full ${timeLeft < 6 ? "bg-error" : currentTurn === "player" ? "bg-primary" : "bg-secondary"}`}
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / INITIAL_TIME_S) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>

      {/* MATCH PLAYERS SCOREBOARD HEADERS HUD */}
      <header className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-3xl border-2 border-surface-container-highest shadow-sm mt-3.5 mx-3 z-10">
        {/* User Card */}
        <div className="flex items-center gap-2.5 text-left">
          <div className="relative">
            <img
              alt={playerProfile.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shadow-xs"
              src={playerProfile.avatarUrl}
            />
            {currentTurn === "player" && (
              <span className="absolute -inset-1 border-2 border-primary rounded-full animate-ping pointer-events-none" />
            )}
          </div>
          <div>
            <h4 className="font-headline font-bold text-xs text-on-surface flex items-center gap-1 max-w-[90px] truncate">
              {playerProfile.name}
            </h4>
            <div className="text-sm font-black text-primary font-headline">{playerScore} pts</div>
          </div>
        </div>

        {/* Dynamic center Turn Tag */}
        <div className="text-center">
          <span className={`text-[10px] font-label-caps font-bold px-3 py-1 rounded-full ${
            currentTurn === 'player' ? 'bg-primary-container/20 text-primary' : 'bg-secondary-container/20 text-on-secondary-container'
          }`}>
            {currentTurn === "player" ? "Your Turn" : "Bot's Turn"}
          </span>
          <p className="text-[10px] font-bold text-outline-variant mt-1">⏳ {timeLeft}sLeft</p>
        </div>

        {/* AI Bot Opponent Custom Card */}
        <div className="flex items-center gap-2.5 text-right flex-row-reverse">
          <div className="relative">
            <img
              alt={selectedBot.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border-2 border-secondary/20 shadow-xs"
              src={selectedBot.avatarUrl}
            />
            {currentTurn === "opponent" && (
              <span className="absolute -inset-1 border-2 border-secondary rounded-full animate-ping pointer-events-none" />
            )}
          </div>
          <div>
            <h4 className="font-headline font-bold text-xs text-on-surface max-w-[90px] truncate">{selectedBot.name}</h4>
            <div className="text-sm font-black text-secondary font-headline">{opponentScore} pts</div>
          </div>
        </div>
      </header>

      {/* MASCOT CHAT BUBBLE BOX REACTION */}
      <div className="flex gap-3 items-center p-4 mx-3 mt-3 bg-surface-container rounded-2xl border border-primary/5 shadow-xs">
        <img
          alt="bot avatar thumb"
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover border"
          src={selectedBot.avatarUrl}
        />
        <div className="kawaii-bubble bg-surface text-on-surface-variant font-body text-xs py-2 px-3.5 border-2 border-outline-variant/10 text-left relative flex-grow">
          {botChat}
          {/* cute caret */}
          <div className="absolute left-[-6px] top-4 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-surface" />
        </div>
      </div>

      {/* BOARD WORKSPACE: SCROLLABLE FEED OF WORD CARDS WIRED BY DOT LINES */}
      <main className="flex-grow flex flex-col justify-end p-4 h-[350px] overflow-y-auto no-scrollbar relative my-2 min-h-[300px]">
        {/* Connection dotted background line indicator */}
        <div className="absolute left-[33px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-primary-container/40 z-0" />

        <div className="space-y-4 z-10 w-full">
          {playedWords.map((wordObj, index) => {
            const isBot = wordObj.speaker === "opponent";
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isBot ? -40 : 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className={`flex gap-3 items-start ${isBot ? 'flex-row' : 'flex-row'}`} // Align everything in uniform easy-read flow
              >
                {/* Round badge indicator with letters */}
                <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-display-game font-bold text-xs shadow-md border-2 border-white flex-shrink-0 ${
                  isBot ? 'bg-secondary' : 'bg-primary'
                }`}>
                  {wordObj.startSound}
                </div>

                {/* Main bubble details card info */}
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-3 flex-grow text-left shadow-xs hover:border-primary/20 transition-all flex justify-between items-center group">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-display-game font-black text-base text-on-surface">
                        {wordObj.kanji || wordObj.word}
                      </h5>
                      <span className="text-[10px] bg-surface-container-low text-on-surface-variant px-1.5 py-0.5 rounded font-display-game">
                        {wordObj.romaji}
                      </span>
                    </div>

                    <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                      Hiragana: <strong className="font-bold text-primary">{wordObj.hiragana}</strong> • {wordObj.translation}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => speakWord(wordObj.hiragana || wordObj.word)}
                      className="p-1 text-outline hover:text-primary hover:bg-primary/5 rounded transition-colors cursor-pointer"
                      title="Speak"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {/* Syllable connector marker info */}
                    <div className={`px-2 py-0.5 rounded font-display-game text-[10px] text-white font-bold inline-block mr-1 ${isBot ? 'bg-secondary' : 'bg-primary'}`}>
                      {wordObj.endSound}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* REQUIRED SYLLABLE BANNER BANNER HELP */}
      <section className="bg-primary-container/10 px-4 py-2 text-center text-xs font-headline font-bold text-on-primary-container border-y border-primary-container/20 flex items-center justify-between">
        <span className="flex items-center gap-1.5 select-none text-primary">
          <Zap className="w-4 h-4 text-tertiary-container fill-current" />
          Connect the syllable:
        </span>
        <span className="text-sm font-black bg-primary text-on-primary rounded-full px-4 py-1 animate-pulse border-2 border-primary-container font-headline">
          {requiredLetter} ({requiredLetter.toUpperCase()})
        </span>
      </section>

      {/* CONTROLS INPUT BOARD PANEL (BOTTOM STICKY) */}
      <footer className="p-3 bg-surface-container-low border-t border-surface-container-highest z-20 flex flex-col gap-2 relative">
        <form onSubmit={handleWordSubmit} className="flex gap-2 items-center">
          
          {/* Leftside Bolt powerups trigger button */}
          <button
            type="button"
            onClick={() => setShowPowerupMenu(prev => !prev)}
            className={`p-3 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
              showPowerupMenu ? 'bg-primary border-primary text-on-primary' : 'bg-surface border-primary/20 text-primary hover:bg-primary/5 shadow-xs'
            }`}
          >
            <Zap className={`w-5 h-5 fill-current ${showPowerupMenu ? 'animate-bounce' : ''}`} />
          </button>

          {/* Core Word Input field */}
          <div className="relative flex-grow">
            <input
              type="text"
              id="game-word-input"
              disabled={currentTurn === "opponent" || evaluatingWord}
              className="w-full bg-surface border-2 border-primary rounded-none py-3 px-6 pr-12 text-on-surface font-body font-bold placeholder:text-white/30 focus:outline-none focus:border-white focus:ring-2 focus:ring-primary/20 transition-all shadow-[4px_4px_0px_0px_#f27d26] disabled:opacity-50"
              placeholder={currentTurn === "opponent" ? "Waiting for Bot..." : `Enter word...`}
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value.replace(/[^a-zA-Zあ-んア-ン]/g, ""))}
            />
            
            <button
              type="submit"
              disabled={!playerInput.trim() || currentTurn === "opponent" || evaluatingWord}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary rounded-none p-2 hover:bg-opacity-90 disabled:opacity-50 transition-colors cursor-pointer border border-white"
            >
              {evaluatingWord ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {/* Converted real-time preview helper tooltip */}
        {playerInput && (
          <div className="text-center font-display-game font-bold text-xs bg-primary/10 text-primary py-1 px-4 rounded-full mx-auto max-w-xs animate-fade-in select-none">
            Preview Conversion: <span className="underline font-extrabold">{inputHiraganaPreview}</span>
          </div>
        )}

        {/* --- POWERUPS OVERLAY DROPDOWN DRAWER --- */}
        <AnimatePresence>
          {showPowerupMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-surface border border-outline-variant/30 rounded-2xl overflow-hidden shadow-inner p-3 text-left space-y-3"
            >
              <div className="flex items-center justify-between border-b pb-1">
                <span className="text-[10px] font-label-caps text-primary font-bold flex items-center gap-1 select-none">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  AVAILABLE SKILL BOOSTS
                </span>
                <span className="text-[9px] font-body text-outline font-medium">Free during event match</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* 1. Request Word Hint */}
                <button
                  type="button"
                  onClick={handleRequestHint}
                  disabled={hintCount <= 0 || loadingHints}
                  className="p-2.5 bg-surface-container border border-outline-variant/20 hover:border-primary hover:bg-primary/5 rounded-xl transition-all flex items-center gap-2 select-none cursor-pointer disabled:opacity-50 text-left"
                >
                  <Lightbulb className="w-4 h-4 text-tertiary-container fill-current" />
                  <div>
                    <h6 className="font-headline font-bold text-xs text-on-surface">Gemini Hint</h6>
                    <p className="text-[9px] text-outline mt-0.5">3 solutions ({hintCount} Left)</p>
                  </div>
                </button>

                {/* 2. Point Shield Protect */}
                <button
                  type="button"
                  disabled={!hasShieldGuard}
                  onClick={() => {
                    setHasShieldGuard(false);
                    setShieldActive(true);
                    setTimeLeft(prev => prev + 25);
                    setBotChat("Active shield safety! Restoring turn game clock with 25 additional seconds!");
                    setShowPowerupMenu(false);
                  }}
                  className="p-2.5 bg-surface-container border border-outline-variant/20 rounded-xl flex items-center gap-2 select-none disabled:opacity-30 text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                  <div>
                    <h6 className="font-headline font-bold text-xs text-on-surface">Time Shield</h6>
                    <p className="text-[9px] text-outline mt-0.5">{hasShieldGuard ? "Available (One-Shot)" : "Used up"}</p>
                  </div>
                </button>
              </div>

              {/* Rendering of hints generated results */}
              {loadingHints && (
                <div className="flex items-center gap-2 text-xs text-outline justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>AI Professor is looking up valid word combinations...</span>
                </div>
              )}

              {hints.length > 0 && (
                <div className="bg-surface rounded-xl p-2.5 border border-primary/10 space-y-1.5 text-xs text-left shadow-xs">
                  <p className="font-label-caps text-[9px] text-primary font-bold">GEMINI SUGGESTED WORDS:</p>
                  <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                    {hints.map((hint, hi) => (
                      <button
                        key={hi}
                        type="button"
                        onClick={() => {
                          setPlayerInput(hint.romaji || hint.word);
                          setShowPowerupMenu(false);
                        }}
                        className="p-2 bg-surface-container-low hover:bg-primary/5 border border-primary/10 rounded-lg text-center cursor-pointer transition-colors"
                      >
                        <span className="font-display-game font-bold text-on-surface block truncate">{hint.word}</span>
                        <span className="text-[9px] text-primary block truncate font-medium">{hint.translation}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </footer>

      {/* --- SUCCESS OVERLAY CARD POPUP ("SUGOI!") --- */}
      <AnimatePresence>
        {successState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94 }}
              className="bg-surface-container-lowest border-4 border-yellow-400 rounded-3xl p-6 text-center max-w-xs w-full shadow-xl space-y-4"
            >
              <div className="w-24 h-24 mx-auto block rounded-full overflow-hidden border-2 bg-slate-100 shadow">
                <img
                  alt="SUGOI CAT"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDuKva3Ae4Mdx_1okP6_ZLRerZXxvd-AjbqdUFthtF4ohqCI7t2K-UrHVh-2aTWROAho5wPA9sSDg8QFu1abQ6N8LSPmv9d5XQEx87YDQb7DqQlNrJPDkKXSpjdCaHdl0wM1WzEF_9NvJlhPF4BiLm_9_wTH9n3uDXSqVWnE-Us64hmzyRw9AWBSPZNF1Sg5Mw1dblfwImLyCWdToV20RGJbgEJc0Rnfx0a4UCk9cSKzllL4wqzKMEUr6Ea8V3NOzRfFgXMCutEuUv"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-headline font-black text-2xl tracking-tight text-yellow-600 animate-bounce">
                  SUGOI! すごい
                </h3>
                <p className="text-xl font-black text-primary font-headline">+{successState.points} points scored!</p>
                <p className="text-xs font-body text-on-surface-variant font-medium">
                  Valid Japanese word: <strong className="font-extrabold text-on-surface font-display-game">{successState.word}</strong> Accepted!
                </p>
              </div>

              <div className="text-[10px] bg-slate-100 text-outline px-4 py-1.5 rounded-full font-body">
                Passing Turn to AI Opponent...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- INVALID OOPS MODAL SCREEN OVERLAY --- */}
      <AnimatePresence>
        {oopsState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94 }}
              className="bg-surface-container-lowest border-4 border-error rounded-3xl p-6 text-center max-w-sm w-full shadow-xl space-y-4 text-left"
            >
              <div className="flex gap-3 items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border-2 border-error/20 shadow-xs">
                  <img
                    alt="MADA MADA DOG"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDveFYsKgkorVEVvyG8y1RXU65eV4xXjssWR9ddJFJ6AfaJrWM4zsCqXALjRCebFfatbks3e6NZsga8jPNtvU7iYYzbOFEGH3FnMVhjlBLLM8L4A-TCvU96Iyq_U9HmC15JVpYF1wykSPYZeomMHz4AeBF2yEWOJAowHZvqOxLzBZXAVLTh9zlP0cTCmxyOa1ame2fJc8gtRV53TATHhA0tDb215Lsg0h-A2vQv5w-DB8b0I_o0dAVgWbGkzdkywp6p4axPucg5S9Al"
                  />
                </div>
                <div>
                  <h3 className="font-headline font-black text-lg text-error">
                    MADA MADA... まだまだ
                  </h3>
                  <p className="text-xs text-on-surface-variant font-body">
                    Humble referee checks revealed a chain mistake!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-error-container/30 border border-error/20 rounded-xl space-y-1">
                <p className="text-xs text-on-error-container font-body font-extrabold leading-tight">
                  Evaluated Word: <span className="underline font-black font-display-game">{oopsState.word}</span>
                </p>
                <p className="text-[11px] text-on-error-container/90 font-body leading-relaxed">
                  Reason: {oopsState.msg}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOopsState(null)}
                  className="bg-error text-on-error font-body font-bold w-full py-2 px-4 rounded-xl shadow-md cursor-pointer text-center hover:bg-opacity-90 active:scale-95"
                >
                  Try Different Word
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- GAME OVER FINAL SUMMARY DIALOG SCREEN OVERLAY --- */}
      <AnimatePresence>
        {gameOverState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs select-none"
          >
            <motion.div
              initial={{ scale: 0.85, y: 35 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface-container-lowest border-4 border-primary rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl space-y-5"
            >
              <h2 className="font-headline text-2xl font-black text-on-surface">Game Over!</h2>

              {/* Show matching avatar of who won! */}
              <div className="space-y-2">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-slate-100 p-1 border-4 border-primary shadow-lg">
                  <img
                    alt="Winner Portrait avatar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                    src={gameOverState.winnerAvatar}
                  />
                  <span className="absolute -bottom-1.5 -right-1 bg-primary text-on-primary font-bold p-1 rounded-full shadow-sm text-[10px]">
                    👑 WINNER
                  </span>
                </div>
                <div>
                  <h4 className="font-headline font-black text-lg text-on-surface">
                    {gameOverState.winnerName} Wins!
                  </h4>
                  <p className="text-xs text-on-surface-variant font-body">
                    Fierce word duel chains came to an end.
                  </p>
                </div>
              </div>

              {/* Scores dashboard wrap recap */}
              <div className="bg-surface rounded-2xl p-4 border border-outline-variant/30 grid grid-cols-2 gap-2 text-center">
                <div className="border-r">
                  <span className="text-[10px] font-label-caps text-on-surface-variant">YOUR SCORE</span>
                  <p className="text-lg font-headline font-black text-primary">{playerScore} pts</p>
                </div>
                <div>
                  <span className="text-[10px] font-label-caps text-on-surface-variant">CHAIN LIMIT</span>
                  <p className="text-lg font-headline font-black text-secondary">{playedWords.length} words</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-1 font-body font-bold">
                <button
                  type="button"
                  onClick={handleRestartDuel}
                  className="squish-btn w-full bg-primary text-on-primary py-3 px-6 rounded-none flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  Play Again
                </button>

                <button
                  type="button"
                  onClick={onExit}
                  className="squish-btn w-full bg-surface-container hover:bg-white/20 text-on-surface py-2.5 px-6 rounded-none flex items-center justify-center gap-2 cursor-pointer border border-white/20 uppercase tracking-widest text-xs"
                >
                  <Home className="w-4 h-4" />
                  Back to Main Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
