/**
 * Real-time Synchronization System
 * WebSocket-based communication with optimistic updates
 * Prevents lag with predictive state management
 */

import { wordCache } from "./advancedCache";
import { performanceOptimizer } from "./performanceOptimizer";

export interface GameState {
  roomId: string;
  players: Player[];
  currentTurn: string; // player ID
  playedWords: PlayedWord[];
  gameStatus: "waiting" | "playing" | "finished";
  lastUpdate: number;
}

export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  score: number;
  isOnline: boolean;
  lastSeen: number;
  latency: number;
}

export interface PlayedWord {
  playerId: string;
  word: string;
  timestamp: number;
  validated: boolean;
}

export interface SyncMessage {
  type: "state" | "move" | "join" | "leave" | "ping" | "pong";
  data: any;
  timestamp: number;
  senderId: string;
}

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "reconnecting";

class RealtimeSync {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval?: NodeJS.Timeout;
  private connectionStatus: ConnectionStatus = "disconnected";
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  // Optimistic updates
  private pendingUpdates: Map<string, any> = new Map();
  private stateVersion = 0;
  private lastAckVersion = 0;

  // Latency tracking
  private pingStartTime = 0;
  private latency = 0;

  // State management
  private gameState: GameState | null = null;

  async connect(roomId: string, playerId: string): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.warn("Already connected");
      return;
    }

    this.connectionStatus = "connecting";

    const wsUrl = this.getWebSocketUrl(roomId, playerId);

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => this.handleOpen();
      this.ws.onmessage = event => this.handleMessage(event);
      this.ws.onerror = error => this.handleError(error);
      this.ws.onclose = () => this.handleClose();

      // Wait for connection
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Connection timeout")), 5000);

        const openHandler = () => {
          clearTimeout(timeout);
          this.ws?.removeEventListener("open", openHandler);
          resolve(undefined);
        };

        this.ws?.addEventListener("open", openHandler);
      });

      console.log("✅ Connected to real-time server");
    } catch (error) {
      console.error("❌ Failed to connect:", error);
      this.connectionStatus = "disconnected";
      throw error;
    }
  }

  disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.connectionStatus = "disconnected";
    console.log("Disconnected from real-time server");
  }

  private handleOpen(): void {
    this.connectionStatus = "connected";
    this.reconnectAttempts = 0;
    this.emit("connected", {});

    // Start heartbeat
    this.startHeartbeat();

    // Request initial state
    this.send({
      type: "join",
      data: {},
      timestamp: Date.now(),
      senderId: this.getPlayerId(),
    });
  }

  private handleMessage(event: MessageEvent): void {
    const startTime = performance.now();

    try {
      const message: SyncMessage = JSON.parse(event.data);

      // Measure latency
      if (message.type === "pong") {
        this.latency = performance.now() - this.pingStartTime;
        this.emit("latency", this.latency);
        return;
      }

      // Handle different message types
      switch (message.type) {
        case "state":
          this.handleStateUpdate(message.data);
          break;
        case "move":
          this.handleMove(message.data);
          break;
        case "join":
          this.handlePlayerJoin(message.data);
          break;
        case "leave":
          this.handlePlayerLeave(message.data);
          break;
      }

      // Emit to listeners
      this.emit(message.type, message.data);

      // Track response time
      performanceOptimizer.measureResponseTime(`realtime_${message.type}`, startTime);
    } catch (error) {
      console.error("Failed to handle message:", error);
    }
  }

  private handleError(error: Event): void {
    console.error("WebSocket error:", error);
    this.emit("error", error);
  }

  private handleClose(): void {
    this.connectionStatus = "disconnected";
    this.emit("disconnected", {});

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Attempt to reconnect
    this.attemptReconnect();
  }

  private async attemptReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      this.emit("reconnect_failed", {});
      return;
    }

    this.connectionStatus = "reconnecting";
    this.reconnectAttempts++;

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await this.connect(this.gameState?.roomId || "", this.getPlayerId());
    } catch (error) {
      console.error("Reconnection failed:", error);
      this.attemptReconnect();
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.ping();
    }, 10000); // Ping every 10 seconds
  }

  private ping(): void {
    this.pingStartTime = performance.now();
    this.send({
      type: "ping",
      data: {},
      timestamp: Date.now(),
      senderId: this.getPlayerId(),
    });
  }

  // Send message with retry logic
  async send(message: SyncMessage, retry = 3): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (retry > 0) {
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.send(message, retry - 1);
      }
      throw new Error("WebSocket not connected");
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error("Failed to send message:", error);
      if (retry > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.send(message, retry - 1);
      }
      throw error;
    }
  }

  // Optimistic update - apply immediately, rollback if rejected
  async sendMove(word: string): Promise<void> {
    const updateId = `move_${Date.now()}`;
    const optimisticUpdate = {
      word,
      playerId: this.getPlayerId(),
      timestamp: Date.now(),
      validated: false,
    };

    // Apply optimistically
    this.pendingUpdates.set(updateId, optimisticUpdate);
    this.emit("optimistic_move", optimisticUpdate);

    try {
      await this.send({
        type: "move",
        data: { word, updateId },
        timestamp: Date.now(),
        senderId: this.getPlayerId(),
      });
    } catch (error) {
      // Rollback on error
      this.pendingUpdates.delete(updateId);
      this.emit("rollback_move", { updateId });
      throw error;
    }
  }

  private handleStateUpdate(state: GameState): void {
    // Cache state for offline access
    wordCache.set(`game_state_${state.roomId}`, state);

    this.gameState = state;
    this.stateVersion++;

    // Clear confirmed pending updates
    this.pendingUpdates.clear();
  }

  private handleMove(data: any): void {
    // Remove from pending if it was our move
    this.pendingUpdates.delete(data.updateId);

    if (this.gameState) {
      this.gameState.playedWords.push(data);
      this.gameState.lastUpdate = Date.now();
    }
  }

  private handlePlayerJoin(data: any): void {
    if (this.gameState && !this.gameState.players.find(p => p.id === data.id)) {
      this.gameState.players.push(data);
    }
  }

  private handlePlayerLeave(data: any): void {
    if (this.gameState) {
      this.gameState.players = this.gameState.players.filter(p => p.id !== data.playerId);
    }
  }

  // Event emitter
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in listener for ${event}:`, error);
      }
    });
  }

  // Getters
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  getLatency(): number {
    return this.latency;
  }

  getGameState(): GameState | null {
    return this.gameState;
  }

  private getPlayerId(): string {
    // Get from session or generate
    let playerId = sessionStorage.getItem("playerId");
    if (!playerId) {
      playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("playerId", playerId);
    }
    return playerId;
  }

  private getWebSocketUrl(roomId: string, playerId: string): string {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = process.env.VITE_WS_HOST || window.location.host;
    return `${protocol}//${host}/ws/game/${roomId}?playerId=${playerId}`;
  }
}

// Singleton instance
export const realtimeSync = new RealtimeSync();

// React hook for real-time sync
export function useRealtimeSync(roomId: string) {
  const [connected, setConnected] = React.useState(false);
  const [latency, setLatency] = React.useState(0);
  const [gameState, setGameState] = React.useState<GameState | null>(null);

  React.useEffect(() => {
    realtimeSync.connect(roomId, "");

    const unsubConnected = realtimeSync.on("connected", () => setConnected(true));
    const unsubDisconnected = realtimeSync.on("disconnected", () => setConnected(false));
    const unsubLatency = realtimeSync.on("latency", (l: number) => setLatency(l));
    const unsubState = realtimeSync.on("state", (state: GameState) => setGameState(state));

    return () => {
      unsubConnected();
      unsubDisconnected();
      unsubLatency();
      unsubState();
      realtimeSync.disconnect();
    };
  }, [roomId]);

  return {
    connected,
    latency,
    gameState,
    sendMove: (word: string) => realtimeSync.sendMove(word),
  };
}

export default realtimeSync;
