import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  X,
  Search,
  Volume2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  PictureInPicture2,
} from "lucide-react";

interface JishoWord {
  slug: string;
  is_common: boolean;
  tags: string[];
  jlpt: string[];
  japanese: {
    word?: string;
    reading: string;
  }[];
  senses: {
    english_definitions: string[];
    parts_of_speech: string[];
    tags: string[];
    info: string[];
  }[];
}

interface JishoResponse {
  meta: { status: number };
  data: JishoWord[];
}

interface FloatingDictionaryProps {
  onClose?: () => void;
}

export default function FloatingDictionary({ onClose }: FloatingDictionaryProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPipMode, setIsPipMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<JishoWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedWord, setSelectedWord] = useState<JishoWord | null>(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const dictRef = useRef<HTMLDivElement>(null);

  const searchJisho = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(searchTerm)}`
      );
      const data: JishoResponse = await response.json();

      if (data.data && data.data.length > 0) {
        setResults(data.data.slice(0, 10));
        setSelectedWord(data.data[0]);
      } else {
        setResults([]);
        setError("No results found");
      }
    } catch (err) {
      setError("Failed to search dictionary");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchJisho(query);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".dict-header")) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const speakWord = (word: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "ja-JP";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Hidden state - just show icon
  if (isHidden) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 9999,
        }}
        className="bg-primary text-on-primary rounded-full p-3 shadow-2xl hover:scale-110 transition-transform cursor-pointer"
        onClick={() => setIsHidden(false)}
      >
        <BookOpen className="w-6 h-6" />
      </motion.div>
    );
  }

  // Minimized state - floating icon
  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 9999,
          cursor: isDragging ? "grabbing" : "grab",
          opacity: opacity,
        }}
        onMouseDown={handleMouseDown}
        className="bg-primary text-on-primary rounded-full p-4 shadow-2xl hover:scale-110 transition-transform"
      >
        <button onClick={() => setIsMinimized(false)} className="flex items-center gap-2 font-bold">
          <BookOpen className="w-6 h-6" />
          <span className="text-sm">辞書</span>
        </button>
      </motion.div>
    );
  }

  // Picture-in-Picture mode - compact view
  if (isPipMode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: opacity, scale: 1 }}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          width: "280px",
          maxHeight: "320px",
          zIndex: 9999,
          cursor: isDragging ? "grabbing" : "auto",
        }}
        className="bg-surface-container/95 backdrop-blur-md rounded-xl shadow-2xl border border-primary/30 overflow-hidden flex flex-col"
      >
        {/* PiP Header */}
        <div
          className="dict-header bg-primary/90 text-on-primary p-2 flex items-center justify-between cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-bold">辞書</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPipMode(false)}
              className="p-1 hover:bg-white/20 rounded transition-all"
              title="Exit PiP"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsHidden(true)}
              className="p-1 hover:bg-white/20 rounded transition-all"
              title="Hide"
            >
              <EyeOff className="w-3 h-3" />
            </button>
            {onClose && (
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-all">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* PiP Content - Selected word only */}
        <div className="flex-1 overflow-y-auto p-3">
          {selectedWord ? (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  {selectedWord.japanese[0]?.word && (
                    <h4 className="font-headline font-bold text-lg text-on-surface">
                      {selectedWord.japanese[0].word}
                    </h4>
                  )}
                  <p className="font-body text-sm text-primary">
                    {selectedWord.japanese[0].reading}
                  </p>
                </div>
                <button
                  onClick={() => speakWord(selectedWord.japanese[0].reading)}
                  className="p-1.5 bg-secondary text-on-secondary rounded-lg hover:bg-opacity-90 transition-all"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {selectedWord.senses.slice(0, 2).map((sense, idx) => (
                  <p key={idx} className="text-xs text-on-surface">
                    {idx + 1}. {sense.english_definitions.slice(0, 2).join(", ")}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <BookOpen className="w-8 h-8 text-outline mx-auto opacity-50 mb-2" />
              <p className="text-xs text-on-surface-variant">Search for a word</p>
            </div>
          )}
        </div>

        {/* Opacity Control */}
        <div className="p-2 bg-surface-container-low border-t border-outline-variant/20">
          <div className="flex items-center gap-2">
            <Eye className="w-3 h-3 text-on-surface-variant" />
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.1"
              value={opacity}
              onChange={e => setOpacity(parseFloat(e.target.value))}
              className="flex-1 h-1 accent-primary"
            />
            <span className="text-xs text-on-surface-variant font-mono">
              {Math.round(opacity * 100)}%
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={dictRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: isExpanded ? "600px" : "400px",
        maxHeight: isExpanded ? "80vh" : "500px",
        zIndex: 9999,
        cursor: isDragging ? "grabbing" : "auto",
        opacity: opacity,
      }}
      className="bg-surface-container/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div
        className="dict-header bg-primary text-on-primary p-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-headline font-bold text-lg">Japanese Dictionary</h3>
          <span className="text-xs opacity-70 font-mono">辞書</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPipMode(true)}
            className="p-1 hover:bg-white/20 rounded transition-all"
            title="Picture-in-Picture"
          >
            <PictureInPicture2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/20 rounded transition-all"
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsHidden(true)}
            className="p-1 hover:bg-white/20 rounded transition-all"
            title="Hide"
          >
            <EyeOff className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/20 rounded transition-all"
            title="Minimize"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded transition-all"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-outline-variant/20">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search in Japanese or English..."
            className="flex-1 bg-surface border-2 border-primary/40 rounded-lg py-2 px-4 text-on-surface font-body placeholder:text-outline/40 focus:outline-none focus:border-primary transition-all"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-secondary text-on-secondary px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2 transition-all"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {error && (
          <div className="bg-error-container/20 border border-error rounded-lg p-3 text-center">
            <p className="text-sm text-error font-body">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-on-surface-variant">Searching dictionary...</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && query && (
          <div className="text-center py-8 space-y-3">
            <BookOpen className="w-12 h-12 text-outline mx-auto opacity-50" />
            <p className="text-sm text-on-surface-variant">
              Enter a Japanese word or English term to search
            </p>
          </div>
        )}

        {selectedWord && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-container/20 border-2 border-primary rounded-xl p-4 space-y-3"
          >
            {/* Word Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                {selectedWord.japanese[0]?.word && (
                  <h4 className="font-headline font-bold text-2xl text-on-surface">
                    {selectedWord.japanese[0].word}
                  </h4>
                )}
                <p className="font-body text-xl text-primary">{selectedWord.japanese[0].reading}</p>
              </div>
              <button
                onClick={() => speakWord(selectedWord.japanese[0].reading)}
                className="p-2 bg-secondary text-on-secondary rounded-lg hover:bg-opacity-90 transition-all"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selectedWord.is_common && (
                <span className="text-xs bg-secondary text-on-secondary px-2 py-1 rounded-full font-bold">
                  Common
                </span>
              )}
              {selectedWord.jlpt.map(level => (
                <span
                  key={level}
                  className="text-xs bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded-full font-bold"
                >
                  {level.toUpperCase()}
                </span>
              ))}
            </div>

            {/* Meanings */}
            <div className="space-y-2">
              {selectedWord.senses.slice(0, isExpanded ? 5 : 3).map((sense, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex flex-wrap gap-1">
                    {sense.parts_of_speech.map(pos => (
                      <span key={pos} className="text-xs text-primary font-mono">
                        {pos}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-on-surface">
                    {idx + 1}. {sense.english_definitions.join(", ")}
                  </p>
                  {sense.tags.length > 0 && (
                    <p className="text-xs text-on-surface-variant italic">
                      ({sense.tags.join(", ")})
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Other Results */}
        {results.length > 1 && (
          <div className="space-y-2">
            <h5 className="text-xs font-label-caps text-on-surface-variant font-bold">
              OTHER RESULTS
            </h5>
            {results.slice(1, isExpanded ? 10 : 5).map((word, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedWord(word)}
                className="w-full text-left bg-surface rounded-lg p-3 border border-outline-variant/20 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-headline font-bold text-on-surface">
                      {word.japanese[0]?.word || word.japanese[0].reading}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {word.senses[0]?.english_definitions.slice(0, 3).join(", ")}
                    </p>
                  </div>
                  {word.is_common && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Common
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Opacity Control */}
      <div className="bg-surface-container-low p-3 border-t border-outline-variant/20">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-on-surface-variant flex-shrink-0">
            Powered by <span className="text-primary font-bold">Jisho.org</span>
          </p>
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <Eye className="w-3 h-3 text-on-surface-variant flex-shrink-0" />
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.1"
              value={opacity}
              onChange={e => setOpacity(parseFloat(e.target.value))}
              className="flex-1 h-1 accent-primary"
              title="Opacity"
            />
            <span className="text-xs text-on-surface-variant font-mono flex-shrink-0">
              {Math.round(opacity * 100)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
