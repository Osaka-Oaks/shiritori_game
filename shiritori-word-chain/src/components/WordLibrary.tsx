import React, { useState } from "react";
import { Search, Volume2, Info, XCircle, ChevronRight, CornerDownRight, CheckCircle2, Loader2, Sparkles, Languages } from "lucide-react";
import { LibraryWordInfo } from "../types";

export default function WordLibrary() {
  const [searchQuery, setSearchQuery] = useState("Ringo");
  const [searchLang, setSearchQueryLang] = useState<"ENG" | "JPN">("ENG");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LibraryWordInfo | null>({
    word: "Ringo",
    kanji: "林檎",
    hiragana: "りんご",
    katakana: "リンゴ",
    romaji: "ringo",
    category: "Noun",
    meaning: "Apple",
    shiritoriRuleCheck: {
      valid: true,
      reason: "Valid word! Starts with Ri (り) and ends with Go (ご). Does not end in 'N' (ん).",
      startsWith: "り",
      endsWith: "ご",
      endsInN: false
    }
  });

  // Word Evaluator Tool state
  const [evalInput, setEvalInput] = useState("");
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResult, setEvalResult] = useState<any | null>(null);

  // Recent Lookups List
  const [recentLookups, setRecentLookups] = useState<Array<any>>([
    { word: "Neko", meaning: "Cat", hiragana: "ねこ", valid: true },
    { word: "Inu", meaning: "Dog", hiragana: "いぬ", valid: true },
    { word: "Mikan", meaning: "Mandarin", hiragana: "みかん", valid: false },
    { word: "Sakura", meaning: "Cherry Blossom", hiragana: "さくら", valid: true }
  ]);

  // Pronounce Japanese word using SpeechSynthesis
  const speakJapanese = (text: string) => {
    if (!text || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.includes("JP") || v.lang.includes("ja"));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  // Search Dictionary via Server Endpoint
  const handleSearch = async (e?: React.FormEvent, wordOverride?: string) => {
    if (e) e.preventDefault();
    const term = wordOverride || searchQuery;
    if (!term.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/library/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: term, language: searchLang })
      });
      const data = await res.json();
      if (res.ok && data.word) {
        setResult(data);
        setRecentLookups(prev => {
          const filtered = prev.filter(item => item.word.toLowerCase() !== data.word.toLowerCase());
          return [{
            word: data.word,
            meaning: data.meaning,
            hiragana: data.hiragana,
            valid: data.shiritoriRuleCheck.valid
          }, ...filtered].slice(0, 4);
        });
      } else {
        alert(data.error || "Word not found. Try spelling in Romaji or JPN.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Evaluate Custom Word
  const handleEvaluate = async () => {
    if (!evalInput.trim()) return;
    setEvalLoading(true);

    try {
      const res = await fetch("/api/game/evaluate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: evalInput, lastChar: "", usedWords: [] })
      });
      const data = await res.json();
      if (res.ok) {
        setEvalResult(data);
      } else {
        alert(data.error || "Evaluation failed.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvalLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-fadeIn pt-4 pb-20 text-[#D1D1D1]">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="serif-italic text-3xl md:text-4xl text-white font-light tracking-wide">
          Word Library
        </h2>
        <p className="text-[#C5A059] font-light text-xs tracking-widest uppercase mt-1">
          SEARCH, LEARN, AND EVALUATE SHIRITORI WORDS!
        </p>
      </div>

      {/* Search Section */}
      <form onSubmit={handleSearch} className="bg-white/[0.02] border border-white/10 rounded-sm p-3.5 flex flex-col sm:flex-row gap-3 shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059] w-4 h-4 pointer-events-none opacity-80" />
          <input
            className="w-full bg-white/5 text-white font-light text-[14px] py-3.5 pl-11 pr-4 rounded-sm border border-white/10 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all placeholder:text-white/25"
            placeholder="Type a word in English or Romaji/Japanese..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center bg-white/5 border border-white/10 rounded-sm p-1 shrink-0 self-stretch sm:self-auto justify-center">
          <button
            type="button"
            onClick={() => setSearchQueryLang("ENG")}
            className={`px-3.5 py-1.5 rounded-sm text-[10px] font-semibold tracking-wider transition-all ${
              searchLang === "ENG"
                ? "bg-[#C5A059] text-black font-bold"
                : "text-white/40 hover:text-white"
            }`}
          >
            ENG
          </button>
          <button
            type="button"
            onClick={() => setSearchQueryLang("JPN")}
            className={`px-3.5 py-1.5 rounded-sm text-[10px] font-semibold tracking-wider transition-all ${
              searchLang === "JPN"
                ? "bg-[#C5A059] text-black font-bold"
                : "text-white/40 hover:text-white"
            }`}
          >
            JPN
          </button>
        </div>
        <button
          type="submit"
          className="bg-[#C5A059] text-black hover:bg-[#D7B574] px-6 py-3.5 rounded-sm text-[10px] font-semibold tracking-widest uppercase transition-all flex items-center justify-center shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "SEARCH"}
        </button>
      </form>

      {/* Search Result Card */}
      {result && (
        <section className="glass-card rounded-sm p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#C5A059]/5 rounded-full filter blur-xl opacity-30 pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="serif-italic text-3xl text-white font-light">
                  {result.word}
                </h3>
                <span className="px-3 py-1 border border-[#C5A059]/30 text-[#C5A059] text-[9px] uppercase tracking-widest rounded-full font-bold">
                  {result.category}
                </span>
              </div>
              <p className="text-white/50 text-sm mt-1.5 font-light tracking-wide">
                {result.meaning}
              </p>
            </div>
            <button
              onClick={() => speakJapanese(result.hiragana)}
              title="Pronounce Word"
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#C5A059] hover:bg-white/10 transition-colors shadow-sm focus:outline-none"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/[0.01] p-4 rounded-sm border border-white/5 flex flex-col justify-center text-center">
              <div className="text-[9px] uppercase tracking-widest text-[#C5A059]/70 mb-1.5 font-bold">Kanji</div>
              <div className="serif-italic text-lg text-white font-medium">{result.kanji || "ー"}</div>
            </div>
            <div className="bg-white/[0.01] p-4 rounded-sm border border-white/5 flex flex-col justify-center text-center">
              <div className="text-[9px] uppercase tracking-widest text-[#C5A059]/70 mb-1.5 font-bold">Hiragana</div>
              <div className="serif-italic text-lg text-[#C5A059] font-medium">{result.hiragana}</div>
            </div>
            <div className="bg-white/[0.01] p-4 rounded-sm border border-white/5 flex flex-col justify-center text-center">
              <div className="text-[9px] uppercase tracking-widest text-[#C5A059]/70 mb-1.5 font-bold">Katakana</div>
              <div className="serif-italic text-lg text-white font-medium">{result.katakana || "ー"}</div>
            </div>
          </div>

          <div className="border border-white/15 bg-white/[0.01] rounded-sm p-4 flex gap-4 items-start">
            <Info className="w-4 h-4 shrink-0 mt-1 text-[#C5A059]" />
            <div>
              <p className="serif-italic text-sm text-white font-light">
                Shiritori Rule Check
              </p>
              <p className="text-white/60 font-light text-xs mt-1 leading-relaxed">
                {result.shiritoriRuleCheck.reason}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Word Evaluator Tool */}
      <section className="glass-card rounded-sm p-6 md:p-8 relative overflow-hidden border-t-2 border-[#C5A059]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[#C5A059]">
            <Sparkles className="w-4 h-4 text-[#C5A059] fill-current" />
          </div>
          <h3 className="serif-italic text-xl text-white font-light tracking-wide">
            Word Evaluator
          </h3>
        </div>
        <p className="text-white/60 mb-6 text-xs font-light leading-relaxed">
          Not sure if a word works? Type it here in Japanese or English to test if it ends in the forbidden &ldquo;ん&rdquo; syllable or is a valid game word!
        </p>
        <div className="flex gap-3">
          <input
            className="flex-grow bg-white/5 border border-white/10 text-white font-light text-sm p-3.5 px-4 rounded-sm placeholder:text-white/20 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
            placeholder="e.g. Mikan, Inu, Ringo..."
            type="text"
            value={evalInput}
            onChange={(e) => setEvalInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEvaluate()}
          />
          <button
            onClick={handleEvaluate}
            className="bg-[#C5A059] text-black hover:bg-[#D7B574] px-6 py-3.5 rounded-sm text-[10px] font-semibold tracking-widest uppercase transition-colors shrink-0 flex items-center justify-center"
          >
            {evalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "EVALUATE"}
          </button>
        </div>

        {/* Evaluator Result Drawer */}
        <div className="mt-6">
          {evalResult ? (
            <div className="bg-white/[0.02] border border-white/10 rounded-sm p-4 space-y-3 animate-fadeIn text-white/90">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="serif-italic text-base text-[#C5A059] font-medium">
                    {evalResult.word} ({evalResult.hiragana})
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold border ${
                  evalResult.valid 
                    ? "border-[#C5A059]/40 text-[#C5A059] bg-[#C5A059]/5" 
                    : "border-red-500/30 text-red-400 bg-red-500/5"
                }`}>
                  {evalResult.valid ? "VALID" : "INVALID"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-light">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                  Meaning: <span className="text-white font-medium">{evalResult.meaning}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  Ends with 'n'? <span className="font-semibold text-white">{evalResult.endsInN ? "Yes! (ん/ン)" : "No"}</span>
                </div>
              </div>
              <div className="text-xs text-white/50 border-t border-white/5 pt-2 flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="italic">{evalResult.reason}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 border border-dashed border-white/10 rounded-sm text-white/30">
              <span className="text-[10px] tracking-widest uppercase font-semibold">Awaiting word input...</span>
            </div>
          )}
        </div>
      </section>

      {/* Recent Lookups */}
      <section>
        <div className="flex justify-between items-end mb-4 px-1">
          <h3 className="serif-italic text-xl text-white font-light tracking-wide">
            Recent Lookups
          </h3>
          <button
            onClick={() => setRecentLookups([])}
            className="text-[#C5A059] text-[9px] uppercase tracking-widest hover:underline focus:outline-none font-bold"
          >
            Clear
          </button>
        </div>
        
        {recentLookups.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentLookups.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSearchQuery(item.word);
                  handleSearch(undefined, item.word);
                }}
                className="glass-card-interactive rounded-sm p-4 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className={`serif-italic text-lg group-hover:text-[#C5A059] transition-colors flex items-center justify-between font-medium ${
                    item.valid ? "text-white" : "text-red-400"
                  }`}>
                    <span>{item.word}</span>
                    {!item.valid && <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                  </div>
                  <div className="text-white/50 text-[11px] font-light mt-1.5 line-clamp-2">
                    {item.meaning}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-2 text-[9px] uppercase tracking-wider">
                  <span className="font-bold text-white/30 font-sans">{item.hiragana}</span>
                  <ChevronRight className="w-3 h-3 text-[#C5A059] opacity-60 group-hover:opacity-100 transition-all" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[10px] uppercase tracking-widest font-semibold text-white/30 glass-card rounded-sm border-dashed">
            No lookups yet. Search a word above!
          </div>
        )}
      </section>

    </div>
  );
}
