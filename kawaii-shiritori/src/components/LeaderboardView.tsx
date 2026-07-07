import React from "react";
import { LeaderboardUser } from "../types";
import { motion } from "motion/react";
import { Trophy, Award, Sparkles, Shield, ChevronUp } from "lucide-react";

interface LeaderboardViewProps {
  users: LeaderboardUser[];
}

export default function LeaderboardView({ users }: LeaderboardViewProps) {
  // Sort users just to make sure rank is pristine
  const sorted = [...users].sort((a, b) => b.score - a.score);

  // Split Top 3 and Others
  const podium = [
    sorted.find(u => u.rank === 2), // 2nd on left
    sorted.find(u => u.rank === 1), // 1st in center
    sorted.find(u => u.rank === 3), // 3rd on right
  ].filter(Boolean) as LeaderboardUser[];

  const listUsers = sorted.filter(u => u.rank > 3);
  const currentUser = sorted.find(u => u.isCurrentUser);

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-4 pb-24 space-y-6">
      {/* Top Title Info */}
      <div className="text-center space-y-1">
        <h2 className="font-headline text-2xl font-extrabold text-on-surface">Leaderboards</h2>
        <p className="font-body text-on-surface-variant font-medium text-sm">
          Compete against AI Masters and your local high-score records
        </p>
      </div>

      {/* Podium Render block */}
      <section className="bg-surface-container-low rounded-3xl p-5 border-2 border-surface-container-highest shadow-soft">
        <div className="grid grid-cols-3 gap-2 pt-6 items-end relative min-h-[220px]">
          {/* Podium 2nd Place */}
          {podium[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center space-y-2 pb-2"
            >
              <div className="relative">
                <img
                  alt={podium[0].name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-4 border-slate-300 shadow-md"
                  src={podium[0].avatarUrl}
                />
                <span className="absolute -bottom-1.5 -right-1 bg-slate-400 text-on-primary font-bold w-5 h-5 rounded-full text-[10px] flex items-center justify-center border border-white shadow-sm">
                  2
                </span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-headline text-xs font-bold text-on-surface truncate max-w-[80px] md:max-w-none">
                  {podium[0].name}
                </h4>
                <p className="text-[10px] font-bold text-primary">{podium[0].score} pts</p>
              </div>
              {/* Silver pillar block */}
              <div className="w-full bg-slate-300/40 rounded-t-xl h-16 border-t-2 border-slate-300 flex items-center justify-center font-display-game italic text-slate-500 font-bold text-lg select-none">
                2nd
              </div>
            </motion.div>
          )}

          {/* Podium 1st Place (Center and Tallest) */}
          {podium[1] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="flex flex-col items-center text-center space-y-2 z-10"
            >
              {/* Crown illustration on top of winner */}
              <div className="relative">
                <img
                  alt="Winner Golden Crown icon"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 absolute -top-9 left-1/2 -translate-x-1/2 drop-shadow"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiugVVR7xjkPLEZEuSXdFRf9OZ98iAvPotyWO18CRZ3R--ugyeHZ56swX4TN_VwN61ctvX_8uASExwMp92MFQ5aFcB9PIZRoFGkcWIHG6Nfta7ZNEP8lCdQDBOUFvXdw4xoKm2PP49XfPZ08VlA-FRLMV8Vcg6L7qyUCojZ_TJ_MqSBMtxd5H3Ch367HmAqQQ-Z-tTJNPcJWbcjV-U6kba8L_K_YLa3FSHkazs-8TtSL0QtmDutJt-JC5jwgR-nL09-XxVWMAVArR-"
                />
                <img
                  alt={podium[1].name}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 rounded-full object-cover border-4 border-yellow-400 shadow-md ring-4 ring-yellow-400/25"
                  src={podium[1].avatarUrl}
                />
                <span className="absolute -bottom-1.5 -right-1 bg-yellow-400 text-on-primary font-bold w-6 h-6 rounded-full text-xs flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-yellow-400 animate-bounce">
                  1
                </span>
                <Sparkles className="absolute -right-3 top-2 text-yellow-400 fill-current w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-headline text-xs font-black text-on-surface truncate max-w-[80px] md:max-w-none">
                  {podium[1].name}
                </h4>
                <p className="text-xs font-black text-primary">{podium[1].score} pts</p>
              </div>
              {/* Golden Pillar block */}
              <div className="w-full bg-yellow-400/20 rounded-t-xl h-24 border-t-4 border-yellow-400 flex flex-col items-center justify-center font-display-game italic text-yellow-600 font-extrabold text-xl select-none">
                <span>1st</span>
                <Trophy className="w-4 h-4 mt-0.5" />
              </div>
            </motion.div>
          )}

          {/* Podium 3rd Place */}
          {podium[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center text-center space-y-2 pb-2"
            >
              <div className="relative">
                <img
                  alt={podium[2].name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-4 border-amber-600/40 shadow-md"
                  src={podium[2].avatarUrl}
                />
                <span className="absolute -bottom-1.5 -right-1 bg-amber-700/80 text-on-primary font-bold w-5 h-5 rounded-full text-[10px] flex items-center justify-center border border-white shadow-sm">
                  3
                </span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-headline text-xs font-bold text-on-surface truncate max-w-[80px] md:max-w-none">
                  {podium[2].name}
                </h4>
                <p className="text-[10px] font-bold text-primary">{podium[2].score} pts</p>
              </div>
              {/* Bronze pillar block */}
              <div className="w-full bg-amber-600/20 rounded-t-xl h-12 border-t-2 border-amber-600/40 flex items-center justify-center font-display-game italic text-amber-700 font-bold text-base select-none">
                3rd
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* List section of and other friends */}
      <div className="space-y-2.5">
        <h3 className="font-label-caps text-xs text-primary font-bold px-1">STANDINGS FIGHT</h3>
        {listUsers.map((item, index) => (
          <div
            key={item.name}
            className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all shadow-sm ${
              item.isCurrentUser
                ? "bg-primary-container/15 border-primary"
                : "bg-surface-container-lowest border-surface-container-highest"
            }`}
          >
            <div className="flex items-center gap-4 text-left">
              <span className="font-display-game font-bold text-sm text-outline-variant w-6 text-center select-none">
                {item.rank}
              </span>

              <img
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/5 shadow-sm"
                src={item.avatarUrl}
              />

              <div>
                <h4 className="font-headline font-bold text-sm text-on-surface flex items-center gap-1.5">
                  {item.name}
                  {item.isCurrentUser && (
                    <span className="bg-primary text-on-primary text-[8px] font-label-caps px-1.5 py-0.5 rounded-full">
                      YOU
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-on-surface-variant/80 font-body">
                  Regular Competitor
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-headline font-black text-sm text-on-surface">
                {item.score} <span className="text-[10px] font-medium text-outline">pts</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky footer rank pointer for current user */}
      {currentUser && currentUser.rank > 2 && (
        <div className="bg-inverse-surface text-inverse-on-surface rounded-2xl p-3 shadow-md flex items-center justify-between font-body text-xs px-5 border border-primary/25">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-container" />
            <span>
              You are currently ranked{" "}
              <strong className="font-bold underline text-primary-container">
                #{currentUser.rank}
              </strong>{" "}
              out of {sorted.length} players.
            </span>
          </div>
          <ChevronUp className="w-4 h-4 animate-bounce text-primary-container" />
        </div>
      )}
    </div>
  );
}
