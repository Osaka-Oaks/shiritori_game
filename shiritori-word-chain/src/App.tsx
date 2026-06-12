import { useState } from "react";
import { 
  Gamepad2, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  User, 
  ChevronRight, 
  Heart, 
  Crown, 
  Layers,
  Award,
  CircleDot,
  Mail,
  LogOut,
  LogIn,
  Trophy
} from "lucide-react";
import HowToPlay from "./components/HowToPlay";
import WordLibrary from "./components/WordLibrary";
import PlayRoom from "./components/PlayRoom";
import ContactForm from "./components/ContactForm";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const [activeTab, setActiveTab] = useState<"game" | "rules" | "library" | "contact">("game");
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");
  const [opponentType, setOpponentType] = useState<"neko" | "mei" | "shiba">("mei");
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { user, profile, logout } = useAuth();

  // Custom styling settings for opponent options
  const opponents = {
    mei: {
      id: "mei" as const,
      name: "Mei-chan",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUnDvc5Ngx-eQ4RbPoOOIuVDkzzqukPK4XUL_Hmotwz80cSnaC8UVMK1nfkR9yOz1QI435mG4s3NqpRAleoxX0wzAcORQUMfQXaIRdhRjphN3hCPhDG541jKMlL1FX4zvzoq_ki4jJyf3BmQBprBFCFFNcLlevKureB4e8A2H4eov6XCfrGmrd2ctR_Eu4hIsGrngj6SZF-Xe8ZNjGnTyO6hwb0zP3AuE7vTOwoc1gSk8-Yho2JffgNyix-33b82k6kWddUMk6NQ_w",
      badge: "ONLINE",
      badgeStyle: "border border-white/20 text-white/70",
      style: "glass-card bg-white/[0.01]",
      accent: "text-[#C5A059]",
      desc: "Friendly & sweet companion. Gives helpful translation hints, speaks fluent school level nouns & Kanji."
    },
    neko: {
      id: "neko" as const,
      name: "Bot Neko",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNQ981cAUylglVaHrBufGT3DyeOHA6vJ57Ddea9_GNup0BNaedtppDgtnkKfRgiMA4dcxEa3D15btCLJfETH2QZZvkH1PCQ3VczNo7QM4hq3M_vwwwMrs30FHRwXbXzFqlp6x8jcJKorYDEzU6-Q2Y1zVuJNioUWVXl7poDjCJdlCKot8UUeQfgznnj6Wj_HTETY12Fxu8dbLSfxrfqEyP195I0nZ7iHhpcxbG807y_8RB-n8PCSxnF47RE3sMMxnrRxic70wb70_P",
      badge: "PLAYFUL",
      badgeStyle: "border border-white/20 text-white/70",
      style: "glass-card bg-white/[0.01]",
      accent: "text-[#C5A059]",
      desc: "Cute digital kitten bot. Responds with hyper kawaii love notes & reactions. Easy to play with!"
    },
    shiba: {
      id: "shiba" as const,
      name: "Inu Shiba",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAhGgljqsqv9TjA1w8oJvAroRa4sVp4WYWWH7-yTfECPHP1Wj_OukHz67zLzOZJfViMqUGjC5Y1s4G5tM9y4gSF_-85y7idVgPkgadWNwV93yuJUZdjhT_4c3-qi3LiMf-Au4l3KQ2NEgHSi371jGRuK7sZjFCKCppJ3mA7GRL7ZGQHiNLkGaTNfc96bYF3_OAR63hiFChR48MqboTcXg_1e2SNWy-N3RrLx2rEPQmmGP2U5ENpcZNQx24m5NrHEZv36pVUcjbGEp1",
      badge: "EXPERT",
      badgeStyle: "border border-[#C5A059]/40 text-[#C5A059]",
      style: "glass-card bg-white/[0.01]",
      accent: "text-[#C5A059]",
      desc: "Smart Shiba Inu sensei. Plays long structural compound words, rarely makes mistakes. Real test!"
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#D1D1D1] flex flex-col font-sans selection:bg-[#C5A059]/30 selection:text-white">
      
      {/* GORGEOUS TOP DESKTOP HEADER BANNER */}
      <header className="bg-[#0A0A0A] border-b border-white/10 sticky top-0 z-40 shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3 cursor-pointer w-full md:w-auto justify-between md:justify-start" onClick={() => { setIsPlaying(false); setActiveTab("game"); }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm border border-white/20 bg-white/5 flex items-center justify-center text-[#C5A059] shrink-0">
                <Gamepad2 className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h1 className="serif-italic text-xl tracking-wide text-white flex items-center gap-2">
                  Shiritori <span className="text-[10px] font-bold border border-[#C5A059]/30 text-[#C5A059] px-1.5 py-0.5 rounded-sm lowercase font-sans">しりとり</span>
                </h1>
                <span className="font-sans text-[8px] text-white/40 font-semibold block tracking-[0.25em] leading-none mt-0.5 uppercase">WORD CHAIN ARENA</span>
              </div>
            </div>

            {/* Micro layout helper in mobile for account sign-in */}
            <div className="md:hidden flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-1.5 border border-white/10 bg-white/[0.03] rounded-sm py-1 px-2">
                  <div className="w-5 h-5 bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#C5A059] text-[9.5px] font-bold rounded-full flex items-center justify-center shrink-0 uppercase">
                    {profile?.displayName?.[0] || user.email?.[0] || "U"}
                  </div>
                  <span className="font-mono text-[8px] text-[#C5A059] font-bold">
                    🏆{profile?.highScore || 0}
                  </span>
                  <button
                    onClick={logout}
                    className="p-1 hover:text-red-400 text-white/40 transition-colors cursor-pointer focus:outline-none"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="border border-[#C5A059]/30 hover:bg-[#C5A059] hover:text-black text-[#C5A059] px-2.5 py-1 text-[8px] font-bold tracking-wider rounded-sm transition-all uppercase flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <LogIn className="w-3 h-3" />
                  <span>SIGN IN</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <nav className="flex items-center bg-white/[0.04] border border-white/10 rounded-sm p-1 w-full md:w-auto justify-around md:justify-start">
              <button
                onClick={() => { setIsPlaying(false); setActiveTab("game"); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  activeTab === "game"
                    ? "bg-[#C5A059] text-black shadow-lg"
                    : "text-white/45 hover:text-white hover:bg-white/5"
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 sm:w-3 h-3" />
                <span className="hidden sm:inline">GAME</span>
              </button>
              <button
                onClick={() => { setIsPlaying(false); setActiveTab("rules"); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  activeTab === "rules"
                    ? "bg-[#C5A059] text-black shadow-lg"
                    : "text-white/45 hover:text-white hover:bg-white/5"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 sm:w-3 h-3" />
                <span className="hidden sm:inline">RULES</span>
              </button>
              <button
                onClick={() => { setIsPlaying(false); setActiveTab("library"); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  activeTab === "library"
                    ? "bg-[#C5A059] text-black shadow-lg"
                    : "text-white/45 hover:text-white hover:bg-white/5"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-3 h-3" />
                <span className="hidden sm:inline">LIBRARY</span>
              </button>
              <button
                onClick={() => { setIsPlaying(false); setActiveTab("contact"); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  activeTab === "contact"
                    ? "bg-[#C5A059] text-black shadow-lg"
                    : "text-white/45 hover:text-white hover:bg-white/5"
                }`}
              >
                <Mail className="w-3.5 h-3.5 sm:w-3 h-3" />
                <span className="hidden sm:inline">CONTACT</span>
              </button>
            </nav>

            {/* Desktop Account profile HUD Badge */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center gap-2 border border-white/10 bg-white/[0.03] rounded-sm py-1 px-2">
                  <div className="w-6 h-6 bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#C5A059] text-[9.5px] font-bold rounded-full flex items-center justify-center shrink-0 uppercase select-none">
                    {profile?.displayName?.[0] || user.email?.[0] || "U"}
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[9px] font-medium text-white truncate max-w-[75px]">
                      {profile?.displayName || user.email?.split("@")[0]}
                    </span>
                    {profile && (
                      <span className="text-[7.5px] font-mono text-[#C5A059]/80 mt-0.5 uppercase tracking-wider">
                        🏆 {profile.highScore} PTS
                      </span>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="p-1 hover:text-red-400 text-white/40 transition-colors cursor-pointer ml-1 focus:outline-none"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="border border-[#C5A059]/30 hover:bg-[#C5A059] hover:text-black hover:border-transparent text-[#C5A059] px-3 py-2 text-[9px] font-bold tracking-widest rounded-sm transition-all uppercase flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <LogIn className="w-3 h-3" />
                  <span>SIGN IN</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CORE VIEW BODY */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 md:py-12 relative z-20 overflow-y-auto">
        
        {/* Game view controller */}
        {activeTab === "game" && (
          isPlaying ? (
            <PlayRoom 
              gameMode="ai" 
              difficulty={difficulty} 
              opponentType={opponentType}
              onBackToHome={() => setIsPlaying(false)} 
            />
          ) : (
            <div className="max-w-2xl mx-auto space-y-10 animate-fadeIn pt-2 pb-20">
              {/* Lobby Hero intro banner */}
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 border border-white/10 rounded-full text-[9px] font-bold tracking-[0.2em] text-white/40 leading-none uppercase">
                  <Sparkles className="w-3 h-3 text-[#C5A059] fill-current animate-pulse" />
                  KIKU TRADITIONAL ARENA
                </span>
                <h2 className="serif-italic text-4xl md:text-5xl text-white leading-tight font-light">
                  しりとりバトル
                </h2>
                <p className="text-[#C5A059] font-light text-xs tracking-[0.18em] uppercase leading-none">
                  SELECT YOUR COMPANION AND LEVEL!
                </p>
              </div>

              {/* Character grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.values(opponents).map((op) => (
                  <div
                    key={op.id}
                    onClick={() => setOpponentType(op.id)}
                    className={`relative rounded-sm p-6 border cursor-pointer transition-all flex flex-col justify-between ${op.style} ${
                      opponentType === op.id 
                        ? "border-[#C5A059] bg-white/[0.04] shadow-[0_0_20px_rgba(197,160,89,0.15)] scale-[1.02]" 
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div>
                      {/* Avatar container inside with circular mask */}
                      <div className="w-20 h-20 rounded-full border border-white/10 shadow-lg mx-auto overflow-hidden relative mb-4">
                        <img className="w-full h-full object-cover" src={op.avatar} alt={op.name} />
                      </div>
                      
                      <div className="text-center">
                        <span className={`px-2 py-0.5 rounded-sm font-sans tracking-widest text-[9px] inline-block leading-none ${op.badgeStyle}`}>
                          {op.badge}
                        </span>
                        <h3 className="serif-italic text-2xl text-white font-medium mt-3">
                          {op.name}
                        </h3>
                      </div>
                      
                      <p className="text-white/50 text-[12px] text-center mt-3 leading-relaxed font-light">
                        {op.desc}
                      </p>
                    </div>

                    <div className="mt-6 flex justify-center border-t border-white/5 pt-4 bg-transparent text-[9px] tracking-widest uppercase font-bold">
                      <span className={op.accent}>
                        {opponentType === op.id ? "● SELECTED COMPANION" : "CLICK TO CHOOSE"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Set Match Difficulty pane */}
              <section className="glass-card rounded-sm p-6 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-1.5 text-center md:text-left">
                    <h3 className="serif-italic text-2xl text-white">Battle Difficulty</h3>
                    <p className="font-light text-xs text-white/50 leading-relaxed">Easy mode is perfect for beginners and features dynamic typo hints.</p>
                  </div>
                  <div className="flex bg-white/5 border border-white/10 rounded-sm p-1 shrink-0">
                    <button
                      onClick={() => setDifficulty("easy")}
                      className={`px-4 py-2 rounded-sm text-[10px] font-bold tracking-widest transition-all uppercase flex items-center gap-1.5 ${
                        difficulty === "easy"
                          ? "bg-[#C5A059] text-black shadow font-bold"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      EASY MATCH
                    </button>
                    <button
                      onClick={() => setDifficulty("hard")}
                      className={`px-4 py-2 rounded-sm text-[10px] font-bold tracking-widest transition-all uppercase flex items-center gap-1.5 ${
                        difficulty === "hard"
                          ? "bg-[#C5A059] text-black shadow font-bold"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Crown className="w-3 h-3 text-current" />
                      HARD MATCH
                    </button>
                  </div>
                </div>
              </section>

              {/* Start match dynamic primary action button */}
              <div className="pt-2 flex justify-center w-full">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-full max-w-sm bg-[#C5A059] text-black hover:bg-[#D7B574] text-[10px] font-bold tracking-[0.25em] uppercase py-4 rounded-sm shadow-md transition-all active:translate-y-0.5 flex items-center justify-center gap-2 focus:outline-none"
                >
                  <span>START MATCH vs {opponents[opponentType].name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )
        )}

        {activeTab === "rules" && (
          <HowToPlay onStartGame={() => { setActiveTab("game"); setIsPlaying(true); }} />
        )}

        {activeTab === "library" && (
          <WordLibrary />
        )}

        {activeTab === "contact" && (
          <ContactForm />
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-surface-container text-on-surface-variant text-center py-4 border-t border-surface-variant/20 shrink-0 text-[10px] font-bold font-label-caps text-outline flex items-center justify-center gap-1">
        <span>Made with Love ❤️ © Shiritori Word Arena</span>
      </footer>

      {/* Secure Authentication Modal Gateway */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

    </div>
  );
}
