// Decorative falling sakura petals for a soft, cute Japanese feel.
// Purely visual; sits behind the content and ignores pointer events.

const PETALS = ["🌸", "🌸", "🌸", "🌼", "🌸", "🌷", "🌸", "✿", "🌸", "❀", "🌸", "🌸"];

export default function Petals() {
  return (
    <div className="petals" aria-hidden>
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${(i * 67 + 4) % 100}%`,
            fontSize: 12 + (i % 4) * 7,
            animationDuration: `${9 + (i % 6) * 2.5}s`,
            animationDelay: `${-i * 2.1}s`,
          }}
        >
          {p}
        </span>
      ))}
    </div>
  );
}
