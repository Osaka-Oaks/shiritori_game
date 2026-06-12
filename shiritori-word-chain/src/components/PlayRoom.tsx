import React, { useState, useEffect, useRef } from "react";
import { 
  Settings, 
  Volume2, 
  Send, 
  Play as PlayIcon, 
  HelpCircle, 
  Shield, 
  Lightbulb, 
  ChevronRight, 
  MessageSquare,
  Home, 
  RotateCcw, 
  X, 
  Crown,
  Heart,
  Sparkle,
  ArrowRight,
  TrendingUp,
  Cpu,
  User,
  AlertCircle
} from "lucide-react";
import ThreeBoard from "./ThreeBoard";
import { WordChainItem, ChatMessage, GameSession } from "../types";
import { useAuth } from "../context/AuthContext";

interface PlayRoomProps {
  gameMode: "ai" | "friend";
  difficulty: "easy" | "hard";
  onBackToHome: () => void;
  opponentType: "neko" | "mei" | "shiba";
}

export default function PlayRoom({ gameMode, difficulty, onBackToHome, opponentType }: PlayRoomProps) {
  const { user, profile, updateHighScore, incrementGamesPlayed } = useAuth();

  // Avatars and Names setup
  const opponentName = opponentType === "mei" ? "Mei-chan" : opponentType === "neko" ? "Bot Neko" : "Inu Shiba";
  const opponentAvatar = opponentType === "mei" 
    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCUnDvc5Ngx-eQ4RbPoOOIuVDkzzqukPK4XUL_Hmotwz80cSnaC8UVMK1nfkR9yOz1QI435mG4s3NqpRAleoxX0wzAcORQUMfQXaIRdhRjphN3hCPhDG541jKMlL1FX4zvzoq_ki4jJyf3BmQBprBFCFFNcLlevKureB4e8A2H4eov6XCfrGmrd2ctR_Eu4hIsGrngj6SZF-Xe8ZNjGnTyO6hwb0zP3AuE7vTOwoc1gSk8-Yho2JffgNyix-33b82k6kWddUMk6NQ_w"
    : opponentType === "neko"
    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDNQ981cAUylglVaHrBufGT3DyeOHA6vJ57Ddea9_GNup0BNaedtppDgtnkKfRgiMA4dcxEa3D15btCLJfETH2QZZvkH1PCQ3VczNo7QM4hq3M_vwwwMrs30FHRwXbXzFqlp6x8jcJKorYDEzU6-Q2Y1zVuJNioUWVXl7poDjCJdlCKot8UUeQfgznnj6Wj_HTETY12Fxu8dbLSfxrfqEyP195I0nZ7iHhpcxbG807y_8RB-n8PCSxnF47RE3sMMxnrRxic70wb70_P"
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuDAhGgljqsqv9TjA1w8oJvAroRa4sVp4WYWWH7-yTfECPHP1Wj_OukHz67zLzOZJfViMqUGjC5Y1s4G5tM9y4gSF_-85y7idVgPkgadWNwV93yuJUZdjhT_4c3-qi3LiMf-Au4l3KQ2NEgHSi371jGRuK7sZjFCKCppJ3mA7GRL7ZGQHiNLkGaTNfc96bYF3_OAR63hiFChR48MqboTcXg_1e2SNWy-N3RrLx2rEPQmmGP2U5ENpcZNQx24m5NrHEZv36pVUcjbGEp1";

  const userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDD-0xFlMJoGr1RST4hByi07rC_6PAviMKob8wj8uioHoe4f4E92-JmQDXgh68sUWTe8HXRvsYMq1-sh6YQPQGAuQzqkDlxLTbZWrhSDAz0D9ncR-nTE-bZUeMT21DVWBlah5mWPl_GzvP1e0jLJ0Rp-_pFdEg_PS26_k8JpoKK_MkyyZ2__lzdPwrIi9kRjaEbOGZFDZpKHo6aUnHvq06fxLS4-w5gF2QgiIS8hhHvHqOOSqvBiHM2JbrcdbYSZbHHFdgMm5AR2_8k";

  // Game States
  const [playerScore, setPlayerScore] = useState(240);
  const [opponentScore, setOpponentScore] = useState(180);
  const [turn, setTurn] = useState<"player" | "opponent">("player");
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(12);
  const [userWordInput, setUserWordInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [botThinking, setBotThinking] = useState(false);

  // Powerups State
  const [hintsLeft, setHintsLeft] = useState(2);
  const [shieldsLeft, setShieldsLeft] = useState(1);
  const [shieldActive, setShieldsActive] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Success & Oops overlays (Modals)
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showOopsOverlay, setShowOopsOverlay] = useState(false);
  const [oopsReason, setOopsReason] = useState("");
  
  // Game Over Terminal state
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverStats, setGameOverGameOverStats] = useState<any>(null);

  // Chat Drawer state
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [hasNewChat, setHasNewChat] = useState(true);
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: opponentName as any,
      text: "Ganbare! You can do it! ❤️",
      japaneseTranslation: "がんばって！",
      timestamp: "Just now"
    },
    {
      id: "2",
      sender: "Jarrel",
      text: "Thanks! I'm trying my best! ✨",
      japaneseTranslation: "ありがとう！頑張るよ！",
      timestamp: "Just now"
    }
  ]);

  // Main Word Chain history
  const [wordChain, setWordChain] = useState<WordChainItem[]>([
    {
      id: "1",
      word: "Neko",
      hiragana: "ねこ",
      romaji: "neko",
      meaning: "Cat",
      lastChar: "こ",
      lastCharRomaji: "ko",
      speaker: "opponent",
      timestamp: "1 min ago"
    } as any,
    {
      id: "2",
      word: "Koinu",
      hiragana: "こいぬ",
      romaji: "koinu",
      meaning: "Puppy",
      lastChar: "ぬ",
      lastCharRomaji: "nu",
      speaker: "player",
      timestamp: "30s ago"
    } as any,
    {
      id: "3",
      word: "Numa",
      hiragana: "ぬま",
      romaji: "numa",
      meaning: "Swamp",
      lastChar: "ま",
      lastCharRomaji: "ma",
      speaker: "opponent",
      timestamp: "Just now"
    } as any
  ]);

  // Get what character is requested to start with
  const currentLastCharItem = wordChain[wordChain.length - 1];
  const lastCharSyllable = currentLastCharItem.lastChar; // e.g. "ま"
  const lastCharRomaji = currentLastCharItem.lastCharRomaji; // e.g. "ma"

  // Audio Pronunciation using browser API
  const speakCurrentWord = (text: string) => {
    if (!text || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    window.speechSynthesis.speak(utterance);
  };

  // Timer Countdown loop
  useEffect(() => {
    if (showGameOver || showSuccessOverlay || showOopsOverlay) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [turn, showGameOver, showSuccessOverlay, showOopsOverlay]);

  // Handle Time Up!
  const handleTimeUp = () => {
    if (shieldsLeft > 0 && shieldActive) {
      setShieldsLeft(p => p - 1);
      setShieldsActive(false);
      setTimeLeft(30);
      alert("Point shield protected you from Time Up!");
      return;
    }
    setOopsReason("Time Up!");
    triggerGameOver("Time Up", currentLastCharItem.word, opponentName);
  };

  // Trigger GameOver Screen Mode
  const triggerGameOver = (fatalWord: string, lastWordPlayed: string, winnerName?: string) => {
    const decidedWinner = winnerName || opponentName;
    setGameOverGameOverStats({
      winner: decidedWinner,
      opponentScore: opponentScore,
      playerScore: playerScore,
      chainLength: wordChain.length,
      fatalWord: fatalWord,
      reason: fatalWord === "Time Up" ? "You ran out of time!" : `${decidedWinner === "Player" ? opponentName : "You"} played a word ending with 'N' ("${fatalWord}")!`
    });
    setShowGameOver(true);

    if (user) {
      incrementGamesPlayed().catch(err => console.error("Error setting game count:", err));
      if (playerScore > (profile?.highScore || 0)) {
        updateHighScore(playerScore).catch(err => console.error("Error setting high score:", err));
      }
    }
  };

  // Handle Player Submit Word
  const handleWordSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userWordInput.trim() || isSubmitting || botThinking) return;

    setIsSubmitting(true);
    setHintMessage(null);

    const matchWord = userWordInput.trim();

    try {
      // Validate Word with server API
      const res = await fetch("/api/game/evaluate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: matchWord,
          lastChar: lastCharSyllable,
          usedWords: wordChain.map(item => item.word.toLowerCase())
        })
      });

      const resultData = await res.json();

      if (!res.ok) {
        throw new Error(resultData.error || "Word validation fail.");
      }

      if (resultData.valid) {
        // Success word chain insertion!
        const newWordItem: WordChainItem = {
          id: Date.now().toString(),
          word: resultData.word,
          romaji: resultData.word,
          kanji: resultData.kanji,
          hiragana: resultData.hiragana,
          meaning: resultData.meaning,
          lastChar: resultData.lastChar,
          lastCharRomaji: resultData.lastCharRomaji,
          speaker: "player",
          timestamp: "Just now"
        };

        setWordChain(prev => [...prev, newWordItem]);
        setPlayerScore(prev => prev + 50);
        setStreak(prev => prev + 1);
        setUserWordInput("");
        
        // Show Sugoi Overlay Modal
        setShowSuccessOverlay(true);
        setTimeout(() => {
          setShowSuccessOverlay(false);
          // Hand turn over to bot
          setTurn("opponent");
          triggerBotPlay(resultData.lastChar, [...wordChain, newWordItem]);
        }, 1800);

      } else {
        // Invalid Word! Check if protected by Shield
        if (shieldsLeft > 0 && shieldActive) {
          setShieldsLeft(p => p - 1);
          setShieldsActive(false);
          alert(`Point shield protected you from wrong word "${matchWord}"! Try another word.`);
          setUserWordInput("");
          setIsSubmitting(false);
          return;
        }

        // Show Oops Overlay Modal
        setOopsReason(resultData.reason || "Word failed the Shiritori validation rule.");
        
        // Check if ends in 'n'
        if (resultData.endsInN) {
          setShowOopsOverlay(true);
          setTimeout(() => {
            setShowOopsOverlay(false);
            triggerGameOver(matchWord, currentLastCharItem.word, opponentName);
          }, 2000);
        } else {
          setShowOopsOverlay(true);
        }
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bot Auto Play logic
  const triggerBotPlay = async (botLastChar: string, currentChain: WordChainItem[]) => {
    setBotThinking(true);
    setTimeLeft(30);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const res = await fetch("/api/game/bot-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastChar: botLastChar,
          difficulty: difficulty,
          usedWords: currentChain.map(i => i.word.toLowerCase()),
          opponentName: opponentName
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bot lookup issue.");
      }

      if (data.isInvalid || data.endsInN) {
        // Bot made a mistake! (For Easy Mode)
        const fatalWordItem: WordChainItem = {
          id: Date.now().toString(),
          word: data.word,
          romaji: data.word,
          kanji: data.kanji,
          hiragana: data.hiragana,
          meaning: data.meaning,
          lastChar: "ん",
          lastCharRomaji: "n",
          speaker: "opponent",
          timestamp: "Just now"
        };
        setWordChain(prev => [...prev, fatalWordItem]);
        
        // Send a crying sticker
        setChatMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: opponentName as any,
            text: `Ahh, I made a mistake with "${data.word}" (ends in N)! You win! 😭`,
            timestamp: "Just now",
            isSticker: false
          }
        ]);
        setHasNewChat(true);

        setTimeout(() => {
          triggerGameOver(data.word, currentChain[currentChain.length - 1].word, "Player");
        }, 3000);

      } else {
        // Successful play
        const newWordItem: WordChainItem = {
          id: Date.now().toString(),
          word: data.word,
          romaji: data.word,
          kanji: data.kanji,
          hiragana: data.hiragana,
          meaning: data.meaning,
          lastChar: data.hiragana.charAt(data.hiragana.length - 1),
          lastCharRomaji: data.word.slice(-2),
          speaker: "opponent",
          timestamp: "Just now"
        };

        setWordChain(prev => [...prev, newWordItem]);
        setOpponentScore(prev => prev + 50);
        setTurn("player");

        // Add Bot's supportive chat dialogue
        setChatMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: opponentName as any,
            text: data.chatMessage || "I played my word! Your turn now! ✨",
            japaneseTranslation: data.hiragana,
            timestamp: "Just now"
          }
        ]);
        setHasNewChat(true);
      }
    } catch (err: any) {
      console.error(err);
      setOpponentScore(prev => prev + 30);
      setTurn("player");
    } finally {
      setBotThinking(false);
    }
  };

  // Use Word Hint powerup
  const useWordHint = async () => {
    if (hintsLeft <= 0 || turn !== "player") return;
    setHintsLeft(prev => prev - 1);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/game/bot-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastChar: lastCharSyllable,
          difficulty: "hard",
          usedWords: wordChain.map(i => i.word.toLowerCase()),
          opponentName: opponentName
        })
      });
      const data = await res.json();
      if (res.ok && data.word) {
        setHintMessage(`HINT: Try word "${data.word}" (${data.hiragana}) which means "${data.meaning}"!`);
      } else {
        setHintMessage("All matching words used! Try anything else.");
      }
    } catch (err) {
      setHintMessage("Failed to get hint. Try checking dictionary.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle point shield powerup
  const togglePointShield = () => {
    if (shieldsLeft <= 0) return;
    setShieldsActive(!shieldActive);
  };

  // Manual chat message sending
  const handleSendChatMessage = () => {
    if (!chatMessageInput.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "Jarrel",
      text: chatMessageInput,
      timestamp: "Just now"
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatMessageInput("");

    setTimeout(async () => {
      const ai = await fetchAIResponseForChat(chatMessageInput);
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: opponentName as any,
          text: ai.text,
          japaneseTranslation: ai.jp,
          timestamp: "Just now"
        }
      ]);
      setHasNewChat(true);
    }, 1500);
  };

  // Helper helper to get chatbot reply from server
  const fetchAIResponseForChat = async (userMsg: string) => {
    try {
      const res = await fetch("/api/library/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg, language: "ENG" })
      });
      const d = await res.json();
      return {
        text: `Oh! Speaking of "${userMsg}", that reminds me of "${d.word}" (${d.hiragana}) in Japanese! Let's resume playing!`,
        jp: d.hiragana
      };
    } catch {
      return {
        text: "That sounds wonderful! Let's keep making high word chains!",
        jp: "がんばりましょう！"
      };
    }
  };

  return (
    <div className="w-full relative h-[calc(100vh-140px)] flex flex-col md:flex-row overflow-hidden pb-12">
      
      {/* 3D Board Background */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-15 pointer-events-none">
        <ThreeBoard />
      </div>

      {/* Main HUD overlay wrapper */}
      <div className="relative z-10 flex-grow flex flex-col w-full h-full max-w-4xl mx-auto px-4 py-3 pointer-events-none">
        
        {/* Top HUD: Scores & Turn Indicator */}
        <div className="flex justify-between items-start w-full pointer-events-auto">
          {/* Player Score (Left) */}
          <div className="flex flex-col items-center gap-1 bg-white/[0.03] border border-white/10 px-5 py-3 rounded-sm shadow-lg backdrop-blur-md">
            <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold">YOU</span>
            <span className="serif-italic text-2xl text-white font-medium">{playerScore}</span>
          </div>

          {/* Turn Indicator (Center) */}
          <div className="flex flex-col items-center gap-1.5 mt-1">
            <div className={`px-5 py-2 rounded-sm border flex items-center gap-2 text-white transition-all ${
              turn === "player" 
                ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]" 
                : "border-white/20 bg-white/5 text-white/40"
            }`}>
              {turn === "player" ? (
                <>
                  <Sparkle className="w-4 h-4 text-current fill-current" />
                  <span className="font-sans text-[10px] uppercase tracking-widest font-extrabold">Your Turn!</span>
                </>
              ) : (
                <>
                  <Sparkle className="w-4 h-4 text-current fill-current animate-spin" />
                  <span className="font-sans text-[10px] uppercase tracking-widest font-extrabold">Opponent Thinking...</span>
                </>
              )}
            </div>
            
            {/* Circular Timer Display */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-sm text-xs font-mono font-bold text-[#C5A059]">
              <span className={`w-2 h-2 rounded-full bg-[#C5A059] ${timeLeft < 10 ? "animate-ping bg-red-400" : ""}`}></span>
              <span className="text-[10px] tracking-widest font-light uppercase">{timeLeft}s remaining</span>
            </div>
          </div>

          {/* Opponent Score (Right) */}
          <div className="flex flex-col items-center gap-1 bg-white/[0.03] border border-white/10 px-5 py-3 rounded-sm shadow-lg backdrop-blur-md">
            <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold">{opponentName}</span>
            <span className="serif-italic text-2xl text-white font-medium">{opponentScore}</span>
          </div>
        </div>

        {/* Dynamic Hint Panel if active */}
        {hintMessage && (
          <div className="mt-4 bg-white/[0.02] border border-[#C5A059]/30 text-white max-w-md mx-auto p-4 rounded-sm shadow-lg text-xs pointer-events-auto border-l-2 border-l-[#C5A059] animate-fadeIn flex items-center gap-3">
            <span className="font-bold uppercase tracking-widest border border-[#C5A059]/40 text-[#C5A059] px-2 py-0.5 rounded-sm shrink-0 text-[9px]">HINT</span>
            <p className="font-sans font-light text-white/80 leading-relaxed">{hintMessage}</p>
          </div>
        )}

        {/* Spacer to push feed down */}
        <div className="flex-grow"></div>

        {/* Game Chat/Notes, History Panel, and Input Form */}
        <div className="flex flex-col gap-4 pointer-events-auto w-full max-w-md mx-auto relative z-20 mb-4">
          
          {/* Active Game Feed list */}
          <div className="glass-card rounded-sm p-5 relative overflow-hidden max-h-[220px] overflow-y-auto shadow-xl">
            {/* Vertical chain dotted pipeline line */}
            <div className="absolute left-[24px] top-6 bottom-6 w-0.5 border-l border-dashed border-white/10"></div>
            
            <div className="flex flex-col gap-4 relative z-10">
              {wordChain.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3.5 ${
                    item.speaker === "player" ? "flex-row-reverse text-right self-end" : "self-start"
                  }`}
                >
                  {/* Speaker Miniature avatar stroke */}
                  <div className={`w-8 h-8 rounded-full overflow-hidden border shrink-0 shadow-lg ${
                    item.speaker === "player" ? "border-[#C5A059]/40" : "border-white/20"
                  }`}>
                    <img className="w-full h-full object-cover" src={item.speaker === "player" ? userAvatar : opponentAvatar} alt="Mini Avatar" />
                  </div>

                  {/* Word item bubble */}
                  <div className={`rounded-sm px-4 py-3 shadow-md border max-w-[210px] cursor-pointer transition-all ${
                    item.speaker === "player"
                      ? "bg-[#C5A059]/10 border-[#C5A059]/30 text-white"
                      : "bg-white/[0.02] border-white/10 text-white/90"
                  }`}
                    onClick={() => speakCurrentWord(item.hiragana)}
                    title="Click to pronounce word"
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="serif-italic text-base font-medium">{item.word}</span>
                      <span className="text-[10px] text-white/40">({item.hiragana})</span>
                    </div>
                    <div className="text-[11px] text-[#C5A059]/80 font-light mt-0.5 leading-tight">
                      {item.meaning}
                    </div>
                    
                    {/* Golden Circle highlighted trailing Hiragana syllable block */}
                    <div className="mt-2 flex items-center justify-end">
                      <span className="inline-flex w-5 h-5 bg-[#C5A059] text-black rounded-full items-center justify-center font-bold text-[10px] shadow-sm animate-pulse">
                        {item.lastChar}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Bot thinking bubble */}
              {botThinking && (
                <div className="flex items-start gap-3 self-start">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 shadow-lg animate-pulse">
                    <img className="w-full h-full object-cover" src={opponentAvatar} alt="Thinking Bot" />
                  </div>
                  <div className="rounded-sm px-4 py-2.5 bg-white/5 border border-white/10 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce delay-200"></span>
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Input & Powerup Action row */}
          <div className="flex gap-3 items-end relative w-full">
            {/* Round Power-up button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowChatDrawer(true)}
                className="w-11 h-11 rounded-sm border border-white/10 bg-white/5 text-[#C5A059] hover:bg-white/10 transition-colors flex items-center justify-center shadow-lg relative active:scale-95"
                title="Toggle Active Chat Notes Drawer"
              >
                <MessageSquare className="w-4 h-4" />
                {hasNewChat && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black"></span>
                )}
              </button>
            </div>

            {/* Hint Powerup button */}
            <button
              onClick={useWordHint}
              disabled={hintsLeft <= 0 || turn !== "player"}
              className={`w-11 h-11 rounded-sm border transition-all flex items-center justify-center shadow-lg ${
                hintsLeft > 0 && turn === "player"
                  ? "bg-white/5 border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/10"
                  : "bg-white/[0.02] border-white/5 text-white/20 cursor-not-allowed"
              }`}
              title={`Use Word Hint (${hintsLeft} left)`}
            >
              <Lightbulb className="w-4 h-4" />
            </button>

            {/* Shield Powerup button */}
            <button
              onClick={togglePointShield}
              disabled={shieldsLeft <= 0}
              className={`w-11 h-11 rounded-sm border transition-all flex items-center justify-center shadow-lg ${
                shieldActive 
                  ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.2)]" 
                  : shieldsLeft > 0 
                  ? "bg-white/5 border-white/10 text-[#C5A059]/70 hover:bg-white/10"
                  : "bg-white/[0.02] border-white/5 text-white/20 cursor-not-allowed"
              }`}
              title={`Toggle Point Shield (${shieldsLeft} left)`}
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Main Word Submission Form */}
            <form onSubmit={handleWordSubmit} className="flex-1 relative">
              <span className="absolute left-[16px] top-1/2 -translate-y-1/2 serif-italic text-lg text-[#C5A059]/80 pointer-events-none uppercase font-bold">
                {lastCharSyllable}
              </span>
              <input
                disabled={turn !== "player" || isSubmitting || botThinking || showGameOver}
                className="w-full h-11 pl-11 pr-11 rounded-sm border border-white/15 bg-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all placeholder:text-white/25 disabled:opacity-30 disabled:cursor-not-allowed"
                placeholder={turn === "player" ? "Type ROMAJI or JAPANESE word..." : "Waiting for opponent..."}
                type="text"
                value={userWordInput}
                onChange={(e) => setUserWordInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={turn !== "player" || !userWordInput.trim() || isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-sm bg-[#C5A059] text-black hover:bg-[#D7B574] flex items-center justify-center transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <p className="text-center text-[9px] text-[#C5A059]/60 font-medium tracking-widest uppercase">
            Must start with “{lastCharSyllable} ({lastCharRomaji})” • No 'N' ending!
          </p>
        </div>
      </div>

      {/* SUCCESS MODAL OVERLAY ("SUGOI!") */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn pointer-events-auto">
          <div className="glass-card rounded-sm p-8 flex flex-col items-center text-center shadow-2xl relative w-full max-w-sm mx-auto animate-fadeIn border-[#C5A059]/30">
            <span className="absolute top-4 left-4 text-[#C5A059] text-3xl opacity-30 animate-pulse">★</span>
            <span className="absolute bottom-6 right-6 text-[#C5A059] text-2xl opacity-20 animate-bounce">✿</span>
            
            <div className="w-36 h-36 mb-5 relative">
              <div className="absolute inset-0 bg-[#C5A059]/10 rounded-full animate-pulse filter blur-xl"></div>
              <img className="w-full h-full object-contain relative z-10 drop-shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDuKva3Ae4Mdx_1okP6_ZLRerZXxvd-AjbqdUFthtF4ohqCI7t2K-UrHVh-2aTWROAho5wPA9sSDg8QFu1abQ6N8LSPmv9d5XQEx87YDQb7DqQlNrJPDkKXSpjdCaHdl0w1WzEF_9NvJlhPF4BiLm_9_wTH9n3uDXSqVWnE-Us64hmzyRw9AWBSPZNF1Sg5Mw1dblfwImLyCWdToV20RGJbgEJc0Rnfx0a4UCk9cSKzllL4wqzKMEUr6Ea8V3NOzRfFgXMCutEuUv" alt="Cheerful Mascot" />
            </div>

            <h2 className="serif-italic text-3xl text-white mb-1.5 tracking-wide">SUGOI!</h2>
            <p className="font-light text-slate-300 text-sm mb-4">Amazing word play!</p>

            <div className="border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059] text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-sm shadow-sm font-bold">
              <span>+50 Points</span>
            </div>
          </div>
        </div>
      )}

      {/* OOPS MODAL OVERLAY ("MADA MADA...") */}
      {showOopsOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn pointer-events-auto">
          <div className="glass-card rounded-sm p-8 flex flex-col items-center text-center shadow-2xl relative w-full max-w-sm mx-auto border-red-500/20">
            <div className="w-36 h-36 mb-5 relative">
              <img className="w-full h-full object-contain drop-shadow-md opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDveFYsKgkorVEVvyG8y1RXU65eV4xXjssWR9ddJFJ6AfaJrWM4zsCqXALjRCebFfatbks3e6NZsga8jPNtvU7iYYzbOFEGH3FnMVhjlBLLM8L4A-TCvU96Iyq_U9HmC15JVpYF1wykSPYZeomMHz4AeBF2yEWOJAowHZvqOxLzBZXAVLTh9zlP0cTCmxyOa1ame2fJc8gtRV53TATHhA0tDb215Lsg0h-A2vQv5w-DB8b0I_o0dAVgWbGkzdkywp6p4axPucg5S9Al" alt="Crying Mascot" />
            </div>

            <h2 className="serif-italic text-2xl text-red-400 mb-3 tracking-wide">MADA MADA...</h2>
            <p className="text-slate-300 font-light text-sm mb-6 leading-relaxed">
              {oopsReason}
            </p>

            <button
              onClick={() => {
                setShowOopsOverlay(false);
                setUserWordInput("");
              }}
              className="bg-[#C5A059] text-black hover:bg-[#D7B574] text-[10px] font-bold tracking-widest uppercase py-3 px-8 rounded-sm shadow-lg transition-colors focus:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5 fill-current inline-block mr-1.5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {showGameOver && gameOverStats && (
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 overflow-y-auto pointer-events-auto">
          <div className="max-w-md w-full flex flex-col gap-6 py-8">
            <div className="text-center">
              <h1 className="serif-italic text-4xl text-white font-light tracking-wide">Game Over</h1>
              <p className="text-[#C5A059] text-xs font-light mt-1.5 uppercase tracking-widest leading-none">
                {gameOverStats.reason}
              </p>
            </div>

            {/* Mascot Battle Arena illustration */}
            <div className="relative w-full h-44 flex justify-center items-end mt-2 mb-2">
              {/* Loser (Player) */}
              <div className="absolute left-8 bottom-0 w-28 h-28 transform animate-pulse">
                <div className="w-full h-full rounded-full bg-white/[0.02] border border-white/10 shadow-lg overflow-hidden flex items-center justify-center relative">
                  <img className="w-full h-full object-cover" src={userAvatar} alt="Sad Player" />
                  <div className="absolute top-6 right-6 text-sm">💧</div>
                </div>
              </div>
              {/* Winner (Opponent) */}
              <div className="absolute right-8 bottom-2 w-32 h-32 animate-bounce">
                <div className="absolute -top-3 -right-3 text-[#C5A059] animate-spin">★</div>
                <div className="w-full h-full rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 shadow-lg overflow-hidden flex items-center justify-center relative">
                  <img className="w-full h-full object-cover" src={opponentAvatar} alt="Happy Bot" />
                </div>
                {/* Crown */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[#C5A059] animate-pulse">
                  <Crown className="w-8 h-8 fill-current text-[#C5A059]" />
                </div>
              </div>
            </div>

            {/* Stats Summary Card */}
            <div className="glass-card rounded-sm p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 border border-white/20 bg-white/5 rounded-sm flex items-center justify-center text-sm">
                    👑
                  </div>
                  <div>
                    <h3 className="text-[9px] uppercase tracking-widest text-white/40 font-bold">WINNER</h3>
                    <p className="serif-italic text-lg text-white font-medium">{gameOverStats.winner}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-[9px] uppercase tracking-widest text-[#C5A059]/80 font-bold">YOUR SCORE</h3>
                  <p className="serif-italic text-xl text-[#C5A059] font-medium">{gameOverStats.playerScore}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center bg-white/[0.01] rounded-sm p-3 border border-white/5">
                  <span className="text-xs font-light text-white/60 uppercase tracking-wide">Word Chain Length</span>
                  <span className="serif-italic text-sm text-white font-medium">{gameOverStats.chainLength} Words</span>
                </div>
                <div className="flex justify-between items-center bg-red-500/[0.02] rounded-sm p-3 border border-red-500/15">
                  <span className="text-xs font-light text-white/60 uppercase tracking-wide">Fatal Word</span>
                  <span className="serif-italic text-sm text-red-400 capitalize">{gameOverStats.fatalWord}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setPlayerScore(240);
                  setOpponentScore(180);
                  setWordChain([
                    {
                      id: "1",
                      word: "Neko",
                      hiragana: "ねこ",
                      romaji: "neko",
                      meaning: "Cat",
                      lastChar: "こ",
                      lastCharRomaji: "ko",
                      speaker: "opponent",
                      timestamp: "Just started"
                    } as any
                  ]);
                  setTurn("player");
                  setTimeLeft(30);
                  setStreak(0);
                  setHintsLeft(2);
                  setShieldsLeft(1);
                  setShieldsActive(false);
                  setHintMessage(null);
                  setShowGameOver(false);
                }}
                className="w-full bg-[#C5A059] text-black hover:bg-[#D7B574] text-[10px] font-bold tracking-[0.2em] uppercase py-4 rounded-sm shadow-lg transition-transform active:translate-y-0.5 flex items-center justify-center gap-2 focus:outline-none"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <button
                onClick={onBackToHome}
                className="w-full bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold tracking-[0.2em] uppercase py-3.5 rounded-sm border border-white/15 transition-transform active:translate-y-0.5 focus:outline-none flex items-center justify-center gap-2"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT/LOVE NOTES DRAWER SIDEBAR */}
      {showChatDrawer && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Backdrop */}
          <div 
            onClick={() => {
              setShowChatDrawer(false);
              setHasNewChat(false);
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto animate-fadeIn"
          ></div>
          
          {/* Drawer content panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-[#0A0A0A] shadow-2xl flex flex-col border-l border-white/10 pointer-events-auto transform animate-slideInRight">
            
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#070707]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C5A059] fill-current animate-pulse" />
                <h2 className="serif-italic text-base text-white tracking-wide">Love Notes</h2>
              </div>
              <button 
                onClick={() => {
                  setShowChatDrawer(false);
                  setHasNewChat(false);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full text-white/50 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#050505]">
              {chatMessages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.sender === "Jarrel" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[9px] uppercase tracking-widest text-[#C5A059]/80 mb-1 px-1 font-bold">
                    {msg.sender === "Jarrel" ? "Jarrel (You)" : msg.sender}
                  </span>
                  
                  <div className={`px-4 py-2.5 shadow-sm max-w-[85%] rounded-sm ${
                    msg.isSticker 
                      ? "text-3xl bg-transparent shadow-none p-1 font-bold animate-pulse" 
                      : msg.sender === "Jarrel"
                      ? "bg-[#C5A059]/10 border border-[#C5A059]/30 text-white"
                      : "bg-white/5 border border-white/10 text-white"
                  }`}>
                    {!msg.isSticker && <p className="text-xs font-light whitespace-pre-wrap">{msg.text}</p>}
                    {msg.japaneseTranslation && (
                      <p className="text-[10px] opacity-75 font-semibold mt-1 border-t border-white/5 pt-1 text-[#C5A059]/80">
                        {msg.japaneseTranslation}
                      </p>
                    )}
                    {msg.isSticker && msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stickers list row */}
            <div className="px-4 py-3 bg-[#070707] border-t border-white/5 flex gap-2.5 overflow-x-auto select-none shrink-0">
              {["❤️", "✨", "🌸", "🔥", "💪", "🐶", "🐱"].map(sticker => (
                <button
                  key={sticker}
                  onClick={() => {
                    const stickerMsg: ChatMessage = {
                      id: Date.now().toString(),
                      sender: "Jarrel",
                      text: sticker,
                      isSticker: true,
                      timestamp: "Just now"
                    };
                    setChatMessages(prev => [...prev, stickerMsg]);
                  }}
                  className="shrink-0 w-8 h-8 border border-white/10 bg-white/5 rounded-sm hover:scale-110 hover:border-[#C5A059]/40 transition-all focus:outline-none active:scale-95 text-lg flex items-center justify-center"
                >
                  {sticker}
                </button>
              ))}
            </div>

            {/* Chat message input form */}
            <div className="p-4 bg-[#070707] border-t border-white/10 shrink-0">
              <div className="relative">
                <input
                  onKeyDown={e => e.key === "Enter" && handleSendChatMessage()}
                  className="w-full bg-[#050505] border border-white/15 rounded-sm pl-4 pr-12 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-white/20"
                  placeholder="Send a sweet note..."
                  value={chatMessageInput}
                  onChange={e => setChatMessageInput(e.target.value)}
                />
                <button 
                  onClick={handleSendChatMessage}
                  className="absolute right-1.5 top-1.5 bottom-1.5 w-7 h-7 bg-[#C5A059] text-black rounded-sm flex items-center justify-center focus:outline-none hover:bg-[#D7B574] active:scale-95"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
