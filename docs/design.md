# Shiritori Game — Design Document

**Version:** 2.0  
**Last Updated:** July 10, 2026  
**Status:** Production

---

## Overview

Shiritori (しりとり) is a Japanese word-chain game where each player must say a word that begins with the final letter/kana of the previous word. This document defines the core game logic, rules, and design decisions across all implementations.

---

## Game Rules (Source of Truth)

### Core Mechanics

1. **Chain Rule**: Next word MUST start with the last character of the previous word
   - English: Last **letter** (apple → **e**lephant)
   - Japanese: Last **kana** (いぬ[inu] → **ぬ**ま[numa])

2. **No Repeats**: Each word can only be used once per game session
   - Track all used words in a Set/array
   - Case-insensitive comparison for English
   - Exact hiragana/katakana matching for Japanese

3. **Losing Conditions**:
   - Playing a word that ends in "n" or "ん" (Japanese rule)
   - Breaking the chain (wrong starting character)
   - Repeating a previously used word
   - Invalid word (not in dictionary)
   - Timeout (multiplayer mode)

4. **Valid Words**:
   - Must exist in the approved dictionary
   - Nouns only (traditional rule) - **DECISION: We allow all parts of speech**
   - Minimum length: 2 characters
   - No proper nouns (names, places) - **DECISION: Allowed in casual mode**

### Language Modes

#### English Mode (Letter-based)
- Match based on Latin letters (A-Z)
- Case-insensitive: "Apple" = "apple"
- Last letter: "apple" → ends with 'e'
- No "n-ending" rule enforcement

#### Japanese Mode (Kana-based)
- Match based on hiragana/katakana
- Normalize: convert katakana → hiragana for comparison
- Last kana: "いぬ" → ends with 'ぬ'
- "ん-ending" rule: Instant loss
- Long vowels (ー) count as the vowel sound

#### Bilingual Mode
- Accepts both English and Japanese words
- Per-word language detection
- Chain continues with appropriate rule set for each word

---

## Core Logic & Algorithms

### Word Validation Function

```typescript
function validateWord(
  word: string,
  previousWord: string | null,
  usedWords: Set<string>
): { valid: boolean; reason?: string } {
  
  // 1. Normalize input
  const normalized = normalizeWord(word);
  
  // 2. Check if word exists
  if (!dictionary.has(normalized)) {
    return { valid: false, reason: 'Word not in dictionary' };
  }
  
  // 3. Check for repeats
  if (usedWords.has(normalized)) {
    return { valid: false, reason: 'Word already used' };
  }
  
  // 4. Check chain (if not first word)
  if (previousWord) {
    const lastChar = getLastChar(previousWord);
    const firstChar = getFirstChar(normalized);
    
    if (lastChar !== firstChar) {
      return { 
        valid: false, 
        reason: `Must start with '${lastChar}'` 
      };
    }
  }
  
  // 5. Check losing condition (Japanese)
  if (endsInN(normalized)) {
    return { 
      valid: false, 
      reason: 'Word ends in ん - you lose!' 
    };
  }
  
  return { valid: true };
}
```

### Normalization Rules

**English:**
```typescript
function normalizeEnglish(word: string): string {
  return word.toLowerCase().trim();
}
```

**Japanese:**
```typescript
function normalizeJapanese(word: string): string {
  // Convert katakana to hiragana for consistent matching
  return convertKatakanaToHiragana(word.trim());
}
```

### Character Extraction

**Get Last Character:**
```typescript
function getLastChar(word: string): string {
  if (word.length === 0) return '';
  
  // Handle long vowel mark in Japanese
  if (word.endsWith('ー')) {
    // Get the vowel sound before the long mark
    return getVowelSound(word[word.length - 2]);
  }
  
  return word[word.length - 1];
}
```

---

## Edge Cases & Special Handling

### Critical Edge Cases

| # | Case | Input | Previous | Expected | Why |
|---|------|-------|----------|----------|-----|
| 1 | Empty input | "" | "apple" | Invalid | Required field |
| 2 | Whitespace only | "   " | "apple" | Invalid | Not a word |
| 3 | Case sensitivity | "Apple" | "egg" | Valid | Normalize to lowercase |
| 4 | Repeated word | "apple" | ... → "apple" | Invalid | Already used |
| 5 | Wrong start | "dog" | "apple" | Invalid | Doesn't start with 'e' |
| 6 | Ends in N | "sun" | "bus" | Invalid | Losing move |
| 7 | Japanese ん | "らいおん" | "にわとり" | Invalid | Ends in ん |
| 8 | Long vowel | "ラーメン" | "ねこ" | Invalid | Ends in ん (after ー) |
| 9 | Katakana/Hiragana mix | "ネコ" | "こい" | Valid | Normalize to hiragana |
| 10 | First word | "hello" | null | Valid | Any word allowed |
| 11 | Single character | "i" | "hi" | Invalid | Min 2 chars |
| 12 | Numbers | "3cats" | "sun" | Invalid | Not in dictionary |
| 13 | Special chars | "cat's" | "bus" | Invalid | Remove punctuation first |

### Language Detection

```typescript
function detectLanguage(word: string): 'english' | 'japanese' {
  // Check for Japanese characters (hiragana, katakana, kanji)
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  return japaneseRegex.test(word) ? 'japanese' : 'english';
}
```

---

## Data Structures

### Game State

```typescript
interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  wordChain: string[];         // Full history
  usedWords: Set<string>;      // For duplicate checking
  lastWord: string | null;
  status: 'waiting' | 'playing' | 'finished';
  winner?: string;
  loser?: string;
  mode: 'english' | 'japanese' | 'bilingual';
}
```

### Word Bank Structure

```typescript
// Efficient O(1) lookup
const dictionary = new Set<string>([
  'apple', 'elephant', 'tiger', 'rabbit',
  'いぬ', 'ぬま', 'まち', 'ちず'
]);

// With metadata (for advanced features)
const dictionaryWithMeta = new Map<string, WordInfo>([
  ['apple', { type: 'noun', difficulty: 'easy', meaning: '...' }],
  ['いぬ', { type: 'noun', difficulty: 'easy', meaning: 'dog' }],
]);
```

---

## Multiplayer Considerations

### Turn Management

1. **Turn Timer**: 30 seconds default, configurable
2. **Timeout Penalty**: Auto-loss if time expires
3. **Reconnection**: 60 second grace period
4. **Turn Order**: Round-robin, tracked by index

### Synchronization

- **Firebase Realtime Database** for real-time state
- **Optimistic Updates**: Show immediately, rollback on error
- **Conflict Resolution**: Server timestamp wins

---

## AI Opponent Logic

### Difficulty Levels

**Easy:**
- Random valid word from dictionary
- No strategy

**Medium:**
- Prefer common words
- Avoid words ending in difficult letters (q, x, z)
- Simple word frequency scoring

**Hard:**
- Maximize difficulty for opponent
- Choose words ending in rare letters
- Track player's vocabulary patterns
- Force toward ん-ending words (Japanese)

```typescript
function selectAIWord(
  lastWord: string,
  usedWords: Set<string>,
  difficulty: 'easy' | 'medium' | 'hard'
): string {
  const validWords = findValidWords(lastWord, usedWords);
  
  switch (difficulty) {
    case 'easy':
      return randomChoice(validWords);
    
    case 'medium':
      return validWords
        .sort((a, b) => getFrequency(b) - getFrequency(a))[0];
    
    case 'hard':
      return validWords
        .sort((a, b) => getDifficulty(b) - getDifficulty(a))[0];
  }
}
```

---

## Performance Optimizations

### Dictionary Loading

- **Lazy Load**: Load dictionary on demand
- **Indexing**: Pre-index by first character for O(1) lookup
- **Caching**: Cache dictionary in localStorage/memory
- **Compression**: Use compressed word list format

```typescript
// Indexed dictionary for fast lookup
const dictionaryByFirstChar = new Map<string, Set<string>>();

// Build index once
for (const word of words) {
  const firstChar = word[0];
  if (!dictionaryByFirstChar.has(firstChar)) {
    dictionaryByFirstChar.set(firstChar, new Set());
  }
  dictionaryByFirstChar.get(firstChar)!.add(word);
}

// Fast lookup: only search subset
function findValidWords(lastChar: string, usedWords: Set<string>): string[] {
  const candidates = dictionaryByFirstChar.get(lastChar) || new Set();
  return Array.from(candidates).filter(w => !usedWords.has(w));
}
```

---

## Future Enhancements

### Planned Features

1. **Power-ups** (casual mode):
   - Skip turn
   - Steal turn
   - Reverse chain
   - Time freeze

2. **Game Modes**:
   - Speed mode (10 sec turns)
   - Marathon (longest chain wins)
   - Theme mode (category restrictions)
   - Team play

3. **Advanced AI**:
   - ML-based difficulty adaptation
   - Personality traits
   - Named characters

4. **Social Features**:
   - Friend challenges
   - Tournaments
   - Global leaderboards
   - Replays

---

## References

### External Resources

- [Shiritori Rules (Japanese)](https://ja.wikipedia.org/wiki/しりとり)
- [EDICT Japanese Dictionary](http://www.edrdg.org/jmdict/j_jmdict.html)
- Word Frequency Lists: See `docs/references/`

### Related Documents

- See `@/Users/jarrel/Documents/Github/shiritori_game/docs/adr/` for architectural decisions
- See `@/Users/jarrel/Documents/Github/shiritori_game/docs/tests/test-cases.md` for comprehensive test scenarios
- See implementation-specific docs in each project folder

---

**Document Status:** ✅ Current  
**Reviewed:** July 10, 2026  
**Next Review:** Q4 2026
