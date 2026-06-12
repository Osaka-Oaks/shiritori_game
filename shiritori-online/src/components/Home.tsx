import { useState } from "react";
import { createRoom, joinRoom } from "../lib/roomService";
import { DEFAULT_RULES, type RuleSettings } from "../lib/shiritori";
import { useSettings, SettingsControls } from "../settings";

interface Props {
  uid: string;
  name: string;
  setName: (n: string) => void;
  deepLinkCode: string;
  onEnterRoom: (code: string) => void;
  onShowRules: () => void;
}

const TIME_OPTIONS = [15, 30, 60];

export default function Home({
  uid,
  name,
  setName,
  deepLinkCode,
  onEnterRoom,
  onShowRules,
}: Props) {
  const { t } = useSettings();
  const [joinCode, setJoinCode] = useState(deepLinkCode);
  const [timeLimit, setTimeLimit] = useState(30);
  const [rules, setRules] = useState<RuleSettings>(DEFAULT_RULES);
  const [showSettings, setShowSettings] = useState(false);
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState("");

  const trimmedName = name.trim();

  async function handleCreate() {
    if (busy) return;
    setError("");
    setBusy("create");
    try {
      const code = await createRoom(uid, trimmedName || "Player 1", timeLimit, rules);
      onEnterRoom(code);
    } catch (e: any) {
      setError(e?.message ?? "Could not create a room.");
      setBusy(null);
    }
  }

  async function handleJoin() {
    if (busy) return;
    setError("");
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      setError(t("enterCode"));
      return;
    }
    setBusy("join");
    const res = await joinRoom(uid, trimmedName || "Player 2", code);
    if (res.ok) {
      onEnterRoom(code);
    } else {
      setError(res.reason);
      setBusy(null);
    }
  }

  return (
    <div className="app fade-in">
      <SettingsControls />

      <div className="brand">
        <h1>しりとり</h1>
        <p>{t("subtitle")}</p>
      </div>

      <div className="card">
        <label className="label">{t("yourName")}</label>
        <input
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          maxLength={16}
        />

        <label className="label">{t("turnTimer")}</label>
        <div className="seg">
          {TIME_OPTIONS.map((tt) => (
            <button
              key={tt}
              className={timeLimit === tt ? "on" : ""}
              onClick={() => setTimeLimit(tt)}
            >
              {tt}s
            </button>
          ))}
        </div>

        <button
          className="btn ghost"
          style={{ marginTop: 10 }}
          onClick={() => setShowSettings((s) => !s)}
        >
          {showSettings ? `▲ ${t("hideHouseRules")}` : `▼ ${t("houseRules")}`}
        </button>

        {showSettings && (
          <div className="fade-in">
            <Toggle
              label={t("smallKana")}
              sub={t("smallKanaSub")}
              on={rules.smallKanaLenient}
              onToggle={() =>
                setRules((r) => ({ ...r, smallKanaLenient: !r.smallKanaLenient }))
              }
            />
            <Toggle
              label={t("dakuten")}
              sub={t("dakutenSub")}
              on={rules.dakutenLenient}
              onToggle={() =>
                setRules((r) => ({ ...r, dakutenLenient: !r.dakutenLenient }))
              }
            />
          </div>
        )}

        <button
          className="btn"
          style={{ marginTop: 18 }}
          onClick={handleCreate}
          disabled={busy !== null}
        >
          {busy === "create" ? t("creating") : `✨ ${t("createRoom")}`}
        </button>

        <div className="divider">{t("orJoin")}</div>

        <div className="row">
          <input
            className="field"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder={t("codePlaceholder")}
            maxLength={4}
            autoCapitalize="characters"
            style={{
              textTransform: "uppercase",
              letterSpacing: "6px",
              textAlign: "center",
              fontWeight: 700,
            }}
          />
          <button
            className="btn secondary"
            onClick={handleJoin}
            disabled={busy !== null}
          >
            {busy === "join" ? t("joining") : t("join")}
          </button>
        </div>

        <p className="error">{error}</p>
      </div>

      <button className="btn ghost" style={{ marginTop: 10 }} onClick={onShowRules}>
        {t("howToPlay")}
      </button>
    </div>
  );
}

function Toggle({
  label,
  sub,
  on,
  onToggle,
}: {
  label: string;
  sub: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="toggle-row" onClick={onToggle}>
      <div>
        <div className="t-label">{label}</div>
        <div className="t-sub">{sub}</div>
      </div>
      <div className={`switch ${on ? "on" : ""}`} />
    </div>
  );
}
