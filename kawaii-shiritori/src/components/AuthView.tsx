import React from "react";
import { motion } from "motion/react";
import { PlayerProfile, AppCustomizations, DEFAULT_CUSTOMIZATIONS } from "../types";
import { User, Mail, Lock, LogIn, UserPlus, LogOut, Check, Sparkles, AlertCircle } from "lucide-react";

interface AuthViewProps {
  currentUser: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  onRegister: (user: AuthUser) => void;
}

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  avatarUrl: string;
  customizations: AppCustomizations;
}

const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuANOuGrOsv-96XQvI8bosq_UYcnNGdxDKm5cOF2YbrvU1TWSXsQvqqqDS4bVFmwbRDeWP4shfrZmDoXtHB3gt-9IJJITzse1D_ewjhj3qT-paPy294Mz5tih9ZdTEGRa-1chVf5KhcVghmhCvUGqQppn9DFqiQvq1gT1wE0GO0Ac5b15y8tju5B5TTWmXgZeg2ysTvNs_UqjgtaKDCqvK68L8-TWauBjqCXJacIiX80f33WvQ2maDkrMR3v9xaMaCfTi-YQA5YXO6Jj",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDv2_dSmuLzNIvq77bleM6yYK1w2nskbF-805BwE30p1TCTfPqHucQDAhM51009utAwsM6gOV0Pf4wEKJ7SxEX9Zv2R7bHUD9Y48kWy2ryoViyezxrLRkfiMgWMXsgiswNZmqFEyeSZFvAUfS-BjXK2NuUE1tD4HE6ks_DU_weW0RR9jrg9ESv15u3kPcSXDOMX7jQdFtaqgPe82uxThMpWFrN0mLCMa8PEBZTMiDunmvltqaE4mghXOTvBoEhYqMx7RPt3lUshKVvY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC5Lg5SU1xKaPIp0mM--d-Cep1T93IrZoLObvX2XNsHO8P-sgdUN8q_D1v5DWfBUXEkKW59oJtJcM0q8o4_1jT5XFM9M3Mu3amwXXKFMPfo_S6MscBlMqBrO4sDHxvHNL1KlKIXI91sYZkaYd-X8aH6yzGf6ABkJUT1E2QAQnPRZLZ0C9c67gWNbWx6hmp-2oMyST2EHB4FLVV-XvbRz-RXEZegVx39CKMnsJnPtoetEXNsOdQjg-KTjAmi2s2j1M3NOXlLjHtcDQo7",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDFRYI5dsRRAnSJV4BppuP-eap7bMIE9mKy65rz08TBAULgei4Nofz3ln4LLTJfnHXvxtI-k4mEBCtsri257VesEzQ_eAxT9XBju7KMfc8NepRD17o5rkW1rgB16wNNM83jLvs7I1Xt238IFjgIhxUJFFqePYlA3i9H0cDZwrLONCXS_lJlAFQyEWosSLb5-jZUzarDzM2vKfIA6q8FTDBOM41TYWjdxEtc1nFCSjBYamaJZItiEsKZreGwqaOW1KWuVddOmpiTur0p",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCiUGinuf2_gEvw9lg5ziXpJoQjS-EeUXJC9gLJzBVu-t_8T8IzvBA59uUGDh2nOF1RVA69aXXq4cV93HG3vK63mPS5tLLq8UOiG1SRTrOG8BLiJsmY-uR4C6rSRFy3o5bNmAyaRF40RFn70d0YeGD62DLDNWyXfODBbQMQvJVcs4VF39YgKjYfQhTxjMt2QcD5GkKlzMc82brS_TiSv3euPOO9TQX8hPd7Gj5KMPY9ai1Cd98Kmn92TA--FlZqnuwS3kAVtI023Bs4"
];

export default function AuthView({
  currentUser,
  onLogin,
  onLogout,
  onRegister,
}: AuthViewProps) {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [selectedAvatar, setSelectedAvatar] = React.useState(AVATARS[0]);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password || (isSignUp && !nickname)) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    // Retrieve accounts
    const savedAccounts = localStorage.getItem("shiritori_accounts");
    let accounts: Record<string, any> = {};
    if (savedAccounts) {
      try { accounts = JSON.parse(savedAccounts); } catch (err) { /* ignore */ }
    }

    const emailKey = email.toLowerCase().trim();

    if (isSignUp) {
      if (accounts[emailKey]) {
        setErrorMsg("An account with this email already exists.");
        return;
      }

      const newUid = "uid_" + Math.random().toString(36).substring(2, 9);
      const newUser: AuthUser = {
        uid: newUid,
        email: emailKey,
        name: nickname,
        avatarUrl: selectedAvatar,
        customizations: { ...DEFAULT_CUSTOMIZATIONS }
      };

      accounts[emailKey] = {
        password: password,
        user: newUser
      };

      localStorage.setItem("shiritori_accounts", JSON.stringify(accounts));
      onRegister(newUser);
      setSuccessMsg(`Welcome, ${nickname}! Account created successfully.`);
      // Reset
      setEmail("");
      setPassword("");
      setNickname("");
    } else {
      const match = accounts[emailKey];
      if (!match || match.password !== password) {
        setErrorMsg("Incorrect email or password combination.");
        return;
      }

      onLogin(match.user);
      setSuccessMsg(`Welcome back, ${match.user.name}!`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 px-4 flex flex-col items-center">
      {/* Container Card */}
      <div className="w-full bg-surface-container-low border-2 border-white p-6 relative">
        <span className="absolute top-1.5 left-2 text-[8px] font-mono text-primary tracking-[3px]">
          SECURE // AUTHENTIC_NODE_09
        </span>
        <span className="absolute bottom-1.5 right-2 text-[8px] font-mono text-white/30">
          STARK_MODE_ACTIVE
        </span>

        {currentUser ? (
          /* Profile and Log Out Mode */
          <div className="space-y-6 text-center py-4">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-primary/20 blur-md rounded-full animate-pulse" />
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="relative w-24 h-24 rounded-full object-cover border-2 border-primary mx-auto"
              />
              <div className="absolute bottom-0 right-1 border border-white bg-primary p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="struct-index text-[10px] tracking-[4px] uppercase block text-primary font-mono">
                CONNECTED USER
              </span>
              <h2 className="font-headline text-3xl font-black text-white uppercase tracking-tight">
                {currentUser.name}
              </h2>
              <p className="font-mono text-xs text-on-surface-variant truncate max-w-xs mx-auto">
                {currentUser.email}
              </p>
            </div>

            <div className="border border-white/10 p-3 bg-surface-dim font-mono text-left text-[11px] space-y-1 my-3">
              <p className="text-white/40 uppercase text-[9px] tracking-widest border-b border-white/5 pb-1 mb-1.5">
                Saved Preferences System
              </p>
              <p><span className="text-primary font-bold">Accent:</span> {currentUser.customizations?.accentColor || "#f27d26"}</p>
              <p><span className="text-primary font-bold">Grid:</span> {currentUser.customizations?.gridStyle || "sparse"}</p>
              <p><span className="text-primary font-bold">Typography:</span> {currentUser.customizations?.font || "Space Grotesk"}</p>
              <p><span className="text-primary font-bold">Casing:</span> {currentUser.customizations?.headingStyle || "uppercase"}</p>
            </div>

            <button
              onClick={onLogout}
              className="w-full bg-primary text-on-primary font-bold py-3 px-6 rounded-none flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest text-xs transition-opacity hover:opacity-90"
            >
              <LogOut className="w-4 h-4" />
              Disconnect Profile
            </button>
          </div>
        ) : (
          /* Form Login/Register mode */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="font-headline text-3xl font-black tracking-tighter text-white uppercase mt-4">
                {isSignUp ? "Create Workspace Account" : "Access your workspace"}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                {isSignUp 
                  ? "Register a profile to custom design your word boards and save stats online"
                  : "Connect to dynamically load your customizations and continue duels"
                }
              </p>
            </div>

            {/* Switch Mode Tab buttons */}
            <div className="flex border-2 border-white/20 p-1 bg-surface">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMsg(""); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider ${
                  !isSignUp ? "bg-primary text-white" : "text-on-surface-variant hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMsg(""); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider ${
                  isSignUp ? "bg-primary text-white" : "text-on-surface-variant hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="bg-red-900/40 border border-red-500/50 p-2 text-xs text-red-200 font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success notifications */}
            {successMsg && (
              <div className="bg-emerald-950/40 border border-emerald-500/50 p-2 text-xs text-emerald-200 font-mono flex items-center gap-2 animate-pulse">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Forms body */}
            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              {isSignUp && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                    Display Name / Nickname
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      className="w-full bg-surface border-2 border-white/20 py-2.5 pl-10 pr-4 text-sm font-bold focus:outline-none focus:border-primary transition-all text-white placeholder:text-white/20"
                      placeholder="e.g. Melvin"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value.substring(0, 15))}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                  Workspace Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    className="w-full bg-surface border-2 border-white/20 py-2.5 pl-10 pr-4 text-sm font-bold focus:outline-none focus:border-primary transition-all text-white placeholder:text-white/20"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                  Secret Credentials Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    className="w-full bg-surface border-2 border-white/20 py-2.5 pl-10 pr-4 text-sm font-bold focus:outline-none focus:border-primary transition-all text-white placeholder:text-white/20"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                    Choose Character Avatar
                  </label>
                  <div className="flex gap-2.5 justify-center py-2 bg-surface border border-white/10">
                    {AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(url)}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all shrink-0 select-none relative ${
                          selectedAvatar === url ? "scale-105 border-primary" : "border-white/10 filter grayscale opacity-70"
                        }`}
                      >
                        <img src={url} alt={`Avatar option ${idx}`} className="w-full h-full object-cover" />
                        {selectedAvatar === url && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white stroke-[3px]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-bold py-3.5 px-6 rounded-none flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest text-xs transition-transform active:scale-99"
              >
                {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {isSignUp ? "Complete Registration" : "Authenticate Session"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
