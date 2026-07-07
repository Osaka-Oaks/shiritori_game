import React from "react";
import {
  HelpCircle,
  ChevronRight,
  Play,
  BookOpen,
  AlertTriangle,
  Clock,
  History,
  AlertCircle,
} from "lucide-react";

interface HowToPlayProps {
  onStartGame: () => void;
}

export default function HowToPlay({ onStartGame }: HowToPlayProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-fadeIn pt-4 pb-20 text-[#D1D1D1]">
      {/* Hero Header */}
      <div className="text-center py-4 space-y-1">
        <h1 className="serif-italic text-3xl md:text-4xl text-white font-light tracking-wide">
          How to Play / 遊び方
        </h1>
        <p className="text-[#C5A059] font-light text-xs tracking-widest uppercase mt-1">
          MASTER THE ART OF THE WORD CHAIN!
        </p>
      </div>

      {/* Section 1: What is Shiritori? */}
      <section className="glass-card rounded-sm p-6 relative overflow-hidden">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-sm flex items-center justify-center text-[#C5A059]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="serif-italic text-xl text-white font-light tracking-wide">
              しりとりとは?
            </h2>
            <span className="text-white/40 block text-[9px] uppercase tracking-wider mt-0.5">
              What is Shiritori?
            </span>
          </div>
        </div>
        <p className="text-white/70 font-light mb-5 leading-relaxed text-sm">
          Shiritori (しりとり) is a traditional Japanese word game. The word literally means
          <strong> "taking the end."</strong> You take the last sound of your opponent's word and
          use it to start your own!
        </p>
        <div className="relative w-full h-44 rounded-sm overflow-hidden bg-black/40 border border-white/5 group">
          <img
            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            alt="Japanese traditional background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJwgPec6oOGAfeCrKKGCYllgQtMZyLyokc-U9przoTfttWlpgGUdlKdCQa8fLHX9CGg4tZNWwVCqLf67gc66SW425Lkd5bB2tH_qgo1GnX7w2SYvsOtYQ8r3e_OELxeC3utr7MXG5M7pwZ5MGTuLoahU3Jn5SB73oE4LDD9Cy1ms75Wb6wmrhuMN-Lz-XHsEp4tAzolpeUM44GcYkiF_PyMENG4gZoS1SEGcirH6SasHpQJYpIxhqh5jbB4xHuk9oRfusTaWv_OU4G"
          />
        </div>
      </section>

      {/* Section 2: Basic Rules & Example Chain */}
      <section className="space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-sm text-[#C5A059] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="serif-italic text-xl text-white font-light tracking-wide">
              Basic Rules
            </h2>
            <span className="text-white/40 block text-[9px] uppercase tracking-wider mt-0.5">
              基本ルール
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rule Steps */}
          <div className="glass-card rounded-sm p-6 space-y-4 border-l-2 border-[#C5A059]/40">
            <div className="flex items-start gap-4">
              <span className="w-5 h-5 border border-[#C5A059] text-[#C5A059] rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <p className="text-sm text-white/80 leading-snug">
                Players take turns saying a word.
                <span className="text-[11px] text-white/40 block mt-0.5">
                  交代で単語を言います。
                </span>
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-5 h-5 border border-[#C5A059] text-[#C5A059] rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <p className="text-sm text-white/80 leading-snug">
                Must use <strong>Nouns only</strong>.
                <span className="text-[11px] text-white/40 block mt-0.5">名詞のみ使えます。</span>
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-5 h-5 border border-[#C5A059] text-[#C5A059] rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <p className="text-sm text-white/80 leading-snug">
                Start your word with the last kana of the previous word.
                <span className="text-[11px] text-white/40 block mt-0.5">
                  前の単語の最後の音から始めます。
                </span>
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-5 h-5 border border-[#C5A059] text-[#C5A059] rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                4
              </span>
              <p className="text-sm text-white/80 leading-snug">
                No repeating words!
                <span className="text-[11px] text-white/40 block mt-0.5">
                  一度出た単語は使えません。
                </span>
              </p>
            </div>
          </div>

          {/* Example Chain */}
          <div className="glass-card rounded-sm p-6 flex flex-col items-center justify-center space-y-4 relative">
            <span className="absolute top-3 left-4 text-[#C5A059] text-[9px] tracking-widest uppercase font-bold">
              Example Chain
            </span>
            <div className="flex flex-col items-center gap-2 py-2 w-full">
              <div className="bg-white/[0.02] border border-white/10 px-6 py-2 rounded-sm text-center w-4/5">
                <span className="serif-italic text-[#C5A059] text-sm font-medium">
                  Ringo (りんご)
                </span>
              </div>
              <div className="text-[#C5A059] text-[10px] my-0.5">▼</div>
              <div className="bg-white/[0.02] border border-white/10 px-6 py-2 rounded-sm text-center w-4/5">
                <span className="serif-italic text-[#C5A059] text-sm font-medium">
                  Gorira (ごりら)
                </span>
              </div>
              <div className="text-[#C5A059] text-[10px] my-0.5">▼</div>
              <div className="bg-white/[0.02] border border-white/10 px-6 py-2 rounded-sm text-center w-4/5">
                <span className="serif-italic text-[#C5A059] text-sm font-medium">
                  Rappa (らっぱ)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Game Over Conditions */}
      <section className="glass-card rounded-sm p-6 border-l-2 border-red-500/40">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-sm text-red-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="serif-italic text-xl text-white font-light tracking-wide">
              Game Over Conditions
            </h2>
            <span className="text-white/40 block text-[9px] uppercase tracking-wider mt-0.5">
              負けの条件
            </span>
          </div>
        </div>

        <ul className="space-y-4">
          <li className="flex items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-sm shadow-sm">
            <span className="font-serif text-[#C5A059] text-2xl font-light px-2 shrink-0">
              「ん」
            </span>
            <div className="font-sans text-sm">
              <p className="font-semibold text-white/90 leading-tight">Ending with 'n' (ん)</p>
              <p className="text-slate-400 text-xs mt-0.5">
                No Japanese words start with 'n', so you instantly lose.
              </p>
            </div>
          </li>
          <li className="flex items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-sm shadow-sm">
            <History className="w-6 h-6 text-red-400/80 shrink-0 ml-2" />
            <div className="font-sans text-sm pl-1">
              <p className="font-semibold text-white/90 leading-tight">Repeating a word</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Once a word is placed in the chain during the match, it cannot be reused.
              </p>
            </div>
          </li>
          <li className="flex items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-sm shadow-sm">
            <Clock className="w-6 h-6 text-red-400/80 shrink-0 ml-2" />
            <div className="font-sans text-sm pl-1">
              <p className="font-semibold text-white/90 leading-tight">Running out of time</p>
              <p className="text-slate-400 text-xs mt-0.5">
                You have 30 seconds for each turn. Think, type, and submit fast!
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Section 4: Special Cases */}
      <section className="glass-card rounded-sm p-6 border-l-2 border-[#C5A059]/40">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-sm flex items-center justify-center text-[#C5A059]">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="serif-italic text-xl text-white font-light tracking-wide">
              Pro Tips & Edge Cases
            </h2>
            <span className="text-white/40 block text-[9px] uppercase tracking-wider mt-0.5">
              特殊なルール
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/[0.01] border border-white/5 rounded-sm p-5">
            <h3 className="serif-italic text-base text-[#C5A059] flex items-center gap-1 font-medium">
              <ChevronRight className="w-4 h-4" />
              Small Kana (ぁ, ぃ, ぅ, ゃ, ゅ, ょ...)
            </h3>
            <p className="text-white/60 text-xs pl-5 mt-1 leading-relaxed">
              You can choose to start your next word with the combined syllable or just the ending
              small kana. For example: <strong>Kaisha (かいしゃ)</strong> ends in "ya" or "sha".
            </p>
          </div>
          <div className="bg-white/[0.01] border border-white/5 rounded-sm p-4">
            <h3 className="serif-italic text-base text-[#C5A059] flex items-center gap-1 font-medium">
              <ChevronRight className="w-4 h-4" />
              Long Vowels (ー)
            </h3>
            <p className="text-white/60 text-xs pl-5 mt-1 leading-relaxed">
              In Katakana terms, look at the vowel sound preceding the dash. For example:{" "}
              <strong>Takushii (タクシー)</strong> ends with the vowel sound "i".
            </p>
          </div>
        </div>
      </section>

      {/* Play Action CTA */}
      <div className="py-6 flex justify-center text-center">
        <button
          onClick={onStartGame}
          className="w-full max-w-sm bg-[#C5A059] text-black hover:bg-[#D7B574] text-[10px] font-bold tracking-[0.25em] uppercase py-4 rounded-sm shadow-md transition-all active:translate-y-0.5 flex items-center justify-center gap-2 focus:outline-none"
        >
          <span>Ready to Play!</span>
          <Play className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
