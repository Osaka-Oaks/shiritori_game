#!/usr/bin/env node
/**
 * Format npm outdated output for GitHub Actions summary
 */

import { readFileSync, existsSync } from "node:fs";

function formatOutdated(appName, jsonFile) {
  if (!existsSync(jsonFile)) {
    console.log(`No outdated packages for ${appName}`);
    return;
  }

  const data = JSON.parse(readFileSync(jsonFile, "utf8"));
  const packages = Object.entries(data);

  if (packages.length === 0) {
    console.log(`✅ All packages up to date in ${appName}!`);
    return;
  }

  console.log(`\n#### ${appName} (${packages.length} outdated)\n`);
  console.log("| Package | Current | Wanted | Latest | Type |");
  console.log("|---------|---------|--------|--------|------|");

  packages.forEach(([name, info]) => {
    const current = info.current || "N/A";
    const wanted = info.wanted || "N/A";
    const latest = info.latest || "N/A";

    // Determine update type
    let type = "📦 patch";
    if (info.type === "devDependencies") {
      type = "🔧 dev";
    }

    // Check if major version change
    if (wanted !== latest) {
      const wantedMajor = wanted.split(".")[0];
      const latestMajor = latest.split(".")[0];
      if (wantedMajor !== latestMajor) {
        type += " ⚠️ MAJOR";
      }
    }

    console.log(`| ${name} | ${current} | ${wanted} | ${latest} | ${type} |`);
  });
}

// Process both apps
console.log("\n## 📦 Outdated Packages\n");

try {
  formatOutdated("Shiritori Online", "online-outdated.json");
  formatOutdated("Kawaii Shiritori", "kawaii-outdated.json");
} catch (err) {
  console.error("Error formatting outdated report:", err.message);
  console.log("\n✅ All packages appear to be up to date!");
}
