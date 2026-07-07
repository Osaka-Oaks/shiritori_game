import { useEffect, useMemo, useRef, useState } from "react";
import {
  validateMove,
  getFirstKana,
  getChainKana,
  DEFAULT_RULES,
  type RuleSettings,
} from "../lib/shiritori";
import { romajiToHiragana, speak } from "../lib/romaji";
import { DICTIONARY } from "../lib/dictionaryData";
import { WORD_BANK } from "../lib/words";

export type Level = "easy" | "medium" | "hard";

interface LevelConfig {
  label: string;
  blurb: string;
  timer: number; // seconds per player turn
  thinkMs: number; // how long the CPU "thinks"
  giveUpChance: number; // chance the CPU passes even when it could move (kid-friendly)
  trap: boolean; // hard mode: prefer words that are hard to follow
}

const LEVELS: Record<Level, LevelConfig> = {
  easy: {
    label: "🌱 Easy",
    blurb: "Slow CPU, gentle words",
    timer: 60,
    thinkMs: 1600,
    giveUpChance: 0.25,
    trap: false,
  },
  medium: {
    label: "🔥 Medium",
    blurb: "Balanced match",
    timer: 30,
    thinkMs: 1000,
    giveUpChance: 0,
    trap: false,
  },
  hard: {
    label: "💀 Hard",
    blurb: "Fast CPU, sets traps",
    timer: 20,
    thinkMs: 550,
    giveUpChance: 0,
    trap: true,
  },
};

interface BotWord {
  kana: string;
  romaji: string;
  meaning: string;
}

// Merge both word sources into the CPU's vocabulary (deduped by kana).
const VOCAB: BotWord[] = (() => {
  const map = new Map<string, BotWord>();
  for (const w of WORD_BANK)
    map.set(w.kana, { kana: w.kana, romaji: w.romaji, meaning: w.meaning });
  for (const d of DICTIONARY) {
    if (!map.has(d.kana)) map.set(d.kana, { kana: d.kana, romaji: d.romaji, meaning: d.en });
  }
  // Only keep legal shiritori words (2+ kana, not ending in ん).
  return [...map.values()].filter(w => w.kana.length >= 2 && getChainKana(w.kana) !== "ん");
})();

interface Turn {
  word: string;
  romaji?: string;
  meaning?: string;
  by: "you" | "cpu";
}

type Status = "playing" | "won" | "lost";

interface Props {
  name: string;
  rules?: RuleSettings;
  onLeave: () => void;
}

export default function SinglePlayer({ name, rules = DEFAULT_RULES, onLeave }: Props) {
  const [level, setLevel] = useState<Level | null>(null);
  const [chain, setChain] = useState<Turn[]>([]);
  const [currentKana, setCurrentKana] = useState<string | null>(null);
  const [turn, setTurn] = useState<"you" | "cpu">("you");
  const [status, setStatus] = useState<Status>("playing");
  const [raw, setRaw] = useState("");
  const [message, setMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [endReason, setEndReason] = useState("");
  const cpuTimer = useRef<number | undefined>(undefined);

  const cfg = level ? LEVELS[level] : null;
  const converted = romajiToHiragana(raw);
  const used = useMemo(() => chain.map(c => c.word), [chain]);

  // ── Player turn countdown ──────────────────────────────
  useEffect(() => {
    if (status !== "playing" || turn !== "you" || !cfg) return;
    setSecondsLeft(cfg.timer);
    const id = window.setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          window.clearInterval(id);
          endGame("lost", "⏰ Time's up!");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, status, chain.length, level]);

  // ── CPU turn ───────────────────────────────────────────
  useEffect(() => {
    if (status !== "playing" || turn !== "cpu" || !cfg) return;
    cpuTimer.current = window.setTimeout(() => cpuMove(), cfg.thinkMs);
    return () => window.clearTimeout(cpuTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, status]);

  function startGame(lvl: Level) {
    setLevel(lvl);
    setChain([]);
    setCurrentKana(null);
    setTurn("you");
    setStatus("playing");
    setRaw("");
    setMessage("");
    setEndReason("");
  }

  function endGame(result: Status, reason: string) {
    setStatus(result);
    setEndReason(reason);
  }

  function countFollowUps(kana: string, usedSet: Set<string>): number {
    return VOCAB.filter(w => getFirstKana(w.kana) === kana && !usedSet.has(w.kana)).length;
  }

  function cpuMove() {
    if (!cfg) return;
    const usedSet = new Set(used);
    const need = currentKana;
    let candidates = VOCAB.filter(
      w => !usedSet.has(w.kana) && (need ? getFirstKana(w.kana) === need : true)
    );

    if (candidates.length === 0) {
      endGame("won", "🎉 The CPU is stuck — you win!");
      return;
    }

    // Easy mode: sometimes the CPU "gives up" so kids can win.
    if (cfg.giveUpChance > 0 && Math.random() < cfg.giveUpChance) {
      endGame("won", "🎉 The CPU gave up — you win!");
      return;
    }

    // Hard mode: pick a word that's hardest to follow (traps the player).
    if (cfg.trap) {
      candidates = [...candidates].sort(
        (a, b) =>
          countFollowUps(getChainKana(a.kana, rules), new Set([...usedSet, a.kana])) -
          countFollowUps(getChainKana(b.kana, rules), new Set([...usedSet, b.kana]))
      );
    } else {
      candidates = shuffle(candidates);
    }

    const pick = candidates[0];
    const nextKana = getChainKana(pick.kana, rules);
    setChain(c => [
      ...c,
      { word: pick.kana, romaji: pick.romaji, meaning: pick.meaning, by: "cpu" },
    ]);
    speak(pick.kana);

    if (nextKana === "ん") {
      // CPU played a word ending in ん — CPU loses (shouldn't happen, VOCAB filters these).
      endGame("won", "🎉 The CPU ended on ん — you win!");
      return;
    }
    setCurrentKana(nextKana);
    setTurn("you");
  }

  function submit() {
    if (status !== "playing" || turn !== "you") return;
    const check = validateMove(converted, currentKana, used, rules);
    if (!check.ok) {
      setMessage(check.reason);
      return;
    }
    setChain(c => [...c, { word: converted, by: "you" }]);
    speak(converted);
    setRaw("");
    setMessage("");

    if (check.losesByN) {
      endGame("lost", "💥 Your word ends in ん — you lose!");
      return;
    }
    setCurrentKana(check.chainKana);
    setTurn("cpu");
  }

  // ── Level picker ───────────────────────────────────────
  if (!level) {
    return (
      <div className="app fade-in">
        <div className="brand">
          <h1>🤖 vs CPU</h1>
          <p>Practice solo — pick a level</p>
        </div>
        <div className="card">
          {(Object.keys(LEVELS) as Level[]).map(lvl => (
            <button
              key={lvl}
              className="btn"
              style={{ marginBottom: 10 }}
              onClick={() => startGame(lvl)}
            >
              <b>{LEVELS[lvl].label}</b> — {LEVELS[lvl].blurb}
            </button>
          ))}
          <button className="btn ghost" style={{ marginTop: 8 }} onClick={onLeave}>
            ← Back
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
          ← Leave
        </button>
        <span className="sp-level">{cfg!.label}</span>
        {status === "playing" && turn === "you" && (
          <span className={`sp-timer ${secondsLeft <= 5 ? "low" : ""}`}>⏱ {secondsLeft}s</span>
        )}
      </div>

      <div className="card">
        {status === "playing" && (
          <p className="sp-turn">
            {turn === "you" ? (
              <>
                Your turn
                {currentKana ? (
                  <>
                    {" "}
                    — start with 「<b>{currentKana}</b>」
                  </>
                ) : (
                  <> — say any word!</>
                )}
              </>
            ) : (
              <>🤖 CPU is thinking…</>
            )}
          </p>
        )}

        {status !== "playing" && (
          <div className="sp-result">
            <h2>{status === "won" ? "🏆 You win!" : "😿 You lose"}</h2>
            <p>{endReason}</p>
            <button className="btn" style={{ marginTop: 12 }} onClick={() => startGame(level)}>
              🔁 Play again
            </button>
            <button
              className="btn secondary"
              style={{ marginTop: 8 }}
              onClick={() => setLevel(null)}
            >
              Change level
            </button>
          </div>
        )}

        <div className="sp-chain">
          {chain.length === 0 && <p className="dict-hint">The chain will appear here…</p>}
          {chain.map((t, i) => (
            <div key={i} className={`sp-word ${t.by}`}>
              <button className="speak" onClick={() => speak(t.word)} aria-label="Speak">
                🔊
              </button>
              <span className="sp-kana">{t.word}</span>
              {t.meaning && <span className="sp-meaning">{t.meaning}</span>}
              <span className="sp-who">{t.by === "you" ? name || "You" : "CPU"}</span>
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
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="Type romaji or kana…"
                autoFocus
                autoComplete="off"
              />
              <button className="btn" onClick={submit} disabled={!converted.trim()}>
                Play
              </button>
            </div>
            {converted && <p className="sp-preview">→ {converted}</p>}
            {message && <p className="error">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
