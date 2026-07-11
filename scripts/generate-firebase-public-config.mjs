#!/usr/bin/env node
/**
 * Writes public/firebase-config.json from VITE_FIREBASE_* env vars (for service workers).
 * Usage: node scripts/generate-firebase-public-config.mjs <app-dir>
 * CI: pass env vars; local: load from app/.env via dotenv.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

// Get the root directory of the project
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

// Get app directory argument or default
const appArg = process.argv[2] || "shiritori-online";

// If appArg is an absolute path, use it; otherwise resolve from root
let appDir;
if (appArg.startsWith('/')) {
  appDir = appArg;
} else {
  // Check if we're already in the app directory (running from app dir)
  const cwd = process.cwd();
  const cwdBasename = basename(cwd);
  if (cwdBasename === appArg && existsSync(resolve(cwd, "package.json"))) {
    // Already in the app directory
    appDir = cwd;
  } else {
    // Resolve from root
    appDir = resolve(rootDir, appArg);
  }
}

const envPath = resolve(appDir, ".env");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.VITE_FIREBASE_APP_ID || "",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

// Ensure public directory exists
const publicDir = resolve(appDir, "public");
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

const out = resolve(publicDir, "firebase-config.json");
writeFileSync(out, JSON.stringify(config, null, 2) + "\n");
console.log(`Wrote ${out}`);
