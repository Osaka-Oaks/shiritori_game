#!/usr/bin/env node
/**
 * Cross-package dependency & framework inventory.
 * Run: npm run deps:report
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const APPS = [
  { dir: "shiritori-online", role: "2-player realtime (Firebase RTDB)" },
  { dir: "kawaii-shiritori", role: "Full-featured app (Firestore, Phaser)" },
  { dir: "shiritori-word-chain", role: "Legacy / alternate build" },
];

const FRAMEWORK_KEYS = [
  "react",
  "react-dom",
  "vite",
  "typescript",
  "firebase",
  "vitest",
  "eslint",
  "prettier",
  "tailwindcss",
  "phaser",
  "express",
  "motion",
];

function readPkg(dir) {
  const path = join(ROOT, dir, "package.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}

function getVersion(pkg, name) {
  return pkg.dependencies?.[name] ?? pkg.devDependencies?.[name] ?? "—";
}

const rows = APPS.map(({ dir, role }) => {
  const pkg = readPkg(dir);
  if (!pkg) return null;
  const frameworks = Object.fromEntries(FRAMEWORK_KEYS.map(k => [k, getVersion(pkg, k)]));
  return {
    dir,
    name: pkg.name,
    version: pkg.version ?? "0.0.0",
    role,
    nodeEngine: pkg.engines?.node ?? "(not pinned)",
    frameworks,
    depCount: Object.keys(pkg.dependencies ?? {}).length,
    devCount: Object.keys(pkg.devDependencies ?? {}).length,
  };
}).filter(Boolean);

console.log("\n📦 Shiritori workspace — dependency inventory\n");
console.log("═".repeat(72));

for (const row of rows) {
  console.log(`\n▸ ${row.dir}  (${row.name}@${row.version})`);
  console.log(`  ${row.role}`);
  console.log(`  deps: ${row.depCount} prod · ${row.devCount} dev · node: ${row.nodeEngine}`);
  console.log("  Frameworks:");
  for (const key of FRAMEWORK_KEYS) {
    const v = row.frameworks[key];
    if (v !== "—") console.log(`    ${key.padEnd(16)} ${v}`);
  }
}

console.log("\n" + "─".repeat(72));
console.log("Version drift (same package, different ranges):\n");

for (const key of FRAMEWORK_KEYS) {
  const versions = new Map();
  for (const row of rows) {
    const v = row.frameworks[key];
    if (v === "—") continue;
    if (!versions.has(v)) versions.set(v, []);
    versions.get(v).push(row.dir);
  }
  if (versions.size > 1) {
    console.log(`  ⚠  ${key}`);
    for (const [ver, apps] of versions) {
      console.log(`       ${ver.padEnd(12)} ← ${apps.join(", ")}`);
    }
  }
}

console.log("\n" + "─".repeat(72));
console.log("Commands:");
console.log("  npm run deps:report     — this report");
console.log("  npm run deps:outdated   — check for newer versions (per app)");
console.log("  npm run deps:sync       — list version mismatches (syncpack)");
console.log("  npm run deps:fix        — align fixable mismatches (syncpack)");
console.log("");
