import { toHiragana } from "../game/shiritori";
import { needsReadingLookup } from "../japanese/japanese";

interface JishoEntry {
  japanese: Array<{ word?: string; reading?: string }>;
  senses: Array<{ english_definitions: string[] }>;
}

interface JishoResponse {
  data: JishoEntry[];
}

export interface LookupResult {
  valid: boolean;
  meaning?: string;
  /** Hiragana reading used for shiritori chain rules */
  reading?: string;
}

const cache = new Map<string, LookupResult>();

function cacheKey(word: string): string {
  return toHiragana(word.trim());
}

function pickMatch(entries: JishoEntry[], word: string): JishoEntry | undefined {
  const key = toHiragana(word.trim());
  return entries.find(entry =>
    entry.japanese.some(j => {
      const r = toHiragana((j.reading ?? "").trim());
      const w = toHiragana((j.word ?? "").trim());
      const raw = word.trim();
      return r === key || w === key || j.word === raw || j.reading === raw;
    })
  );
}

/**
 * Check whether a word is real Japanese via the Jisho public API.
 * Returns reading for kanji words so chain rules work correctly.
 * Fails open (valid: true) on network errors so the game never breaks offline.
 */
export async function lookupWord(word: string): Promise<LookupResult> {
  const trimmed = word.trim();
  if (!trimmed) return { valid: false };

  const key = cacheKey(trimmed);
  if (cache.has(key)) return cache.get(key)!;

  // Pure kana — no API needed for reading, but still verify if possible.
  const pureKana = !needsReadingLookup(trimmed);

  try {
    const res = await fetch(
      `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(trimmed)}`
    );
    if (!res.ok) {
      const fallback: LookupResult = pureKana
        ? { valid: true, reading: toHiragana(trimmed) }
        : { valid: true };
      cache.set(key, fallback);
      return fallback;
    }

    const json: JishoResponse = await res.json();
    const match = pickMatch(json.data, trimmed);

    const result: LookupResult = match
      ? {
          valid: true,
          meaning: match.senses[0]?.english_definitions.slice(0, 2).join(", "),
          reading: toHiragana(
            (match.japanese[0]?.reading ?? match.japanese[0]?.word ?? trimmed).trim()
          ),
        }
      : { valid: false };

    cache.set(key, result);
    return result;
  } catch {
    const fallback: LookupResult = pureKana
      ? { valid: true, reading: toHiragana(trimmed) }
      : { valid: true };
    cache.set(key, fallback);
    return fallback;
  }
}
