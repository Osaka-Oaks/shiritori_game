# ADR 0002: One Engine, Two Language Modes

**Date:** July 10, 2026  
**Status:** ✅ Accepted  
**Deciders:** Development Team  
**Supersedes:** Initial bilingual mixing approach

---

## Context

The game must serve **four distinct player personas:**
1. English speakers learning Japanese (need romaji + translations + hints)
2. Native Japanese kids (small vocabulary, gentle rules)
3. Native Japanese adults (full vocabulary, traditional rules)
4. English casual players (no Japanese knowledge needed)

### The Core Realization

**This isn't "two languages" — it's two completely different rule engines** with fundamentally different matching logic:

**English Mode:**
- Match on **letters** (26 characters)
- Simple normalization (lowercase)
- No losing condition (typically)

**Japanese Mode (しりとり):**
- Match on **kana** (50+ characters)
- Complex normalization (katakana→hiragana, ー expansion, small kana handling)
- Built-in losing condition (ん-ending)
- Traditional constraints (nouns only)
- House rule variations (dakuten leniency)

### The Problem

**Initial Approach (Rejected):** Bilingual mode that mixes English and Japanese words in same chain
- ❌ Undefined behavior for cross-language transitions
- ❌ Which rules apply when?
- ❌ Romanization mismatches
- ❌ Unfair advantage/disadvantage based on language knowledge

**Alternative (Rejected):** Two separate codebases
- ❌ Code duplication
- ❌ Harder to maintain
- ❌ Can't reuse UI, sync logic, test harness

---

## Decision

**Build ONE validation engine parameterized by language mode configuration.**

### Architecture

```typescript
interface GameConfig {
  mode: 'english' | 'japanese';
  
  // English-specific
  banEndingLetter?: string | null;
  
  // Japanese-specific  
  banEndingN: boolean;
  nounsOnly: boolean;
  lenientDakuten: boolean;
  
  // Learner layer (Japanese only)
  learnerMode?: boolean;
  learnerConfig?: LearnerConfig;
  
  // Universal
  allowRepeats: boolean;
  minWordLength: number;
}
```

### Supported Modes

**Mode 1: English Only**
- Match unit: Letters
- Normalization: Simple (lowercase, trim)
- Losing condition: None (or optional "n" ban)
- Target: English casual players

**Mode 2: Japanese Only**  
- Match unit: Kana
- Normalization: Complex (katakana→hiragana, ー, small kana)
- Losing condition: ん-ending
- Variants: Kid-friendly, Traditional adult, Learner
- Target: Native speakers + learners

**Mode 3 (Explicitly NOT Supported): Bilingual Mixed**
- ❌ Too complex, undefined edge cases
- ❌ No fair way to transition between languages
- ❌ Players can't reasonably strategize
- Decision: Players choose ONE mode per game

### Learner Layer

**Additional layer on TOP of Japanese mode only:**
- Display: Kana + Romaji + English meaning
- Input: Accept romaji, convert to kana
- Progression: Tier-based vocabulary (1: Kids, 2: Intermediate, 3: Advanced)
- Assistance: Hints, next-word suggestions

**Key:** This is a **display/input enhancement**, not a third game mode

---

## Consequences

### Positive

✅ **Shared Infrastructure**
- Single repeat-tracking system
- One UI codebase for both modes
- Shared multiplayer sync logic
- Common test harness

✅ **Configuration Over Code**
- New house rules become config flags, not code changes
- Easy to add variants (kid mode, tournament mode)
- Mode selection at game creation, no mid-game switching

✅ **Learner Support**
- Japanese mode can have learner enhancements without affecting native play
- Tier progression system natural fit
- Romaji input doesn't pollute core validation

✅ **Maintainability**
- Single place to fix bugs
- Unified documentation
- Easier to add new features

### Negative

❌ **Complex Japanese Normalization**
- Most test effort goes into Japanese edge cases
- Katakana/hiragana/ー/small kana handling is complex
- Must test all combinations thoroughly

❌ **No Mixed Language Play**
- Can't do "English→Japanese" chains
- Some players may want this (but complexity outweighs benefit)
- Future enhancement if demand exists

❌ **Configuration Complexity**
- Many flags for Japanese house rules
- Need clear presets to avoid overwhelming users
- Documentation critical (hence `docs/rules.md`)

### Risks & Mitigations

**Risk:** Japanese normalization bugs
- **Mitigation:** 50+ dedicated test cases (see `docs/tests/test-cases.md`)
- **Mitigation:** Reference implementation from JMdict standard

**Risk:** Romaji→Kana conversion ambiguities
- **Mitigation:** Use standard Hepburn romanization
- **Mitigation:** Document edge cases (shi vs si, chi vs ti)
- **Mitigation:** Tier 1 restricts to unambiguous hiragana

**Risk:** Dictionary quality/completeness
- **Mitigation:** Use established sources (EDICT for JP, SCOWL for EN)
- **Mitigation:** User feedback system for missing words
- **Mitigation:** Regular dictionary updates
4. **Accessibility**: English-only mode for non-Japanese speakers

### Bilingual Mode Details

**Chain Matching Logic:**
```typescript
function isValidChain(prevWord: string, nextWord: string): boolean {
  const prevLang = detectLanguage(prevWord);
  const nextLang = detectLanguage(nextWord);
  
  // Get last character based on previous word's language
  const lastChar = prevLang === 'japanese' 
    ? getLastKana(prevWord)
    : getLastLetter(prevWord).toLowerCase();
  
  // Get first character based on next word's language
  const firstChar = nextLang === 'japanese'
    ? getFirstKana(nextWord)
    : getFirstLetter(nextWord).toLowerCase();
  
  // For cross-language transitions, use romanization
  if (prevLang !== nextLang) {
    const lastRomaji = toRomaji(lastChar);
    const firstRomaji = toRomaji(firstChar);
    return lastRomaji[0] === firstRomaji[0];
  }
  
  return lastChar === firstChar;
}
```

**Example Bilingual Chains:**
- ✅ "apple" → "elephant" (English → English)
- ✅ "いぬ" → "ぬま" (Japanese → Japanese)
- ✅ "ねこ" → "cat" (ね[ne] → c, via romanization)
- ✅ "dog" → "ごはん" (d → ご[go], close enough)
- ❌ "らいおん" (ends in ん - lose even in bilingual)

---

## Consequences

### Positive

- ✅ **Flexible**: Accommodates different player skill levels
- ✅ **Educational**: Players learn words in both languages
- ✅ **Inclusive**: Accessible to monolingual players
- ✅ **Authentic**: Preserves traditional Japanese rules when needed

### Negative

- ❌ **Complexity**: Three code paths to maintain
- ❌ **Romanization Edge Cases**: "shi" vs "si", "chi" vs "ti"
- ❌ **Balance Issues**: Bilingual mode harder for Japanese-only speakers

### Trade-offs

- **Simple Mode Selection**: Players choose mode upfront
- **No Mid-Game Switching**: Prevents rule confusion
- **UI Clarity**: Mode clearly displayed during gameplay

---

## Implementation

### Language Detection

```typescript
function detectLanguage(word: string): 'english' | 'japanese' {
  // Check for any Japanese characters
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  return japaneseRegex.test(word) ? 'japanese' : 'english';
}
```

### Mode Configuration

```typescript
interface GameConfig {
  mode: 'english' | 'japanese' | 'bilingual';
  enforceNRule: boolean;  // Auto-set based on mode
  dictionaryLanguages: ('en' | 'ja')[];
}

const modeConfigs = {
  english: {
    mode: 'english',
    enforceNRule: false,
    dictionaryLanguages: ['en']
  },
  japanese: {
    mode: 'japanese',
    enforceNRule: true,
    dictionaryLanguages: ['ja']
  },
  bilingual: {
    mode: 'bilingual',
    enforceNRule: true,  // Apply for Japanese words
    dictionaryLanguages: ['en', 'ja']
  }
};
```

### UI Indicators

```typescript
// Show current mode prominently
<div className="game-mode-badge">
  {mode === 'bilingual' ? '🌐 EN/JP' : 
   mode === 'japanese' ? '🇯🇵 日本語' : 
   '🇺🇸 English'}
</div>

// Warn about ん rule in Japanese/bilingual modes
{(mode === 'japanese' || mode === 'bilingual') && (
  <div className="rule-warning">
    ⚠️ Words ending in ん cause instant loss!
  </div>
)}
```

---

## Edge Cases

### Romanization Ambiguities

| Japanese | Romaji Option 1 | Romaji Option 2 | Decision |
|----------|----------------|----------------|----------|
| し | shi | si | Use "shi" |
| ち | chi | ti | Use "chi" |
| つ | tsu | tu | Use "tsu" |
| ふ | fu | hu | Use "fu" |

**Why:** Standard Hepburn romanization is most recognized

### Cross-Language Examples

```typescript
// Test cases for bilingual transitions
const testCases = [
  { prev: 'ねこ', next: 'cat', valid: true },      // ko → c (close)
  { prev: 'dog', next: 'ごはん', valid: true },    // g → go
  { prev: 'さくら', next: 'rabbit', valid: true }, // ra → r
  { prev: 'table', next: 'えび', valid: true },   // e → e
];
```

---

## Related Decisions

- See ADR-0001: Word Validation Strategy (dictionary sources)
- See ADR-0003: Japanese Kana Normalization
- See `@/Users/jarrel/Documents/Github/shiritori_game/docs/design.md`: Language modes section

---

## References

- Implementation: `kawaii-shiritori/src/lib/japaneseConverter.ts`
- Romanization: Hepburn standard
- Testing: `kawaii-shiritori/src/lib/__tests__/japaneseConverter.test.ts`

---

**Status:** ✅ Implemented  
**Files:** `kawaii-shiritori/src/lib/wordValidator.ts`  
**Review Date:** Q4 2026
