import { useEffect, useState } from "react";
import { ensureSignedIn } from "./firebase";
import Home from "./components/Home";
import GameRoom from "./components/GameRoom";
import Rules from "./components/Rules";
import Welcome from "./components/Welcome";
import LoveNote from "./components/LoveNote";
import FloatingDictionary from "./components/FloatingDictionary";
import SinglePlayer from "./components/SinglePlayer";
import { parseLevelId as parseLevel } from "./lib/levels";
import type { LevelId } from "./lib/levels";
import { enableDevMode } from "./lib/devMode";
import { useSettings } from "./settings";

type View = { name: "home" } | { name: "room"; code: string } | { name: "solo"; level?: LevelId };

const LOVE_KEY = "shiritori_lovenote_seen";

export default function App() {
  const { t } = useSettings();
  const [uid, setUid] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  // Deep-link: ?room=ABCD | ?solo=3 | ?dev=1
  const [deepLink] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return {
      room: (p.get("room") || "").toUpperCase(),
      solo: parseLevel(p.get("solo") ?? p.get("level")),
      dev: p.get("dev") === "1",
    };
  });

  const [deepLinkCode] = useState(() => deepLink.room);

  const [view, setView] = useState<View>(() =>
    deepLink.solo ? { name: "solo", level: deepLink.solo } : { name: "home" }
  );
  const [showRules, setShowRules] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLove, setShowLove] = useState(false);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("shiritori_name") || "");

  useEffect(() => {
    if (deepLink.dev) enableDevMode();
  }, [deepLink.dev]);

  useEffect(() => {
    ensureSignedIn()
      .then(setUid)
      .catch(e => setAuthError(t("connectError") + "\n" + (e?.message ?? "")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setName(name: string) {
    setPlayerName(name);
    localStorage.setItem("shiritori_name", name);
  }

  function enterRoom(code: string) {
    setView({ name: "room", code });
    // Clean the deep-link param from the URL once we're in.
    window.history.replaceState({}, "", window.location.pathname);
  }

  function leaveRoom() {
    setView({ name: "home" });
  }

  function closeLove() {
    localStorage.setItem(LOVE_KEY, "1");
    setShowLove(false);
  }

  const welcome = showWelcome ? (
    <Welcome
      name={playerName.trim()}
      onDone={() => {
        setShowWelcome(false);
        // First-ever visit: surprise Mei with the note.
        if (!localStorage.getItem(LOVE_KEY)) setShowLove(true);
      }}
    />
  ) : null;

  const loveNote = showLove ? <LoveNote fromName={playerName} onClose={closeLove} /> : null;

  if (authError) {
    return (
      <div className="app">
        <div className="brand">
          <h1>しりとり</h1>
          <p>{t("subtitle")}</p>
        </div>
        <div className="card">
          <p className="error" style={{ whiteSpace: "pre-wrap" }}>
            {authError}
          </p>
        </div>
      </div>
    );
  }

  if (!uid) {
    return (
      <div className="app">
        <div className="center-screen">
          <div className="spinner" />
          <p>{t("connecting")}</p>
        </div>
        {welcome}
        {loveNote}
      </div>
    );
  }

  return (
    <>
      {view.name === "home" && (
        <Home
          uid={uid}
          name={playerName}
          setName={setName}
          deepLinkCode={deepLinkCode}
          onEnterRoom={enterRoom}
          onSinglePlayer={() => setView({ name: "solo" })}
          onSoloLevel={level => setView({ name: "solo", level: level as LevelId })}
          onShowRules={() => setShowRules(true)}
          onShowLove={() => setShowLove(true)}
        />
      )}
      {view.name === "solo" && (
        <SinglePlayer
          name={playerName}
          initialLevel={view.level}
          onLeave={leaveRoom}
        />
      )}
      {view.name === "room" && (
        <GameRoom
          uid={uid}
          code={view.code}
          onLeave={leaveRoom}
          onShowRules={() => setShowRules(true)}
        />
      )}
      {showRules && <Rules onClose={() => setShowRules(false)} />}
      <FloatingDictionary />
      {welcome}
      {loveNote}
    </>
  );
}
