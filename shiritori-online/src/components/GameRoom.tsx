import { useEffect, useRef, useState } from "react";
import {
  subscribeRoom,
  playWord,
  finalizeTimeout,
  voteRematch,
  seatOf,
} from "../lib/roomService";
import { romajiToHiragana, speak } from "../lib/romaji";
import { findHint } from "../lib/words";
import { validateMove } from "../lib/shiritori";
import { lookupWord } from "../lib/dictionary";
import { useSettings, SettingsControls } from "../settings";
import type { GameState } from "../types";

interface Props {
  uid: string;
  code: string;
  onLeave: () => void;
  onShowRules: () => void;
}

export default function GameRoom({ uid, code, onLeave, onShowRules }: Props) {
  const { t } = useSettings();
  const [state, setState] = useState<GameState | null>(null);
  const [closed, setClosed] = useState(false);
  const [raw, setRaw] = useState("");
  const [moveError, setMoveError] = useState("");
  const [checking, setChecking] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const chainRef = useRef<HTMLDivElement>(null);
  const timeoutFiring = useRef(false);

  // Live room subscription.
  useEffect(() => {
    const unsub = subscribeRoom(code, (s) => {
      if (!s) {
        setClosed(true);
        return;
      }
      setState(s);
    });
    return unsub;
  }, [code]);

  // Ticking clock for the turn timer (lightweight, UI only).
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll the chain to the newest word.
  useEffect(() => {
    chainRef.current?.scrollTo({ top: chainRef.current.scrollHeight, behavior: "smooth" });
  }, [state?.words?.length]);

  // Clear a transient move error when the player edits their input.
  useEffect(() => {
    if (moveError) setMoveError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  const mySeat = state ? seatOf(state, uid) : -1;
  const theirSeat = mySeat === 0 ? 1 : 0;
  const isPlaying = state?.status === "playing";
  const myTurn = isPlaying && state?.turn === mySeat;

  // Timer math.
  const remainingMs =
    state && isPlaying
      ? state.timeLimit * 1000 - (now - state.turnStartedAt)
      : state
      ? state.timeLimit * 1000
      : 0;
  const remaining = Math.max(0, Math.ceil(remainingMs / 1000));
  const pct = state ? Math.max(0, Math.min(100, (remainingMs / (state.timeLimit * 1000)) * 100)) : 100;

  // Either client finalizes an expired turn (transaction makes this safe).
  useEffect(() => {
    if (!state || !isPlaying) return;
    if (remainingMs <= -2000 && !timeoutFiring.current) {
      timeoutFiring.current = true;
      finalizeTimeout(state).finally(() => {
        timeoutFiring.current = false;
      });
    }
  }, [state, isPlaying, remainingMs]);

  if (closed) {
    return (
      <div className="app">
        <div className="center-screen">
          <div style={{ fontSize: 48 }}>🍃</div>
          <p>{t("roomClosed")}</p>
          <button className="btn" style={{ maxWidth: 200 }} onClick={onLeave}>
            {t("backHome")}
          </button>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="app">
        <div className="center-screen">
          <div className="spinner" />
          <p>
            {t("loadingRoom")} {code}…
          </p>
        </div>
      </div>
    );
  }

  const theirName = state.names[String(theirSeat)];
  const opponentJoined = !!state.seats[String(theirSeat)];
  const converted = romajiToHiragana(raw);

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}?room=${code}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Shiritori", text: `Room code: ${code}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      /* user cancelled share */
    }
  }

  async function submit() {
    if (!state || !converted.trim() || checking) return;

    // Fast pre-check for obvious errors (wrong kana, duplicate, etc.) before hitting the API.
    const preCheck = validateMove(
      converted,
      state.currentKana,
      state.words.map((w) => w.word),
      state.settings
    );
    if (!preCheck.ok) {
      setMoveError(preCheck.reason);
      return;
    }

    setChecking(true);
    const { valid, meaning } = await lookupWord(converted);
    setChecking(false);

    if (!valid) {
      setMoveError(t("notRealWord"));
      return;
    }

    const res = await playWord(state, uid, converted, meaning);
    if (res.ok) {
      setRaw("");
    } else {
      setMoveError(res.reason);
    }
  }

  function useHint() {
    if (!state) return;
    const hint = findHint(state.currentKana, state.words.map((w) => w.word));
    if (hint) setRaw(hint.kana);
    else setMoveError(t("noHint"));
  }

  // ---------- Waiting for opponent ----------
  if (state.status === "waiting" || !opponentJoined) {
    return (
      <div className="app fade-in">
        <TopBar code={code} onLeave={onLeave} onShowRules={onShowRules} />
        <div className="center-screen" style={{ gap: 22 }}>
          <p style={{ margin: 0 }}>{t("shareCode")}</p>
          <div className="code-display">
            <span className="code">{code}</span>
          </div>
          <button className="btn" style={{ maxWidth: 260 }} onClick={share}>
            {copied ? t("linkCopied") : `📤 ${t("shareInvite")}`}
          </button>
          <p style={{ color: "var(--muted)" }}>
            {t("waitingP2")}
            <span className="dots">…</span>
          </p>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  // ---------- In-game / finished ----------
  return (
    <div className="app">
      <TopBar code={code} onLeave={onLeave} onShowRules={onShowRules} />

      <div className="scoreboard">
        <PlayerPill
          name={state.names[String(mySeat)] || t("you")}
          side="me"
          active={isPlaying && state.turn === mySeat}
          youLabel={t("you")}
        />
        <PlayerPill
          name={theirName || "Player 2"}
          side="them"
          active={isPlaying && state.turn === theirSeat}
          youLabel={t("opponent")}
        />
      </div>

      <div className={`timer ${remaining <= 5 && myTurn ? "danger" : ""}`}>
        <div style={{ width: `${pct}%` }} />
      </div>
      {isPlaying && (
        <div
          style={{
            textAlign: "center",
            marginTop: 6,
            color: remaining <= 5 ? "var(--bad)" : "var(--muted)",
            fontWeight: 700,
          }}
        >
          {myTurn
            ? t("yourTurnSec", { sec: remaining })
            : t("theirTurnSec", { name: theirName || t("opponentFallback"), sec: remaining })}
        </div>
      )}

      <div className="next-kana">
        <div className="lbl">{t("nextStartsWith")}</div>
        {state.currentKana ? (
          <div className="kana" key={state.currentKana}>
            {state.currentKana}
          </div>
        ) : (
          <div className="any">{t("anyFirst")}</div>
        )}
      </div>

      <div className="chain" ref={chainRef}>
        {state.words.length === 0 && (
          <div className="chain-empty">
            {t("chainEmpty")}
            <br />
            {myTurn ? t("playAnyNoun") : t("waitingFirst")}
          </div>
        )}
        {state.words.map((w, i) => {
          const mine = w.seat === mySeat;
          return (
            <div key={i} className={`bubble ${mine ? "me" : "them"}`}>
              <button className="speak" onClick={() => speak(w.word)} aria-label="Speak">
                🔊
              </button>
              <div className="kana">{w.word}</div>
              {w.meaning && <div className="meaning">{w.meaning}</div>}
              <div className="romaji">
                → {t("nextLabel")}: 「{w.kana}」
              </div>
            </div>
          );
        })}
      </div>

      {isPlaying && (
        <div className="dock">
          {myTurn ? (
            <>
              <div className="preview">
                {converted || <span className="ph">{t("typePrompt")}</span>}
              </div>
              {checking
                ? <div className="error" style={{ color: "var(--muted)" }}>{t("checking")}</div>
                : moveError && <div className="error">{moveError}</div>
              }
              <div className="dock-row">
                <input
                  className="field"
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  placeholder={t("inputPlaceholder")}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  enterKeyHint="send"
                  disabled={checking}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submit();
                    }
                  }}
                />
                <button className="send" onClick={submit} disabled={!converted.trim() || checking} aria-label="Send">
                  {checking ? "…" : "➤"}
                </button>
              </div>
              <button className="btn ghost hint-btn" onClick={useHint}>
                💡 {t("hint")}
              </button>
            </>
          ) : (
            <div className="waiting-turn">
              ⏳ {t("waitingOpp", { name: theirName || t("opponentFallback") })}
            </div>
          )}
        </div>
      )}

      {state.status === "finished" && (
        <GameOver
          state={state}
          mySeat={mySeat}
          onRematch={() => voteRematch(state, uid)}
          onLeave={onLeave}
        />
      )}
    </div>
  );
}

function TopBar({
  code,
  onLeave,
  onShowRules,
}: {
  code: string;
  onLeave: () => void;
  onShowRules: () => void;
}) {
  return (
    <div className="topbar">
      <button className="icon-btn" onClick={onLeave} aria-label="Leave">
        ✕
      </button>
      <span className="code-chip">{code}</span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <SettingsControls compact />
        <button className="icon-btn" onClick={onShowRules} aria-label="Rules">
          ？
        </button>
      </div>
    </div>
  );
}

function PlayerPill({
  name,
  side,
  active,
  youLabel,
}: {
  name: string;
  side: "me" | "them";
  active: boolean;
  youLabel: string;
}) {
  const { t } = useSettings();
  return (
    <div className={`player-pill ${side} ${active ? "active" : ""}`}>
      <div className="who">{youLabel}</div>
      <div className="name">{name}</div>
      {active && <div className="turn-tag">● {t("playing")}</div>}
    </div>
  );
}

function GameOver({
  state,
  mySeat,
  onRematch,
  onLeave,
}: {
  state: GameState;
  mySeat: number;
  onRematch: () => void;
  onLeave: () => void;
}) {
  const { t } = useSettings();
  const iWon = state.winnerSeat === mySeat;
  const myRematch = !!state.rematch?.[String(mySeat)];
  const theirSeat = mySeat === 0 ? 1 : 0;
  const theirRematch = !!state.rematch?.[String(theirSeat)];

  const reason =
    state.loseReasonCode === "n"
      ? t("endN", { word: state.loseWord ?? "" })
      : state.loseReasonCode === "timeout"
      ? t("endTimeout")
      : "";

  return (
    <div className="overlay fade-in">
      <div className="modal">
        <div className="emoji">{iWon ? "🎉" : "😿"}</div>
        <h2>{iWon ? t("youWin") : t("youLose")}</h2>
        <p className="reason">{reason}</p>
        <button className="btn" onClick={onRematch} disabled={myRematch}>
          {myRematch
            ? theirRematch
              ? t("startingRematch")
              : t("waitingOppRematch")
            : `🔄 ${t("rematch")}`}
        </button>
        {theirRematch && !myRematch && (
          <p style={{ color: "var(--accent)", fontSize: 13, marginTop: 10 }}>
            {t("oppWantsRematch")}
          </p>
        )}
        <button className="btn ghost" style={{ marginTop: 8 }} onClick={onLeave}>
          {t("leaveRoom")}
        </button>
      </div>
    </div>
  );
}
