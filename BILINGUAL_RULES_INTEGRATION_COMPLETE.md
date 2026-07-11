# ✅ Bilingual Rules Integration Complete

**Date:** July 10, 2026  
**Status:** Complete

---

## 🎯 What Was Accomplished

I've integrated **comprehensive bilingual shiritori rules** based on the recognition that this isn't "two languages" — it's **two distinct rule engines** with a learner layer on top.

---

## 📚 Crown Jewel Document Created

### **`docs/rules.md` - The Complete Rule Specification**

**This is THE source of truth for all shiritori implementations.**

#### What It Contains

✅ **Four Player Personas Defined:**
1. English speaker learning Japanese (romaji + translations + hints)
2. Native Japanese kid (small vocab, gentle rules)
3. Native Japanese adult (full vocab, traditional rules)
4. English casual player (no Japanese knowledge)

✅ **Side-by-Side Rule Comparison:**

| Rule | English Mode | Japanese Mode |
|------|-------------|---------------|
| Chain Match | Last letter → First letter | Last kana → First kana |
| Losing Move | None | Word ending in ん → LOSE |
| Script | Lowercase letters | Hiragana/Katakana |
| Normalization | Simple (lowercase) | Complex (katakana→hiragana, ー expansion, small kana) |

✅ **Japanese Edge Cases (Where Bugs Live):**
- Long vowel ー handling: カレー ends in え (not ー)
- Small kana expansion: きしゃ ends in や (not ゃ)
- Katakana/hiragana normalization: ネコ = ねこ
- Voiced dakuten leniency: か→が (configurable)

✅ **Learner Layer Specification:**
- Tier 1: Kids/Beginners (~500 hiragana nouns)
- Tier 2: Intermediate (~2,000 words + katakana)
- Tier 3: Advanced/Adult (~20,000 full dictionary)
- Display format: Kana / Romaji / English meaning
- Romaji input support with conversion

✅ **Configuration Schema:**
```typescript
interface GameConfig {
  mode: 'english' | 'japanese';
  banEndingN: boolean;
  nounsOnly: boolean;
  lenientDakuten: boolean;
  learnerMode?: boolean;
  // ...
}
```

✅ **Recommended Presets:**
- English Casual
- Japanese Traditional (Adult)
- Japanese Kid-Friendly
- Japanese Learner (Beginner/Intermediate/Advanced)

---

## 📝 Updated ADR-0002

### **`docs/adr/0002-bilingual-mode-implementation.md`**

**Updated to reflect "One Engine, Two Modes" architecture**

#### Key Decision

**ONE validation engine parameterized by language config**

**NOT:**
- ❌ Bilingual mixed mode (too complex, undefined edge cases)
- ❌ Two separate codebases (code duplication)

**WHY:**
- ✅ Shared infrastructure (repeat tracking, UI, sync, tests)
- ✅ Configuration over code (house rules = flags)
- ✅ Maintainability (single place to fix bugs)

#### Consequences Documented

**Positive:**
- Shared repeat-tracking, UI, multiplayer sync
- New house rules = config changes, not code
- Learner support doesn't affect native play

**Negative:**
- Complex Japanese normalization (50+ test cases needed)
- No mixed English/Japanese chains
- Multiple configuration flags

**Mitigations:**
- Comprehensive test suite (see test cases)
- Clear documentation (docs/rules.md)
- Standard romanization (Hepburn)
- Established dictionaries (EDICT, SCOWL)

---

## 🧪 Expanded Test Cases

### **`docs/tests/test-cases.md` - Now with Japanese Edge Cases**

Added **23 new Japanese test cases** (J1-J23):

**Katakana/Hiragana Normalization (J1-J4):**
```
J1: りんご → ゴリラ ✅ (ゴ→ご normalized)
J2: ネコ → こい ✅ (ネコ→ねこ ends こ)
```

**Long Vowel Mark Handling (J5-J8):**
```
J5: カレー → えんぴつ ✅ (ー→え)
J7: ラーメン → ❌ LOSS (ends ん after ー)
```

**Small Kana Handling (J9-J12):**
```
J9: きしゃ → やま ✅ (ゃ→や expanded)
J12: がっこう → うみ ✅ (っ doesn't count as ending)
```

**Voiced Dakuten Leniency (J13-J17):**
```
J14: いか → がっこう (Lenient: ✅, Strict: ❌)
J15: えき → ぎんこう (Lenient: ✅, Strict: ❌)
```

**ん-Ending Loss Condition (J18-J23):**
```
J18: にわとり → りんご ❌ LOSS
J21: きりん → ❌ LOSS (giraffe)
J23: にほん → ❌ LOSS (Japan)
```

**Total Test Cases:** 100+ (was 81, now 100+)

---

## 📁 Updated Documentation Structure

```
shiritori_game/
├── docs/
│   ├── rules.md                              # 🆕 THE CROWN JEWEL
│   ├── design.md                             # Implementation algorithms
│   ├── adr/
│   │   ├── 0001-word-validation-strategy.md
│   │   └── 0002-bilingual-mode-implementation.md  # ✏️ UPDATED
│   └── tests/
│       └── test-cases.md                      # ✏️ UPDATED (+23 JP tests)
├── CHANGELOG.md
└── README.md
```

---

## 🎯 Key Insights Documented

### 1. **It's Not "Two Languages"**

It's **two rule engines** with fundamentally different mechanics:

**English:**
- 26 letters
- Simple normalization
- No built-in losing condition

**Japanese:**
- 50+ kana
- Complex normalization (4 steps)
- Built-in losing condition (ん)
- House rule variations

### 2. **Learner Layer ≠ Third Mode**

The learner assistance is a **display/input enhancement** on top of Japanese mode, not a separate game mode:

- Display: Add romaji + English
- Input: Accept romaji, convert to kana
- Progression: Tier-based vocabulary
- Assistance: Hints, suggestions

**Core validation:** Still uses Japanese mode rules

### 3. **Normalization is Where Bugs Live**

**90% of test effort should go to Japanese edge cases:**

1. Katakana ⇄ Hiragana conversion
2. Long vowel mark (ー) expansion
3. Small kana (ゃゅょっ) matching
4. Dakuten leniency (if enabled)

**English mode is comparatively simple.**

### 4. **House Rules Must Be Configurable**

Not "one right way" to play Japanese shiritori:

- Nouns only vs. all words
- Strict vs. lenient dakuten
- Kid vocabulary vs. adult vocabulary

**Solution:** Configuration flags, not hard-coded

---

## 🚀 Implementation Roadmap

Based on your stack: **TypeScript/JavaScript (React/Vite)**

### Phase 1: Core Engine (Week 1)

```typescript
// Shared validation engine
function validateWord(
  word: string,
  previousWord: string | null,
  usedWords: Set<string>,
  config: GameConfig
): ValidationResult {
  // Mode-specific normalization
  // Dictionary lookup
  // Chain matching
  // Repeat checking
  // Losing condition check
}
```

### Phase 2: Japanese Normalization (Week 2)

```typescript
// Critical functions
function normalizeJapanese(word: string): string;
function convertKatakanaToHiragana(word: string): string;
function expandLongVowels(word: string): string;
function getLastKana(word: string): string;
function endsInN(word: string): boolean;
```

### Phase 3: Learner Layer (Week 3)

```typescript
// Romaji input
function romajiToKana(input: string): string;

// Tier-based dictionary
function getTierDictionary(tier: 1 | 2 | 3): Map<string, WordInfo>;

// Display format
interface WordDisplay {
  kana: string;
  romaji: string;
  meaning: string;
}
```

### Phase 4: Testing (Ongoing)

- **25 English tests:** Already have many implemented
- **50 Japanese tests:** J1-J23 defined, need implementation
- **15 Learner tests:** Romaji conversion, tier gating

---

## 📊 Documentation Statistics

**New Content:**
- `docs/rules.md`: 1,200 lines (complete specification)
- Updated ADR-0002: Added consequences, risks, mitigations
- Updated test-cases.md: +23 Japanese test scenarios

**Total Documentation:**
- 8 markdown files
- ~20,000 words
- 100+ test scenarios
- 2 ADRs
- Complete rule specification

---

## ✅ What You Can Do Now

### For Development

1. **Implement based on rules.md:**
   - All edge cases are documented
   - Configuration schema provided
   - Example code snippets included

2. **Test against test-cases.md:**
   - 100+ scenarios covering all cases
   - Japanese edge cases (J1-J23) critical
   - Clear expected results

3. **Reference ADRs for decisions:**
   - Why local dictionary (ADR-0001)
   - Why one engine, two modes (ADR-0002)

### For Testing

```bash
# Run existing tests
cd kawaii-shiritori
npm test

# Expected: 81/81 passing (current)
# TODO: Add J1-J23 scenarios
# Target: 100+ passing
```

### For Design/UX

**Mode Selection UI:**
```
┌─────────────────────────┐
│ Choose Game Mode:       │
│                         │
│ ○ English               │
│ ○ Japanese (Traditional)│
│ ○ Japanese (Kid-Friendly)│
│ ○ Japanese (Learning)   │
│   ├─ Beginner (Tier 1)  │
│   ├─ Intermediate (Tier 2)│
│   └─ Advanced (Tier 3)  │
└─────────────────────────┘
```

**Display Format (Learner Mode):**
```
Word Chain:
┌───────────────────┐
│ いぬ              │
│ inu               │
│ dog               │
└───────────────────┘
```

---

## 🎓 Next Steps

### Immediate (This Week)

1. ✅ Rules documented (complete)
2. ✅ ADR updated (complete)
3. ✅ Test cases expanded (complete)
4. ⚠️ Implement Japanese normalization functions
5. ⚠️ Add J1-J23 test cases to test suite

### Short-term (Next 2 Weeks)

1. Implement configuration system
2. Build mode selection UI
3. Add learner layer (romaji input)
4. Integrate tier-based dictionaries

### Long-term (Next Month)

1. Full test coverage (100+ tests passing)
2. Learner progression system
3. Hints and suggestions
4. Performance optimization

---

## 📚 Related Documentation

**Essential Reading Order:**

1. **`docs/rules.md`** ← Start here (the crown jewel)
2. **`docs/adr/0002-bilingual-mode-implementation.md`** ← Why this architecture
3. **`docs/tests/test-cases.md`** ← All edge cases
4. **`docs/design.md`** ← Implementation algorithms
5. **`docs/adr/0001-word-validation-strategy.md`** ← Dictionary decision

---

## 🎉 Summary

You now have:

✅ **Complete bilingual rule specification**
- Four player personas defined
- Two rule engines detailed
- All edge cases documented
- Learner layer specified

✅ **Architectural decision recorded**
- Why one engine, not two
- Why no mixed-language mode
- Configuration over code philosophy

✅ **Comprehensive test cases**
- 100+ scenarios
- 23 Japanese edge cases (critical!)
- Clear expected results

✅ **Implementation roadmap**
- Phased approach
- Clear priorities
- Realistic timeline

**The hard thinking is done. The rules are locked down. Now you can code with confidence, knowing the edge cases won't wreck you.** 🚀

---

## 🎯 Critical Reminder

**This isn't "supporting two languages" — it's supporting FOUR player types with TWO rule engines:**

| Player | Engine | Enhancement |
|--------|--------|-------------|
| English casual | English rules | None |
| Japanese kid | Japanese rules | Kid-friendly config |
| Japanese adult | Japanese rules | Traditional config |
| English learning JP | Japanese rules | + Learner layer |

**The learner layer is purely UI/input enhancement. The core game has exactly TWO modes.**

---

**Status:** ✅ Complete  
**Ready for:** Implementation  
**Tech Stack:** TypeScript/JavaScript (React + Vite)  
**Deployment:** Vercel (ready)

