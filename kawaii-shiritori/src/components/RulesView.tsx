import React from "react";
import { motion } from "motion/react";
import { HelpCircle, Star, ShieldAlert, BadgeCheck, Clock, Award } from "lucide-react";

export default function RulesView() {
  const steps = [
    {
      title: "1. Japanese Nouns ONLY",
      desc: "Words must be standard Japanese nouns (usually in Hiragana/Katakana). Verbs, adjectives, or particles are strictly banned!",
      icon: <BadgeCheck className="w-5 h-5 text-secondary" />,
      bg: "bg-secondary-container/10 border-secondary/20",
    },
    {
      title: "2. The Word Chain Rule",
      desc: "Your word must start with the exact final syllable (sound) of the previous word. Example: さくら (Sakura) -> らいおん (Raion - wait, that ends in N!).",
      icon: <Star className="w-5 h-5 text-tertiary" />,
      bg: "bg-tertiary-fixed/20 border-tertiary-container/30",
    },
    {
      title: "3. Avoid 'ん' (N) at All Costs",
      desc: "Since no Japanese words start with the syllable 'ん' (N), ending your word in 'ん' / 'ン' leads to an direct FATAL GAME OVER!",
      icon: <ShieldAlert className="w-5 h-5 text-error" />,
      bg: "bg-error-container/25 border-error/20",
    },
    {
      title: "4. No Duplication",
      desc: "You cannot repeat any word that has already been spoken in the current match duel.",
      icon: <Clock className="w-5 h-5 text-primary" />,
      bg: "bg-primary-container/15 border-primary/20 animate-pulse",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-4 pb-24 space-y-6">
      {/* Top Header Card with Cherry Blossom Street view */}
      <div className="relative bg-surface-container-lowest rounded-3xl border-2 border-surface-container-highest overflow-hidden shadow-soft">
        <div className="h-44 md:h-56 overflow-hidden relative">
          <img
            alt="Illustrative cherry blossoms street banner graphic"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJwgPec6oOGAfeCrKKGCYllgQtMZyLyokc-U9przoTfttWlpgGUdlKdCQa8fLHX9CGg4tZNWwVCqLf67gc66SW425Lkd5bB2tH_qgo1GnX7w2SYvsOtYQ8r3e_OELxeC3utr7MXG5M7pwZ5MGTuLoahU3Jn5SB73oE4LDD9Cy1ms75Wb6wmrhuMN-Lz-XHsEp4tAzolpeUM44GcYkiF_PyMENG4gZoS1SEGcirH6SasHpQJYpIxhqh5jbB4xHuk9oRfusTaWv_OU4G"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
        </div>

        <div className="p-6 text-center space-y-2">
          <h2 className="font-headline text-3xl font-extrabold text-on-surface">
            How to Playしりとり
          </h2>
          <p className="font-body text-sm font-medium text-on-surface-variant max-w-md mx-auto">
            Shiritori is a classic Japanese word game that tests vocabulary, phonetic awareness, and
            quick-thinking puzzle skills. Let's learn!
          </p>
        </div>
      </div>

      {/* Structured Guideline Checklist Step Cards */}
      <h3 className="font-label-caps text-xs text-primary font-bold self-start mt-2 px-1">
        OFFICIAL TOURNAMENT RULES
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            className={`p-5 rounded-2xl border-2 ${step.bg} flex flex-col space-y-2 shadow-sm text-left`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-surface rounded-xl shadow-xs inline-flex">{step.icon}</span>
              <h4 className="font-headline font-bold text-sm text-on-surface">{step.title}</h4>
            </div>
            <p className="font-body text-xs text-on-surface-variant font-medium leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Word Chain Example Walkthrough Interactive Block */}
      <section className="bg-surface-container rounded-2xl p-5 border border-primary/10 text-left space-y-3 shadow-inner">
        <h4 className="font-headline font-bold text-sm text-primary flex items-center gap-2">
          <Award className="w-5 h-5" />
          Example of a successful chain duel:
        </h4>
        <div className="flex flex-wrap items-center gap-2 font-display-game font-bold text-xs">
          <span className="px-2.5 py-1.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
            さくら (sakura)
          </span>
          <span className="text-primary font-body font-medium">✏️ end in ら • next play:</span>
          <span className="px-2.5 py-1.5 bg-primary-container text-on-primary-container rounded-xl shadow-xs">
            らっぱ (rappa)
          </span>
          <span className="text-secondary font-body font-medium">✏️ end in ぱ • next play:</span>
          <span className="px-2.5 py-1.5 bg-secondary-container text-on-secondary-container rounded-xl shadow-xs">
            ぱんだ (panda)
          </span>
          <span className="text-error font-body font-medium">
            ⚠️ end in だ... next player wins!
          </span>
        </div>
      </section>
    </div>
  );
}
