# ADR 0001: Word Validation Strategy

**Date:** July 10, 2026  
**Status:** ✅ Accepted  
**Deciders:** Development Team

---

## Context

The core of Shiritori is validating whether a word:
1. Exists in a valid dictionary
2. Follows the shiritori chain rule
3. Hasn't been used before

We need to decide on the word validation source and strategy that balances:
- **Performance** - Fast lookups during gameplay
- **Accuracy** - Comprehensive word coverage
- **Offline capability** - Works without internet
- **Maintainability** - Easy to update word lists

### Options Considered

#### Option 1: Bundled Local Dictionary File
- Pre-package dictionary.txt/json with the app
- Load into memory on startup
- O(1) lookup with Set/Map

**Pros:**
- ✅ Works offline
- ✅ Fast (in-memory)
- ✅ No API rate limits
- ✅ Predictable behavior

**Cons:**
- ❌ Increases bundle size
- ❌ Must ship updates for new words
- ❌ Limited to pre-packaged vocabulary

#### Option 2: Online Dictionary API
- Call external API for each word validation
- Examples: Merriam-Webster, JMDict, Wiktionary

**Pros:**
- ✅ Always up-to-date
- ✅ Comprehensive vocabulary
- ✅ Small bundle size

**Cons:**
- ❌ Requires internet connection
- ❌ API latency (~100-500ms)
- ❌ Rate limits / costs
- ❌ Dependency on external service

#### Option 3: Hybrid Approach
- Local dictionary for common words
- API fallback for rare words
- Cache API results

**Pros:**
- ✅ Best of both worlds
- ✅ Fast for common cases
- ✅ Comprehensive for edge cases

**Cons:**
- ❌ Complex implementation
- ❌ Still needs internet for full coverage
- ❌ Cache management overhead

---

## Decision

**We chose Option 1: Bundled Local Dictionary File**

### Rationale

1. **Core Requirement**: The game must work offline
   - Shiritori is often played in situations without reliable internet
   - Real-time gameplay cannot tolerate API latency

2. **Performance**: Sub-millisecond validation is critical
   - Multiplayer has 30-second turn timers
   - Any delay affects UX
   - In-memory Set lookup is O(1)

3. **Predictability**: Fixed vocabulary ensures fair play
   - All players have same word list
   - No "dictionary disagreements"
   - Consistent competitive environment

4. **Implementation**: Simple and reliable
   - No external dependencies
   - No API error handling needed
   - Easy to test

### Dictionary Sources

**English:**
- Based on SCOWL (Spell Checker Oriented Word Lists)
- ~50,000 common words
- Filtered for appropriate content
- Stored in: `assets/dictionaries/english.json`

**Japanese:**
- Based on EDICT/JMdict
- ~20,000 common words (hiragana/katakana)
- Nouns, verbs, adjectives included
- Stored in: `assets/dictionaries/japanese.json`

### Bundle Size Impact

- English dictionary: ~500 KB uncompressed, ~100 KB gzipped
- Japanese dictionary: ~300 KB uncompressed, ~60 KB gzipped
- **Total:** ~160 KB gzipped (acceptable for web)

---

## Consequences

### Positive

- ✅ **Fast**: Instant word validation
- ✅ **Reliable**: No network dependencies
- ✅ **Fair**: Everyone uses same dictionary
- ✅ **Simple**: Straightforward implementation
- ✅ **Testable**: Easy to unit test

### Negative

- ❌ **Limited Vocabulary**: Can't validate very rare/new words
- ❌ **Update Process**: Requires app update for new words
- ❌ **Bundle Size**: Adds ~160 KB to download

### Mitigation Strategies

1. **Regular Updates**: Update dictionary quarterly
2. **User Feedback**: Allow reporting of missing words
3. **Progressive Enhancement**: Consider API fallback in future v2.0
4. **Compression**: Use gzip compression for dictionaries

---

## Implementation Notes

### Data Structure

```typescript
// Efficient Set-based lookup
const englishDictionary = new Set<string>(wordList);

// With metadata for advanced features
interface WordInfo {
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: number;  // For AI difficulty
}

const enhancedDictionary = new Map<string, WordInfo>();
```

### Loading Strategy

```typescript
// Lazy load on game start
async function loadDictionary(language: 'en' | 'ja'): Promise<Set<string>> {
  const cached = localStorage.getItem(`dict_${language}`);
  if (cached) {
    return new Set(JSON.parse(cached));
  }
  
  const response = await fetch(`/assets/dictionaries/${language}.json`);
  const words = await response.json();
  localStorage.setItem(`dict_${language}`, JSON.stringify(words));
  return new Set(words);
}
```

### Validation Function

```typescript
function isValidWord(word: string, language: 'en' | 'ja'): boolean {
  const normalized = language === 'en' 
    ? word.toLowerCase() 
    : convertToHiragana(word);
  
  const dictionary = getDictionary(language);
  return dictionary.has(normalized);
}
```

---

## Related Decisions

- See ADR-0002: Japanese Kana Normalization Strategy
- See ADR-0003: Multiplayer Synchronization Architecture
- See `@/Users/jarrel/Documents/Github/shiritori_game/docs/design.md` for full validation logic

---

## References

- SCOWL Word Lists: http://wordlist.aspell.net/
- EDICT Japanese Dictionary: http://www.edrdg.org/jmdict/
- Dictionary Files: `kawaii-shiritori/src/lib/multiDictionary.ts`
- Implementation: `kawaii-shiritori/src/lib/wordValidator.ts`

---

**Status:** ✅ Implemented and tested  
**Review Date:** Q4 2026
