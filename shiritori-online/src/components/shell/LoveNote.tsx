import { useSettings } from "../../settings";

interface Props {
  /** The husband's saved name, used to sign the note (optional). */
  fromName?: string;
  onClose: () => void;
}

// Hearts that float up behind the letter.
const HEARTS = ["💛", "🌸", "💕", "🌼", "💗", "🌸", "💛", "✨", "💞", "🌷"];

/**
 * A heartfelt bilingual note from Jorel to his wife Mei. Shown once on the very
 * first visit, and re-openable anytime from the home screen (💌 button).
 */
export default function LoveNote({ fromName, onClose }: Props) {
  const { t } = useSettings();
  const signEn = fromName?.trim() ? fromName.trim() : "your husband";
  const signJa = fromName?.trim() ? `${fromName.trim()}` : "あなたの夫";

  return (
    <div
      className="love-overlay fade-in"
      onClick={onClose}
      role="dialog"
      aria-label="A note for Mei"
    >
      <div className="love-hearts" aria-hidden>
        {HEARTS.map((h, i) => (
          <span
            key={i}
            className="love-heart"
            style={{
              left: `${(i * 79 + 6) % 100}%`,
              fontSize: 16 + (i % 4) * 10,
              animationDuration: `${7 + (i % 5) * 2}s`,
              animationDelay: `${-i * 1.3}s`,
            }}
          >
            {h}
          </span>
        ))}
      </div>

      <div className="love-card" onClick={e => e.stopPropagation()}>
        <div className="love-seal">💌</div>
        <h2 className="love-title">
          For Mei <span className="love-jp">メイへ</span>
        </h2>

        <div className="love-body">
          <p>
            Mei, I made this little game just for us. 💛 I love you — and more than anything I want
            a small moment that&apos;s only ours, every day. So let&apos;s play for five minutes
            every night, win or lose, and just be together.
          </p>
          <p className="love-jp-block" lang="ja">
            メイへ。このゲームは、ふたりのためにつくったよ。💛
            あいしてる。まいばん5ふんだけでも、きみといっしょのじかんがほしいんだ。 かっても
            まけても、ふたりでいられたら それでしあわせ。
          </p>
          <p className="love-sign">
            Forever yours, {signEn} 💛
            <br />
            <span lang="ja">ずっとそばにいるよ。 — {signJa} より</span>
          </p>
        </div>

        <button className="btn" onClick={onClose}>
          {t("loveClose")}
        </button>
      </div>
    </div>
  );
}
