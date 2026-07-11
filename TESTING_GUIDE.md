# Testing Guide

This guide covers the testing infrastructure for the Shiritori Game monorepo.

## 📋 Table of Contents

- [Test Setup](#test-setup)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## 🧪 Test Setup

### Kawaii Shiritori

The `kawaii-shiritori` project uses **Vitest** as the test runner with the following setup:

**Test Framework:**
- Vitest with jsdom environment
- React Testing Library
- Jest DOM matchers

**Configuration:**
- `vitest.config.ts` - Main test configuration
- `src/test/setup.ts` - Test setup with localStorage/sessionStorage mocks

### Current Test Coverage

Located in `kawaii-shiritori/src/lib/__tests__/`:
- ✅ `wordValidator.test.ts` - Word validation logic (21 tests)
- ✅ `japaneseConverter.test.ts` - Japanese character conversion (37 tests)
- ✅ `dictionaryHelper.test.ts` - Dictionary utilities (16 tests)
- ✅ `leaderboard.test.ts` - Leaderboard functionality (7 tests)

**Total: 81 tests passing** ✅

## 🚀 Running Tests

### Run All Tests

```bash
# From root
npm test

# From kawaii-shiritori
npm run test
```

### Watch Mode

```bash
npm run test:watch
```

### With UI

```bash
npm run test:ui
```

### Coverage Report

```bash
npm run test:coverage
```

### JUnit Output (for CI/CD)

```bash
npm run test:junit
```

This generates `test-results/junit.xml` for CI/CD pipelines.

## 📊 Test Coverage

Current coverage focuses on core business logic:

| Module | Coverage | Description |
|--------|----------|-------------|
| Word Validator | ✅ High | Japanese word validation, shiritori rules |
| Japanese Converter | ✅ High | Hiragana/Katakana/Romaji conversion |
| Dictionary Helper | ✅ High | Dictionary lookup and caching |
| Leaderboard | ✅ High | Score tracking and rankings |
| Components | ⚠️ Low | UI components (future improvement) |

### Generating Coverage Reports

```bash
npm run test:coverage
```

This creates an HTML report in `coverage/` directory.

## ✍️ Writing Tests

### Test File Structure

```typescript
import { describe, it, expect, beforeEach } from "vitest";

describe("ComponentName", () => {
  describe("methodName", () => {
    it("should do something specific", () => {
      // Arrange
      const input = "test";
      
      // Act
      const result = someFunction(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Testing with localStorage

localStorage is mocked in `src/test/setup.ts`:

```typescript
it("should save to localStorage", () => {
  localStorage.setItem("key", "value");
  expect(localStorage.getItem("key")).toBe("value");
});
```

### Testing React Components

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  it("should render correctly", () => {
    render(<ComponentName prop="value" />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
  
  it("should handle click events", () => {
    const handleClick = vi.fn();
    render(<ComponentName onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Async Testing

```typescript
it("should handle async operations", async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

## 🔄 CI/CD Integration

### GitHub Actions

Tests are automatically run on:
- Pull requests
- Pushes to main/develop branches
- Manual workflow dispatch

### JUnit Reports

The `test:junit` script generates XML reports for CI systems:

```yaml
- name: Run Tests
  run: npm run test:junit
  
- name: Publish Test Results
  uses: EnricoMi/publish-unit-test-result-action@v2
  if: always()
  with:
    files: '**/test-results/junit.xml'
```

## 🐛 Troubleshooting

### localStorage Errors

**Issue:** `localStorage.setItem is not a function`

**Solution:** Ensure test setup file is loaded:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

### Import Errors

**Issue:** Cannot find module

**Solution:** Check path aliases in vitest config:
```typescript
resolve: {
  alias: {
    "@": resolve(__dirname, "./src"),
  },
}
```

### Firebase Mocking

**Issue:** Firebase initialization errors in tests

**Solution:** Mock Firebase modules:
```typescript
vi.mock("./lib/firebase", () => ({
  auth: { currentUser: null },
  database: vi.fn(),
}));
```

## 📈 Future Test Improvements

### Priority 1 - Component Tests
- [ ] Add tests for core game components
- [ ] Test routing logic in App.tsx
- [ ] Test game room interactions

### Priority 2 - Integration Tests
- [ ] Multi-player game flow
- [ ] Firebase integration tests
- [ ] End-to-end game scenarios

### Priority 3 - Performance Tests
- [ ] Load testing for dictionary lookups
- [ ] Performance benchmarks

## 🎯 Best Practices

1. **Test Behavior, Not Implementation** - Focus on what the code does, not how
2. **Use Descriptive Test Names** - Clear what is being tested
3. **Arrange-Act-Assert Pattern** - Structure tests consistently
4. **Mock External Dependencies** - Keep tests isolated and fast
5. **Test Edge Cases** - Include error conditions and boundary values
6. **Keep Tests Fast** - Fast tests = more frequent runs
7. **One Assertion Per Test** - Makes failures easier to diagnose

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

For more information, see:
- [CI/CD Pipeline](./CI_CD_PIPELINE.md)
- [Project README](./README.md)
