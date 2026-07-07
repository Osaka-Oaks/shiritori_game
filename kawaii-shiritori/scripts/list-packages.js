#!/usr/bin/env node

/**
 * 📦 Package Listing Script
 * Shows all dependencies with versions, descriptions, and purposes
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
};

// Package descriptions and purposes
const packageInfo = {
  // Production dependencies
  "@google/genai": {
    purpose: "Gemini AI integration for game features",
    critical: false,
    category: "AI",
  },
  "@tailwindcss/vite": {
    purpose: "TailwindCSS integration with Vite",
    critical: true,
    category: "Styling",
  },
  "@vitejs/plugin-react": {
    purpose: "React plugin for Vite build tool",
    critical: true,
    category: "Build",
  },
  "lucide-react": {
    purpose: "Icon library (1000+ icons)",
    critical: true,
    category: "UI",
  },
  react: {
    purpose: "Core UI framework",
    critical: true,
    category: "Framework",
  },
  "react-dom": {
    purpose: "React DOM renderer for web",
    critical: true,
    category: "Framework",
  },
  vite: {
    purpose: "Fast build tool and dev server",
    critical: true,
    category: "Build",
  },
  express: {
    purpose: "Server framework for SSR",
    critical: false,
    category: "Server",
  },
  dotenv: {
    purpose: "Environment variable management",
    critical: false,
    category: "Config",
  },
  motion: {
    purpose: "Animation library (Framer Motion)",
    critical: true,
    category: "Animation",
  },
  firebase: {
    purpose: "Firebase SDK (Auth, Firestore, Hosting)",
    critical: true,
    category: "Backend",
  },
  phaser: {
    purpose: "2D game engine for Unity-like mode",
    critical: false,
    category: "Game",
  },

  // Development dependencies
  "@types/node": {
    purpose: "TypeScript types for Node.js",
    critical: true,
    category: "Types",
  },
  "@types/express": {
    purpose: "TypeScript types for Express",
    critical: false,
    category: "Types",
  },
  "@types/react": {
    purpose: "TypeScript types for React",
    critical: true,
    category: "Types",
  },
  "@types/react-dom": {
    purpose: "TypeScript types for React DOM",
    critical: true,
    category: "Types",
  },
  "@typescript-eslint/eslint-plugin": {
    purpose: "ESLint rules for TypeScript",
    critical: false,
    category: "Linting",
  },
  "@typescript-eslint/parser": {
    purpose: "ESLint TypeScript parser",
    critical: false,
    category: "Linting",
  },
  "@vitest/ui": {
    purpose: "UI for Vitest test runner",
    critical: false,
    category: "Testing",
  },
  "@vitest/coverage-v8": {
    purpose: "Test coverage reports",
    critical: false,
    category: "Testing",
  },
  "@testing-library/react": {
    purpose: "React component testing utilities",
    critical: false,
    category: "Testing",
  },
  "@testing-library/jest-dom": {
    purpose: "Custom DOM matchers for testing",
    critical: false,
    category: "Testing",
  },
  autoprefixer: {
    purpose: "Automatic CSS vendor prefixes",
    critical: true,
    category: "Styling",
  },
  esbuild: {
    purpose: "Fast JavaScript bundler",
    critical: true,
    category: "Build",
  },
  eslint: {
    purpose: "Code linting and quality checks",
    critical: false,
    category: "Linting",
  },
  "eslint-config-prettier": {
    purpose: "ESLint + Prettier integration",
    critical: false,
    category: "Linting",
  },
  "eslint-plugin-react": {
    purpose: "React-specific linting rules",
    critical: false,
    category: "Linting",
  },
  "eslint-plugin-react-hooks": {
    purpose: "Linting for React Hooks",
    critical: false,
    category: "Linting",
  },
  "eslint-plugin-react-refresh": {
    purpose: "HMR linting for Vite",
    critical: false,
    category: "Linting",
  },
  husky: {
    purpose: "Git hooks for pre-commit checks",
    critical: false,
    category: "Git",
  },
  jsdom: {
    purpose: "DOM implementation for testing",
    critical: false,
    category: "Testing",
  },
  "lint-staged": {
    purpose: "Run linters on staged files",
    critical: false,
    category: "Git",
  },
  prettier: {
    purpose: "Code formatting tool",
    critical: false,
    category: "Formatting",
  },
  tailwindcss: {
    purpose: "Utility-first CSS framework",
    critical: true,
    category: "Styling",
  },
  tsx: {
    purpose: "Execute TypeScript files directly",
    critical: true,
    category: "Build",
  },
  typescript: {
    purpose: "Type checking and compilation",
    critical: true,
    category: "Language",
  },
  vitest: {
    purpose: "Fast unit testing framework",
    critical: false,
    category: "Testing",
  },
};

// Read package.json
const packageJsonPath = path.join(process.cwd(), "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

console.log(`${colors.bright}📦 Package Inventory${colors.reset}`);
console.log("=".repeat(80));
console.log("");

// Function to display package section
function displayPackages(deps, title, isDev = false) {
  if (!deps || Object.keys(deps).length === 0) {
    return;
  }

  console.log(`${colors.bright}${colors.blue}${title}${colors.reset}`);
  console.log("-".repeat(80));

  const packages = Object.entries(deps).map(([name, version]) => {
    const info = packageInfo[name] || {
      purpose: "No description available",
      critical: false,
      category: "Other",
    };

    return {
      name,
      version,
      ...info,
    };
  });

  // Group by category
  const categories = {};
  packages.forEach(pkg => {
    if (!categories[pkg.category]) {
      categories[pkg.category] = [];
    }
    categories[pkg.category].push(pkg);
  });

  // Display by category
  Object.keys(categories)
    .sort()
    .forEach(category => {
      console.log(`\n  ${colors.cyan}${category}:${colors.reset}`);
      categories[category].forEach(pkg => {
        const criticalIcon = pkg.critical ? "✅" : "🟡";
        const nameDisplay = `${colors.bright}${pkg.name}${colors.reset}`;
        const versionDisplay = `${colors.green}${pkg.version}${colors.reset}`;
        console.log(`    ${criticalIcon} ${nameDisplay}@${versionDisplay}`);
        console.log(`       ${colors.yellow}→${colors.reset} ${pkg.purpose}`);
      });
    });

  console.log("");
}

// Display production dependencies
displayPackages(packageJson.dependencies, "🚀 Production Dependencies");

// Display dev dependencies
displayPackages(packageJson.devDependencies, "🛠️  Development Dependencies", true);

// Summary statistics
const totalProd = Object.keys(packageJson.dependencies || {}).length;
const totalDev = Object.keys(packageJson.devDependencies || {}).length;
const total = totalProd + totalDev;

const criticalProd = Object.keys(packageJson.dependencies || {}).filter(
  name => packageInfo[name]?.critical
).length;

const criticalDev = Object.keys(packageJson.devDependencies || {}).filter(
  name => packageInfo[name]?.critical
).length;

console.log(`${colors.bright}${colors.blue}📊 Summary${colors.reset}`);
console.log("-".repeat(80));
console.log(`Total packages: ${colors.bright}${total}${colors.reset}`);
console.log(`  Production: ${totalProd} (${criticalProd} critical)`);
console.log(`  Development: ${totalDev} (${criticalDev} critical)`);
console.log("");

// Check for updates
try {
  console.log(`${colors.bright}${colors.blue}🔍 Checking for updates...${colors.reset}`);
  execSync("npm outdated --json > /tmp/outdated.json 2>&1", { stdio: "ignore" });

  const outdated = JSON.parse(fs.readFileSync("/tmp/outdated.json", "utf8"));
  const outdatedCount = Object.keys(outdated).length;

  if (outdatedCount > 0) {
    console.log(
      `${colors.yellow}⚠️  ${outdatedCount} packages have updates available${colors.reset}`
    );
    console.log("   Run: npm outdated");
  } else {
    console.log(`${colors.green}✅ All packages are up to date${colors.reset}`);
  }

  fs.unlinkSync("/tmp/outdated.json");
} catch (err) {
  console.log(`${colors.green}✅ All packages are up to date${colors.reset}`);
}

console.log("");
console.log(`${colors.bright}💡 Tips:${colors.reset}`);
console.log("  • Update all: npm update --legacy-peer-deps");
console.log("  • Security check: npm audit");
console.log("  • Remove unused: npx depcheck");
console.log("  • Full docs: See DEPENDENCIES.md");
console.log("");
