/**
 * Shared Logger - Module-specific error tracking and logging
 */

export type LogLevel = "error" | "warn" | "info" | "debug";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  metadata?: Record<string, any>;
  stack?: string;
  userId?: string;
  sessionId?: string;
}

export interface LoggerOptions {
  level?: LogLevel;
  module: string;
  enableConsole?: boolean;
  enableRemote?: boolean;
  remoteEndpoint?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

class Logger {
  private options: Required<LoggerOptions>;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor(options: LoggerOptions) {
    this.options = {
      level: "info",
      enableConsole: true,
      enableRemote: false,
      remoteEndpoint: "",
      ...options,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.options.level];
  }

  private createEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      module: this.options.module,
      message,
      metadata,
      stack: error?.stack,
      sessionId: this.getSessionId(),
    };
  }

  private getSessionId(): string {
    if (typeof window !== "undefined") {
      let sessionId = sessionStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("sessionId", sessionId);
      }
      return sessionId;
    }
    return "server";
  }

  private formatConsoleMessage(entry: LogEntry): string {
    const time = new Date(entry.timestamp).toLocaleTimeString();
    return `[${time}] [${entry.module}] ${entry.message}`;
  }

  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createEntry(level, message, metadata, error);

    // Store in memory
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console logging
    if (this.options.enableConsole) {
      const formatted = this.formatConsoleMessage(entry);
      const consoleMethod = level === "debug" ? "log" : level;

      if (error) {
        console[consoleMethod](formatted, metadata, error);
      } else if (metadata) {
        console[consoleMethod](formatted, metadata);
      } else {
        console[consoleMethod](formatted);
      }
    }

    // Remote logging
    if (this.options.enableRemote && this.options.remoteEndpoint) {
      this.sendToRemote(entry);
    }

    // Persist to localStorage for errors
    if (level === "error") {
      this.persistError(entry);
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    try {
      await fetch(this.options.remoteEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    } catch (err) {
      // Fail silently for logging errors
      console.warn("Failed to send log to remote:", err);
    }
  }

  private persistError(entry: LogEntry): void {
    try {
      const key = `error_log_${this.options.module}`;
      const existing = localStorage.getItem(key);
      const errors = existing ? JSON.parse(existing) : [];

      errors.push(entry);

      // Keep last 50 errors
      if (errors.length > 50) {
        errors.shift();
      }

      localStorage.setItem(key, JSON.stringify(errors));
    } catch (err) {
      // Fail silently
    }
  }

  error(message: string, metadataOrError?: Record<string, any> | Error): void {
    const error = metadataOrError instanceof Error ? metadataOrError : undefined;
    const metadata = metadataOrError instanceof Error ? undefined : metadataOrError;
    this.log("error", message, metadata, error);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.log("warn", message, metadata);
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log("info", message, metadata);
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.log("debug", message, metadata);
  }

  getLogs(filter?: { level?: LogLevel; since?: Date }): LogEntry[] {
    let filtered = [...this.logs];

    if (filter?.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    if (filter?.since) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= filter.since);
    }

    return filtered;
  }

  getErrorCount(since?: Date): number {
    return this.getLogs({ level: "error", since }).length;
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Logger factory
export function createLogger(module: string, options?: Partial<LoggerOptions>): Logger {
  return new Logger({ module, ...options });
}

// Get errors from localStorage for a specific module
export function getPersistedErrors(module: string): LogEntry[] {
  try {
    const key = `error_log_${module}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Get all errors from all modules
export function getAllPersistedErrors(): Record<string, LogEntry[]> {
  const errors: Record<string, LogEntry[]> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("error_log_")) {
        const module = key.replace("error_log_", "");
        const stored = localStorage.getItem(key);
        if (stored) {
          errors[module] = JSON.parse(stored);
        }
      }
    }
  } catch {
    // Fail silently
  }

  return errors;
}

// Clear all persisted errors
export function clearPersistedErrors(module?: string): void {
  try {
    if (module) {
      localStorage.removeItem(`error_log_${module}`);
    } else {
      // Clear all error logs
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("error_log_")) {
          keys.push(key);
        }
      }
      keys.forEach(key => localStorage.removeItem(key));
    }
  } catch {
    // Fail silently
  }
}

// Error tracking utilities
export const ErrorTracking = {
  getErrorsByModule: (module: string): LogEntry[] => {
    return getPersistedErrors(module);
  },

  getAllErrors: (): Record<string, LogEntry[]> => {
    return getAllPersistedErrors();
  },

  getErrorStats: (): Record<string, { count: number; lastError?: LogEntry }> => {
    const allErrors = getAllPersistedErrors();
    const stats: Record<string, { count: number; lastError?: LogEntry }> = {};

    Object.entries(allErrors).forEach(([module, errors]) => {
      stats[module] = {
        count: errors.length,
        lastError: errors[errors.length - 1],
      };
    });

    return stats;
  },

  clearAll: () => {
    clearPersistedErrors();
  },

  clearModule: (module: string) => {
    clearPersistedErrors(module);
  },
};

export default Logger;
