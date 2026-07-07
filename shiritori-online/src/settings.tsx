import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ============================ Theme ============================ */

export type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

function getSystemTheme(): Resolved {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/* ========================== Language ========================== */
// 'en' = English only, 'ja' = Japanese only, 'both' = bilingual (EN / JA)
export type Lang = "en" | "ja" | "both";

type Str = { en: string; ja: string };

// All user-facing UI text. Add a key here, use it via t("key") everywhere.
const STRINGS = {
  subtitle: { en: "Shiritori · word chain", ja: "しりとり・ことばつなぎ" },

  // Welcome splash
  welcome: { en: "Welcome!", ja: "ようこそ！" },
  welcomeBack: { en: "Welcome back, {name}!", ja: "おかえり、{name}！" },
  welcomeMsg: { en: "Let's play the word-chain game!", ja: "ことばつなぎであそぼう！" },
  tapToStart: { en: "Tap to start", ja: "タップしてスタート" },

  // Home / lobby
  yourName: { en: "Your name", ja: "なまえ" },
  namePlaceholder: { en: "e.g. Mei", ja: "れい：めい" },
  turnTimer: { en: "Turn timer", ja: "もちじかん" },
  houseRules: { en: "House rules", ja: "ハウスルール" },
  hideHouseRules: { en: "Hide house rules", ja: "ハウスルールをとじる" },
  smallKana: { en: "Small kana → big kana", ja: "小さいかな → 大きいかな" },
  smallKanaSub: { en: "でんしゃ → や (not しゃ)", ja: "でんしゃ → や（しゃではない）" },
  dakuten: { en: "Lenient dakuten", ja: "濁点をゆるく" },
  dakutenSub: {
    en: "が can be answered with か, ぱ with は",
    ja: "が→か、ぱ→は でもOK",
  },
  createRoom: { en: "Create a room", ja: "へやをつくる" },
  creating: { en: "Creating…", ja: "つくっています…" },
  orJoin: { en: "or join with a code", ja: "またはコードでさんか" },
  codePlaceholder: { en: "CODE", ja: "コード" },
  join: { en: "Join", ja: "さんか" },
  joining: { en: "Joining…", ja: "さんかちゅう…" },
  howToPlay: { en: "How to play", ja: "あそびかた" },
  enterCode: { en: "Enter the 4-character room code.", ja: "4文字のコードを入れてね。" },

  // Love note 💌
  loveButton: { en: "A note for Mei", ja: "メイへのメッセージ" },
  loveClose: { en: "I love you too 💛", ja: "わたしもだいすき 💛" },

  // Connecting / errors
  connecting: { en: "Connecting…", ja: "せつぞくちゅう…" },
  connectError: {
    en: "Couldn't connect to the game server. Check your internet / Firebase setup.",
    ja: "サーバーにつながりません。ネットせつぞくをかくにんしてね。",
  },
  roomClosed: { en: "This room has closed.", ja: "このへやはとじました。" },
  backHome: { en: "Back home", ja: "ホームへもどる" },
  loadingRoom: { en: "Loading room", ja: "へやをよみこみちゅう" },

  // Waiting room
  shareCode: {
    en: "Share this code with your opponent:",
    ja: "このコードをあいてにおしえてね：",
  },
  shareInvite: { en: "Share invite link", ja: "しょうたいリンクをおくる" },
  linkCopied: { en: "Link copied! ✓", ja: "コピーしました！✓" },
  waitingP2: { en: "Waiting for player 2 to join", ja: "プレイヤー2をまっています" },

  // Game board
  you: { en: "YOU", ja: "あなた" },
  opponent: { en: "OPPONENT", ja: "あいて" },
  playing: { en: "playing", ja: "プレイ中" },
  yourTurnSec: { en: "Your turn · {sec}s", ja: "あなたの番 · {sec}秒" },
  theirTurnSec: { en: "{name}'s turn · {sec}s", ja: "{name}さんの番 · {sec}秒" },
  nextStartsWith: { en: "Next word starts with", ja: "つぎのことばは…からはじまる" },
  anyFirst: { en: "anything — first word!", ja: "なんでもOK — さいしょのことば！" },
  chainEmpty: { en: "The chain is empty.", ja: "まだことばがありません。" },
  playAnyNoun: { en: "Play any noun to start!", ja: "すきな名詞ではじめよう！" },
  waitingFirst: { en: "Waiting for the first word…", ja: "さいしょのことばをまっています…" },
  nextLabel: { en: "next", ja: "つぎ" },
  typePrompt: { en: "type romaji or kana…", ja: "ローマ字かかなを入力…" },
  inputPlaceholder: { en: "e.g. sakura → さくら", ja: "れい：sakura → さくら" },
  hint: { en: "Hint", ja: "ヒント" },
  noHint: { en: "No hint available — you're on your own! 💪", ja: "ヒントなし — がんばって！💪" },
  checking: { en: "Checking word…", ja: "ことばをかくにんちゅう…" },
  notRealWord: {
    en: "Not a real Japanese word — try another!",
    ja: "日本語のことばではありません — 別のことばを試してね！",
  },
  waitingOpp: { en: "Waiting for {name} to play…", ja: "{name}さんの番をまっています…" },
  opponentFallback: { en: "your opponent", ja: "あいて" },

  // Game over
  youWin: { en: "You win!", ja: "かち！" },
  youLose: { en: "You lose", ja: "まけ" },
  rematch: { en: "Rematch", ja: "もういちど" },
  startingRematch: { en: "Starting…", ja: "はじめます…" },
  waitingOppRematch: { en: "Waiting for opponent…", ja: "あいてをまっています…" },
  oppWantsRematch: { en: "Opponent wants a rematch!", ja: "あいてがもういちどやりたい！" },
  leaveRoom: { en: "Leave room", ja: "へやをでる" },
  endN: {
    en: "Played 「{word}」 which ends in ん — instant loss!",
    ja: "「{word}」は「ん」でおわり — そっこうまけ！",
  },
  endTimeout: { en: "Ran out of time!", ja: "時間切れ！" },

  // Solo / vs CPU
  soloTitle: { en: "Practice vs CPU", ja: "CPUとれんしゅう" },
  soloSubtitle: { en: "Pick a level — get instant feedback", ja: "レベルをえらんで — すぐへんしんがくれる" },
  soloYourTurn: { en: "Your turn", ja: "あなたの番" },
  soloCpuThinking: { en: "CPU is thinking…", ja: "CPUがかんがえちゅう…" },
  soloPlay: { en: "Play", ja: "プレイ" },
  soloPlayAgain: { en: "Play again", ja: "もういちど" },
  soloChangeLevel: { en: "Change level", ja: "レベルへんこう" },
  soloPracticeBtn: { en: "Practice vs CPU (solo)", ja: "CPUとれんしゅう（ひとり）" },
  soloDevHint: { en: "Dev: add ?dev=1 to URL for test tools", ja: "開発：?dev=1 でテストツール" },
} as const;

export type StringKey = keyof typeof STRINGS;

function render(s: Str, lang: Lang): string {
  if (lang === "en") return s.en;
  if (lang === "ja") return s.ja;
  // both: avoid duplicating identical text (e.g. example chains)
  return s.en === s.ja ? s.en : `${s.en} / ${s.ja}`;
}

function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

/* ========================== Context ========================== */

interface SettingsValue {
  theme: Theme;
  resolvedTheme: Resolved;
  cycleTheme: () => void;
  lang: Lang;
  cycleLang: () => void;
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<SettingsValue | undefined>(undefined);

const THEME_KEY = "shiritori_theme";
const LANG_KEY = "shiritori_lang";
const THEME_ORDER: Theme[] = ["system", "light", "dark"];
const LANG_ORDER: Lang[] = ["both", "en", "ja"];

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const s = localStorage.getItem(THEME_KEY);
    return s === "light" || s === "dark" || s === "system" ? s : "system";
  });
  const [systemTheme, setSystemTheme] = useState<Resolved>(getSystemTheme);
  const [lang, setLang] = useState<Lang>(() => {
    const s = localStorage.getItem(LANG_KEY);
    return s === "en" || s === "ja" || s === "both" ? s : "both";
  });

  const resolvedTheme: Resolved = theme === "system" ? systemTheme : theme;

  // React to OS theme changes while on "system".
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemTheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Apply the resolved theme to <html> + persist preference.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, resolvedTheme]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === "ja" ? "ja" : "en";
  }, [lang]);

  const cycleTheme = useCallback(
    () => setTheme(t => THEME_ORDER[(THEME_ORDER.indexOf(t) + 1) % THEME_ORDER.length]),
    []
  );
  const cycleLang = useCallback(
    () => setLang(l => LANG_ORDER[(LANG_ORDER.indexOf(l) + 1) % LANG_ORDER.length]),
    []
  );

  const t = useCallback(
    (key: StringKey, vars?: Record<string, string | number>) =>
      interpolate(render(STRINGS[key], lang), vars),
    [lang]
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, cycleTheme, lang, cycleLang, t }),
    [theme, resolvedTheme, cycleTheme, lang, cycleLang, t]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}

/* ===================== Reusable controls ===================== */

const THEME_ICON: Record<Theme, string> = { system: "🌗", light: "☀️", dark: "🌙" };
const THEME_LABEL: Record<Theme, Str> = {
  system: { en: "Auto", ja: "自動" },
  light: { en: "Light", ja: "ライト" },
  dark: { en: "Dark", ja: "ダーク" },
};
const LANG_LABEL: Record<Lang, string> = { both: "EN+日", en: "EN", ja: "日本語" };

/** Theme + language buttons. `compact` shows icons only (for the game topbar). */
export function SettingsControls({ compact = false }: { compact?: boolean }) {
  const { theme, lang, cycleTheme, cycleLang } = useSettings();
  return (
    <div className="settings-bar" style={compact ? { padding: 0 } : undefined}>
      <button
        className={`ctl ${compact ? "compact" : ""}`}
        onClick={cycleTheme}
        aria-label="Change theme"
      >
        <span className="ic">{THEME_ICON[theme]}</span>
        {!compact && <span>{render(THEME_LABEL[theme], lang === "ja" ? "ja" : "en")}</span>}
      </button>
      <button
        className={`ctl ${compact ? "compact" : ""}`}
        onClick={cycleLang}
        aria-label="Change language"
        style={compact ? { width: "auto", padding: "0 10px", fontSize: 13 } : undefined}
      >
        {compact ? (
          <span>{LANG_LABEL[lang]}</span>
        ) : (
          <>
            <span className="ic">🌐</span>
            <span>{LANG_LABEL[lang]}</span>
          </>
        )}
      </button>
    </div>
  );
}
