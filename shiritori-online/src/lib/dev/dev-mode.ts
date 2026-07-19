/** Dev / test helpers — enabled in Vite dev, via ?dev=1, or localStorage. */

export interface DevSettings {
  enabled: boolean;
  skipTimer: boolean;
  instantCpu: boolean;
  skipDictionary: boolean;
  showDebug: boolean;
}

const STORAGE_KEY = "shiritori_dev";

export function isDevEnvironment(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("dev") === "1") return true;
  return localStorage.getItem(STORAGE_KEY) === "1";
}

export function loadDevSettings(): DevSettings {
  const enabled = isDevEnvironment();
  let stored: Partial<DevSettings> = {};
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_opts`);
    if (raw) stored = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {
    enabled,
    skipTimer: stored.skipTimer ?? false,
    instantCpu: stored.instantCpu ?? false,
    skipDictionary: stored.skipDictionary ?? false,
    showDebug: stored.showDebug ?? enabled,
  };
}

export function saveDevSettings(patch: Partial<DevSettings>): DevSettings {
  const current = loadDevSettings();
  const next = { ...current, ...patch, enabled: current.enabled };
  localStorage.setItem(`${STORAGE_KEY}_opts`, JSON.stringify(next));
  return next;
}

export function enableDevMode(): void {
  localStorage.setItem(STORAGE_KEY, "1");
}
