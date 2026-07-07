/**
 * Performance Optimizer - Prevents lag and monitors response times
 * Tracks metrics, detects bottlenecks, and optimizes rendering
 */

import React from "react";

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  responseTime: number;
  renderTime: number;
  memoryUsage?: number;
  lag: boolean;
}

export interface PerformanceAlert {
  type: "fps" | "memory" | "response" | "render";
  severity: "low" | "medium" | "high";
  message: string;
  timestamp: number;
  value: number;
}

class PerformanceOptimizer {
  private metrics: PerformanceMetrics = {
    fps: 60,
    frameTime: 16.67,
    responseTime: 0,
    renderTime: 0,
    lag: false,
  };

  private frameCount = 0;
  private lastFrameTime = performance.now();
  private frameTimes: number[] = [];
  private responseTimes: number[] = [];
  private renderTimes: number[] = [];

  private alerts: PerformanceAlert[] = [];
  private monitoring = false;
  private rafId?: number;

  // Thresholds
  private readonly FPS_THRESHOLD = 30;
  private readonly FRAME_TIME_THRESHOLD = 33.33; // 30 FPS
  private readonly RESPONSE_TIME_THRESHOLD = 100; // 100ms
  private readonly RENDER_TIME_THRESHOLD = 16.67; // 60 FPS target

  constructor() {
    this.startMonitoring();
  }

  startMonitoring(): void {
    if (this.monitoring) return;
    this.monitoring = true;
    this.monitorFrames();
  }

  stopMonitoring(): void {
    this.monitoring = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  private monitorFrames(): void {
    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;

    this.frameCount++;
    this.frameTimes.push(frameTime);

    // Keep only last 60 frames
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }

    // Calculate FPS
    if (this.frameTimes.length >= 10) {
      const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.metrics.fps = Math.round(1000 / avgFrameTime);
      this.metrics.frameTime = avgFrameTime;

      // Detect lag
      this.metrics.lag = this.metrics.fps < this.FPS_THRESHOLD;

      if (this.metrics.lag) {
        this.addAlert({
          type: "fps",
          severity: this.metrics.fps < 20 ? "high" : "medium",
          message: `Low FPS detected: ${this.metrics.fps}`,
          timestamp: currentTime,
          value: this.metrics.fps,
        });
      }
    }

    this.lastFrameTime = currentTime;

    if (this.monitoring) {
      this.rafId = requestAnimationFrame(() => this.monitorFrames());
    }
  }

  // Track response time for user interactions
  measureResponseTime(action: string, startTime: number): number {
    const responseTime = performance.now() - startTime;
    this.responseTimes.push(responseTime);

    // Keep only last 50 measurements
    if (this.responseTimes.length > 50) {
      this.responseTimes.shift();
    }

    // Update average
    this.metrics.responseTime =
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;

    // Alert if response time is too high
    if (responseTime > this.RESPONSE_TIME_THRESHOLD) {
      this.addAlert({
        type: "response",
        severity: responseTime > 200 ? "high" : "medium",
        message: `Slow response for ${action}: ${responseTime.toFixed(2)}ms`,
        timestamp: performance.now(),
        value: responseTime,
      });
    }

    return responseTime;
  }

  // Track render time
  measureRenderTime(componentName: string, startTime: number): number {
    const renderTime = performance.now() - startTime;
    this.renderTimes.push(renderTime);

    // Keep only last 50 measurements
    if (this.renderTimes.length > 50) {
      this.renderTimes.shift();
    }

    // Update average
    this.metrics.renderTime = this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;

    // Alert if render time is too high
    if (renderTime > this.RENDER_TIME_THRESHOLD) {
      this.addAlert({
        type: "render",
        severity: renderTime > 33 ? "high" : "low",
        message: `Slow render for ${componentName}: ${renderTime.toFixed(2)}ms`,
        timestamp: performance.now(),
        value: renderTime,
      });
    }

    return renderTime;
  }

  // Check memory usage (if available)
  checkMemoryUsage(): void {
    if ("memory" in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

      if (this.metrics.memoryUsage > 0.9) {
        this.addAlert({
          type: "memory",
          severity: "high",
          message: `High memory usage: ${(this.metrics.memoryUsage * 100).toFixed(1)}%`,
          timestamp: performance.now(),
          value: this.metrics.memoryUsage,
        });
      }
    }
  }

  private addAlert(alert: PerformanceAlert): void {
    this.alerts.push(alert);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }

    // Log high severity alerts
    if (alert.severity === "high") {
      console.warn("⚠️ Performance Alert:", alert.message);
    }
  }

  getMetrics(): PerformanceMetrics {
    this.checkMemoryUsage();
    return { ...this.metrics };
  }

  getAlerts(severity?: PerformanceAlert["severity"]): PerformanceAlert[] {
    if (severity) {
      return this.alerts.filter(a => a.severity === severity);
    }
    return [...this.alerts];
  }

  clearAlerts(): void {
    this.alerts = [];
  }

  // Optimization utilities
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Batch DOM updates to prevent layout thrashing
  batchDOMUpdates(updates: Array<() => void>): void {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  }

  // Lazy load images
  lazyLoadImage(img: HTMLImageElement, src: string): void {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = src;
            observer.unobserve(img);
          }
        });
      });
      observer.observe(img);
    } else {
      img.src = src;
    }
  }

  // Virtualize long lists
  virtualizeList<T>(items: T[], visibleRange: { start: number; end: number }): T[] {
    return items.slice(visibleRange.start, visibleRange.end);
  }

  // Optimize animations
  optimizeAnimation(callback: (timestamp: number) => void): number {
    let rafId: number;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp: number) => {
      rafId = requestAnimationFrame(animate);

      const elapsed = timestamp - lastTime;

      if (elapsed >= frameInterval) {
        lastTime = timestamp - (elapsed % frameInterval);
        callback(timestamp);
      }
    };

    rafId = requestAnimationFrame(animate);
    return rafId;
  }

  // Preload critical assets
  async preloadAssets(urls: string[]): Promise<void> {
    const promises = urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    });

    try {
      await Promise.all(promises);
      console.log("✅ Assets preloaded");
    } catch (error) {
      console.warn("⚠️ Some assets failed to preload:", error);
    }
  }

  // Memory cleanup
  cleanup(): void {
    this.frameTimes = [];
    this.responseTimes = [];
    this.renderTimes = [];
    this.clearAlerts();
  }
}

// Singleton instance
export const performanceOptimizer = new PerformanceOptimizer();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(
    performanceOptimizer.getMetrics()
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceOptimizer.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}

// HOC to measure component render time
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const Wrapped = (props: P) => {
    const startTime = React.useRef(performance.now());

    React.useEffect(() => {
      performanceOptimizer.measureRenderTime(componentName, startTime.current);
    });

    return <Component {...props} />;
  };
  Wrapped.displayName = `WithPerformanceTracking(${componentName})`;
  return Wrapped;
}

// Measure async operation time
export async function measureAsyncOperation<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await operation();
    performanceOptimizer.measureResponseTime(operationName, startTime);
    return result;
  } catch (error) {
    performanceOptimizer.measureResponseTime(operationName, startTime);
    throw error;
  }
}

export default performanceOptimizer;
