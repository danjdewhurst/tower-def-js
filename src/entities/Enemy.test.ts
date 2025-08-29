import { expect, test } from "bun:test";
import type { GridPosition } from "../types/Game";
import { Enemy } from "./Enemy";

const testPath: GridPosition[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
];

test("should create enemy with initial values", () => {
  const enemy = new Enemy(15, 15, testPath);

  expect(enemy.position.x).toBe(15);
  expect(enemy.position.y).toBe(15);
  expect(enemy.health).toBe(100);
  expect(enemy.maxHealth).toBe(100);
  expect(enemy.speed).toBe(60);
  expect(enemy.reward).toBe(5);
  expect(enemy.pathIndex).toBe(0);
  expect(enemy.isAlive()).toBe(true);
  expect(enemy.hasReachedGoal()).toBe(false);
});

test("should move along path", () => {
  const enemy = new Enemy(0, 0, testPath); // Start away from path center
  const deltaTime = 1.0; // 1 second

  const initialX = enemy.position.x;
  enemy.update(deltaTime);

  // Should move towards first path point (0,0 -> 15,15 in pixels)
  expect(enemy.position.x).not.toBe(initialX);
});

test("should advance to next path point when close enough", () => {
  // Start enemy very close to first path point
  const enemy = new Enemy(16, 16, testPath); // Close to (15, 15) center of (0,0) grid cell

  expect(enemy.pathIndex).toBe(0);
  enemy.update(0.1);
  expect(enemy.pathIndex).toBe(1); // Should advance to next point
});

test("should take damage correctly", () => {
  const enemy = new Enemy(0, 0, testPath);

  expect(enemy.health).toBe(100);
  enemy.takeDamage(30);
  expect(enemy.health).toBe(70);
  expect(enemy.isAlive()).toBe(true);
});

test("should die when health reaches zero", () => {
  const enemy = new Enemy(0, 0, testPath);

  enemy.takeDamage(100);
  expect(enemy.health).toBe(0);
  expect(enemy.isAlive()).toBe(false);
});

test("should not go below zero health", () => {
  const enemy = new Enemy(0, 0, testPath);

  enemy.takeDamage(150); // More than max health
  expect(enemy.health).toBe(0);
  expect(enemy.isAlive()).toBe(false);
});

test("should reach goal when path is complete", () => {
  const enemy = new Enemy(0, 0, testPath);

  // Manually set path index to end
  enemy.pathIndex = testPath.length;
  expect(enemy.hasReachedGoal()).toBe(true);
});

test("should not update when dead", () => {
  const enemy = new Enemy(15, 15, testPath);
  enemy.takeDamage(100); // Kill enemy

  const initialX = enemy.position.x;
  enemy.update(1.0);

  // Position should not change
  expect(enemy.position.x).toBe(initialX);
});

test("should not update when reached goal", () => {
  const enemy = new Enemy(15, 15, testPath);
  enemy.pathIndex = testPath.length; // Set to end of path

  const initialX = enemy.position.x;
  enemy.update(1.0);

  // Position should not change
  expect(enemy.position.x).toBe(initialX);
});
