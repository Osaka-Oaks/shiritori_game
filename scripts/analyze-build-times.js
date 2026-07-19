#!/usr/bin/env node
// Build Time Analysis and Optimization Recommendations

const fs = require("fs");
const path = require("path");

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function readBuildTimes() {
  const jsonPath = path.join(__dirname, "..", "build-times.json");

  if (!fs.existsSync(jsonPath)) {
    log("❌ No build time data found. Run a build with tracking first:", "red");
    log("   bash scripts/track-build-time.sh kawaii-shiritori", "cyan");
    process.exit(1);
  }

  const data = fs.readFileSync(jsonPath, "utf8");
  return JSON.parse(data);
}

function analyzeBuilds(builds) {
  if (builds.length === 0) {
    log("No builds to analyze", "yellow");
    return;
  }

  // Group by app
  const byApp = {};
  builds.forEach(build => {
    if (!byApp[build.app]) byApp[build.app] = [];
    byApp[build.app].push(build);
  });

  log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "blue");
  log("📊 Build Time Analysis", "blue");
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n", "blue");

  // Analyze each app
  Object.keys(byApp).forEach(app => {
    const appBuilds = byApp[app];
    analyzeSingleApp(app, appBuilds);
  });

  // Overall statistics
  log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "blue");
  log("📈 Overall Statistics", "blue");
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n", "blue");

  const totalBuilds = builds.length;
  const avgTotal = average(builds.map(b => b.timings.total));
  const avgBuild = average(builds.map(b => b.timings.build));

  log(`Total Builds:        ${totalBuilds}`);
  log(`Average Total Time:  ${avgTotal.toFixed(1)}s`, avgTotal < 180 ? "green" : "yellow");
  log(`Average Build Time:  ${avgBuild.toFixed(1)}s`, avgBuild < 120 ? "green" : "yellow");
}

function analyzeSingleApp(app, builds) {
  log(`\n📱 ${app}`, "cyan");
  log("─".repeat(50), "cyan");

  const recent = builds.slice(-10);
  const times = recent.map(b => b.timings.total);
  const buildTimes = recent.map(b => b.timings.build);
  const depTimes = recent.map(b => b.timings.dependencies);

  const stats = {
    count: recent.length,
    avgTotal: average(times),
    minTotal: Math.min(...times),
    maxTotal: Math.max(...times),
    avgBuild: average(buildTimes),
    avgDeps: average(depTimes),
  };

  log(`\nBuilds analyzed:     ${stats.count}`);
  log(`Average total:       ${stats.avgTotal.toFixed(1)}s`, getPerformanceColor(stats.avgTotal));
  log(`Average build:       ${stats.avgBuild.toFixed(1)}s`, getPerformanceColor(stats.avgBuild));
  log(`Average deps:        ${stats.avgDeps.toFixed(1)}s`);
  log(`Fastest:             ${stats.minTotal}s`, "green");
  log(`Slowest:             ${stats.maxTotal}s`, stats.maxTotal > 300 ? "red" : "yellow");

  // Trend analysis
  if (recent.length >= 5) {
    const firstHalf = times.slice(0, Math.floor(times.length / 2));
    const secondHalf = times.slice(Math.floor(times.length / 2));
    const trendChange = average(secondHalf) - average(firstHalf);

    log(`\n📈 Trend:`, "cyan");
    if (Math.abs(trendChange) < 5) {
      log(`  Stable (±${Math.abs(trendChange).toFixed(1)}s)`, "green");
    } else if (trendChange > 0) {
      log(`  Increasing (+${trendChange.toFixed(1)}s) ⚠️`, "yellow");
    } else {
      log(`  Improving (${trendChange.toFixed(1)}s) ✅`, "green");
    }
  }

  // Recent builds
  log(`\n📜 Recent Builds:`, "cyan");
  recent.slice(-5).forEach((build, i) => {
    const time = build.timings.total;
    const icon = time < 180 ? "🚀" : time < 300 ? "⚡" : "🐌";
    log(`  ${icon} ${formatDate(build.timestamp)}: ${time}s`, getPerformanceColor(time));
  });

  // Recommendations
  provideRecommendations(app, stats, recent);
}

function provideRecommendations(app, stats, builds) {
  log(`\n💡 Optimization Recommendations:`, "yellow");

  const recommendations = [];

  // Slow build detection
  if (stats.avgTotal > 300) {
    recommendations.push({
      severity: "high",
      message: "Build time is over 5 minutes. This significantly impacts development speed.",
      actions: [
        "Enable aggressive caching in vite.config.ts",
        "Use esbuild minifier instead of terser",
        "Disable source maps in CI: GENERATE_SOURCEMAP=false",
        "Consider using SWC instead of Babel",
      ],
    });
  } else if (stats.avgTotal > 180) {
    recommendations.push({
      severity: "medium",
      message: "Build time is 3-5 minutes. Room for improvement.",
      actions: [
        "Review bundle analyzer for large dependencies",
        "Enable CSS code splitting",
        "Use tree shaking for unused code",
      ],
    });
  }

  // Dependency installation time
  if (stats.avgDeps > 60) {
    recommendations.push({
      severity: "medium",
      message: "Dependency installation is slow.",
      actions: [
        "Use npm ci --prefer-offline for cached installs",
        "Consider using pnpm for faster installs",
        "Clean node_modules occasionally: rm -rf node_modules",
      ],
    });
  }

  // High variance
  const variance =
    Math.max(...builds.map(b => b.timings.total)) - Math.min(...builds.map(b => b.timings.total));
  if (variance > 120) {
    recommendations.push({
      severity: "low",
      message: "High variance in build times detected.",
      actions: [
        "Check for concurrent processes during builds",
        "Ensure consistent environment (same Node version)",
        "Monitor system resources (RAM, CPU)",
      ],
    });
  }

  // Output recommendations
  if (recommendations.length === 0) {
    log("  ✅ Build performance is good! No immediate optimizations needed.", "green");
  } else {
    recommendations.forEach(rec => {
      const severityColor =
        rec.severity === "high" ? "red" : rec.severity === "medium" ? "yellow" : "cyan";
      log(
        `\n  ${getSeverityIcon(rec.severity)} [${rec.severity.toUpperCase()}] ${rec.message}`,
        severityColor
      );
      log("  Actions:", "bright");
      rec.actions.forEach(action => {
        log(`    • ${action}`);
      });
    });
  }

  // Quick wins
  log(`\n🎯 Quick Wins:`, "green");
  log("  1. Use optimized build: npm run build:fast");
  log("  2. Enable caching: Set cache-dependency-path in GitHub Actions");
  log("  3. Parallel builds: Use matrix strategy for multiple apps");
  log("  4. Skip audits: npm ci --no-audit saves ~20-30s");
}

function getSeverityIcon(severity) {
  const icons = {
    high: "🔴",
    medium: "🟡",
    low: "🟢",
  };
  return icons[severity] || "⚪";
}

function getPerformanceColor(seconds) {
  if (seconds < 120) return "green";
  if (seconds < 180) return "cyan";
  if (seconds < 300) return "yellow";
  return "red";
}

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function generateChart(builds) {
  if (builds.length < 2) return;

  log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "blue");
  log("📊 Build Time Trend", "blue");
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n", "blue");

  const recent = builds.slice(-20);
  const maxTime = Math.max(...recent.map(b => b.timings.total));
  const scale = 50 / maxTime;

  recent.forEach((build, i) => {
    const time = build.timings.total;
    const barLength = Math.floor(time * scale);
    const bar = "█".repeat(barLength);
    const color = getPerformanceColor(time);
    const label = `${i + 1}.`.padStart(3);
    log(`${label} ${bar} ${time}s`, color);
  });

  log("\n  Scale: █ = ~" + (maxTime / 50).toFixed(0) + "s");
}

function exportReport() {
  const builds = readBuildTimes();
  const report = {
    generated: new Date().toISOString(),
    totalBuilds: builds.length,
    summary: {},
  };

  // Group by app
  const byApp = {};
  builds.forEach(build => {
    if (!byApp[build.app]) byApp[build.app] = [];
    byApp[build.app].push(build);
  });

  Object.keys(byApp).forEach(app => {
    const appBuilds = byApp[app];
    const times = appBuilds.map(b => b.timings.total);
    report.summary[app] = {
      count: appBuilds.length,
      average: average(times).toFixed(1),
      min: Math.min(...times),
      max: Math.max(...times),
    };
  });

  const reportPath = path.join(__dirname, "..", "build-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📄 Report exported to: build-report.json`, "cyan");
}

// Main execution
function main() {
  const builds = readBuildTimes();

  analyzeBuilds(builds);
  generateChart(builds);

  if (process.argv.includes("--export")) {
    exportReport();
  }

  log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "blue");
  log("✅ Analysis Complete!", "green");
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n", "blue");

  log("💡 Commands:", "cyan");
  log("  Track build:   bash scripts/track-build-time.sh <app>", "cyan");
  log("  Fast build:    npm run build:fast", "cyan");
  log("  Export report: node scripts/analyze-build-times.js --export", "cyan");
  log("");
}

main();
