import { useEffect, useState } from "react";
import { ensureSignedIn } from "./firebase";
import Home from "./components/Home";
import GameRoom from "./components/GameRoom";
import Rules from "./components/Rules";
import { useSettings } from "./settings";

type View = { name: "home" } | { name: "room"; code: string };

export default function App() {
  const { t } = useSettings();
  const [uid, setUid] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [view, setView] = useState<View>({ name: "home" });
  const [showRules, setShowRules] = useState(false);
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem("shiritori_name") || ""
  );

  // Anonymous sign-in on first load.
  useEffect(() => {
    ensureSignedIn()
      .then(setUid)
      .catch((e) => setAuthError(t("connectError") + "\n" + (e?.message ?? "")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deep-link support: shiritori.app/?room=ABCD prefills the code on Home.
  const [deepLinkCode] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return (p.get("room") || "").toUpperCase();
  });

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
      </div>
    );
  }

  return (
    <>
      {view.name === "home" ? (
        <Home
          uid={uid}
          name={playerName}
          setName={setName}
          deepLinkCode={deepLinkCode}
          onEnterRoom={enterRoom}
          onShowRules={() => setShowRules(true)}
        />
      ) : (
        <GameRoom
          uid={uid}
          code={view.code}
          onLeave={leaveRoom}
          onShowRules={() => setShowRules(true)}
        />
      )}
      {showRules && <Rules onClose={() => setShowRules(false)} />}
    </>
  );
}
