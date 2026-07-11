# Shiritori — Rule Specification

**The definitive source of truth for game rules across all implementations.**

**Last Updated:** July 10, 2026  
**Version:** 2.0

---

## Overview

Shiritori is **not one game** — it's **two rule engines** with a learner layer on top. This document specifies the exact behavior for each mode.

---

## Player Personas & Modes

### The Four Real User Types

| Player Type | Mode They Play | Script Shown | Extra Needs |
|-------------|----------------|--------------|-------------|
| **English speaker learning Japanese** | Japanese | hiragana + romaji + English meaning | Furigana, hints, difficulty tiers |
| **Native Japanese kid** | Japanese | hiragana only | Small vocab, gentle rules |
| **Native Japanese adult** | Japanese | kana (+ kanji ok) | Full vocabulary |
| **English speaker, casual** | English | letters | None |

**Key Insight:** This isn't "two languages" — it's **two rule engines** + a **learner assistance layer** on top of the Japanese one.

---

## Rule Engine Comparison

### Side-by-Side Specification

| Rule | English Mode | Japanese Mode (しりとり) |
|------|--------------|------------------------|
| **Chain Match** | Last **letter** → First letter | Last **kana** → First kana |
| **Losing Move** | None (standard)<br>Optional: word ending in "n" | Word ending in **ん** / "n"<br>→ Immediate loss |
| **Repeats** | Not allowed | Not allowed |
| **Word Type** | Any word<br>(or nouns-only house rule) | Traditionally **nouns only** |
| **Case/Script** | Normalize to lowercase | Normalize hiragana ⇄ katakana before matching |
| **Long Vowel ー** | N/A | Treat カレー as ending in **え**<br>(the vowel it stands for) |
| **Small Kana ゃゅょっ** | N/A | Match on full-size kana<br>(きしゃ → や) |
| **Voiced Dakuten (が/か)** | N/A | House rule: decide if が counts as か<br>**Default: lenient (kid-friendly)** |

---

## English Mode — Detailed Rules

### Core Mechanics

**Match Rule:**
```typescript
const lastChar = previousWord[previousWord.length - 1].toLowerCase();
const firstChar = currentWord[0].toLowerCase();
return lastChar === firstChar;
```

**Example Chain:**
```
apple → elephant → tiger → rabbit → turtle → egg
  e   →     e    →   t   →    t   →   t    → e
```

### Normalization

```typescript
function normalizeEnglish(word: string): string {
  return word.toLowerCase().trim();
}
```

**Rules:**
1. Convert to lowercase: "Apple" → "apple"
2. Trim whitespace: " hello " → "hello"
3. Remove accents (optional): "résumé" → "resume"

### Losing Condition

**Standard:** None (any last letter is valid)

**Optional Flag:** `banEndingLetter`
```typescript
const config = {
  mode: 'english',
  banEndingLetter: 'n',  // Optional: disallow words ending in 'n'
};

// If enabled:
if (word.endsWith('n')) {
  return { valid: false, reason: 'Words ending in "n" are not allowed' };
}
```

### Word Validation

```typescript
function validateEnglishWord(word: string): boolean {
  const normalized = normalizeEnglish(word);
  
  // Minimum length
  if (normalized.length < 2) return false;
  
  // Only letters
  if (!/^[a-z]+$/.test(normalized)) return false;
  
  // In dictionary
  return englishDictionary.has(normalized);
}
```

---

## Japanese Mode (しりとり) — Detailed Rules

### Core Mechanics

**Match Rule:**
```typescript
const lastKana = getLastKana(previousWord);  // After normalization
const firstKana = getFirstKana(currentWord); // After normalization
return lastKana === firstKana;
```

**Example Chain:**
```
いぬ → ぬま → まち → ちず → ずし
 ぬ  →  ぬ  →  ま  →  ち  →  ず
```

### Normalization (Critical!)

**Applied BEFORE matching:**

```typescript
function normalizeJapanese(word: string): string {
  let normalized = word.trim();
  
  // 1. Katakana → Hiragana
  normalized = convertKatakanaToHiragana(normalized);
  
  // 2. Handle long vowel marks (ー)
  normalized = expandLongVowels(normalized);
  
  // 3. Handle small kana (ゃゅょっ)
  // Keep as-is for matching
  
  return normalized;
}
```

#### Normalization Examples

**1. Katakana → Hiragana:**
```
Input:   ネコ (katakana)
Output:  ねこ (hiragana)
Match:   "ネコ" and "ねこ" are treated as same word
```

**2. Long Vowel Mark (ー):**
```
Input:   カレー
Process: カレー → かれー → かれえ
Last:    え (not ー)

Chain:   カレー → えんぴつ ✅ Valid
         (かれー ends in え → えんぴつ starts with え)
```

**3. Small Kana (ゃゅょっ):**
```
Input:   きしゃ (kisha - train)
Last:    ゃ → や (small ya becomes full ya)
Chain:   きしゃ → やま ✅ Valid
```

**4. Doubled Consonant (っ):**
```
Input:   がっこう (gakkou - school)
Last:    う
Chain:   がっこう → うみ ✅ Valid
```

### Losing Condition (ん / "n")

**The Core Japanese Rule:**

```typescript
function endsInN(word: string): boolean {
  const normalized = normalizeJapanese(word);
  const lastChar = normalized[normalized.length - 1];
  return lastChar === 'ん';
}

// Playing a word ending in ん = INSTANT LOSS
if (endsInN(word)) {
  return {
    valid: false,
    reason: 'Word ends in ん — you lose!',
    isLosingMove: true
  };
}
```

**Examples:**
```
らいおん (raion - lion)    → Ends in ん → LOSE ❌
みかん   (mikan - orange)   → Ends in ん → LOSE ❌
にほん   (nihon - Japan)    → Ends in ん → LOSE ❌
さくら   (sakura - cherry)  → Ends in ら → OK ✅
```

**Why this rule exists:** In Japanese, very few words START with ん, making it nearly impossible to continue the chain.

### House Rules (Configurable)

#### 1. Voiced Dakuten Leniency

**The Question:** Does が (ga) count as か (ka) for matching?

**Strict (Adult Mode):**
```typescript
const config = { lenientDakuten: false };

// か → が = INVALID ❌
// か → か = VALID ✅
```

**Lenient (Kid-Friendly, Default):**
```typescript
const config = { lenientDakuten: true };

// か → が = VALID ✅ (allows ga after ka)
// か → か = VALID ✅
```

**Pairs affected:**
```
か/が  き/ぎ  く/ぐ  け/げ  こ/ご
さ/ざ  し/じ  す/ず  せ/ぜ  そ/ぞ
た/だ  ち/ぢ  つ/づ  て/で  と/ど
は/ば/ぱ  ひ/び/ぴ  ふ/ぶ/ぷ  へ/べ/ぺ  ほ/ぼ/ぽ
```

#### 2. Nouns Only

**Traditional Rule:** Only nouns allowed

**Modern/Casual:** All word types allowed

```typescript
const config = {
  nounsOnly: true,  // Traditional
  // OR
  nounsOnly: false, // Casual (default for learners)
};
```

---

## Learner Layer (English Speakers Playing Japanese Mode)

### Display Format

**For Each Word:**
```
かれー
ka-re-
curry
```

**Components:**
1. **Kana** (hiragana/katakana)
2. **Romaji** (Latin alphabet representation)
3. **English Meaning** (translation)

### Difficulty Tiers

| Tier | Name | Vocabulary | Complexity |
|------|------|------------|------------|
| **1** | Kids/Beginners | Common hiragana nouns only<br>(~500 words) | No katakana, no compound words |
| **2** | Intermediate | + Katakana loanwords<br>(~2,000 words) | Some compound words |
| **3** | Advanced/Adult | Full dictionary<br>(~20,000 words) | Kanji readings, all word types |

**Tier Gating:**
```typescript
interface LearnerConfig {
  tier: 1 | 2 | 3;
  showRomaji: boolean;      // Default: true
  showMeaning: boolean;     // Default: true
  showFurigana: boolean;    // For kanji (tier 3)
  hintsEnabled: boolean;    // Suggest next words
}
```

### Romaji Input Support

**Critical UX Decision:** Allow learners to type in romaji

```typescript
function processLearnerInput(input: string, tier: number): string {
  // Convert "gorira" → "ゴリラ"
  const kana = romajiToKana(input);
  
  // Validate against tier-appropriate dictionary
  const dict = getTierDictionary(tier);
  if (!dict.has(kana)) {
    return { error: 'Word not in your current tier' };
  }
  
  return kana;
}
```

**Romaji Conversion Examples:**
```
Input:    "neko"
Output:   "ねこ"

Input:    "gorira"  
Output:   "ゴリラ"

Input:    "sakura"
Output:   "さくら"
```

**System Used:** Modified Hepburn romanization

---

## Configuration Schema

### Complete Game Config

```typescript
interface GameConfig {
  // Language Mode
  mode: 'english' | 'japanese';
  
  // English-specific
  banEndingLetter?: string | null;  // Default: null
  
  // Japanese-specific
  banEndingN: boolean;              // Default: true
  nounsOnly: boolean;               // Default: false (casual)
  lenientDakuten: boolean;          // Default: true (kid-friendly)
  
  // Learner Layer (Japanese mode only)
  learnerMode?: boolean;            // Default: false
  learnerConfig?: LearnerConfig;
  
  // Universal
  allowRepeats: boolean;            // Default: false
  minWordLength: number;            // Default: 2
}
```

### Recommended Presets

**English Casual:**
```typescript
{
  mode: 'english',
  banEndingLetter: null,
  allowRepeats: false,
  minWordLength: 2
}
```

**Japanese Traditional (Adult):**
```typescript
{
  mode: 'japanese',
  banEndingN: true,
  nounsOnly: true,
  lenientDakuten: false,
  allowRepeats: false,
  minWordLength: 2
}
```

**Japanese Kid-Friendly:**
```typescript
{
  mode: 'japanese',
  banEndingN: true,
  nounsOnly: false,
  lenientDakuten: true,
  allowRepeats: false,
  minWordLength: 2
}
```

**Japanese Learner (Beginner):**
```typescript
{
  mode: 'japanese',
  banEndingN: true,
  nounsOnly: false,
  lenientDakuten: true,
  learnerMode: true,
  learnerConfig: {
    tier: 1,
    showRomaji: true,
    showMeaning: true,
    hintsEnabled: true
  }
}
```

---

## Implementation Guidelines

### Single Engine Architecture

**ONE validation engine, NOT two separate codebases:**

```typescript
function validateWord(
  word: string,
  previousWord: string | null,
  usedWords: Set<string>,
  config: GameConfig
): ValidationResult {
  // Normalize based on mode
  const normalized = config.mode === 'english' 
    ? normalizeEnglish(word)
    : normalizeJapanese(word);
  
  // Check dictionary
  if (!isInDictionary(normalized, config)) {
    return { valid: false, reason: 'Word not in dictionary' };
  }
  
  // Check repeats (universal)
  if (!config.allowRepeats && usedWords.has(normalized)) {
    return { valid: false, reason: 'Word already used' };
  }
  
  // Check chain (mode-specific)
  if (previousWord) {
    if (!matchesChain(normalized, previousWord, config)) {
      return { valid: false, reason: 'Breaks the chain' };
    }
  }
  
  // Check losing condition (mode-specific)
  if (config.mode === 'japanese' && config.banEndingN) {
    if (endsInN(normalized)) {
      return { valid: false, reason: 'Ends in ん - you lose!', isLosingMove: true };
    }
  }
  
  return { valid: true };
}
```

### Where Tests Must Focus

**Japanese normalization is where bugs live:**

1. Katakana/Hiragana conversion
2. Long vowel (ー) handling
3. Small kana (ゃゅょっ) matching
4. Dakuten leniency edge cases

**Most test effort goes here.** See `@/Users/jarrel/Documents/Github/shiritori_game/docs/tests/test-cases.md` for comprehensive test matrix.

---

## Dictionary Requirements

### English Dictionary

**Source:** SCOWL (Spell Checker Oriented Word Lists)

**Format:**
```json
{
  "words": ["apple", "banana", "cat", "dog", ...]
}
```

**Size:** ~50,000 common words

### Japanese Dictionary

**Source:** EDICT/JMdict with enhancements

**Format:**
```json
{
  "words": [
    {
      "kana": "ねこ",
      "kanji": "猫",
      "romaji": "neko",
      "meaning": "cat",
      "type": "noun",
      "tier": 1,
      "frequency": "high"
    },
    {
      "kana": "ごりら",
      "katakana": "ゴリラ",
      "romaji": "gorira",
      "meaning": "gorilla",
      "type": "noun",
      "tier": 2,
      "frequency": "medium"
    }
  ]
}
```

**Required Fields:**
- `kana`: Hiragana representation (normalized form)
- `romaji`: For learner input
- `meaning`: English translation
- `tier`: 1-3 for learner progression
- `type`: For nouns-only filtering

**Size:** ~20,000 words across all tiers

---

## Regional & Cultural Variations

### Known House Rule Variations

**Voiced Dakuten:**
- **Tokyo standard:** Lenient (が after か is OK)
- **Kansai variation:** Sometimes strict
- **Our default:** Lenient (kid-friendly)

**Nouns Only:**
- **Traditional:** Strictly nouns
- **Modern kids:** Any word type
- **Our default:** Any word type (casual)

**Long Vowel Handling:**
- **Standard:** ー represents the previous vowel
- **Rare variant:** Treat ー as actual ending
- **Our implementation:** Standard (ー → vowel)

---

## Edge Cases Requiring Decisions

### 1. Kanji Readings

**Problem:** 猫 can be read as "ねこ" or "ひょう" (hyou)

**Decision:** Use most common reading (ねこ)

**Implementation:** Pre-process kanji to hiragana in dictionary

### 2. ゃゅょ as Last Character

**Problem:** Does きしゃ end in ゃ or や?

**Decision:** Small kana expands to full size → ends in や

**Rationale:** More words start with full や than ゃ

### 3. Multiple Dakuten Marks

**Problem:** ば (ba) has both dakuten (゛) and handakuten (゜)

**Decision:** In lenient mode, treat は/ば/ぱ as interchangeable

**Implementation:**
```typescript
function basKana(kana: string): string {
  // Strip all diacritics, return base
  return kana.replace(/[゛゜]/g, '');
}
```

---

## Testing Requirements

### Critical Test Coverage

**English Mode:** 25 test cases minimum
- Basic chain (5)
- Edge cases (10)
- Normalization (10)

**Japanese Mode:** 50 test cases minimum
- Basic chain (10)
- ん-ending (5)
- Katakana/hiragana (10)
- Long vowel (ー) (10)
- Small kana (10)
- Dakuten leniency (5)

**Learner Layer:** 15 test cases
- Romaji input (10)
- Tier gating (5)

**Total:** 90 test cases required

See `@/Users/jarrel/Documents/Github/shiritori_game/docs/tests/test-cases.md` for full test matrix.

---

## References

### Standards

- **Hepburn Romanization:** Standard for romaji conversion
- **Unicode:** Hiragana (U+3040–U+309F), Katakana (U+30A0–U+30FF)
- **JIS X 0208:** Japanese character encoding standard

### Related Documents

- `@/Users/jarrel/Documents/Github/shiritori_game/docs/design.md` - Implementation algorithms
- `@/Users/jarrel/Documents/Github/shiritori_game/docs/adr/0002-language-modes.md` - Architecture decision
- `@/Users/jarrel/Documents/Github/shiritori_game/docs/tests/test-cases.md` - Complete test suite

### External Resources

- [Shiritori (Wikipedia)](https://en.wikipedia.org/wiki/Shiritori)
- [しりとり (Japanese Wikipedia)](https://ja.wikipedia.org/wiki/しりとり)
- [Hepburn Romanization](https://en.wikipedia.org/wiki/Hepburn_romanization)

---

**Document Status:** ✅ Complete  
**Version:** 2.0  
**Last Review:** July 10, 2026  
**Next Review:** Q4 2026

**This is the crown jewel document for a bilingual shiritori game. All implementations must follow these rules exactly.**
