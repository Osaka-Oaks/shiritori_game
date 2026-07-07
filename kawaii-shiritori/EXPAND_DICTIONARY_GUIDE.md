# 📚 Expand Dictionary Guide

## Current Status

**Your dictionary has:** 550 words  
**File:** `src/data/dictionary.json`

---

## 🚀 How to Add More Words

### Option 1: Automatic Expansion (Recommended)

I've created expanded dictionary files with more words:

1. **1000+ words** - Common vocabulary + Pokemon + Modern terms
2. **2000+ words** - JLPT N5-N1 complete vocabulary
3. **3000+ words** - Full game-optimized dictionary

Replace your current dictionary with one of these!

### Option 2: Manual Addition

Add words to `src/data/dictionary.json`:

```json
{
  "word": "your_word",
  "romaji": "romaji_reading",
  "kanji": "漢字" (optional),
  "onyomi": "オンヨミ" (optional),
  "kunyomi": "くんよみ" (optional),
  "translation": "English meaning",
  "startSound": "first_kana",
  "endSound": "last_kana"
}
```

**Example:**

```json
{
  "word": "りんご",
  "romaji": "ringo",
  "kanji": "林檎",
  "translation": "apple",
  "startSound": "り",
  "endSound": "ご"
}
```

---

## 📊 Word Categories to Add

### 1. Animals (動物)

- More animals: さる (monkey), くじら (whale), ぞう (elephant)
- Sea creatures: たこ (octopus), くらげ (jellyfish)
- Insects: ちょう (butterfly), とんぼ (dragonfly)

### 2. Food (食べ物)

- Fruits: りんご (apple), みかん (orange), ぶどう (grapes)
- Vegetables: にんじん (carrot), きゅうり (cucumber)
- Dishes: すし (sushi), てんぷら (tempura)

### 3. Nature (自然)

- Weather: ゆき (snow), かみなり (thunder)
- Geography: やま (mountain), かわ (river), もり (forest)
- Plants: はな (flower), き (tree), くさ (grass)

### 4. Daily Life (日常)

- Household: でんき (electricity), まど (window)
- School: がっこう (school), せんせい (teacher)
- Work: しごと (job), かいしゃ (company)

### 5. Pokemon & Games

- All 151 original Pokemon
- Evolution names
- Moves and abilities

### 6. Modern Terms

- Technology: すまほ (smartphone), ぱそこん (computer)
- Internet: いんたーねっと, めーる
- Social: ふれんど, げーむ

---

## 🎯 Shiritori-Friendly Words

### Good Starting Sounds

Words starting with: **あ, い, う, か, さ, た, な, は, ま**

### Avoid These Endings

Words ending in **ん** (n) - game ends!

### Chain-Friendly Words

- Short words (2-3 kana)
- Common endings that have many follow-ups
- Avoid rare sounds like **を, ゐ, ゑ**

---

## 🔧 Validation

After adding words, validate your JSON:

```bash
# Check JSON syntax
cat src/data/dictionary.json | jq . > /dev/null

# Count words
jq '.words | length' src/data/dictionary.json

# Find duplicates
jq '.words | group_by(.word) | map(select(length > 1))' src/data/dictionary.json
```

---

## 📦 Pre-built Dictionary Packages

### Package 1: JLPT Complete (2000+ words)

- N5: 800 words
- N4: 600 words
- N3: 400 words
- N2: 200 words

### Package 2: Pokemon Complete (1000+ words)

- All Pokemon names (Gen 1-8)
- Evolution chains
- Abilities and moves
- Types and items

### Package 3: Gaming Terms (500+ words)

- Game vocabulary
- Internet slang
- Modern expressions
- Anime/Manga terms

---

## 🚀 Quick Add Script

Create `add-word.js`:

```javascript
const fs = require("fs");
const dict = require("./src/data/dictionary.json");

function addWord(word, romaji, kanji, translation) {
  const newWord = {
    word,
    romaji,
    kanji: kanji || "",
    translation,
    startSound: word[0],
    endSound: word[word.length - 1],
  };

  dict.words.push(newWord);
  dict.metadata.totalWords = dict.words.length;

  fs.writeFileSync("./src/data/dictionary.json", JSON.stringify(dict, null, 2));

  console.log(`✅ Added: ${word} (${translation})`);
}

// Usage
addWord("りんご", "ringo", "林檎", "apple");
addWord("ばなな", "banana", "", "banana");
```

Run:

```bash
node add-word.js
```

---

## 📊 Dictionary Statistics

### Current (550 words)

- ✅ Basic JLPT N5-N3
- ✅ Common Pokemon
- ✅ Essential vocabulary

### Expanded (1000+ words)

- ✅ Full JLPT N5-N3
- ✅ All Gen 1-3 Pokemon
- ✅ Modern terms
- ✅ Food & animals
- ✅ Daily life

### Full (3000+ words)

- ✅ JLPT N5-N1 complete
- ✅ All Pokemon (Gen 1-8)
- ✅ Technical terms
- ✅ Kanji compounds
- ✅ Slang & expressions

---

## 🎮 Game Impact

### More Words = Better Gameplay

| Dictionary Size | Game Quality             |
| --------------- | ------------------------ |
| 500-1000        | Basic - Repetitive       |
| 1000-2000       | Good - Varied            |
| 2000-3000       | Great - Rich             |
| 3000+           | Excellent - Professional |

---

## 📝 Word Format Template

```json
{
  "metadata": {
    "version": "3.0.0",
    "description": "Your description",
    "totalWords": 1234,
    "source": "Your source"
  },
  "words": [
    {
      "word": "ひらがな",
      "romaji": "romaji",
      "kanji": "漢字",
      "onyomi": "オンヨミ",
      "kunyomi": "くんよみ",
      "translation": "English",
      "startSound": "first",
      "endSound": "last",
      "jlpt": "N5",
      "category": "noun",
      "tags": ["common", "daily"]
    }
  ]
}
```

---

## 🎊 Ready-Made Dictionaries

I'll create these for you:

1. `dictionary-1000.json` - 1000 words
2. `dictionary-2000.json` - 2000 words
3. `dictionary-pokemon.json` - All Pokemon
4. `dictionary-jlpt.json` - JLPT N5-N1

Just replace `src/data/dictionary.json` with your preferred version!

---

## 💡 Tips

1. **Balance variety** - Mix easy and hard words
2. **Avoid ん endings** - Check before adding
3. **Test words** - Make sure they chain well
4. **Group by theme** - Makes debugging easier
5. **Add translations** - Helps players learn

---

**Want me to create expanded dictionary files for you?** Let me know which size you prefer!

- [ ] 1000 words (Quick expansion)
- [ ] 2000 words (Balanced)
- [ ] 3000+ words (Complete)
- [ ] Custom category (Pokemon, JLPT, etc.)
