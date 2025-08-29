# Automated Testing Pipeline for Tower Defense Game

## Overview

This document outlines the automated testing strategy and CI/CD pipeline recommendations for the tower defense game built with TypeScript, Canvas API, and Bun runtime.

## Testing Strategy Pyramid

```
                    🎯 Manual Testing
                 ━━━━━━━━━━━━━━━━━━━━━━━━
               🧪 End-to-End Tests (E2E)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      🔧 Integration Tests (API + Game Loop)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧱 Unit Tests (Entities, Components, Utils)
```

## Test Categories and Coverage

### 1. Unit Tests (Foundation Layer)
**Coverage Target: 85%+**

```bash
# Run all unit tests
bun test src/**/*.test.ts

# Run with coverage
bun test --coverage src/**/*.test.ts
```

**Current Coverage:**
- ✅ Entities (Enemy, Tower, Projectile, Entity)
- ✅ Engine Components (AudioManager, Camera, ParticleSystem, Renderer, SaveManager, TowerPlacement)
- ✅ Configuration (TowerConfig)
- ✅ UI Components (LevelSelector)
- ✅ Level Definitions

### 2. Integration Tests
**Coverage Target: 70%+**

```bash
# Run integration tests
bun test src/engine/Game.test.ts

# Run all integration tests
bun test src/**/*.integration.test.ts
```

**Current Coverage:**
- ✅ Game Loop Integration
- ✅ Entity System Integration
- ✅ Tower Placement Workflow
- ✅ Combat System Integration
- ✅ Wave Management Integration
- ✅ Resource Management Integration

### 3. Performance Tests
**Target: 60fps under normal load, 30fps under stress**

```bash
# Run performance tests
bun test ./src/testing/PerformanceTestSuite.ts
```

**Current Coverage:**
- ✅ Frame rate consistency testing
- ✅ Entity limit stress testing
- ✅ Collision detection performance
- ✅ Rendering performance
- ✅ Pathfinding efficiency

### 4. Stress Tests and Edge Cases
**Target: No crashes or memory leaks**

```bash
# Run stress tests
bun test ./src/testing/StressTestSuite.ts
```

**Current Coverage:**
- ✅ Memory management stress tests
- ✅ Boundary value testing
- ✅ Concurrent operations testing
- ✅ Rapid state changes
- ✅ Invalid input handling

### 5. UI/UX Tests
**Target: Cross-browser and responsive compatibility**

```bash
# Run UI tests
bun test ./src/testing/UITestSuite.ts
```

**Current Coverage:**
- ✅ Canvas-HTML integration
- ✅ Responsive design testing
- ✅ Accessibility testing
- ✅ Touch interface testing
- ✅ Performance UI testing

---

## CI/CD Pipeline Configuration

### GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install
    
    - name: Lint code
      run: bun run lint
    
    - name: Run unit tests
      run: bun test src/**/*.test.ts
    
    - name: Run integration tests
      run: bun test src/engine/Game.test.ts
    
    - name: Run performance tests
      run: bun test ./src/testing/PerformanceTestSuite.ts
    
    - name: Run stress tests
      run: bun test ./src/testing/StressTestSuite.ts
    
    - name: Run UI tests
      run: bun test ./src/testing/UITestSuite.ts
    
    - name: Generate test coverage
      run: bun test --coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
        fail_ci_if_error: true

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
    
    - name: Install dependencies
      run: bun install
    
    - name: Build application
      run: bun build index.ts --outdir ./dist
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-artifacts
        path: dist/

  e2e:
    name: End-to-End Tests
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
    
    - name: Install dependencies
      run: bun install
    
    - name: Install Playwright
      run: bun add -d playwright
    
    - name: Install Playwright browsers
      run: bunx playwright install
    
    - name: Start application
      run: |
        bun --hot ./index.ts &
        sleep 5
    
    - name: Run E2E tests
      run: bunx playwright test
    
    - name: Upload E2E artifacts
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/

  performance:
    name: Performance Benchmarks
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
    
    - name: Install dependencies
      run: bun install
    
    - name: Run performance benchmarks
      run: |
        bun --hot ./index.ts &
        sleep 5
        # Add performance testing tools like Lighthouse CI
        npm install -g @lhci/cli@0.12.x
        lhci autorun --upload.target=temporary-public-storage
```

---

## Local Development Testing

### Pre-commit Hooks

Using Husky (already configured in package.json):

```bash
# Install pre-commit hooks
bun run prepare

# Hooks run automatically on git commit
git add .
git commit -m "Add new feature"
```

**Pre-commit checks:**
- Lint code with Biome
- Format code
- Run unit tests
- Check TypeScript compilation
- Validate commit message format

### Development Test Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "bun test",
    "test:unit": "bun test src/**/*.test.ts",
    "test:integration": "bun test src/engine/Game.test.ts",
    "test:performance": "bun test ./src/testing/PerformanceTestSuite.ts",
    "test:stress": "bun test ./src/testing/StressTestSuite.ts",
    "test:ui": "bun test ./src/testing/UITestSuite.ts",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage",
    "test:all": "bun run test:unit && bun run test:integration && bun run test:performance && bun run test:stress && bun run test:ui"
  }
}
```

### Quick Test Commands

```bash
# Run all tests
bun run test:all

# Run tests in watch mode during development
bun run test:watch

# Run specific test suites
bun run test:unit
bun run test:performance
bun run test:stress

# Generate coverage report
bun run test:coverage

# Quick smoke test
bun test src/engine/Game.test.ts --timeout 5000
```

---

## Browser Testing with Playwright

### Setup E2E Tests

```bash
# Install Playwright
bun add -d playwright @playwright/test

# Generate Playwright config
bunx playwright install
```

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'bun --hot ./index.ts',
    port: 3000,
  },
});
```

### E2E Test Examples

Create `tests/e2e/gameplay.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Tower Defense Gameplay', () => {
  test('should complete level 1 successfully', async ({ page }) => {
    await page.goto('/');
    
    // Select level 1
    await page.click('[data-level="level-1"]');
    
    // Place a basic tower
    await page.click('[data-tower="basic"]');
    await page.click('canvas', { position: { x: 300, y: 200 } });
    
    // Start the wave
    await page.click('[data-action="start-wave"]');
    
    // Wait for wave completion
    await page.waitForSelector('[data-status="wave-complete"]', { timeout: 30000 });
    
    // Verify victory
    await expect(page.locator('[data-result="victory"]')).toBeVisible();
  });

  test('should handle mobile touch controls', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');
    
    await page.goto('/');
    await page.click('[data-level="level-1"]');
    
    // Test touch controls
    await page.tap('[data-tower="basic"]');
    await page.tap('canvas');
    
    // Test pinch-to-zoom
    await page.touchscreen.tap(400, 300);
    // Add pinch gesture simulation
  });
});
```

---

## Performance Monitoring

### Continuous Performance Tracking

```bash
# Add performance monitoring dependencies
bun add -d lighthouse puppeteer

# Create performance benchmark script
```

Create `scripts/performance-benchmark.ts`:

```typescript
import { launch } from 'puppeteer';
import lighthouse from 'lighthouse';

async function runPerformanceBenchmark() {
  const browser = await launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  
  try {
    const page = await browser.newPage();
    
    // Monitor performance metrics
    await page.goto('http://localhost:3000');
    await page.click('[data-level="level-1"]');
    
    // Measure game loop performance
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const frameTimes: number[] = [];
        let frameCount = 0;
        const maxFrames = 300; // 5 seconds at 60fps
        
        function measureFrame() {
          const start = performance.now();
          requestAnimationFrame(() => {
            const end = performance.now();
            frameTimes.push(end - start);
            frameCount++;
            
            if (frameCount < maxFrames) {
              measureFrame();
            } else {
              const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
              const fps = 1000 / avgFrameTime;
              resolve({ avgFrameTime, fps, frameDrops: frameTimes.filter(t => t > 20).length });
            }
          });
        }
        
        measureFrame();
      });
    });
    
    console.log('Performance Metrics:', metrics);
    
    // Fail if performance is poor
    if (metrics.fps < 45) {
      throw new Error(`Performance degradation: ${metrics.fps} fps`);
    }
    
  } finally {
    await browser.close();
  }
}

runPerformanceBenchmark().catch(console.error);
```

### Memory Leak Detection

```bash
# Add memory monitoring
bun add -d memwatch-next
```

Create `scripts/memory-monitor.ts`:

```typescript
import * as memwatch from 'memwatch-next';

// Monitor for memory leaks during testing
memwatch.on('leak', (info) => {
  console.error('Memory leak detected:', info);
  process.exit(1);
});

memwatch.on('stats', (stats) => {
  console.log('Memory stats:', stats);
});

// Export for use in tests
export const startMemoryMonitoring = () => {
  const hd = new memwatch.HeapDiff();
  
  return () => {
    const diff = hd.end();
    console.log('Memory diff:', diff);
    
    if (diff.change.size_bytes > 10 * 1024 * 1024) { // 10MB threshold
      throw new Error(`Memory leak detected: ${diff.change.size_bytes} bytes`);
    }
  };
};
```

---

## Quality Gates

### Definition of Done Checklist

Before merging any PR, ensure:

- [ ] All unit tests pass (85%+ coverage)
- [ ] Integration tests pass
- [ ] Performance tests meet 60fps target
- [ ] Stress tests pass without memory leaks
- [ ] UI tests pass for responsive design
- [ ] Code passes linting (Biome)
- [ ] Manual testing checklist completed
- [ ] No console errors in browser
- [ ] Cross-browser compatibility verified
- [ ] Mobile experience tested

### Automated Quality Checks

```yaml
# Branch protection rules on GitHub
- Require status checks to pass before merging
- Require up-to-date branches
- Require signed commits
- Restrict pushes to main branch
- Require pull request reviews

# Status checks required:
- ci/test-suite
- ci/build
- ci/e2e-tests  
- ci/performance-benchmarks
- ci/code-quality
```

---

## Test Environment Setup

### Development Environment

```bash
# Local development setup
git clone <repository>
cd tower-def-js
bun install
bun run test:all

# Start development server with hot reload
bun --hot ./index.ts
```

### CI Environment

```yaml
# Docker container for consistent CI environment
FROM oven/bun:1-alpine

WORKDIR /app
COPY package*.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run test:all
RUN bun run lint
RUN bun run build

EXPOSE 3000
CMD ["bun", "start"]
```

### Staging Environment

```bash
# Staging deployment with monitoring
- Deploy latest main branch
- Run full test suite against staging
- Performance monitoring enabled
- Error tracking (Sentry integration)
- Analytics for user behavior
```

---

## Monitoring and Alerting

### Performance Alerts

```typescript
// Add to monitoring config
const performanceThresholds = {
  averageFrameTime: 16.67, // 60fps
  maxFrameDrops: 5,
  memoryUsage: 100 * 1024 * 1024, // 100MB
  loadTime: 3000, // 3 seconds
};

// Alert conditions
- Frame rate drops below 45fps for 5+ seconds
- Memory usage exceeds 200MB
- Page load time exceeds 5 seconds
- Error rate exceeds 1%
```

### Test Result Notifications

```yaml
# Slack/Discord notifications
- Test failures in CI
- Performance regressions
- Coverage drops below threshold
- Security vulnerabilities detected
```

---

## Test Data Management

### Test Fixtures

```typescript
// Create test data factories
export const TestData = {
  createLevel: (overrides = {}) => ({
    id: 'test-level',
    name: 'Test Level',
    difficulty: 1,
    startingMoney: 200,
    grid: Array(50).fill(Array(50).fill(0)),
    path: [{ x: 0, y: 25 }, { x: 49, y: 25 }],
    waves: [{ enemies: 5, health: 100, speed: 60, reward: 5, spawnInterval: 1000 }],
    ...overrides,
  }),
  
  createEnemy: (overrides = {}) => ({
    position: { x: 0, y: 0 },
    health: 100,
    path: [{ x: 0, y: 0 }, { x: 10, y: 0 }],
    ...overrides,
  }),
};
```

### Database Seeding (if applicable)

```typescript
// For future backend integration
export const seedTestData = async () => {
  // Seed test levels
  // Seed user progress
  // Seed leaderboards
};
```

---

This comprehensive testing pipeline ensures high code quality, performance, and reliability for the tower defense game while supporting continuous integration and deployment practices.