import React, { useState } from "react";
import { X, Mail, Lock, User, Sparkles, AlertCircle, LogIn, ChevronRight, Loader2, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, signup, loginWithGoogle } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          throw new Error("Display Name is required for registration.");
        }
        await signup(email, password, displayName);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "An authentication error occurred.";
      if (err.code === "auth/operation-not-allowed") {
        errMsg = "Email/Password provider is not yet enabled in your Firebase console. Go to Authentication -> Sign-in Method to enable it, or use Google Login!";
      } else if (err.code === "auth/invalid-credential") {
        errMsg = "Incorrect email or password. Please try again.";
      } else if (err.code === "auth/email-already-in-use") {
        errMsg = "This email is already registered. Try logging in!";
      } else if (err.code === "auth/weak-password") {
        errMsg = "Weak password. Please write at least 6 characters.";
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Container */}
      <div className="glass-card w-full max-w-md rounded-sm p-6 md:p-8 relative overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
        
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#C5A059]/10 rounded-full filter blur-xl opacity-30 pointer-events-none"></div>
        
        {/* Close Button Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-sm text-white/50 hover:text-white transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-white/5 bg-white/[0.02] rounded-full text-[8px] font-bold tracking-[0.2em] text-[#C5A059] uppercase mb-2">
            <Sparkles className="w-3 h-3 text-[#C5A059] fill-current animate-pulse" />
            Arena Passport / パスポート
          </span>
          <h2 className="serif-italic text-2xl md:text-3xl text-white font-light tracking-wide">
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="font-sans text-[10px] text-white/40 font-semibold tracking-widest uppercase mt-1">
            {tab === "login" ? "Log in to sync your high scores" : "Register to start your legend"}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-white/5 border border-white/10 rounded-sm p-1 mb-6">
          <button
            type="button"
            onClick={() => { setTab("login"); setError(null); }}
            className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase transition-all rounded-sm ${
              tab === "login"
                ? "bg-[#C5A059] text-black shadow-md font-bold"
                : "text-white/40 hover:text-white"
            }`}
          >
            LOG IN
          </button>
          <button
            type="button"
            onClick={() => { setTab("signup"); setError(null); }}
            className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase transition-all rounded-sm ${
              tab === "signup"
                ? "bg-[#C5A059] text-black shadow-md font-bold"
                : "text-white/40 hover:text-white"
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* Dynamic Error Indicator */}
        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-300 p-3.5 rounded-sm text-xs leading-relaxed flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <p className="font-light">{error}</p>
          </div>
        )}

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
          {tab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Display Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059] opacity-80" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Kenji, Sakura..."
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/5 text-white font-light text-xs sm:text-sm py-3 pl-10 pr-4 rounded-sm border border-white/10 focus:outline-none focus:border-[#C5A059] transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059] opacity-80" />
              <input
                required
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 text-white font-light text-xs sm:text-sm py-3 pl-10 pr-4 rounded-sm border border-white/10 focus:outline-none focus:border-[#C5A059] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059] opacity-80" />
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 text-white font-light text-xs sm:text-sm py-3 pl-10 pr-4 rounded-sm border border-white/10 focus:outline-none focus:border-[#C5A059] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C5A059] text-black hover:bg-[#D7B574] py-3.5 rounded-sm font-sans font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-colors active:translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>{tab === "login" ? "LOG IN TO ARENA" : "CREATE MY PROFILE"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-white/10 w-full"></div>
          <span className="absolute bg-[#050505] px-3 font-mono text-[8px] text-white/30 tracking-widest font-bold uppercase">OR</span>
        </div>

        {/* Social Sign In button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          type="button"
          className="w-full bg-white/5 border border-white/15 text-white hover:bg-white/10 py-3.5 rounded-sm font-sans font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all focus:outline-none disabled:opacity-45 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.57 1.21 15.69 0 12.24 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.93 0 11.52-4.875 11.52-11.725 0-.785-.085-1.385-.19-1.99H12.24z"
                />
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
            </>
          )}
        </button>

        {/* Informational Developer Note as mandated by rule 3 */}
        <div className="mt-5 border border-white/5 bg-white/[0.01] p-3 rounded-sm flex gap-2 items-start text-[10px] text-white/40">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#C5A059]" />
          <div>
            <p className="font-semibold text-white/60 mb-0.5 leading-none">Console Notice / 注意</p>
            <p className="leading-snug">
              Google Login works out-of-the-box. To sign up with a custom email, ensure "Email/Password" is enabled in your Firebase console.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
