import { toHiragana } from "./shiritori";

interface JishoEntry {
  japanese: Array<{ word?: string; reading?: string }>;
  senses: Array<{ english_definitions: string[] }>;
}

interface JishoResponse {
  data: JishoEntry[];
}

const cache = new Map<string, { valid: boolean; meaning?: string }>();

/**
 * Check whether a kana string is a real Japanese word via the Jisho public API.
 * Returns { valid: true, meaning } on match, { valid: false } if not found.
 * Fails open (valid: true) on any network or API error so the game never breaks.
 */
export async function lookupWord(kana: string): Promise<{ valid: boolean; meaning?: string }> {
  const key = toHiragana(kana.trim());
  if (cache.has(key)) return cache.get(key)!;

  try {
    const res = await fetch(
      `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(kana)}`
    );
    if (!res.ok) return { valid: true };

    const json: JishoResponse = await res.json();

    // Find an entry whose reading or kana writing exactly matches our word.
    const match = json.data.find((entry) =>
      entry.japanese.some((j) => {
        const r = toHiragana((j.reading ?? "").trim());
        const w = toHiragana((j.word ?? "").trim());
        return r === key || w === key;
      })
    );

    const result: { valid: boolean; meaning?: string } = match
      ? { valid: true, meaning: match.senses[0]?.english_definitions.slice(0, 2).join(", ") }
      : { valid: false };

    cache.set(key, result);
    return result;
  } catch {
    // Fail open — don't block the game if the dictionary is unreachable
    return { valid: true };
  }
}
