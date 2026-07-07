import { useEffect, useRef, useState } from "react";
import { DEFAULT_RULES, type RuleSettings } from "../lib/shiritori";
import { romajiToHiragana, speak } from "../lib/romaji";
import { lookupWord } from "../lib/dictionary";
import { needsReadingLookup } from "../lib/japanese";
import { LEVEL_LIST, type LevelId, parseLevelId } from "../lib/levels";
import {
  createSoloGame,
  cpuMove,
  applyPlayerWord,
  attachWordMeta,
  type SoloState,
} from "../lib/soloEngine";
import { loadDevSettings, saveDevSettings, type DevSettings } from "../lib/devMode";
import { useSettings } from "../settings";

interface Props {
  name: string;
  rules?: RuleSettings;
  initialLevel?: LevelId | null;
  onLeave: () => void;
}

export default function SinglePlayer({
  name,
  rules = DEFAULT_RULES,
  initialLevel = null,
  onLeave,
}: Props) {
  const { t } = useSettings();
  const [levelId, setLevelId] = useState<LevelId | null>(initialLevel);
  const [game, setGame] = useState<SoloState | null>(null);
  const [raw, setRaw] = useState("");
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);
  const [liveMeaning, setLiveMeaning] = useState<string | undefined>();
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [dev, setDev] = useState<DevSettings>(() => loadDevSettings());
  const [showDev, setShowDev] = useState(false);
  const cpuTimer = useRef<number | undefined>(undefined);

  const cfg = game?.level ?? null;
  const converted = romajiToHiragana(raw);
  const status = game?.status ?? "playing";
  const turn = game?.turn ?? "you";

  function patchDev(patch: Partial<DevSettings>) {
    setDev(saveDevSettings(patch));
  }

  function startGame(id: LevelId) {
    const level = LEVEL_LIST.find(l => l.id === id)!;
    setLevelId(id);
    setGame(createSoloGame(level));
    setRaw("");
    setMessage("");
    setLiveMeaning(undefined);
  }

  // Live dictionary preview while typing.
  useEffect(() => {
    setLiveMeaning(undefined);
    if (converted.length < 2) return;
    const timer = setTimeout(async () => {
      const { valid, meaning } = await lookupWord(converted);
      if (valid) setLiveMeaning(meaning);
    }, 400);
    return () => clearTimeout(timer);
  }, [converted]);

  // Player turn timer.
  useEffect(() => {
    if (!game || status !== "playing" || turn !== "you" || !cfg) return;
    if (dev.skipTimer) {
      setSecondsLeft(cfg.timer);
      return;
    }
    setSecondsLeft(cfg.timer);
    const id = window.setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          window.clearInterval(id);
          setGame(g =>
            g ? { ...g, status: "lost", endReason: "⏰ Time's up!", lastFeedback: "⏰ Time's up!" } : g
          );
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [turn, status, game?.chain.length, levelId, dev.skipTimer, cfg, game]);

  // CPU turn.
  useEffect(() => {
    if (!game || status !== "playing" || turn !== "cpu" || !cfg) return;
    const delay = dev.instantCpu ? 80 : cfg.thinkMs;
    cpuTimer.current = window.setTimeout(() => {
      const { state, message: cpuMsg } = cpuMove(game, rules, dev);
      setGame(state);
      speak(state.chain[state.chain.length - 1]?.word ?? "");
      if (dev.showDebug) setMessage(cpuMsg);
    }, delay);
    return () => window.clearTimeout(cpuTimer.current);
  }, [turn, status, game?.chain.length, dev.instantCpu, cfg, game, rules, dev]);

  async function submit() {
    if (!game || status !== "playing" || turn !== "you") return;
    const word = converted.trim();
    if (!word) return;

    setChecking(true);
    setMessage("");

    let readingKana: string | undefined;
    let meaning: string | undefined;

    if (game.level.requireDictionary && !dev.skipDictionary) {
      const lookup = await lookupWord(word);
      if (!lookup.valid) {
        setMessage(t("notRealWord"));
        setChecking(false);
        return;
      }
      meaning = lookup.meaning;
      if (needsReadingLookup(word)) readingKana = lookup.reading;
    } else if (!dev.skipDictionary) {
      const lookup = await lookupWord(word);
      meaning = lookup.meaning;
      if (needsReadingLookup(word)) readingKana = lookup.reading;
    }

    const result = applyPlayerWord(game, word, rules, dev, readingKana);
    setChecking(false);

    if (!result.ok) {
      setMessage(result.reason ?? "Invalid word");
      setGame(result.state);
      return;
    }

    let next = result.state;
    if (meaning) next = attachWordMeta(next, word, { meaning });
    setGame(next);
    setRaw("");
    setMessage("");
    speak(word);

    if (next.status !== "playing") return;
  }

  function forceCpuTurn() {
    if (!game || game.turn !== "cpu") return;
    const { state } = cpuMove(game, rules, dev);
    setGame(state);
    speak(state.chain[state.chain.length - 1]?.word ?? "");
  }

  // ── Level picker ───────────────────────────────────────
  if (!levelId || !game) {
    return (
      <div className="app fade-in">
        <div className="brand">
          <h1>🤖 {t("soloTitle")}</h1>
          <p>{t("soloSubtitle")}</p>
        </div>
        <div className="card">
          <div className="sp-level-grid">
            {LEVEL_LIST.map(lvl => (
              <button key={lvl.id} className="sp-level-card" onClick={() => startGame(lvl.id)}>
                <span className="sp-level-emoji">{lvl.emoji}</span>
                <span className="sp-level-name">{lvl.label}</span>
                <span className="sp-level-blurb">{lvl.blurb}</span>
                <span className="sp-level-meta">
                  ⏱ {lvl.timer}s · {lvl.requireDictionary ? "📖 dict" : "📝 casual"}
                </span>
              </button>
            ))}
          </div>
          {dev.enabled && (
            <p className="sp-dev-badge">🛠 Dev mode on — open solo with ?dev=1</p>
          )}
          <button className="btn ghost" style={{ marginTop: 12 }} onClick={onLeave}>
            ← {t("backHome")}
          </button>
        </div>
      </div>
    );
  }

  // ── Game board ─────────────────────────────────────────
  return (
    <div className="app fade-in">
      <div className="sp-top">
        <button className="btn ghost small" onClick={onLeave}>
          ← {t("backHome")}
        </button>
        <span className="sp-level">
          {cfg!.emoji} L{cfg!.id}
        </span>
        {dev.enabled && (
          <button className="btn ghost small" onClick={() => setShowDev(s => !s)}>
            🛠
          </button>
        )}
        {status === "playing" && turn === "you" && !dev.skipTimer && (
          <span className={`sp-timer ${secondsLeft <= 5 ? "low" : ""}`}>⏱ {secondsLeft}s</span>
        )}
      </div>

      {game.lastFeedback && <div className="sp-feedback">{game.lastFeedback}</div>}

      {showDev && dev.enabled && (
        <div className="sp-dev card">
          <b>Dev tools</b>
          <label className="sp-dev-row">
            <input
              type="checkbox"
              checked={dev.skipTimer}
              onChange={e => patchDev({ skipTimer: e.target.checked })}
            />
            Skip timer
          </label>
          <label className="sp-dev-row">
            <input
              type="checkbox"
              checked={dev.instantCpu}
              onChange={e => patchDev({ instantCpu: e.target.checked })}
            />
            Instant CPU
          </label>
          <label className="sp-dev-row">
            <input
              type="checkbox"
              checked={dev.skipDictionary}
              onChange={e => patchDev({ skipDictionary: e.target.checked })}
            />
            Skip dictionary check
          </label>
          <label className="sp-dev-row">
            <input
              type="checkbox"
              checked={dev.showDebug}
              onChange={e => patchDev({ showDebug: e.target.checked })}
            />
            Debug log
          </label>
          <button className="btn secondary small" onClick={forceCpuTurn} disabled={turn !== "cpu"}>
            Force CPU now
          </button>
          {dev.showDebug && game.debugLog.length > 0 && (
            <pre className="sp-debug">{game.debugLog.join("\n")}</pre>
          )}
        </div>
      )}

      <div className="card">
        {status === "playing" && (
          <p className="sp-turn">
            {turn === "you" ? (
              <>
                {t("soloYourTurn")}
                {game.currentKana ? (
                  <>
                    {" "}
                    — 「<b>{game.currentKana}</b>」
                  </>
                ) : (
                  <> — {t("anyFirst")}</>
                )}
              </>
            ) : (
              <>🤖 {t("soloCpuThinking")}</>
            )}
          </p>
        )}

        {status !== "playing" && (
          <div className="sp-result">
            <h2>{status === "won" ? `🏆 ${t("youWin")}` : `😿 ${t("youLose")}`}</h2>
            <p>{game.endReason}</p>
            <button className="btn" style={{ marginTop: 12 }} onClick={() => startGame(levelId)}>
              🔁 {t("soloPlayAgain")}
            </button>
            <button
              className="btn secondary"
              style={{ marginTop: 8 }}
              onClick={() => {
                setLevelId(null);
                setGame(null);
              }}
            >
              {t("soloChangeLevel")}
            </button>
          </div>
        )}

        <div className="sp-chain">
          {game.chain.length === 0 && <p className="dict-hint">{t("chainEmpty")}</p>}
          {game.chain.map((turn, i) => (
            <div key={i} className={`sp-word ${turn.by}`}>
              <button className="speak" onClick={() => speak(turn.word)} aria-label="Speak">
                🔊
              </button>
              <div className="sp-word-body">
                <span className="sp-kana">{turn.word}</span>
                {turn.meaning && <span className="sp-meaning">{turn.meaning}</span>}
                {turn.feedback && <span className="sp-word-feedback">{turn.feedback}</span>}
              </div>
              <span className="sp-who">{turn.by === "you" ? name || t("you") : "CPU"}</span>
            </div>
          ))}
        </div>

        {status === "playing" && turn === "you" && (
          <>
            <div className="row" style={{ marginTop: 12 }}>
              <input
                className="field"
                value={raw}
                onChange={e => setRaw(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !checking && submit()}
                placeholder={t("inputPlaceholder")}
                autoFocus
                autoComplete="off"
                disabled={checking}
              />
              <button className="btn" onClick={submit} disabled={!converted.trim() || checking}>
                {checking ? t("checking") : t("soloPlay")}
              </button>
            </div>
            {converted && <p className="sp-preview">→ {converted}</p>}
            {liveMeaning && <p className="sp-meaning-live">📖 {liveMeaning}</p>}
            {message && <p className="error">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export { parseLevelId };
