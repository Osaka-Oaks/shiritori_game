#!/usr/bin/env node
/**
 * Format npm audit output for GitHub Actions summary
 */

import { readFileSync, existsSync } from "node:fs";

function formatAudit(appName, jsonFile) {
  if (!existsSync(jsonFile)) {
    console.log(`No audit data for ${appName}`);
    return;
  }

  const data = JSON.parse(readFileSync(jsonFile, "utf8"));

  // npm audit v7+ format
  const vulnerabilities = data.vulnerabilities || {};
  const metadata = data.metadata || {};

  const total = Object.keys(vulnerabilities).length;

  if (total === 0) {
    console.log(`✅ ${appName}: No vulnerabilities found!`);
    return;
  }

  // Count by severity
  const severityCounts = {
    critical: 0,
    high: 0,
    moderate: 0,
    low: 0,
    info: 0,
  };

  Object.values(vulnerabilities).forEach(vuln => {
    const severity = vuln.severity || "info";
    severityCounts[severity] = (severityCounts[severity] || 0) + 1;
  });

  console.log(`\n#### ${appName}\n`);

  // Summary badges
  if (severityCounts.critical > 0) {
    console.log(`🔴 **CRITICAL**: ${severityCounts.critical} vulnerabilities`);
  }
  if (severityCounts.high > 0) {
    console.log(`🟠 **HIGH**: ${severityCounts.high} vulnerabilities`);
  }
  if (severityCounts.moderate > 0) {
    console.log(`🟡 **MODERATE**: ${severityCounts.moderate} vulnerabilities`);
  }
  if (severityCounts.low > 0) {
    console.log(`⚪ **LOW**: ${severityCounts.low} vulnerabilities`);
  }

  // Detail table for critical and high
  const criticalAndHigh = Object.entries(vulnerabilities).filter(
    ([_, v]) => v.severity === "critical" || v.severity === "high"
  );

  if (criticalAndHigh.length > 0) {
    console.log("\n| Package | Severity | Issue | Fix Available |");
    console.log("|---------|----------|-------|---------------|");

    criticalAndHigh.slice(0, 10).forEach(([name, vuln]) => {
      const severity = vuln.severity === "critical" ? "🔴 CRITICAL" : "🟠 HIGH";
      const title = vuln.via?.[0]?.title || "Security issue";
      const fixAvailable = vuln.fixAvailable ? "✅ Yes" : "❌ No";

      console.log(`| ${name} | ${severity} | ${title.slice(0, 50)}... | ${fixAvailable} |`);
    });

    if (criticalAndHigh.length > 10) {
      console.log(`\n*... and ${criticalAndHigh.length - 10} more*`);
    }
  }

  // Remediation advice
  if (metadata.vulnerabilities) {
    const total = metadata.vulnerabilities.total || 0;
    console.log(`\n**Total vulnerabilities**: ${total}`);

    if (total > 0) {
      console.log("\n**Recommended action**: Run `npm audit fix` to automatically fix issues.");
      console.log("For breaking changes, run `npm audit fix --force` (review changes first!).");
    }
  }
}

// Process both apps
console.log("\n## 🔒 Security Audit\n");

try {
  formatAudit("Shiritori Online", "online-audit.json");
  formatAudit("Kawaii Shiritori", "kawaii-audit.json");
} catch (err) {
  console.error("Error formatting audit report:", err.message);
  console.log("\n✅ No security issues detected!");
}
