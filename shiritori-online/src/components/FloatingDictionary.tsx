import { useState, useEffect, useRef } from "react";
import "./FloatingDictionary.css";

interface DictionaryEntry {
  word: string;
  translation?: string;
  romaji?: string;
  definition?: string;
  type?: string;
}

interface FloatingDictionaryProps {
  language?: "english" | "japanese" | "both";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export default function FloatingDictionary({
  language = "both",
  position = "bottom-right",
}: FloatingDictionaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"english" | "japanese">("english");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search dictionary
  const searchDictionary = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate dictionary search
      // In production, replace with actual dictionary API or local search
      await new Promise(resolve => setTimeout(resolve, 200));

      const mockResults: DictionaryEntry[] = [];

      if (activeTab === "english" || language === "both") {
        // English dictionary search
        const englishWords = [
          {
            word: "apple",
            definition: "A round fruit with red, yellow, or green skin",
            type: "noun",
          },
          { word: "elephant", definition: "A very large animal with a trunk", type: "noun" },
          {
            word: "tiger",
            definition: "A large wild cat with orange fur and black stripes",
            type: "noun",
          },
          { word: "rabbit", definition: "A small animal with long ears", type: "noun" },
        ];

        const englishMatches = englishWords.filter(w =>
          w.word.toLowerCase().includes(query.toLowerCase())
        );
        mockResults.push(...englishMatches);
      }

      if (activeTab === "japanese" || language === "both") {
        // Japanese dictionary search
        const japaneseWords = [
          { word: "いぬ", romaji: "inu", translation: "dog", type: "noun" },
          { word: "ねこ", romaji: "neko", translation: "cat", type: "noun" },
          { word: "さくら", romaji: "sakura", translation: "cherry blossom", type: "noun" },
          { word: "ゴリラ", romaji: "gorira", translation: "gorilla", type: "noun" },
        ];

        const japaneseMatches = japaneseWords.filter(
          w =>
            w.word.includes(query) ||
            w.romaji?.toLowerCase().includes(query.toLowerCase()) ||
            w.translation?.toLowerCase().includes(query.toLowerCase())
        );
        mockResults.push(...japaneseMatches);
      }

      setResults(mockResults.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error("Dictionary search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchDictionary(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to toggle dictionary
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen]);

  const positionClass = {
    "top-right": "floating-dict-top-right",
    "top-left": "floating-dict-top-left",
    "bottom-right": "floating-dict-bottom-right",
    "bottom-left": "floating-dict-bottom-left",
  }[position];

  return (
    <div className={`floating-dictionary ${positionClass} ${isOpen ? "open" : "closed"}`}>
      {/* Toggle Button */}
      <button
        className="floating-dict-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Dictionary"
        title="Dictionary (Ctrl+K)"
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 7H16M4 10H16M4 13H10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect
              x="2"
              y="3"
              width="16"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        )}
      </button>

      {/* Dictionary Panel */}
      {isOpen && (
        <div className="floating-dict-panel">
          <div className="floating-dict-header">
            <h3>📚 Dictionary</h3>
            <span className="floating-dict-shortcut">Ctrl+K</span>
          </div>

          {/* Language Tabs */}
          {language === "both" && (
            <div className="floating-dict-tabs">
              <button
                className={`tab ${activeTab === "english" ? "active" : ""}`}
                onClick={() => setActiveTab("english")}
              >
                🇺🇸 English
              </button>
              <button
                className={`tab ${activeTab === "japanese" ? "active" : ""}`}
                onClick={() => setActiveTab("japanese")}
              >
                🇯🇵 日本語
              </button>
            </div>
          )}

          {/* Search Input */}
          <div className="floating-dict-search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder={`Search ${activeTab === "english" ? "English" : "Japanese"} words...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="floating-dict-input"
            />
            {searchQuery && (
              <button
                className="floating-dict-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Results */}
          <div className="floating-dict-results">
            {isLoading ? (
              <div className="floating-dict-loading">
                <div className="spinner"></div>
                Searching...
              </div>
            ) : results.length > 0 ? (
              <ul className="floating-dict-list">
                {results.map((entry, index) => (
                  <li key={index} className="floating-dict-entry">
                    <div className="entry-word">
                      <strong>{entry.word}</strong>
                      {entry.romaji && <span className="entry-romaji">({entry.romaji})</span>}
                      {entry.type && <span className="entry-type">{entry.type}</span>}
                    </div>
                    <div className="entry-meaning">{entry.translation || entry.definition}</div>
                  </li>
                ))}
              </ul>
            ) : searchQuery ? (
              <div className="floating-dict-empty">
                <p>No results found for "{searchQuery}"</p>
                <small>Try a different search term</small>
              </div>
            ) : (
              <div className="floating-dict-empty">
                <p>Start typing to search</p>
                <small>
                  {activeTab === "japanese"
                    ? "Search by kana, romaji, or English"
                    : "Search for English words"}
                </small>
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="floating-dict-footer">
            <small>💡 Tip: Press Esc to close</small>
          </div>
        </div>
      )}
    </div>
  );
}
