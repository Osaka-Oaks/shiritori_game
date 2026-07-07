import { useCallback, useEffect, useRef, useState } from "react";
import {
  searchDictionary,
  jishoUrl,
  type DictSearchResult,
} from "../../lib/dictionary/dictionary-data";
import { speak } from "../../lib/japanese/romaji";

const PIP_W = 300;
const PIP_H = 420;
const POS_KEY = "shiritori_dict_pip_pos";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function loadPos(): { x: number; y: number } | null {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as { x: number; y: number };
    if (typeof p.x === "number" && typeof p.y === "number") return p;
  } catch {
    /* ignore */
  }
  return null;
}

interface Props {
  /** When true, panel auto-fades to ghost mode so it doesn't block gameplay. */
  isPlaying?: boolean;
}

/**
 * Picture-in-picture dictionary — draggable, minimizable, see-through ghost mode,
 * and hideable back to the 📖 FAB. No backdrop; the game stays fully interactive.
 */
export default function FloatingDictionary({ isPlaying = false }: Props) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [ghost, setGhost] = useState(false);
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState<{ x: number; y: number } | null>(loadPos);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null);

  const results: DictSearchResult[] = query.trim() ? searchDictionary(query) : [];
  const seeThrough = ghost || isPlaying;

  // Place the panel bottom-right the first time it opens.
  useEffect(() => {
    if (open && !pos) {
      setPos({
        x: Math.max(8, window.innerWidth - PIP_W - 16),
        y: Math.max(8, window.innerHeight - PIP_H - 16),
      });
    }
  }, [open, pos]);

  // Persist position after drag.
  useEffect(() => {
    if (pos) localStorage.setItem(POS_KEY, JSON.stringify(pos));
  }, [pos]);

  // Focus the search box when opened / restored.
  useEffect(() => {
    if (open && !minimized && !seeThrough) {
      const id = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(id);
    }
  }, [open, minimized, seeThrough]);

  // Esc hides the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragOffset.current) return;
    setPos({
      x: clamp(e.clientX - dragOffset.current.dx, 4, window.innerWidth - 60),
      y: clamp(e.clientY - dragOffset.current.dy, 4, window.innerHeight - 44),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    dragOffset.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }, [onPointerMove]);

  function startDrag(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("button")) return;
    if (!pos) return;
    dragOffset.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  if (!open) {
    return (
      <button
        className={`dict-fab${isPlaying ? " playing" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open dictionary"
        title="Dictionary / じしょ"
      >
        📖
      </button>
    );
  }

  return (
    <div
      className={`dict-pip${seeThrough ? " ghost" : ""}${minimized ? " min" : ""}${isPlaying ? " playing" : ""}`}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
      role="dialog"
      aria-label="Dictionary"
    >
      <div className="dict-pip-bar" onPointerDown={startDrag}>
        <span className="dict-pip-title">📖 じしょ</span>
        <button
          className="dict-pip-btn"
          onClick={() => setGhost(g => !g)}
          aria-label="Toggle see-through"
          title={seeThrough ? "Make solid" : "Make see-through"}
        >
          {seeThrough ? "👁" : "🌫"}
        </button>
        <button
          className="dict-pip-btn"
          onClick={() => setMinimized(m => !m)}
          aria-label={minimized ? "Restore" : "Minimize"}
          title={minimized ? "Restore" : "Minimize"}
        >
          {minimized ? "▢" : "—"}
        </button>
        <button
          className="dict-pip-btn"
          onClick={() => setOpen(false)}
          aria-label="Hide dictionary"
          title="Hide"
        >
          ✕
        </button>
      </div>

      {!minimized && (
        <div className="dict-pip-body">
          <input
            ref={inputRef}
            className="dict-search"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="English or 日本語…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />

          <div className="dict-results">
            {query.trim() === "" && (
              <p className="dict-hint">
                Look up a word while you play. Try <code>dog</code>, <code>inu</code>,{" "}
                <code>いぬ</code>, or <code>犬</code>.
              </p>
            )}

            {query.trim() !== "" && results.length === 0 && (
              <p className="dict-hint">No local match — try the full dictionary:</p>
            )}

            {results.map(r => (
              <div className="dict-card" key={`${r.kana}-${r.romaji}-${r.en}`}>
                <div className="dict-card-head">
                  <span className="dict-kana">{r.kanji ? `${r.kanji}【${r.kana}】` : r.kana}</span>
                  {r.jlpt && <span className="dict-badge">{r.jlpt}</span>}
                  <button
                    className="speak"
                    onClick={() => speak(r.kana)}
                    aria-label={`Speak ${r.romaji}`}
                  >
                    🔊
                  </button>
                </div>
                <div className="dict-romaji">{r.romaji}</div>
                <div className="dict-en">
                  <span className="dict-pos">{r.pos}</span> {r.en}
                </div>
              </div>
            ))}

            {query.trim() !== "" && (
              <a
                className="btn secondary dict-jisho"
                href={jishoUrl(query)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Search on Jisho ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
