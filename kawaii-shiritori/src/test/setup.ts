import { expect, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Mock localStorage and sessionStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

beforeAll(() => {
  global.localStorage = localStorageMock as Storage;
  global.sessionStorage = localStorageMock as Storage;
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorageMock.clear();
});
