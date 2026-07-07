import { useEffect, useRef, useState } from "react";
import { searchDictionary, jishoUrl, type DictSearchResult } from "../lib/dictionaryData";
import { speak } from "../lib/romaji";

/**
 * A floating dictionary the player can open anywhere — on the home screen or
 * mid-game — to look up Japanese or English words. Offline & instant (no CORS,
 * no lag), with a "Search on Jisho" deep link for the long tail.
 */
export default function FloatingDictionary() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results: DictSearchResult[] = query.trim() ? searchDictionary(query) : [];

  // Focus the search box when the panel opens.
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [open]);

  // Esc closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        className="dict-fab"
        onClick={() => setOpen(true)}
        aria-label="Open dictionary"
        title="Dictionary / じしょ"
      >
        📖
      </button>

      {open && (
        <div className="dict-sheet fade-in" role="dialog" aria-label="Dictionary">
          <div className="dict-inner">
            <div className="topbar">
              <h2 className="dict-title">📖 じしょ · Dictionary</h2>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <input
              ref={inputRef}
              className="dict-search"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search English or 日本語 (kana / romaji / kanji)…"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />

            <div className="dict-results">
              {query.trim() === "" && (
                <p className="dict-hint">
                  Type a word in <b>English</b>, <b>romaji</b>, <b>kana</b>, or <b>kanji</b>.
                  <br />
                  Try: <code>dog</code>, <code>inu</code>, <code>いぬ</code>, or <code>犬</code>.
                </p>
              )}

              {query.trim() !== "" && results.length === 0 && (
                <p className="dict-hint">
                  No local match for “{query.trim()}”. Search the full dictionary:
                </p>
              )}

              {results.map(r => (
                <div className="dict-card" key={`${r.kana}-${r.romaji}-${r.en}`}>
                  <div className="dict-card-head">
                    <span className="dict-kana">
                      {r.kanji ? `${r.kanji}【${r.kana}】` : r.kana}
                    </span>
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
                  Search “{query.trim()}” on Jisho ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
