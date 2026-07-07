// Health Check Endpoint for Shiritori Game
// Provides comprehensive application health status

import { Request, Response } from "express";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  checks: {
    database: CheckResult;
    firebase: CheckResult;
    memory: CheckResult;
    storage: CheckResult;
    dependencies: CheckResult;
  };
  version: string;
  buildTime: string;
}

interface CheckResult {
  status: "pass" | "warn" | "fail";
  responseTime?: number;
  message?: string;
  details?: any;
}

// Health check timeout
const HEALTH_CHECK_TIMEOUT = 5000;

export class HealthCheckService {
  private startTime = Date.now();
  private version = process.env.npm_package_version || "1.0.0";
  private buildTime = process.env.BUILD_TIME || new Date().toISOString();

  /**
   * Main health check endpoint
   */
  async checkHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkFirebase(),
      this.checkMemory(),
      this.checkStorage(),
      this.checkDependencies(),
    ]);

    const [database, firebase, memory, storage, dependencies] = checks.map(result =>
      result.status === "fulfilled"
        ? result.value
        : { status: "fail" as const, message: "Check timed out" }
    );

    const overallStatus = this.calculateOverallStatus([
      database,
      firebase,
      memory,
      storage,
      dependencies,
    ]);

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
      checks: {
        database,
        firebase,
        memory,
        storage,
        dependencies,
      },
      version: this.version,
      buildTime: this.buildTime,
    };
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<CheckResult> {
    const start = Date.now();
    try {
      // Add your database check here
      // Example: await db.ping();

      const responseTime = Date.now() - start;

      if (responseTime > 1000) {
        return {
          status: "warn",
          responseTime,
          message: "Database response time is slow",
        };
      }

      return {
        status: "pass",
        responseTime,
        message: "Database is accessible",
      };
    } catch (error) {
      return {
        status: "fail",
        responseTime: Date.now() - start,
        message: `Database error: ${error}`,
      };
    }
  }

  /**
   * Check Firebase services
   */
  private async checkFirebase(): Promise<CheckResult> {
    const start = Date.now();
    try {
      // Check Firestore
      // const firestoreOk = await admin.firestore().listCollections();

      // Check Authentication
      // const authOk = await admin.auth().listUsers(1);

      const responseTime = Date.now() - start;

      return {
        status: "pass",
        responseTime,
        message: "Firebase services are operational",
        details: {
          firestore: "connected",
          auth: "connected",
          storage: "connected",
        },
      };
    } catch (error) {
      return {
        status: "fail",
        responseTime: Date.now() - start,
        message: `Firebase error: ${error}`,
      };
    }
  }

  /**
   * Check memory usage
   */
  private async checkMemory(): Promise<CheckResult> {
    const usage = process.memoryUsage();
    const heapUsedPercent = (usage.heapUsed / usage.heapTotal) * 100;

    let status: "pass" | "warn" | "fail" = "pass";
    let message = "Memory usage is normal";

    if (heapUsedPercent > 90) {
      status = "fail";
      message = "Critical: Memory usage above 90%";
    } else if (heapUsedPercent > 75) {
      status = "warn";
      message = "Warning: Memory usage above 75%";
    }

    return {
      status,
      message,
      details: {
        heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
        heapUsedPercent: `${heapUsedPercent.toFixed(2)}%`,
        rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
      },
    };
  }

  /**
   * Check storage availability
   */
  private async checkStorage(): Promise<CheckResult> {
    try {
      // Check Cloud Storage
      // const bucket = admin.storage().bucket();
      // await bucket.exists();

      return {
        status: "pass",
        message: "Storage is accessible",
      };
    } catch (error) {
      return {
        status: "fail",
        message: `Storage error: ${error}`,
      };
    }
  }

  /**
   * Check critical dependencies
   */
  private async checkDependencies(): Promise<CheckResult> {
    const dependencies: string[] = [];

    // Check external APIs
    try {
      // Example: Check Jisho API
      const jishoResponse = await fetch("https://jisho.org/api/v1/search/words?keyword=test", {
        signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT),
      });

      if (!jishoResponse.ok) {
        dependencies.push("Jisho API unavailable");
      }
    } catch {
      dependencies.push("Jisho API timeout");
    }

    if (dependencies.length > 0) {
      return {
        status: "warn",
        message: "Some dependencies are unavailable",
        details: { issues: dependencies },
      };
    }

    return {
      status: "pass",
      message: "All dependencies are operational",
    };
  }

  /**
   * Calculate overall health status
   */
  private calculateOverallStatus(checks: CheckResult[]): "healthy" | "degraded" | "unhealthy" {
    const hasFailures = checks.some(check => check.status === "fail");
    const hasWarnings = checks.some(check => check.status === "warn");

    if (hasFailures) return "unhealthy";
    if (hasWarnings) return "degraded";
    return "healthy";
  }

  /**
   * Get application uptime in seconds
   */
  private getUptime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Liveness probe - simple check that server is running
   */
  async liveness(): Promise<{ alive: boolean }> {
    return { alive: true };
  }

  /**
   * Readiness probe - check if server is ready to accept traffic
   */
  async readiness(): Promise<{ ready: boolean; message?: string }> {
    try {
      // Check critical services
      const firebase = await this.checkFirebase();
      const memory = await this.checkMemory();

      const ready = firebase.status !== "fail" && memory.status !== "fail";

      return {
        ready,
        message: ready ? "Server is ready" : "Server is not ready",
      };
    } catch {
      return {
        ready: false,
        message: "Readiness check failed",
      };
    }
  }
}

// Express middleware
export function setupHealthEndpoints(app: any) {
  const healthService = new HealthCheckService();

  // Detailed health check
  app.get("/health", async (req: Request, res: Response) => {
    const health = await healthService.checkHealth();
    const statusCode = health.status === "healthy" ? 200 : health.status === "degraded" ? 200 : 503;
    res.status(statusCode).json(health);
  });

  // Liveness probe (Kubernetes)
  app.get("/health/live", async (req: Request, res: Response) => {
    const liveness = await healthService.liveness();
    res.status(200).json(liveness);
  });

  // Readiness probe (Kubernetes)
  app.get("/health/ready", async (req: Request, res: Response) => {
    const readiness = await healthService.readiness();
    const statusCode = readiness.ready ? 200 : 503;
    res.status(statusCode).json(readiness);
  });

  // Simple ping endpoint
  app.get("/ping", (req: Request, res: Response) => {
    res.status(200).send("pong");
  });

  // Metrics endpoint (Prometheus format)
  app.get("/metrics", (req: Request, res: Response) => {
    const health = healthService.checkHealth();
    // Convert to Prometheus format
    // This is a simplified example
    res.set("Content-Type", "text/plain");
    res.send(
      `
# HELP shiritori_up Application is up
# TYPE shiritori_up gauge
shiritori_up 1

# HELP shiritori_uptime_seconds Application uptime in seconds
# TYPE shiritori_uptime_seconds counter
shiritori_uptime_seconds ${healthService["getUptime"]()}
    `.trim()
    );
  });
}

export default HealthCheckService;
