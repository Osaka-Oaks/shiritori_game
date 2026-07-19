import { useEffect, useState } from "react";
import { useSettings } from "../../settings";

const TITLE = ["し", "り", "と", "り"];
// Decorative kana that drift up the screen behind the title.
const FLOATIES = ["あ", "き", "す", "ね", "は", "ま", "ゆ", "ら", "を", "ん", "こ", "わ"];

interface Props {
  /** Saved player name (empty string if first visit). */
  name: string;
  onDone: () => void;
}

/** Full-screen animated greeting shown when the game opens. */
export default function Welcome({ name, onDone }: Props) {
  const { t } = useSettings();
  const [leaving, setLeaving] = useState(false);

  // Auto-dismiss after a short moment; tapping skips ahead.
  useEffect(() => {
    const id = setTimeout(() => setLeaving(true), 2800);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const id = setTimeout(onDone, 450); // matches the CSS fade-out
    return () => clearTimeout(id);
  }, [leaving, onDone]);

  const greeting = name ? t("welcomeBack", { name }) : t("welcome");

  return (
    <div
      className={`welcome ${leaving ? "leaving" : ""}`}
      onClick={() => setLeaving(true)}
      role="button"
      aria-label={greeting}
    >
      <div className="floaties" aria-hidden>
        {FLOATIES.map((ch, i) => (
          <span
            key={i}
            className="floaty"
            style={{
              left: `${(i * 83 + 7) % 100}%`,
              fontSize: 16 + (i % 4) * 12,
              animationDuration: `${8 + (i % 5) * 2.5}s`,
              animationDelay: `${-i * 1.7}s`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      <div className="welcome-inner">
        <h1 className="welcome-title" aria-label="しりとり">
          {TITLE.map((ch, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              {ch}
            </span>
          ))}
        </h1>
        <p className="welcome-greeting">{greeting}</p>
        <p className="welcome-msg">{t("welcomeMsg")}</p>
        <p className="welcome-tap">{t("tapToStart")}</p>
      </div>
    </div>
  );
}
