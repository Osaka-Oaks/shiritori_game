import React from "react";
import { convertRomajiToHiragana, speakWord } from "../utils";
import { Search, CheckCircle, XCircle, Volume2, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WordEvaluationResult {
  word: string;
  isValid: boolean;
  reason: string;
  translation: string;
  kanji: string;
  hiragana: string;
  katakana: string;
  romaji: string;
  startSound: string;
  endSound: string;
  endsInN: boolean;
}

export default function LibraryView() {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<WordEvaluationResult | null>(null);
  const [errorStatus, setErrorStatus] = React.useState<string | null>(null);

  // Quick word lookup dictionary to suggest words
  const quickWords = [
    { jp: "りんご", romaji: "ringo", eng: "Apple" },
    { jp: "ごりら", romaji: "gorira", eng: "Gorilla" },
    { jp: "らっぱ", romaji: "rappa", eng: "Trumpet" },
    { jp: "いぬ", romaji: "inu", eng: "Dog" },
    { jp: "ねこ", romaji: "neko", eng: "Cat" },
    { jp: "すいか", romaji: "suika", eng: "Watermelon" },
    { jp: "さくら", romaji: "sakura", eng: "Cherry Blossom" },
    { jp: "うみ", romaji: "umi", eng: "Sea" },
  ];

  const handleEvaluate = async (wordToTest: string) => {
    const trimmed = wordToTest.trim();
    if (!trimmed) return;
    
    setLoading(true);
    setErrorStatus(null);
    setResult(null);

    // Auto-resolve potential romaji inputs
    const kanaForm = convertRomajiToHiragana(trimmed);

    try {
      const response = await fetch("/api/gemini/evaluate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: kanaForm || trimmed }),
      });

      if (!response.ok) throw new Error("Evaluation failed");
      const data: WordEvaluationResult = await response.json();
      setResult(data);
    } catch (e: any) {
      setErrorStatus("Oops! It seems we couldn't evaluate that word right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onQuickClick = (txt: string) => {
    setQuery(txt);
    handleEvaluate(txt);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-4 pb-24 space-y-6">
      {/* Top Title Info */}
      <div className="text-center space-y-1">
        <h2 className="font-headline text-2xl font-extrabold text-on-surface">Interactive Dictionary</h2>
        <p className="font-body text-on-surface-variant font-medium text-sm">
          Solve disputes! Test any word below to see if it is valid for Shiritori
        </p>
      </div>

      {/* Input box */}
      <div className="bg-surface-container-low rounded-3xl p-5 border-2 border-surface-container-highest shadow-soft space-y-4">
        <h3 className="font-label-caps text-xs text-primary font-bold">SHIRITORI WORD REFEREE</h3>
        
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleEvaluate(query);
          }}
        >
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full bg-surface border-2 border-primary/40 rounded-full py-3 px-6 pr-12 text-on-surface font-body font-bold placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all font-medium"
              placeholder="Enter word (e.g., さくら, ringo, 猫)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-primary text-on-primary font-semibold px-6 py-3.5 rounded-full hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
          </button>
        </form>

        {/* Quick word suggestions tag grid */}
        <div className="space-y-1.5 text-left bg-surface rounded-2xl p-3 border border-outline-variant/20">
          <p className="text-[10px] font-label-caps text-outline-variant font-bold">POPULAR SEARCHES</p>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {quickWords.map((item, i) => (
              <button
                key={i}
                onClick={() => onQuickClick(item.jp)}
                className="text-xs bg-surface-container-low border border-primary/10 hover:border-primary hover:bg-primary/5 text-on-surface-variant font-bold px-2.5 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                {item.jp} <span className="opacity-60 font-medium text-[10px] bg-primary/5 px-1 py-0.5 rounded ml-0.5">{item.romaji}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Output block */}
      {errorStatus && (
        <div className="bg-error-container/40 border-2 border-error/20 rounded-2xl p-4 flex gap-3 text-left">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-on-error-container font-body font-bold">Referee Error</p>
            <p className="text-xs text-on-error-container/80 mt-0.5">{errorStatus}</p>
          </div>
        </div>
      )}

      {/* Result Verification Detail Dashboard with Mascot Illustrates */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`rounded-3xl border-2 p-6 text-left shadow-soft space-y-6 ${
              result.isValid 
                ? "bg-secondary-container/15 border-secondary/30" 
                : "bg-error-container/15 border-error/25"
            }`}
          >
            {/* Split top: Details + Mascot Image */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Left Side: Readings Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-display-game text-3xl font-extrabold text-on-surface tracking-tight">
                    {result.kanji || result.word}
                  </h3>
                  
                  {/* TTS Voice Playback Trigger */}
                  <button
                    onClick={() => speakWord(result.hiragana || result.word)}
                    className="p-2 mb-0.5 bg-surface hover:bg-primary/10 hover:text-primary border-2 border-primary/20 rounded-full transition-colors text-outline shadow-sm cursor-pointer"
                    title="Speak word in Japanese"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-body font-bold text-on-surface-variant">
                  <span className="px-2.5 py-1 bg-surface rounded-lg border border-outline-variant/30">
                    Hiragana: {result.hiragana}
                  </span>
                  <span className="px-2.5 py-1 bg-surface rounded-lg border border-outline-variant/30">
                    Katakana: {result.katakana}
                  </span>
                  <span className="px-2.5 py-1 bg-surface rounded-lg border border-outline-variant/30">
                    Romaji: {result.romaji}
                  </span>
                </div>

                <p className="text-sm text-on-surface font-semibold pt-1">
                  English Mean: <span className="font-extrabold text-primary">{result.translation}</span>
                </p>
              </div>

              {/* Right Side: Massive Mascot verification validation overlay card */}
              <div className="flex items-center gap-3 bg-surface p-4 rounded-2xl border-2 border-outline-variant/20 shadow-xs self-stretch md:self-auto justify-center">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-surface-container border">
                  {result.isValid ? (
                    <img
                      alt="SUGOI"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDuKva3Ae4Mdx_1okP6_ZLRerZXxvd-AjbqdUFthtF4ohqCI7t2K-UrHVh-2aTWROAho5wPA9sSDg8QFu1abQ6N8LSPmv9d5XQEx87YDQb7DqQlNrJPDkKXSpjdCaHdl0wM1WzEF_9NvJlhPF4BiLm_9_wTH9n3uDXSqVWnE-Us64hmzyRw9AWBSPZNF1Sg5Mw1dblfwImLyCWdToV20RGJbgEJc0Rnfx0a4UCk9cSKzllL4wqzKMEUr6Ea8V3NOzRfFgXMCutEuUv"
                    />
                  ) : (
                    <img
                      alt="MADA MADA"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDveFYsKgkorVEVvyG8y1RXU65eV4xXjssWR9ddJFJ6AfaJrWM4zsCqXALjRCebFfatbks3e6NZsga8jPNtvU7iYYzbOFEGH3FnMVhjlBLLM8L4A-TCvU96Iyq_U9HmC15JVpYF1wykSPYZeomMHz4AeBF2yEWOJAowHZvqOxLzBZXAVLTh9zlP0cTCmxyOa1ame2fJc8gtRV53TATHhA0tDb215Lsg0h-A2vQv5w-DB8b0I_o0dAVgWbGkzdkywp6p4axPucg5S9Al"
                    />
                  )}
                </div>

                <div className="text-left">
                  <div className={`text-xs font-headline font-black tracking-wider ${result.isValid ? 'text-secondary' : 'text-error'}`}>
                    {result.isValid ? "SUGOI! VALID" : "MADA MADA... INVALID"}
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-body mt-0.5 leading-tight max-w-xs select-none">
                    {result.reason}
                  </p>
                </div>
              </div>
            </div>

            {/* Syllables mapping break-down row */}
            <div className="p-4 bg-surface rounded-2xl border border-outline-variant/20 grid grid-cols-3 gap-2 text-center text-xs font-body font-bold">
              <div className="space-y-0.5 text-left border-r border-outline-variant/20 pr-2">
                <span className="text-[10px] font-label-caps text-on-surface-variant/80 block select-none">STARTS WITH</span>
                <span className="text-sm text-primary font-display-game font-extrabold">{result.startSound}</span>
              </div>

              <div className="space-y-0.5 text-center">
                <span className="text-[10px] font-label-caps text-on-surface-variant/80 block select-none">ENDS WITH</span>
                <span className="text-sm text-primary font-display-game font-extrabold">{result.endSound}</span>
              </div>

              <div className="space-y-0.5 text-right border-l border-outline-variant/20 pl-2">
                <span className="text-[10px] font-label-caps text-on-surface-variant/80 block select-none">ENDS IN N?</span>
                <span className={`text-sm font-extrabold ${result.endsInN ? 'text-error' : 'text-secondary'}`}>
                  {result.endsInN ? "YES (ん/ン)" : "NO"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
