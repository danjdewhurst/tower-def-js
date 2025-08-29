import { describe, expect, test } from "bun:test";

/**
 * Performance Testing Suite for Tower Defense Game
 *
 * Tests frame rate consistency, memory usage, and performance under stress conditions.
 * Target: Maintain 60fps (16.67ms per frame) even with many entities on screen.
 */

interface PerformanceMetrics {
  frameTimes: number[];
  averageFrameTime: number;
  worstFrameTime: number;
  frameDrops: number;
  memoryUsage?: number;
}

class PerformanceProfiler {
  private metrics: PerformanceMetrics = {
    frameTimes: [],
    averageFrameTime: 0,
    worstFrameTime: 0,
    frameDrops: 0,
  };

  startFrame(): number {
    return performance.now();
  }

  endFrame(startTime: number): void {
    const frameTime = performance.now() - startTime;
    this.metrics.frameTimes.push(frameTime);

    // Count frame drops (anything over 20ms is considered a drop for 60fps)
    if (frameTime > 20) {
      this.metrics.frameDrops++;
    }
  }

  getMetrics(): PerformanceMetrics {
    const frameTimes = this.metrics.frameTimes;

    if (frameTimes.length === 0) {
      return this.metrics;
    }

    this.metrics.averageFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    this.metrics.worstFrameTime = Math.max(...frameTimes);

    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      frameTimes: [],
      averageFrameTime: 0,
      worstFrameTime: 0,
      frameDrops: 0,
    };
  }
}

// Mock entity classes for performance testing
class MockEnemy {
  position = { x: 0, y: 0 };
  health = 100;
  speed = 60;

  update(deltaTime: number): void {
    // Simulate enemy movement calculations
    this.position.x += this.speed * deltaTime;
    this.position.y += Math.sin(this.position.x * 0.01) * 10;
  }
}

class MockTower {
  position = { x: 0, y: 0 };
  range = 90;
  lastShotTime = 0;

  update(deltaTime: number): void {
    this.lastShotTime += deltaTime;
  }

  findTarget(enemies: MockEnemy[]): MockEnemy | null {
    // Simulate expensive distance calculations
    let closest: MockEnemy | null = null;
    let minDistance = Infinity;

    for (const enemy of enemies) {
      const dx = enemy.position.x - this.position.x;
      const dy = enemy.position.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= this.range && distance < minDistance) {
        minDistance = distance;
        closest = enemy;
      }
    }

    return closest;
  }
}

class MockProjectile {
  position = { x: 0, y: 0 };
  target: MockEnemy;
  speed = 300;

  constructor(x: number, y: number, target: MockEnemy) {
    this.position.x = x;
    this.position.y = y;
    this.target = target;
  }

  update(deltaTime: number): void {
    const dx = this.target.position.x - this.position.x;
    const dy = this.target.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      const ratio = (this.speed * deltaTime) / distance;
      this.position.x += dx * ratio;
      this.position.y += dy * ratio;
    }
  }
}

describe("Performance Testing Suite", () => {
  const _TARGET_FPS = 60;
  const _MAX_FRAME_TIME = 16.67; // 60fps target
  const ACCEPTABLE_FRAME_TIME = 20; // Allows for some variance
  const profiler = new PerformanceProfiler();

  test("should maintain 60fps with moderate entity count", () => {
    const enemies: MockEnemy[] = [];
    const towers: MockTower[] = [];
    const projectiles: MockProjectile[] = [];

    // Create moderate number of entities (typical mid-game scenario)
    for (let i = 0; i < 20; i++) {
      enemies.push(new MockEnemy());
    }

    for (let i = 0; i < 10; i++) {
      towers.push(new MockTower());
    }

    for (let i = 0; i < 15; i++) {
      projectiles.push(new MockProjectile(0, 0, enemies[0]));
    }

    // Simulate 120 frames (2 seconds at 60fps)
    for (let frame = 0; frame < 120; frame++) {
      const startTime = profiler.startFrame();

      // Simulate game update loop
      const deltaTime = 1 / 60; // 60fps

      for (const enemy of enemies) {
        enemy.update(deltaTime);
      }

      for (const tower of towers) {
        tower.update(deltaTime);
        tower.findTarget(enemies); // Expensive operation
      }

      for (const projectile of projectiles) {
        projectile.update(deltaTime);
      }

      profiler.endFrame(startTime);
    }

    const metrics = profiler.getMetrics();

    expect(metrics.averageFrameTime).toBeLessThan(ACCEPTABLE_FRAME_TIME);
    expect(metrics.frameDrops).toBeLessThan(5); // Allow a few frame drops

    profiler.reset();
  });

  test("should handle stress conditions with many entities", () => {
    const enemies: MockEnemy[] = [];
    const towers: MockTower[] = [];
    const projectiles: MockProjectile[] = [];

    // Create stress-test scenario
    for (let i = 0; i < 100; i++) {
      enemies.push(new MockEnemy());
    }

    for (let i = 0; i < 25; i++) {
      towers.push(new MockTower());
    }

    for (let i = 0; i < 50; i++) {
      projectiles.push(new MockProjectile(0, 0, enemies[i % enemies.length]));
    }

    // Simulate 60 frames (1 second)
    for (let frame = 0; frame < 60; frame++) {
      const startTime = profiler.startFrame();

      const deltaTime = 1 / 60;

      for (const enemy of enemies) {
        enemy.update(deltaTime);
      }

      for (const tower of towers) {
        tower.update(deltaTime);
        tower.findTarget(enemies);
      }

      for (const projectile of projectiles) {
        projectile.update(deltaTime);
      }

      profiler.endFrame(startTime);
    }

    const metrics = profiler.getMetrics();

    // Under stress, we allow more frame time but still expect reasonable performance
    expect(metrics.averageFrameTime).toBeLessThan(33); // Allow 30fps average under stress
    expect(metrics.frameDrops).toBeLessThan(30); // More lenient under stress

    profiler.reset();
  });

  test("should maintain consistent frame times", () => {
    const enemies: MockEnemy[] = [];
    for (let i = 0; i < 30; i++) {
      enemies.push(new MockEnemy());
    }

    const frameTimes: number[] = [];

    for (let frame = 0; frame < 100; frame++) {
      const startTime = performance.now();

      // Simulate consistent workload
      for (const enemy of enemies) {
        enemy.update(1 / 60);
      }

      const frameTime = performance.now() - startTime;
      frameTimes.push(frameTime);
    }

    // Calculate frame time variance
    const average = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const variance =
      frameTimes.reduce((sum, time) => sum + (time - average) ** 2, 0) / frameTimes.length;
    const standardDeviation = Math.sqrt(variance);

    // Frame times should be consistent (low variance)
    expect(standardDeviation).toBeLessThan(5); // Less than 5ms variance
  });

  test("should efficiently handle collision detection", () => {
    const projectiles: MockProjectile[] = [];
    const enemies: MockEnemy[] = [];

    // Create many projectiles and enemies for collision testing
    for (let i = 0; i < 50; i++) {
      enemies.push(new MockEnemy());
      enemies[i].position.x = i * 10;
      enemies[i].position.y = i * 10;
    }

    for (let i = 0; i < 30; i++) {
      projectiles.push(new MockProjectile(0, 0, enemies[i % enemies.length]));
    }

    const startTime = performance.now();

    // Simulate collision detection loop
    for (let frame = 0; frame < 60; frame++) {
      for (const projectile of projectiles) {
        for (const enemy of enemies) {
          const dx = projectile.position.x - enemy.position.x;
          const dy = projectile.position.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 5) {
            // Collision detected
          }
        }
      }
    }

    const totalTime = performance.now() - startTime;
    const averageFrameTime = totalTime / 60;

    expect(averageFrameTime).toBeLessThan(ACCEPTABLE_FRAME_TIME);
  });

  test("should efficiently render many entities", () => {
    // Mock canvas context for render performance testing
    const mockContext = {
      fillRect: () => {},
      strokeRect: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      beginPath: () => {},
      closePath: () => {},
    };

    const entities = 200;

    const startTime = performance.now();

    // Simulate rendering loop
    for (let frame = 0; frame < 60; frame++) {
      for (let i = 0; i < entities; i++) {
        // Simulate entity rendering
        mockContext.beginPath();
        mockContext.arc();
        mockContext.fill();
      }
    }

    const totalTime = performance.now() - startTime;
    const averageFrameTime = totalTime / 60;

    expect(averageFrameTime).toBeLessThan(ACCEPTABLE_FRAME_TIME);
  });

  test("should handle pathfinding efficiently", () => {
    const enemies: MockEnemy[] = [];
    const path = [
      { x: 0, y: 25 },
      { x: 10, y: 25 },
      { x: 20, y: 15 },
      { x: 30, y: 15 },
      { x: 40, y: 25 },
      { x: 49, y: 25 },
    ];

    for (let i = 0; i < 50; i++) {
      enemies.push(new MockEnemy());
    }

    const startTime = performance.now();

    // Simulate pathfinding calculations
    for (let frame = 0; frame < 60; frame++) {
      for (const enemy of enemies) {
        // Simulate path following calculations
        for (const waypoint of path) {
          const dx = waypoint.x * 30 - enemy.position.x;
          const dy = waypoint.y * 30 - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 5) {
            // Reached waypoint
            break;
          }
        }
      }
    }

    const totalTime = performance.now() - startTime;
    const averageFrameTime = totalTime / 60;

    expect(averageFrameTime).toBeLessThan(ACCEPTABLE_FRAME_TIME);
  });
});

export { PerformanceProfiler, type PerformanceMetrics };
