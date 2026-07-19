import type { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetTime: number };

/** Lightweight in-memory rate limiter — no extra npm dependencies. */
export function createRateLimiter(maxRequests = 100, windowMs = 60_000) {
  const buckets = new Map<string, Bucket>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const record = buckets.get(ip);

    if (!record || now > record.resetTime) {
      buckets.set(ip, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (record.count >= maxRequests) {
      res.status(429).json({ error: "Too many requests" });
      return;
    }

    record.count++;
    next();
  };
}
