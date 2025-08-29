import { expect, test } from "bun:test";
import { Enemy } from "./Enemy";
import { Projectile } from "./Projectile";

test("should create projectile with correct values", () => {
  const testPath = [{ x: 0, y: 0 }];
  const target = new Enemy(200, 200, testPath);
  const projectile = new Projectile(100, 100, target, 50);

  expect(projectile.position.x).toBe(100);
  expect(projectile.position.y).toBe(100);
  expect(projectile.target).toBe(target);
  expect(projectile.damage).toBe(50);
  expect(projectile.speed).toBe(300);
  expect(projectile.hasHit).toBe(false);
  expect(projectile.shouldRemove()).toBe(false);
});

test("should move towards target", () => {
  const testPath = [{ x: 0, y: 0 }];
  const target = new Enemy(200, 100, testPath); // Same Y, 100 pixels to the right
  const projectile = new Projectile(100, 100, target, 50);

  const initialX = projectile.position.x;
  projectile.update(0.1); // 0.1 seconds

  // Should move towards target (right)
  expect(projectile.position.x).toBeGreaterThan(initialX);
  expect(projectile.position.y).toBe(100); // Y should stay same
});

test("should hit target when close enough", () => {
  const testPath = [{ x: 0, y: 0 }];
  const target = new Enemy(103, 100, testPath); // Very close to projectile
  const projectile = new Projectile(100, 100, target, 50);

  expect(target.health).toBe(100);
  expect(projectile.hasHit).toBe(false);

  projectile.update(0.1);

  expect(projectile.hasHit).toBe(true);
  expect(target.health).toBe(50); // Should take damage
});

test("should stop moving after hitting target", () => {
  const testPath = [{ x: 0, y: 0 }];
  const target = new Enemy(102, 100, testPath);
  const projectile = new Projectile(100, 100, target, 50);

  projectile.update(0.1); // Should hit
  expect(projectile.hasHit).toBe(true);

  const positionAfterHit = { ...projectile.position };
  projectile.update(0.1); // Update again

  // Position should not change after hit
  expect(projectile.position.x).toBe(positionAfterHit.x);
  expect(projectile.position.y).toBe(positionAfterHit.y);
});

test("should not move when target is dead", () => {
  const testPath = [{ x: 0, y: 0 }];
  const target = new Enemy(200, 100, testPath);
  target.takeDamage(100); // Kill target
  const projectile = new Projectile(100, 100, target, 50);

  const initialPosition = { ...projectile.position };
  projectile.update(0.1);

  // Should not move when target is dead
  expect(projectile.position.x).toBe(initialPosition.x);
  expect(projectile.position.y).toBe(initialPosition.y);
});

test("should be removed when target is dead", () => {
  const testPath = [{ x: 0, y: 0 }];
  const target = new Enemy(200, 100, testPath);
  target.takeDamage(100); // Kill target
  const projectile = new Projectile(100, 100, target, 50);

  expect(projectile.shouldRemove()).toBe(true);
});

test("should be removed after hitting", () => {
  const testPath = [{ x: 0, y: 0 }];
  const target = new Enemy(102, 100, testPath);
  const projectile = new Projectile(100, 100, target, 50);

  projectile.update(0.1); // Should hit
  expect(projectile.shouldRemove()).toBe(true);
});

test("should calculate movement speed correctly", () => {
  const testPath = [{ x: 0, y: 0 }];
  const target = new Enemy(400, 100, testPath); // 300 pixels away
  const projectile = new Projectile(100, 100, target, 50);

  projectile.update(1.0); // 1 second at 300 pixels/second

  // Should move exactly 300 pixels (reaching target)
  expect(Math.abs(projectile.position.x - 400)).toBeLessThan(5);
});

test("should handle projectile moving to same position as target", () => {
  const testPath = [{ x: 0, y: 0 }];
  const target = new Enemy(100, 100, testPath); // Same position as projectile
  const projectile = new Projectile(100, 100, target, 50);

  projectile.update(0.1);

  expect(projectile.hasHit).toBe(true);
  expect(target.health).toBe(50);
});
