import React, { useState } from "react";
import { Send, Mail, User, MessageSquare, CheckCircle2, AlertCircle, Loader2, Sparkles, Heart } from "lucide-react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setState("submitting");
    setErrorMessage(null);

    const submissionId = `sub_${Date.now()}`;
    const docPath = `contactSubmissions/${submissionId}`;

    try {
      // 1. Store user data securely in Firestore
      const docRef = doc(db, "contactSubmissions", submissionId);
      await setDoc(docRef, {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date() // Evaluates securely in firestore.rules as request.time
      });

      // 2. Submit to backend API route for email transport processing
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process email delivery.");
      }

      setState("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      setState("error");
      setErrorMessage(err.message || "Something went wrong while processing your request.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fadeIn pt-4 pb-20 text-[#D1D1D1]">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 border border-white/10 rounded-full text-[9px] font-bold tracking-[0.2em] text-[#C5A059] leading-none uppercase mb-2">
          <Sparkles className="w-3 h-3 text-[#C5A059] fill-current animate-pulse" />
          Kiku Messenger / お問い合わせ
        </span>
        <h2 className="serif-italic text-3xl md:text-4xl text-white font-light tracking-wide">
          Contact Us
        </h2>
        <p className="text-white/40 font-light text-[10px] tracking-widest uppercase mt-1">
          REACH OUT TO THE SHIRITORI ARENA TEAM
        </p>
      </div>

      {state === "success" ? (
        <div className="glass-card rounded-sm p-8 text-center space-y-5 border-l-2 border-l-[#C5A059] animate-fadeIn">
          <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto text-[#C5A059] border border-[#C5A059]/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="serif-italic text-2xl text-white">Message Transmitted!</h3>
            <p className="text-white/60 text-xs font-light leading-relaxed max-w-sm mx-auto">
              Your inquiry has been stored securely in our database and successfully dispatched to the administrator's inbox.
            </p>
          </div>
          <button
            onClick={() => setState("idle")}
            className="bg-[#C5A059] text-black hover:bg-[#D7B574] text-[10px] font-bold tracking-widest uppercase py-3 px-8 rounded-sm shadow-md transition-all active:translate-y-0.5 cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Send Another Message</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card rounded-sm p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#C5A059]/5 rounded-full filter blur-xl opacity-30 pointer-events-none"></div>

          {/* Error Message */}
          {state === "error" && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-sm text-xs leading-relaxed flex gap-3 items-start animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div>
                <span className="font-semibold block mb-0.5">Submission Error</span>
                <p className="font-light">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold block">
              Your Name / お名前
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059] opacity-80" />
              <input
                required
                disabled={state === "submitting"}
                type="text"
                placeholder="e.g. Jarrel, Sakura"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 text-white font-light text-sm py-3.5 pl-11 pr-4 rounded-sm border border-white/10 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold block">
              Email Address / メール
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059] opacity-80" />
              <input
                required
                disabled={state === "submitting"}
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 text-white font-light text-sm py-3.5 pl-11 pr-4 rounded-sm border border-white/10 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
              />
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold block">
              Inquiry Message / メッセージ
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4.5 w-4 h-4 text-[#C5A059] opacity-80" />
              <textarea
                required
                disabled={state === "submitting"}
                rows={5}
                placeholder="Write your feedback, bug reports, or feature requests..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/5 text-white font-light text-sm py-3.5 pl-11 pr-4 rounded-sm border border-white/10 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all resize-none min-h-[120px]"
              />
            </div>
          </div>

          {/* Explicit submission instructions */}
          <p className="text-[9px] text-white/30 font-light leading-relaxed">
            By clicking submit, your form inquiry is securely saved into our live Firebase Cloud database containing strict Zero-Trust protocols, and processed via server-side mailer simulation protocols.
          </p>

          <button
            type="submit"
            disabled={state === "submitting"}
            className="w-full bg-[#C5A059] text-black hover:bg-[#D7B574] py-4 rounded-sm font-sans font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-colors active:translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
          >
            {state === "submitting" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>SEND MESSAGE</span>
                <Send className="w-3.5 h-3.5 fill-current" />
              </>
            )}
          </button>
        </form>
      )}

    </div>
  );
}
