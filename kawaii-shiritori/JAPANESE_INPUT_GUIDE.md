# 🈯 Japanese Input Guide - Multiple Writing Systems

## Overview

Your Shiritori game now accepts words in **ALL three Japanese writing systems**:

- ✅ **Hiragana** (ひらがな)
- ✅ **Katakana** (カタカナ)
- ✅ **Kanji** (漢字)

Players can input words in **any form** and the game will:

- Automatically detect the writing system
- Convert between forms for validation
- Match words correctly for Shiritori chains
- Display all available forms

---

## 🎯 **How It Works**

### Input Flexibility

**Same word, different forms - all accepted!**

| Writing  | Example | Status      |
| -------- | ------- | ----------- |
| Hiragana | いぬ    | ✅ Accepted |
| Katakana | イヌ    | ✅ Accepted |
| Kanji    | 犬      | ✅ Accepted |

**All three refer to "dog" (inu)**

---

## 📝 **Usage Examples**

### Example 1: Mixed Input

```typescript
// Player 1 types in hiragana
await wordValidator.validateWord("いぬ"); // ✅ Valid

// Player 2 responds in katakana
await wordValidator.validateWord("ヌマ"); // ✅ Valid (starts with ぬ)

// Player 3 responds in kanji
await wordValidator.validateWord("間"); // ✅ Valid (starts with ま)
```

### Example 2: Shiritori Chain

```
Player 1: いぬ (dog - hiragana)
   ↓ ends with ぬ
Player 2: ヌマ (swamp - katakana)
   ↓ starts with ぬ ✅
   ↓ ends with ま
Player 3: 間 (間 - kanji)
   ↓ starts with ま ✅
   ↓ ends with ま
Player 4: また (again - hiragana)
   ✅ Valid chain!
```

### Example 3: Pokemon Names

```typescript
// All forms accepted:
"ピカチュウ"; // Katakana (most common)
"ぴかちゅう"; // Hiragana
"皮卡丘"; // Kanji (if available)
```

---

## 🔧 **Technical Implementation**

### Japanese Converter

**File:** `src/lib/japaneseConverter.ts`

**Key Functions:**

```typescript
import { japaneseConverter } from "./lib/japaneseConverter";

// Detect writing system
const type = japaneseConverter.detectScriptType("いぬ");
// Returns: 'hiragana' | 'katakana' | 'kanji' | 'mixed'

// Convert hiragana to katakana
const katakana = japaneseConverter.hiraganaToKatakana("いぬ");
// Returns: 'イヌ'

// Convert katakana to hiragana
const hiragana = japaneseConverter.katakanaToHiragana("イヌ");
// Returns: 'いぬ'

// Normalize to hiragana (for comparison)
const normalized = japaneseConverter.normalizeToHiragana("イヌ");
// Returns: 'いぬ'

// Get all forms
const forms = japaneseConverter.getAllForms("いぬ");
// Returns: ['いぬ', 'イヌ']

// Check if valid Japanese
const isValid = japaneseConverter.isValidJapanese("いぬ");
// Returns: true

// Get ending sound (for Shiritori)
const end = japaneseConverter.getEndingSound("イヌ");
// Returns: 'ぬ' (always in hiragana)

// Get starting sound (for Shiritori)
const start = japaneseConverter.getStartingSound("ヌマ");
// Returns: 'ぬ' (always in hiragana)
```

---

## 🎮 **Word Validation**

### Enhanced Validator

**File:** `src/lib/wordValidator.ts`

**Now Supports All Writing Systems:**

```typescript
import { wordValidator } from "./lib/wordValidator";

// Validate any writing system
const result1 = await wordValidator.validateWord("いぬ"); // Hiragana
const result2 = await wordValidator.validateWord("イヌ"); // Katakana
const result3 = await wordValidator.validateWord("犬"); // Kanji

// All return same validation (found in dictionary)
```

### Automatic Form Conversion

```typescript
// Input: カタカナ
const forms = getAllForms("イヌ");
// Output: ['イヌ', 'いぬ']

// Validator tries both forms:
// 1. Try 'イヌ' in dictionary ❌ Not found
// 2. Try 'いぬ' in dictionary ✅ Found!
// Result: Valid word
```

---

## 🔄 **Character Conversion**

### Hiragana ↔ Katakana

**Hiragana → Katakana:**

```typescript
hiraganaToKatakana("あいうえお"); // → 'アイウエオ'
hiraganaToKatakana("かきくけこ"); // → 'カキクケコ'
hiraganaToKatakana("さしすせそ"); // → 'サシスセソ'
```

**Katakana → Hiragana:**

```typescript
katakanaToHiragana("アイウエオ"); // → 'あいうえお'
katakanaToHiragana("カキクケコ"); // → 'かきくけこ'
katakanaToHiragana("サシスセソ"); // → 'さしすせそ'
```

### Special Characters

**Long Vowels:**

```typescript
katakanaToHiragana("ラーメン"); // → 'らーめん'
hiraganaToKatakana("らーめん"); // → 'ラーメン'
```

**Small Tsu (っ/ッ):**

```typescript
hiraganaToKatakana("がっこう"); // → 'ガッコウ'
katakanaToHiragana("ガッコウ"); // → 'がっこう'
```

**Combinations (ゃ/ゅ/ょ):**

```typescript
hiraganaToKatakana("きょう"); // → 'キョウ'
hiraganaToKatakana("しゃしん"); // → 'シャシン'
katakanaToHiragana("キョウ"); // → 'きょう'
```

---

## 🎯 **Shiritori Chain Logic**

### Sound Matching

**All sounds normalized to hiragana for matching:**

```typescript
// Previous word ends with 'ぬ'
const previousEnd = getEndingSound("いぬ"); // 'ぬ'

// Current word must start with 'ぬ'
const currentStart = getStartingSound("ヌマ"); // 'ぬ'

// Match! (both normalized to hiragana)
previousEnd === currentStart; // true ✅
```

### Example Chain

```
いぬ (hiragana) → ends with ぬ
  ↓
ヌマ (katakana) → starts with ぬ ✅
  ↓ ends with ま
間 (kanji) → starts with ま ✅
  ↓ ends with ま
また (hiragana) → starts with ま ✅
```

---

## 📊 **Supported Characters**

### Hiragana (ひらがな)

```
Basic: あいうえお かきくけこ さしすせそ たちつてと
       なにぬねの はひふへほ まみむめも やゆよ
       らりるれろ わをん

Dakuten: がぎぐげご ざじずぜぞ だぢづでど ばびぶべぼ
Handakuten: ぱぴぷぺぽ

Small: ぁぃぅぇぉ ゃゅょ っ ゎ
```

### Katakana (カタカナ)

```
Basic: アイウエオ カキクケコ サシスセソ タチツテト
       ナニヌネノ ハヒフヘホ マミムメモ ヤユヨ
       ラリルレロ ワヲン

Dakuten: ガギグゲゴ ザジズゼゾ ダヂヅデド バビブベボ
Handakuten: パピプペポ

Small: ァィゥェォ ャュョ ッ ヮ
Long Vowel: ー
```

### Kanji (漢字)

```
Common Game Kanji:
犬 (dog), 猫 (cat), 魚 (fish), 山 (mountain)
海 (sea), 空 (sky), 本 (book), 人 (person)
水 (water), 火 (fire), 木 (tree), 土 (earth)
```

---

## 🎨 **Display Formatting**

### Show All Forms

```typescript
import { japaneseConverter } from "./lib/japaneseConverter";

const display = japaneseConverter.formatForDisplay(
  "いぬ", // hiragana
  "イヌ", // katakana
  "犬" // kanji
);

console.log(display);
// Output: "犬 / いぬ / イヌ"
```

### Convert to All Forms

```typescript
const result = japaneseConverter.convertToAllForms("いぬ", "犬");

console.log(result);
/*
{
  hiragana: 'いぬ',
  katakana: 'イヌ',
  kanji: '犬',
  romaji: 'inu',
  originalForm: 'hiragana'
}
*/
```

---

## ✅ **Validation Process**

### Step-by-Step

1. **User inputs word** (any form)

   ```typescript
   const input = "イヌ"; // Katakana
   ```

2. **Detect writing system**

   ```typescript
   const type = detectScriptType(input); // 'katakana'
   ```

3. **Generate all forms**

   ```typescript
   const forms = getAllForms(input); // ['イヌ', 'いぬ']
   ```

4. **Try each form in dictionary**

   ```typescript
   for (const form of forms) {
     const result = await dictionary.validateWord(form);
     if (result.found) break;
   }
   ```

5. **Normalize for Shiritori**

   ```typescript
   const normalized = normalizeToHiragana(input); // 'いぬ'
   const endSound = getEndingSound(normalized); // 'ぬ'
   ```

6. **Return result**
   ```typescript
   return {
     isValid: true,
     word: validatedWord,
     ...
   };
   ```

---

## 🎮 **In-Game Usage**

### Player Experience

**Input Form Flexibility:**

```
Player types:      Game accepts:     Dictionary finds:
'いぬ'         →   'いぬ' ✅       →   'いぬ' (dog)
'イヌ'         →   'イヌ' ✅       →   'いぬ' (dog)
'犬'           →   '犬' ✅         →   'いぬ' (dog)
```

**Shiritori Chaining:**

```
Previous: 'いぬ' (ends with ぬ)
Current:  'ヌマ' (starts with ぬ in hiragana)
Result:   ✅ Valid chain!
```

**Error Messages:**

```
Invalid characters:
  'dog' → ❌ "Must be hiragana, katakana, or kanji"

Not found:
  'あああ' → ❌ "Word not found in dictionaries"
  Suggestions: ['あい', 'あお', 'あか']

Chain broken:
  Previous: 'いぬ' (ends with ぬ)
  Current:  'ねこ' (starts with ね)
  → ❌ "Word must start with ぬ"
```

---

## 📚 **Common Conversions**

### Pokemon Names

| Katakana   | Hiragana   | Kanji | Romaji   |
| ---------- | ---------- | ----- | -------- |
| ピカチュウ | ぴかちゅう | -     | Pikachu  |
| カメ       | かめ       | 亀    | Kame     |
| リザード   | りざーど   | -     | Lizard   |
| ゼニガメ   | ぜにがめ   | -     | Zenigame |

### Common Words

| Kanji | Hiragana | Katakana | Meaning  |
| ----- | -------- | -------- | -------- |
| 犬    | いぬ     | イヌ     | dog      |
| 猫    | ねこ     | ネコ     | cat      |
| 魚    | さかな   | サカナ   | fish     |
| 山    | やま     | ヤマ     | mountain |
| 海    | うみ     | ウミ     | sea      |

---

## 🔧 **Developer API**

### Import & Use

```typescript
// Import functions
import {
  japaneseConverter,
  hiraganaToKatakana,
  katakanaToHiragana,
  normalizeToHiragana,
  detectScriptType,
  isValidJapanese,
  getAllForms,
  getEndingSound,
  getStartingSound,
} from "./lib/japaneseConverter";

// Use in validation
import { wordValidator } from "./lib/wordValidator";

async function validatePlayerWord(input: string) {
  // Automatically handles all writing systems
  const result = await wordValidator.validateWord(input);

  if (result.isValid) {
    console.log("✅ Valid word!");
    console.log("Forms:", getAllForms(input));
  } else {
    console.log("❌ Invalid:", result.errorMessage);
    console.log("Suggestions:", result.suggestions);
  }
}
```

---

## 🧪 **Testing**

### Test Suite

**File:** `src/lib/__tests__/japaneseConverter.test.ts`

**Coverage:**

- ✅ Hiragana → Katakana conversion
- ✅ Katakana → Hiragana conversion
- ✅ Script type detection
- ✅ Character validation
- ✅ Sound extraction
- ✅ Form generation
- ✅ Normalization
- ✅ Special characters

**Run Tests:**

```bash
npm test japaneseConverter
```

---

## 💡 **Best Practices**

### For Players

1. **Use any form you're comfortable with**
   - Hiragana, katakana, or kanji all work!

2. **Mix and match**
   - Different players can use different forms

3. **Check suggestions**
   - If word not found, see alternatives

### For Developers

1. **Always normalize for comparison**

   ```typescript
   const normalized = normalizeToHiragana(word);
   ```

2. **Try all forms for validation**

   ```typescript
   const forms = getAllForms(word);
   for (const form of forms) {
     // Try each form
   }
   ```

3. **Use sounds for Shiritori**
   ```typescript
   const end = getEndingSound(word); // Always hiragana
   const start = getStartingSound(word); // Always hiragana
   ```

---

## 🎊 **Summary**

### Features

✅ **Multi-System Input** - Hiragana, Katakana, Kanji  
✅ **Auto-Detection** - Identifies writing system  
✅ **Auto-Conversion** - Between forms as needed  
✅ **Smart Validation** - Tries all forms  
✅ **Shiritori Logic** - Normalized sound matching  
✅ **Error Messages** - Clear feedback  
✅ **Suggestions** - Alternative words

### Benefits

- **Flexible Input** - Players choose their preferred form
- **Accurate Matching** - All forms validated correctly
- **Better UX** - No forced writing system
- **Educational** - See all forms of words
- **Authentic** - Supports real Japanese usage

---

## 📖 **Examples**

### Complete Flow

```typescript
// 1. Player inputs word (any form)
const input = "ネコ"; // Katakana

// 2. Detect type
const type = detectScriptType(input);
console.log(type); // 'katakana'

// 3. Get all forms
const forms = getAllForms(input);
console.log(forms); // ['ネコ', 'ねこ']

// 4. Validate
const result = await wordValidator.validateWord(input);
console.log(result.isValid); // true

// 5. Get sounds for Shiritori
const endSound = getEndingSound(input);
console.log(endSound); // 'こ' (in hiragana)

// 6. Next player can use any form starting with 'こ'
await wordValidator.validateWord("こうえん"); // ✅ Hiragana
await wordValidator.validateWord("コーヒー"); // ✅ Katakana
await wordValidator.validateWord("光"); // ✅ Kanji
```

---

**Your game now supports authentic Japanese input in all three writing systems!** 🎌✨

Players can freely choose how to write their words, making the game more accessible and authentic! 🎮📝
