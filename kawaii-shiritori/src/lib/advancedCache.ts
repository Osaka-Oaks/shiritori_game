/**
 * Advanced Caching System
 * Uses IndexedDB for persistent storage with fallback to memory cache
 * Prevents lag by pre-caching and optimizing data access
 */

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  expiresAt?: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  strategy?: "LRU" | "LFU" | "FIFO"; // Eviction strategy
}

const DEFAULT_OPTIONS: Required<CacheOptions> = {
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 1000,
  strategy: "LRU", // Least Recently Used
};

class AdvancedCache {
  private dbName = "shiritori_cache";
  private dbVersion = 1;
  private storeName = "cache";
  private db: IDBDatabase | null = null;
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private options: Required<CacheOptions>;
  private initialized = false;

  constructor(options: CacheOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.initDB();
  }

  private async initDB(): Promise<void> {
    if (this.initialized) return;

    try {
      this.db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = event => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: "key" });
            store.createIndex("timestamp", "timestamp", { unique: false });
            store.createIndex("expiresAt", "expiresAt", { unique: false });
            store.createIndex("lastAccessed", "lastAccessed", { unique: false });
          }
        };
      });

      this.initialized = true;
      console.log("✅ Advanced cache initialized");

      // Load frequently accessed items into memory
      await this.warmupCache();
    } catch (error) {
      console.warn("IndexedDB not available, using memory cache only:", error);
      this.initialized = true;
    }
  }

  private async warmupCache(): Promise<void> {
    try {
      if (!this.db) return;

      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const index = store.index("accessCount");

      // Load top 50 most accessed items
      const request = index.openCursor(null, "prev");
      let count = 0;

      request.onsuccess = event => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && count < 50) {
          const entry = cursor.value as CacheEntry<any>;
          if (!this.isExpired(entry)) {
            this.memoryCache.set(entry.key, entry);
            count++;
          }
          cursor.continue();
        }
      };
    } catch (error) {
      console.warn("Cache warmup failed:", error);
    }
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    if (!entry.expiresAt) return false;
    return Date.now() > entry.expiresAt;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: now,
      expiresAt: ttl ? now + ttl : now + this.options.ttl,
      accessCount: 0,
      lastAccessed: now,
    };

    // Update memory cache
    this.memoryCache.set(key, entry);

    // Update IndexedDB
    if (this.db) {
      try {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        store.put(entry);
      } catch (error) {
        console.warn("Failed to write to IndexedDB:", error);
      }
    }

    // Check cache size and evict if necessary
    await this.evictIfNecessary();
  }

  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first (fastest)
    let entry = this.memoryCache.get(key) as CacheEntry<T> | undefined;

    // If not in memory, check IndexedDB
    if (!entry && this.db) {
      try {
        entry = await new Promise((resolve, reject) => {
          const transaction = this.db!.transaction([this.storeName], "readonly");
          const store = transaction.objectStore(this.storeName);
          const request = store.get(key);

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        // Add to memory cache for next time
        if (entry) {
          this.memoryCache.set(key, entry);
        }
      } catch (error) {
        console.warn("Failed to read from IndexedDB:", error);
      }
    }

    if (!entry) return null;

    // Check expiration
    if (this.isExpired(entry)) {
      await this.delete(key);
      return null;
    }

    // Update access stats
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    // Update in background (don't await)
    this.set(key, entry.value);

    return entry.value;
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);

    if (this.db) {
      try {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        store.delete(key);
      } catch (error) {
        console.warn("Failed to delete from IndexedDB:", error);
      }
    }
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();

    if (this.db) {
      try {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        store.clear();
      } catch (error) {
        console.warn("Failed to clear IndexedDB:", error);
      }
    }
  }

  async size(): Promise<number> {
    if (this.db) {
      try {
        return await new Promise((resolve, reject) => {
          const transaction = this.db!.transaction([this.storeName], "readonly");
          const store = transaction.objectStore(this.storeName);
          const request = store.count();

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      } catch {
        return this.memoryCache.size;
      }
    }
    return this.memoryCache.size;
  }

  private async evictIfNecessary(): Promise<void> {
    const currentSize = await this.size();

    if (currentSize <= this.options.maxSize) return;

    const toEvict = currentSize - this.options.maxSize + Math.floor(this.options.maxSize * 0.1);

    if (this.db) {
      try {
        const entries = await this.getAllEntries();
        const sortedKeys = this.sortForEviction(entries);

        for (let i = 0; i < toEvict && i < sortedKeys.length; i++) {
          await this.delete(sortedKeys[i]);
        }
      } catch (error) {
        console.warn("Eviction failed:", error);
      }
    }
  }

  private async getAllEntries(): Promise<CacheEntry<any>[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private sortForEviction(entries: CacheEntry<any>[]): string[] {
    switch (this.options.strategy) {
      case "LRU": // Least Recently Used
        return entries.sort((a, b) => a.lastAccessed - b.lastAccessed).map(e => e.key);

      case "LFU": // Least Frequently Used
        return entries.sort((a, b) => a.accessCount - b.accessCount).map(e => e.key);

      case "FIFO": // First In First Out
        return entries.sort((a, b) => a.timestamp - b.timestamp).map(e => e.key);

      default:
        return entries.map(e => e.key);
    }
  }

  // Batch operations for better performance
  async setMany<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    const promises = entries.map(({ key, value, ttl }) => this.set(key, value, ttl));
    await Promise.all(promises);
  }

  async getMany<T>(keys: string[]): Promise<Map<string, T | null>> {
    const results = new Map<string, T | null>();
    const promises = keys.map(async key => {
      const value = await this.get<T>(key);
      results.set(key, value);
    });
    await Promise.all(promises);
    return results;
  }

  // Get cache statistics
  async getStats(): Promise<{
    size: number;
    memorySize: number;
    hitRate: number;
  }> {
    const size = await this.size();
    return {
      size,
      memorySize: this.memoryCache.size,
      hitRate: this.memoryCache.size / size,
    };
  }
}

// Create singleton instances for different cache types
export const gameCache = new AdvancedCache({
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
  maxSize: 5000,
  strategy: "LRU",
});

export const wordCache = new AdvancedCache({
  ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
  maxSize: 10000,
  strategy: "LFU", // Keep frequently used words
});

export const apiCache = new AdvancedCache({
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 1000,
  strategy: "LRU",
});

export const assetCache = new AdvancedCache({
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
  maxSize: 500,
  strategy: "LRU",
});

export default AdvancedCache;
