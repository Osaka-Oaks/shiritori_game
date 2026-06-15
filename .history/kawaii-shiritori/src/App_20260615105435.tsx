import React from "react";
import { AppView, PlayerProfile, OpponentBot, MatchHistory, LeaderboardUser } from "./types";
import HomeView from "./components/HomeView";
import AvatarPickerView from "./components/AvatarPickerView";
import GameRoomView from "./components/GameRoomView";
import HistoryView from "./components/HistoryView";
import LibraryView from "./components/LibraryView";
import LeaderboardView from "./components/LeaderboardView";
import EnhancedRulesView from "./components/EnhancedRulesView";
import PracticeModeView from "./components/PracticeModeView";
import MultiplayerView from "./components/MultiplayerView";
import UnityGameView from "./components/UnityGameView";
import { motion, AnimatePresence } from "motion/react";
import { Gamepad2, History, BookOpen, Trophy, HelpCircle, Heart, Sparkles, X, Swords, Target, Users } from "lucide-react";

const BOT_OPPONENTS: OpponentBot[] = [
  {
    id: "usagi",
    name: "Usagi Chan",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5Lg5SU1xKaPIp0mM--d-Cep1T93IrZoLObvX2XNsHO8P-sgdUN8q_D1v5DWfBUXEkKW59oJtJcM0q8o4_1jT5XFM9M3Mu3amwXXKFMPfo_S6MscBlMqBrO4sDHxvHNL1KlKIXI91sYZkaYd-X8aH6yzGf6ABkJUT1E2QAQnPRZLZ0C9c67gWNbWx6hmp-2oMyST2EHB4FLVV-XvbRz-RXEZegVx39CKMnsJnPtoetEXNsOdQjg-KTjAmi2s2j1M3NOXlLjHtcDQo7",
    difficulty: "easy",
    description: "A lovable, speedy little bunny. Plays very easy everyday nouns starting from standard sounds."
  },
  {
    id: "inu_sensei",
    name: "Inu Sensei",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv2_dSmuLzNIvq77bleM6yYK1w2nskbF-805BwE30p1TCTfPqHucQDAhM51009utAwsM6gOV0Pf4wEKJ7SxEX9Zv2R7bHUD9Y48kWy2ryoViyezxrLRkfiMgWMXsgiswNZmqFEyeSZFvAUfS-BjXK2NuUE1tD4HE6ks_DU_weW0RR9jrg9ESv15u3kPcSXDOMX7jQdFtaqgPe82uxThMpWFrN0mLCMa8PEBZTMiDunmvltqaE4mghXOTvBoEhYqMx7RPt3lUshKVvY",
    difficulty: "medium",
    description: "The wise Shiba dog. Plays highly balanced, interesting nouns. A delightful, strategic match!"
  },
  {
    id: "neko_master",
    name: "Neko Master",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtgTJqbRrHR2A3kE3800L-klEN5Xn6-0v2Aa9D0SlnqU1DCP3BhnHXWghoFfL6hSsN1FgrjDtMuQUoSw9-xYVpSZMToJQx2tFlV6D2ngX5OuZT5cj3zk200QkuLB_UewEHTwuWRCVz9_q5-zmcpDpKWe-YrQnTqDPnYjkUfgahX40ChVBXYlskeWfuxd_VL3-UKJsmzBw8Fz96Ca8kuo7wD9D74opPtuFFAyxVH5PEFL_KwOepANbXGRwen5j8dl3p4nXwzKHJ-ApH",
    difficulty: "hard",
    description: "The Grandmaster of Japanese word games. Plays challenging, multisyllabic vocabulary. Master tier!"
  }
];

const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Neko Master", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtgTJqbRrHR2A3kE3800L-klEN5Xn6-0v2Aa9D0SlnqU1DCP3BhnHXWghoFfL6hSsN1FgrjDtMuQUoSw9-xYVpSZMToJQx2tFlV6D2ngX5OuZT5cj3zk200QkuLB_UewEHTwuWRCVz9_q5-zmcpDpKWe-YrQnTqDPnYjkUfgahX40ChVBXYlskeWfuxd_VL3-UKJsmzBw8Fz96Ca8kuo7wD9D74opPtuFFAyxVH5PEFL_KwOepANbXGRwen5j8dl3p4nXwzKHJ-ApH", score: 2500 },
  { rank: 2, name: "Sakura San", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuANOuGrOsv-96XQvI8bosq_UYcnNGdxDKm5cOF2YbrvU1TWSXsQvqqqDS4bVFmwbRDeWP4shfrZmDoXtHB3gt-9IJJITzse1D_ewjhj3qT-paPy294Mz5tih9ZdTEGRa-1chVf5KhcVghmhCvUGqQppn9DFqiQvq1gT1wE0GO0Ac5b15y8tju5B5TTWmXgZeg2ysTvNs_UqjgtaKDCqvK68L8-TWauBjqCXJacIiX80f33WvQ2maDkrMR3v9xaMaCfTi-YQA5YXO6Jj", score: 1800 },
  { rank: 3, name: "Inu Sensei", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv2_dSmuLzNIvq77bleM6yYK1w2nskbF-805BwE30p1TCTfPqHucQDAhM51009utAwsM6gOV0Pf4wEKJ7SxEX9Zv2R7bHUD9Y48kWy2ryoViyezxrLRkfiMgWMXsgiswNZmqFEyeSZFvAUfS-BjXK2NuUE1tD4HE6ks_DU_weW0RR9jrg9ESv15u3kPcSXDOMX7jQdFtaqgPe82uxThMpWFrN0mLCMa8PEBZTMiDunmvltqaE4mghXOTvBoEhYqMx7RPt3lUshKVvY", score: 1200 },
  { rank: 4, name: "Haru Chan", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDD-0xFlMJoGr1RST4hByi07rC_6PAviMKob8wj8uioHoe4f4E92-JmQDXgh68sUWTe8HXRvsYMq1-sh6YQPQGAuQzqkDlxLTbZWrhSDAz0D9ncR-nTE-bZUeMT21DVWBlah5mWPl_GzvP1e0jLJ0Rp-_pFdEg_PS26_k8JpoKK_MkyyZ2__lzdPwrIi9kRjaEbOGZFDZpKHo6aUnHvq06fxLS4-w5gF2QgiIS8hhHvHqOOSqvBiHM2JbrcdbYSZbHHFdgMm5AR2_8k", score: 850 },
  { rank: 5, name: "Usagi Chan", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5Lg5SU1xKaPIp0mM--d-Cep1T93IrZoLObvX2XNsHO8P-sgdUN8q_D1v5DWfBUXEkKW59oJtJcM0q8o4_1jT5XFM9M3Mu3amwXXKFMPfo_S6MscBlMqBrO4sDHxvHNL1KlKIXI91sYZkaYd-X8aH6yzGf6ABkJUT1E2QAQnPRZLZ0C9c67gWNbWx6hmp-2oMyST2EHB4FLVV-XvbRz-RXEZegVx39CKMnsJnPtoetEXNsOdQjg-KTjAmi2s2j1M3NOXlLjHtcDQo7", score: 480 }
];

export default function App() {
  // --- CORE DECONSTRUCT COGNOMEN STATE ---
  const [activeView, setActiveView] = React.useState<AppView>("HOME");
  
  // Player state loaded from storage
  const [profile, setProfile] = React.useState<PlayerProfile>(() => {
    const saved = localStorage.getItem("shiritori_profile");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      name: "Jarrel-Chan",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAhGgljqsqv9TjA1w8oJvAroRa4sVp4WYWWH7-yTfECPHP1Wj_OukHz67zLzOZJfViMqUGjC5Y1s4G5tM9y4gSF_-85y7idVgPkgadWNwV93yuJUZdjhT_4c3-qi3LiMf-Au4l3KQ2NEgHSi371jGRuK7sZjFCKCppJ3mA7GRL7ZGQHiNLkGaTNfc96bYF3_OAR63hiFChR48MqboTcXg_1e2SNWy-N3RrLx2rEPQmmGP2U5ENpcZNQx24m5NrHEZv36pVUcjbGEp1"
    };
  });

  // Matches logs history loaded from storage
  const [matches, setMatches] = React.useState<MatchHistory[]>(() => {
    const saved = localStorage.getItem("shiritori_matches_v2");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [];
  });

  // Active playing bot opponent
  const [selectedBot, setSelectedBot] = React.useState<OpponentBot>(BOT_OPPONENTS[1]);

  // Sized match details modal state overlay
  const [detailModalMatch, setDetailModalMatch] = React.useState<MatchHistory | null>(null);

  // Sync profile storage on edits
  React.useEffect(() => {
    localStorage.setItem("shiritori_profile", JSON.stringify(profile));
  }, [profile]);

  // Sync matches history storage on updates
  React.useEffect(() => {
    localStorage.setItem("shiritori_matches_v2", JSON.stringify(matches));
  }, [matches]);

  // --- SCORE REDUCTION RECAP SYSTEM FOR LEADERBOARD ---
  const leaderboardWithCurrent = React.useMemo(() => {
    // Collect all unique matches score points of player
    const playerTotalPoints = matches.reduce((acc, curr) => acc + curr.playerScore, 0);

    const playerEntry: LeaderboardUser = {
      rank: 99, // solved below
      name: `${profile.name} (YOU)`,
      avatarUrl: profile.avatarUrl,
      score: playerTotalPoints || 150, // default soft score to place them nicely
      isCurrentUser: true,
    };

    const combined = [...INITIAL_LEADERBOARD, playerEntry];
    return combined
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({
        ...item,
        rank: idx + 1
      }));
  }, [matches, profile]);

  const handleStartGameSetup = () => {
    setActiveView("AVATAR_PICKER");
  };

  const handleConfirmStart = (userProfile: PlayerProfile, opponentBot: OpponentBot) => {
    setProfile(userProfile);
    setSelectedBot(opponentBot);
    setActiveView("GAME_ROOM");
  };

  const handleGameFinishedLog = (newReport: MatchHistory) => {
    setMatches(prev => [newReport, ...prev]);
  };

  const handleClearMatchesLog = () => {
    if (confirm("Are you sure you want to clear your lifetime match history and high-scores?")) {
      setMatches([]);
    }
  };

  const handleSelectRecentMatch = (m: MatchHistory) => {
    setDetailModalMatch(m);
  };

  // Switch tabs handler helper
  const renderViewContent = () => {
    switch (activeView) {
      case "HOME":
        return (
          <HomeView
            profile={profile}
            matches={matches}
            onStartGame={handleStartGameSetup}
            onOpenRules={() => setActiveView("RULES")}
            onSelectMatch={handleSelectRecentMatch}
            onOpenPractice={() => setActiveView("PRACTICE")}
            onOpenMultiplayer={() => setActiveView("MULTIPLAYER")}
          />
        );
      case "AVATAR_PICKER":
        return (
          <AvatarPickerView
            initialProfile={profile}
            opponents={BOT_OPPONENTS}
            onConfirm={handleConfirmStart}
          />
        );
      case "GAME_ROOM":
        return (
          <GameRoomView
            playerProfile={profile}
            selectedBot={selectedBot}
            onGameFinished={handleGameFinishedLog}
            onExit={() => setActiveView("HOME")}
          />
        );
      case "RULES":
        return <EnhancedRulesView />;
      case "HISTORY":
        return (
          <HistoryView
            matches={matches}
            onClearHistory={handleClearMatchesLog}
            onSelectMatch={handleSelectRecentMatch}
          />
        );
      case "LIBRARY":
        return <LibraryView />;
      case "LEADERBOARD":
        return <LeaderboardView users={leaderboardWithCurrent} />;
      case "PRACTICE":
        return <PracticeModeView />;
      case "MULTIPLAYER":
        return <MultiplayerView profile={profile} onBack={() => setActiveView("HOME")} />;
      default:
        return <div className="text-center py-20 font-body">Tab parsing anomaly error inside view registry.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-surface confetti-bg flex flex-col font-sans text-on-surface antialiased overflow-x-hidden">
      
      {/* GLOBAL APPLICATION BRAND GLASS HEADER HEADER */}
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b-2 border-surface-container-high py-3 px-5 flex items-center justify-between shadow-xs">
        <div 
          onClick={() => setActiveView("HOME")} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-2xl filter drop-shadow">🌸</span>
          <div>
            <h1 className="font-display-game font-extrabold text-lg text-primary tracking-tight leading-none flex items-center gap-1">
              しりとり <span className="font-medium text-xs text-on-surface-variant font-body">Shiritori Duel!</span>
            </h1>
            <p className="text-[9px] text-outline-variant font-body font-bold mt-0.5">KAWAII EDITION</p>
          </div>
        </div>

        {/* Small preview of active profile info */}
        {activeView !== "GAME_ROOM" && (
          <div 
            onClick={() => setActiveView("AVATAR_PICKER")} 
            className="flex items-center gap-2 bg-surface-container-low border border-primary/10 pl-2.5 pr-3 py-1.5 rounded-full cursor-pointer hover:border-primary/40 transition-colors shadow-sm"
          >
            <img
              alt="Header profile mini avatar thumbnail"
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border"
              src={profile.avatarUrl}
            />
            <span className="text-[10px] text-on-surface-variant font-body font-extrabold max-w-[80px] truncate">
              {profile.name}
            </span>
          </div>
        )}
      </header>

      {/* MAIN LAYOUT CANVAS WRAPPER CONTEXT */}
      <main className="flex-grow w-full max-w-4xl mx-auto flex flex-col relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            className="w-full flex-grow flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            {renderViewContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* REUSABLE FLOATING MATCH DETAILS OVERLAY POPUP */}
      <AnimatePresence>
        {detailModalMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 35 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94 }}
              className="bg-surface-container-lowest border-4 border-primary rounded-3xl p-6 text-center max-w-sm w-full shadow-xl space-y-4 text-left relative"
            >
              {/* Close Button x */}
              <button
                onClick={() => setDetailModalMatch(null)}
                className="absolute right-4 top-4 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-outline cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-headline font-black text-lg text-on-surface flex items-center gap-1.5 select-none text-primary">
                <Swords className="w-5 h-5 text-primary" />
                Battle Report Duel Details
              </h3>

              <div className="flex items-center gap-3 bg-surface p-3 rounded-2xl border border-outline-variant/10 shadow-xs">
                <img
                  alt="opponent avatar"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border"
                  src={detailModalMatch.opponentAvatar}
                />
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">
                    Opponent: {detailModalMatch.opponentName}
                  </h4>
                  <p className="text-[10px] text-outline font-body">Match date: {detailModalMatch.date}</p>
                </div>
              </div>

              {/* Stats dashboard details */}
              <div className="grid grid-cols-3 gap-2 text-center font-body text-xs">
                <div className="bg-slate-100/50 p-2.5 rounded-xl border border-outline-variant/15">
                  <span className="text-[9px] font-label-caps text-on-surface-variant block">SCORE</span>
                  <span className="font-headline font-bold text-sm text-primary">
                    {detailModalMatch.playerScore} - {detailModalMatch.opponentScore}
                  </span>
                </div>
                <div className="bg-slate-100/50 p-2.5 rounded-xl border border-outline-variant/15">
                  <span className="text-[9px] font-label-caps text-on-surface-variant block">CHAINS</span>
                  <span className="font-headline font-bold text-sm text-secondary">{detailModalMatch.chainLength} words</span>
                </div>
                <div className="bg-slate-100/50 p-2.5 rounded-xl border border-outline-variant/15">
                  <span className="text-[9px] font-label-caps text-on-surface-variant block">RESULT</span>
                  <span className={`font-headline font-bold text-sm ${detailModalMatch.didWin ? 'text-secondary' : 'text-error'}`}>
                    {detailModalMatch.didWin ? "VICTORY" : "DEFEAT"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1.5 font-body">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  The match duel came to an end due to the word chain matching ending sound validation. The last played word recorded was <strong className="font-extrabold text-primary font-display-game font-semibold">{detailModalMatch.fatalWord || "N/A"}</strong>.
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      // Lookup matching opponent bot config of this record
                      const matchedBot = BOT_OPPONENTS.find(b => b.name === detailModalMatch.opponentName) || BOT_OPPONENTS[1];
                      setSelectedBot(matchedBot);
                      setDetailModalMatch(null);
                      setActiveView("GAME_ROOM");
                    }}
                    className="w-full bg-primary text-on-primary font-bold py-2.5 px-4 rounded-xl shadow-md cursor-pointer hover:bg-opacity-95 text-xs text-center border-none flex items-center justify-center gap-1"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    Replay Bot Match
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FLOATING TAB NAVIGATION BAR (STAY BOTTOM STICKY ALWAYS) --- */}
      {activeView !== "GAME_ROOM" && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container/95 backdrop-blur-md border-t-2 border-primary py-2.5 px-3 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.5)] rounded-none max-w-lg mx-auto select-none">
          {/* Tab 1: Game / Play */}
          <button
            onClick={() => setActiveView("HOME")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-transform duration-100 active:scale-95 ${
              activeView === 'HOME' || activeView === 'AVATAR_PICKER' ? 'text-primary' : 'text-outline hover:text-primary/70'
            }`}
          >
            <Gamepad2 className="w-5.5 h-5.5" />
            <span className="text-[10px] font-body font-bold">Play</span>
          </button>

          {/* Tab 2: Match History statistics */}
          <button
            onClick={() => setActiveView("HISTORY")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-transform duration-100 active:scale-95 ${
              activeView === 'HISTORY' ? 'text-primary' : 'text-outline hover:text-primary/70'
            }`}
          >
            <History className="w-5.5 h-5.5" />
            <span className="text-[10px] font-body font-bold">History</span>
          </button>

          {/* Tab 3: Dictionary referee search */}
          <button
            onClick={() => setActiveView("LIBRARY")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-transform duration-100 active:scale-95 ${
              activeView === 'LIBRARY' ? 'text-primary' : 'text-outline hover:text-primary/70'
            }`}
          >
            <BookOpen className="w-5.5 h-5.5" />
            <span className="text-[10px] font-body font-bold">Dictionary</span>
          </button>

          {/* Tab 4: Leaderboard Podium */}
          <button
            onClick={() => setActiveView("LEADERBOARD")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-transform duration-100 active:scale-95 ${
              activeView === 'LEADERBOARD' ? 'text-primary' : 'text-outline hover:text-primary/70'
            }`}
          >
            <Trophy className="w-5.5 h-5.5" />
            <span className="text-[10px] font-body font-bold">Leaderboard</span>
          </button>

          {/* Tab 5: Help/Rules center */}
          <button
            onClick={() => setActiveView("RULES")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-transform duration-100 active:scale-95 ${
              activeView === 'RULES' ? 'text-primary' : 'text-outline hover:text-primary/70'
            }`}
          >
            <HelpCircle className="w-5.5 h-5.5" />
            <span className="text-[10px] font-body font-bold">Rules</span>
          </button>
        </nav>
      )}

      {/* LOVELY SYSTEM FOOTER ACCENTS CREDITS */}
      {activeView !== "GAME_ROOM" && (
        <footer className="w-full text-center py-10 pb-28 text-[11px] text-outline/50 font-body select-none">
          <div className="flex items-center justify-center gap-1">
            <span>Made with</span>
            <Heart className="w-3" />
            <span>for Japanese Learners</span>
          </div>
          <p className="mt-1">© 2026 Kawaii Shiritori Duel. All Rights Reserved.</p>
        </footer>
      )}
    </div>
  );
}
