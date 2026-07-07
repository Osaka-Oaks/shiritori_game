/**
 * Sound Effects System with On/Off Toggle
 * Manages all game audio with user preferences
 */

export type SoundType =
  | "click"
  | "correct"
  | "incorrect"
  | "win"
  | "lose"
  | "notification"
  | "happy"
  | "sad"
  | "excited"
  | "think"
  | "love"
  | "surprise"
  | "chirp"
  | "whoosh"
  | "pop"
  | "ding"
  | "error"
  | "success";

export interface SoundConfig {
  enabled: boolean;
  volume: number; // 0-1
  soundEffects: boolean;
  music: boolean;
  notifications: boolean;
}

export interface Sound {
  id: SoundType;
  url: string;
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

const DEFAULT_CONFIG: SoundConfig = {
  enabled: true,
  volume: 0.7,
  soundEffects: true,
  music: false,
  notifications: true,
};

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private config: SoundConfig;
  private initialized = false;
  private audioContext?: AudioContext;

  constructor() {
    this.config = this.loadConfig();
    this.initSounds();
  }

  private loadConfig(): SoundConfig {
    try {
      const stored = localStorage.getItem("soundConfig");
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_CONFIG;
  }

  private saveConfig(): void {
    try {
      localStorage.setItem("soundConfig", JSON.stringify(this.config));
    } catch {
      // Fail silently
    }
  }

  private initSounds(): void {
    const soundDefinitions: Sound[] = [
      // UI Sounds
      { id: "click", url: "/sounds/click.mp3", volume: 0.3, preload: true },
      { id: "whoosh", url: "/sounds/whoosh.mp3", volume: 0.4, preload: true },
      { id: "pop", url: "/sounds/pop.mp3", volume: 0.5, preload: true },
      { id: "ding", url: "/sounds/ding.mp3", volume: 0.6, preload: true },

      // Game Feedback
      { id: "correct", url: "/sounds/correct.mp3", volume: 0.7, preload: true },
      { id: "incorrect", url: "/sounds/incorrect.mp3", volume: 0.6, preload: true },
      { id: "error", url: "/sounds/error.mp3", volume: 0.5, preload: true },
      { id: "success", url: "/sounds/success.mp3", volume: 0.8, preload: true },

      // Game Results
      { id: "win", url: "/sounds/win.mp3", volume: 0.8, preload: true },
      { id: "lose", url: "/sounds/lose.mp3", volume: 0.6, preload: true },

      // Notifications
      { id: "notification", url: "/sounds/notification.mp3", volume: 0.5, preload: true },

      // Emotions (for LINE stickers)
      { id: "happy", url: "/sounds/happy.mp3", volume: 0.6, preload: false },
      { id: "sad", url: "/sounds/sad.mp3", volume: 0.5, preload: false },
      { id: "excited", url: "/sounds/excited.mp3", volume: 0.7, preload: false },
      { id: "think", url: "/sounds/think.mp3", volume: 0.4, preload: false },
      { id: "love", url: "/sounds/love.mp3", volume: 0.6, preload: false },
      { id: "surprise", url: "/sounds/surprise.mp3", volume: 0.7, preload: false },
      { id: "chirp", url: "/sounds/chirp.mp3", volume: 0.5, preload: false },
    ];

    // Create audio elements (but don't load yet)
    soundDefinitions.forEach(sound => {
      const audio = new Audio();
      audio.volume = (sound.volume ?? 0.7) * this.config.volume;
      audio.loop = sound.loop ?? false;

      // Only preload important sounds
      if (sound.preload) {
        audio.preload = "auto";
        audio.src = sound.url;
      } else {
        audio.preload = "none";
      }

      this.sounds.set(sound.id, audio);
    });
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Create AudioContext for better control
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Preload critical sounds
      const preloadPromises: Promise<void>[] = [];
      this.sounds.forEach((audio, id) => {
        if (audio.preload === "auto") {
          const promise = new Promise<void>(resolve => {
            audio.addEventListener("canplaythrough", () => resolve(), { once: true });
            audio.addEventListener("error", () => resolve(), { once: true });
          });
          preloadPromises.push(promise);
        }
      });

      await Promise.all(preloadPromises);
      this.initialized = true;
      console.log("✅ Sound system initialized");
    } catch (error) {
      console.warn("Sound system initialization failed:", error);
    }
  }

  play(soundType: SoundType): void {
    if (!this.config.enabled || !this.config.soundEffects) return;

    const audio = this.sounds.get(soundType);
    if (!audio) {
      console.warn(`Sound not found: ${soundType}`);
      return;
    }

    // Load sound if not already loaded
    if (audio.preload === "none" && !audio.src) {
      const soundDef = this.getSoundDefinition(soundType);
      if (soundDef) {
        audio.src = soundDef.url;
      }
    }

    // Reset and play
    try {
      audio.currentTime = 0;
      const playPromise = audio.play();

      if (playPromise) {
        playPromise.catch(error => {
          // Autoplay prevented - this is normal
          if (error.name !== "NotAllowedError") {
            console.warn(`Failed to play sound: ${soundType}`, error);
          }
        });
      }
    } catch (error) {
      console.warn(`Error playing sound: ${soundType}`, error);
    }
  }

  playWithDelay(soundType: SoundType, delayMs: number): void {
    setTimeout(() => this.play(soundType), delayMs);
  }

  stopAll(): void {
    this.sounds.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  // Configuration methods
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    this.saveConfig();
  }

  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(audio => {
      const soundDef = Array.from(this.sounds.entries()).find(([_, a]) => a === audio);
      if (soundDef) {
        const [type] = soundDef;
        const def = this.getSoundDefinition(type);
        audio.volume = (def?.volume ?? 0.7) * this.config.volume;
      }
    });
    this.saveConfig();
  }

  setSoundEffects(enabled: boolean): void {
    this.config.soundEffects = enabled;
    this.saveConfig();
  }

  setMusic(enabled: boolean): void {
    this.config.music = enabled;
    this.saveConfig();
  }

  setNotifications(enabled: boolean): void {
    this.config.notifications = enabled;
    this.saveConfig();
  }

  getConfig(): SoundConfig {
    return { ...this.config };
  }

  isEnabled(): boolean {
    return this.config.enabled && this.config.soundEffects;
  }

  private getSoundDefinition(type: SoundType): Sound | undefined {
    const definitions: Sound[] = [
      { id: "click", url: "/sounds/click.mp3", volume: 0.3 },
      { id: "correct", url: "/sounds/correct.mp3", volume: 0.7 },
      { id: "incorrect", url: "/sounds/incorrect.mp3", volume: 0.6 },
      { id: "win", url: "/sounds/win.mp3", volume: 0.8 },
      { id: "lose", url: "/sounds/lose.mp3", volume: 0.6 },
      { id: "notification", url: "/sounds/notification.mp3", volume: 0.5 },
      { id: "happy", url: "/sounds/happy.mp3", volume: 0.6 },
      { id: "sad", url: "/sounds/sad.mp3", volume: 0.5 },
      { id: "excited", url: "/sounds/excited.mp3", volume: 0.7 },
      { id: "think", url: "/sounds/think.mp3", volume: 0.4 },
      { id: "love", url: "/sounds/love.mp3", volume: 0.6 },
      { id: "surprise", url: "/sounds/surprise.mp3", volume: 0.7 },
      { id: "chirp", url: "/sounds/chirp.mp3", volume: 0.5 },
      { id: "whoosh", url: "/sounds/whoosh.mp3", volume: 0.4 },
      { id: "pop", url: "/sounds/pop.mp3", volume: 0.5 },
      { id: "ding", url: "/sounds/ding.mp3", volume: 0.6 },
      { id: "error", url: "/sounds/error.mp3", volume: 0.5 },
      { id: "success", url: "/sounds/success.mp3", volume: 0.8 },
    ];
    return definitions.find(d => d.id === type);
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// React hook for sound management
export function useSoundManager() {
  const [config, setConfig] = React.useState<SoundConfig>(soundManager.getConfig());

  React.useEffect(() => {
    soundManager.initialize();
  }, []);

  const updateConfig = () => {
    setConfig(soundManager.getConfig());
  };

  return {
    config,
    play: (sound: SoundType) => soundManager.play(sound),
    playWithDelay: (sound: SoundType, delay: number) => soundManager.playWithDelay(sound, delay),
    setEnabled: (enabled: boolean) => {
      soundManager.setEnabled(enabled);
      updateConfig();
    },
    setVolume: (volume: number) => {
      soundManager.setVolume(volume);
      updateConfig();
    },
    setSoundEffects: (enabled: boolean) => {
      soundManager.setSoundEffects(enabled);
      updateConfig();
    },
    setMusic: (enabled: boolean) => {
      soundManager.setMusic(enabled);
      updateConfig();
    },
    stopAll: () => soundManager.stopAll(),
  };
}

// Convenience function for quick sound playback
export function playSound(type: SoundType): void {
  soundManager.play(type);
}

export default soundManager;
