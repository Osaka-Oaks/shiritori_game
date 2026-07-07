interface Props {
  onClose: () => void;
}

export default function Rules({ onClose }: Props) {
  return (
    <div className="sheet fade-in">
      <div className="sheet-inner">
        <div className="topbar">
          <span />
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <h2>How to Play / あそびかた</h2>
        <p>
          Shiritori (しりとり, “taking the rear”) is a Japanese word-chain game. Each new word must
          begin with the <b>last kana</b> of the previous word.
        </p>

        <h3>The basics</h3>
        <ul>
          <li>
            Player 1 says any noun, e.g. <code>りんご</code> (ringo, apple).
          </li>
          <li>
            It ends in <code>ご</code>, so the next word must start with <code>ご</code> →{" "}
            <code>ごりら</code> (gorilla).
          </li>
          <li>Keep chaining, taking turns, before your timer runs out.</li>
        </ul>

        <h3>How you lose</h3>
        <ul>
          <li>
            <b>
              Your word ends in <code>ん</code>
            </b>{" "}
            — no Japanese word starts with ん, so the chain dies. Instant loss! (みかん, パン,
            きりん…)
          </li>
          <li>
            <b>You run out of time</b> on your turn.
          </li>
        </ul>
        <p style={{ color: "var(--muted)" }}>
          Words that are already used, don’t match the required kana, or aren’t kana are simply
          rejected — your turn continues, so try another.
        </p>

        <h3>Typing tips</h3>
        <ul>
          <li>
            Type <b>romaji</b> and it converts live: <code>sakura</code> → <code>さくら</code>,{" "}
            <code>kk</code> → <code>っ</code>.
          </li>
          <li>Or use your phone’s Japanese keyboard to type kana directly.</li>
          <li>Katakana loanwords are fine: パンダ, ピアノ, ドア.</li>
          <li>Tap 🔊 on any word to hear it spoken.</li>
        </ul>

        <h3>House rules</h3>
        <ul>
          <li>
            <b>Small kana → big kana:</b> でんしゃ ends in しゃ → next starts with や.
          </li>
          <li>
            <b>Long vowel ー</b> is ignored: ミキサー → next starts with さ.
          </li>
          <li>
            <b>Lenient dakuten</b> (optional): が may be answered with か.
          </li>
        </ul>

        <h3>Strategy</h3>
        <ul>
          <li>
            Trap your opponent with words ending in <code>る</code>, <code>り</code>, or{" "}
            <code>ず</code> — few follow-ups.
          </li>
          <li>Watch for hidden ん in loanwords (ペン, ライオン, ラーメン).</li>
          <li>Keep a stockpile of “safe” words for hard kana like る.</li>
        </ul>

        <button className="btn" style={{ marginTop: 24 }} onClick={onClose}>
          Got it! / りょうかい
        </button>
      </div>
    </div>
  );
}
