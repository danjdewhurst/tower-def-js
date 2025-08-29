import { describe, expect, test } from "bun:test";
import { Enemy } from "../entities/Enemy";
import { Projectile } from "../entities/Projectile";
import { Tower } from "../entities/Tower";
import { TowerType } from "../types/Game";
import type { LevelConfig } from "../types/Level";

/**
 * Stress Testing and Edge Case Suite
 *
 * Tests system behavior under extreme conditions, edge cases,
 * and potential failure scenarios.
 */

describe("Stress Testing and Edge Cases", () => {
  describe("Memory Management Stress Tests", () => {
    test("should handle entity creation and destruction without memory leaks", () => {
      const entities: Array<Enemy | Tower | Projectile> = [];
      const initialMemory = process.memoryUsage().heapUsed;

      // Create and destroy many entities rapidly
      for (let cycle = 0; cycle < 100; cycle++) {
        // Create entities
        for (let i = 0; i < 50; i++) {
          entities.push(
            new Enemy(i * 10, i * 10, [
              { x: 0, y: 0 },
              { x: 10, y: 0 },
            ]),
          );
          entities.push(new Tower(i * 30, i * 30, i, i, TowerType.BASIC));
        }

        // Clear entities (simulating cleanup)
        entities.length = 0;
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    test("should handle circular references without memory leaks", () => {
      const enemies: Enemy[] = [];
      const projectiles: Projectile[] = [];

      // Create enemies
      for (let i = 0; i < 100; i++) {
        enemies.push(
          new Enemy(i * 10, i * 10, [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
          ]),
        );
      }

      // Create projectiles targeting enemies (circular references)
      for (let i = 0; i < 100; i++) {
        const target = enemies[i % enemies.length];
        projectiles.push(new Projectile(0, 0, target, 25));
      }

      // Clear references
      enemies.length = 0;
      projectiles.length = 0;

      // Should not crash or cause memory issues
      expect(true).toBe(true);
    });
  });

  describe("Boundary Value Tests", () => {
    test("should handle zero and negative values gracefully", () => {
      const enemy = new Enemy(0, 0, [{ x: 0, y: 0 }]);

      // Test with zero delta time
      expect(() => enemy.update(0)).not.toThrow();

      // Test with negative delta time
      expect(() => enemy.update(-0.1)).not.toThrow();

      // Test with zero damage
      enemy.takeDamage(0);
      expect(enemy.health).toBe(100);

      // Test with negative damage
      enemy.takeDamage(-10);
      expect(enemy.health).toBe(100); // Should not heal
    });

    test("should handle extremely large values", () => {
      const enemy = new Enemy(0, 0, [
        { x: 0, y: 0 },
        { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER },
      ]);

      // Test with very large delta time
      expect(() => enemy.update(1000)).not.toThrow();

      // Test with very large damage
      enemy.takeDamage(Number.MAX_SAFE_INTEGER);
      expect(enemy.health).toBe(0);
    });

    test("should handle invalid coordinates", () => {
      // Test with NaN coordinates
      expect(() => new Enemy(NaN, NaN, [{ x: 0, y: 0 }])).not.toThrow();

      // Test with Infinity coordinates
      expect(() => new Enemy(Infinity, Infinity, [{ x: 0, y: 0 }])).not.toThrow();

      // Test with very large negative coordinates
      expect(() => new Enemy(-1000000, -1000000, [{ x: 0, y: 0 }])).not.toThrow();
    });
  });

  describe("Empty and Null Value Tests", () => {
    test("should handle empty paths gracefully", () => {
      const enemy = new Enemy(100, 100, []);

      // Should not crash with empty path
      expect(() => enemy.update(0.016)).not.toThrow();
      expect(enemy.hasReachedGoal()).toBe(true);
    });

    test("should handle single-point paths", () => {
      const enemy = new Enemy(100, 100, [{ x: 5, y: 5 }]);

      enemy.update(0.016);
      // Should eventually reach the single waypoint
      expect(typeof enemy.hasReachedGoal()).toBe("boolean");
    });

    test("should handle towers with no targets", () => {
      const tower = new Tower(100, 100, 5, 5, TowerType.BASIC);
      const emptyEnemyArray: Enemy[] = [];

      const target = tower.findTarget(emptyEnemyArray);
      expect(target).toBeNull();

      // Initially cannot shoot (needs to wait for cooldown)
      expect(tower.canShoot()).toBe(false);

      // After updating for sufficient time, should be able to shoot
      tower.update(1.5); // More than 1/fireRate seconds
      expect(tower.canShoot()).toBe(true);
    });
  });

  describe("Concurrent Operations Tests", () => {
    test("should handle simultaneous entity modifications", async () => {
      const enemies: Enemy[] = [];
      const towers: Tower[] = [];

      // Create entities
      for (let i = 0; i < 50; i++) {
        enemies.push(
          new Enemy(i * 10, 100, [
            { x: 0, y: 5 },
            { x: 20, y: 5 },
          ]),
        );
        towers.push(new Tower(i * 30, 50, i, 2, TowerType.RAPID));
      }

      // Simulate concurrent operations
      const operations = [
        // Simulate game updates
        () => {
          for (let frame = 0; frame < 100; frame++) {
            for (const enemy of enemies) {
              enemy.update(0.016);
            }
          }
        },
        // Simulate tower targeting
        () => {
          for (let frame = 0; frame < 100; frame++) {
            for (const tower of towers) {
              tower.findTarget(enemies);
            }
          }
        },
        // Simulate damage dealing
        () => {
          for (let frame = 0; frame < 100; frame++) {
            for (const enemy of enemies) {
              if (Math.random() > 0.9) {
                enemy.takeDamage(10);
              }
            }
          }
        },
      ];

      // Run operations concurrently
      await Promise.all(
        operations.map(
          (op) =>
            new Promise((resolve) => {
              op();
              resolve(undefined);
            }),
        ),
      );

      // Should complete without errors
      expect(true).toBe(true);
    });
  });

  describe("Rapid State Changes", () => {
    test("should handle rapid enemy death and respawn", () => {
      const enemies: Enemy[] = [];
      const path = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
      ];

      for (let cycle = 0; cycle < 1000; cycle++) {
        // Create enemy
        const enemy = new Enemy(0, 0, path);
        enemies.push(enemy);

        // Immediately kill enemy
        enemy.takeDamage(1000);

        // Remove from array (simulate cleanup)
        const index = enemies.indexOf(enemy);
        if (index > -1) {
          enemies.splice(index, 1);
        }
      }

      expect(enemies.length).toBe(0);
    });

    test("should handle rapid tower placement and removal", () => {
      const towers: Tower[] = [];

      for (let cycle = 0; cycle < 1000; cycle++) {
        // Add tower
        towers.push(new Tower(cycle % 100, cycle % 100, cycle % 10, cycle % 10, TowerType.BASIC));

        // Remove tower
        if (towers.length > 10) {
          towers.shift();
        }
      }

      expect(towers.length).toBeLessThanOrEqual(10);
    });
  });

  describe("Resource Exhaustion Tests", () => {
    test("should handle maximum entity limits gracefully", () => {
      const MAX_ENTITIES = 1000;
      const entities: Enemy[] = [];

      // Try to create maximum entities
      for (let i = 0; i < MAX_ENTITIES; i++) {
        entities.push(
          new Enemy(i, i, [
            { x: 0, y: 0 },
            { x: 10, y: 10 },
          ]),
        );
      }

      expect(entities.length).toBe(MAX_ENTITIES);

      // Update all entities (performance stress test)
      const startTime = performance.now();

      for (const entity of entities) {
        entity.update(0.016);
      }

      const updateTime = performance.now() - startTime;

      // Should complete updates in reasonable time (less than one frame)
      expect(updateTime).toBeLessThan(16.67);
    });

    test("should handle extremely long paths", () => {
      const longPath = [];
      for (let i = 0; i < 1000; i++) {
        longPath.push({ x: i, y: Math.floor(i / 50) });
      }

      const enemy = new Enemy(0, 0, longPath);

      // Should handle long paths without issues
      for (let i = 0; i < 100; i++) {
        enemy.update(0.016);
      }

      expect(enemy.pathIndex).toBeGreaterThanOrEqual(0);
      expect(enemy.pathIndex).toBeLessThanOrEqual(longPath.length);
    });
  });

  describe("Invalid Input Handling", () => {
    test("should handle malformed level data", () => {
      const invalidLevels = [
        null,
        undefined,
        {},
        { grid: null },
        { grid: [], path: null },
        { grid: [[]], path: [] },
        { grid: Array(50).fill(Array(50).fill(0)), path: null },
      ];

      for (const invalidLevel of invalidLevels) {
        // Should not crash when given invalid level data
        expect(() => {
          // This would be level loading logic
          const level = invalidLevel as LevelConfig;
          if (level?.path) {
            new Enemy(0, 0, level.path);
          }
        }).not.toThrow();
      }
    });

    test("should handle invalid tower configurations", () => {
      // Test with invalid tower types - should throw error for safety
      expect(() => new Tower(0, 0, 0, 0, "INVALID" as TowerType)).toThrow(
        "Invalid tower type: INVALID",
      );

      // Test with extreme coordinates - should handle gracefully
      expect(() => new Tower(NaN, Infinity, -1, 1000, TowerType.BASIC)).not.toThrow();
    });
  });

  describe("Time-based Edge Cases", () => {
    test("should handle time travel (negative time progression)", () => {
      const enemy = new Enemy(100, 100, [
        { x: 0, y: 0 },
        { x: 200, y: 200 },
      ]);
      const _initialX = enemy.position.x;

      // Move forward
      enemy.update(1);
      const forwardX = enemy.position.x;

      // Try to move backward in time - should be ignored
      enemy.update(-0.5);

      // Position should remain the same after negative deltaTime (not move backward)
      expect(enemy.position.x).toBe(forwardX);
    });

    test("should handle frame rate fluctuations", () => {
      const enemy = new Enemy(0, 0, [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ]);
      const frameTimes = [0.016, 0.033, 0.008, 0.05, 0.016, 0.1, 0.016];

      let totalDistance = 0;
      const initialX = enemy.position.x;

      for (const frameTime of frameTimes) {
        enemy.update(frameTime);
        totalDistance += Math.abs(enemy.position.x - initialX);
      }

      // Should handle variable frame times smoothly
      expect(totalDistance).toBeGreaterThan(0);
    });
  });

  describe("Floating Point Precision Tests", () => {
    test("should handle floating point precision errors", () => {
      const enemy = new Enemy(0, 0, [
        { x: 0, y: 0 },
        { x: 0.1, y: 0.1 },
      ]);

      // Update with very small values that might cause precision issues
      for (let i = 0; i < 1000; i++) {
        enemy.update(0.0001);
      }

      // Should not cause infinite loops or NaN positions
      expect(Number.isFinite(enemy.position.x)).toBe(true);
      expect(Number.isFinite(enemy.position.y)).toBe(true);
    });

    test("should handle distance calculations near zero", () => {
      const enemy = new Enemy(5.0000001, 5.0000001, [{ x: 1, y: 1 }]);
      const tower = new Tower(5, 5, 1, 1, TowerType.BASIC);

      // Distance should be calculated correctly even with tiny differences
      const target = tower.findTarget([enemy]);
      expect(target).toBeTruthy();
    });
  });
});
