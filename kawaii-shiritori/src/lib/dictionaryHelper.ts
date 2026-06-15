import dictionaryData from '../data/dictionary.json';

export interface DictionaryWord {
  word: string;
  romaji: string;
  kanji: string;
  translation: string;
  startSound: string;
  endSound: string;
}

export interface DictionaryIndex {
  [key: string]: DictionaryWord[];
}

class DictionaryHelper {
  private words: DictionaryWord[];
  private byStartSound: DictionaryIndex;
  private byEndSound: DictionaryIndex;
  private byHiragana: Map<string, DictionaryWord>;
  private byRomaji: Map<string, DictionaryWord>;
  private byKanji: Map<string, DictionaryWord>;

  constructor() {
    this.words = dictionaryData.words as DictionaryWord[];
    this.byStartSound = {};
    this.byEndSound = {};
    this.byHiragana = new Map();
    this.byRomaji = new Map();
    this.byKanji = new Map();
    
    this.buildIndexes();
  }

  private buildIndexes(): void {
    this.words.forEach(word => {
      if (!this.byStartSound[word.startSound]) {
        this.byStartSound[word.startSound] = [];
      }
      this.byStartSound[word.startSound].push(word);

      if (!this.byEndSound[word.endSound]) {
        this.byEndSound[word.endSound] = [];
      }
      this.byEndSound[word.endSound].push(word);

      this.byHiragana.set(word.word, word);
      this.byRomaji.set(word.romaji.toLowerCase(), word);
      
      if (word.kanji) {
        this.byKanji.set(word.kanji, word);
      }
    });
  }

  findWord(input: string): DictionaryWord | null {
    const normalized = input.trim().toLowerCase();
    
    if (this.byHiragana.has(input.trim())) {
      return this.byHiragana.get(input.trim()) || null;
    }
    
    if (this.byRomaji.has(normalized)) {
      return this.byRomaji.get(normalized) || null;
    }
    
    if (this.byKanji.has(input.trim())) {
      return this.byKanji.get(input.trim()) || null;
    }
    
    return null;
  }

  isValidWord(input: string): boolean {
    return this.findWord(input) !== null;
  }

  getWordsByStartSound(sound: string): DictionaryWord[] {
    return this.byStartSound[sound] || [];
  }

  getWordsByEndSound(sound: string): DictionaryWord[] {
    return this.byEndSound[sound] || [];
  }

  endsInN(word: string): boolean {
    return word.endsWith('ん') || word.endsWith('ン') || word.toLowerCase().endsWith('n');
  }

  getRandomWordStartingWith(sound: string, excludeWords: string[] = []): DictionaryWord | null {
    const candidates = this.getWordsByStartSound(sound).filter(w => 
      !this.endsInN(w.word) && 
      !excludeWords.includes(w.word) &&
      !excludeWords.includes(w.romaji) &&
      !excludeWords.includes(w.kanji)
    );
    
    if (candidates.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }

  getSuggestedWords(sound: string, count: number = 3, excludeWords: string[] = []): DictionaryWord[] {
    const candidates = this.getWordsByStartSound(sound).filter(w => 
      !this.endsInN(w.word) && 
      !excludeWords.includes(w.word) &&
      !excludeWords.includes(w.romaji)
    );
    
    const shuffled = candidates.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  getAllWords(): DictionaryWord[] {
    return this.words;
  }

  getTotalWordCount(): number {
    return this.words.length;
  }

  getStartSoundCoverage(): string[] {
    return Object.keys(this.byStartSound).sort();
  }
}

export const dictionary = new DictionaryHelper();
