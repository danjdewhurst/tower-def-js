import { expect, test } from "bun:test";
import { getLevelById, levels } from "./index";
import { level1 } from "./level1";

test("should export all levels", () => {
  expect(levels).toBeDefined();
  expect(levels.length).toBe(11);
});

test("should contain level1 as first level", () => {
  expect(levels[0]).toBe(level1);
  expect(levels[0].id).toBe("level1");
});

test("should find level by id", () => {
  const foundLevel = getLevelById("level1");
  expect(foundLevel).toBe(level1);
  expect(foundLevel?.name).toBe("First Steps");
});

test("should return undefined for non-existent level", () => {
  const foundLevel = getLevelById("nonexistent");
  expect(foundLevel).toBeUndefined();
});

test("all levels should have required properties", () => {
  for (const level of levels) {
    expect(level.id).toBeDefined();
    expect(level.name).toBeDefined();
    expect(level.difficulty).toBeGreaterThan(0);
    expect(level.difficulty).toBeLessThanOrEqual(5);
    expect(level.startingMoney).toBeGreaterThan(0);
    expect(level.spawn).toBeDefined();
    expect(level.goal).toBeDefined();
    expect(level.grid).toBeDefined();
    expect(level.waves).toBeDefined();
    expect(level.waves.length).toBeGreaterThan(0);
  }
});

test("all levels should have valid grid dimensions", () => {
  for (const level of levels) {
    expect(level.grid.length).toBeGreaterThan(0);
    expect(level.grid[0].length).toBeGreaterThan(0);

    // All rows should have same length
    const firstRowLength = level.grid[0].length;
    for (const row of level.grid) {
      expect(row.length).toBe(firstRowLength);
    }
  }
});

test("all levels should have spawn and goal within grid", () => {
  for (const level of levels) {
    expect(level.spawn.x).toBeGreaterThanOrEqual(0);
    expect(level.spawn.y).toBeGreaterThanOrEqual(0);
    expect(level.spawn.x).toBeLessThan(level.grid[0].length);
    expect(level.spawn.y).toBeLessThan(level.grid.length);

    expect(level.goal.x).toBeGreaterThanOrEqual(0);
    expect(level.goal.y).toBeGreaterThanOrEqual(0);
    expect(level.goal.x).toBeLessThan(level.grid[0].length);
    expect(level.goal.y).toBeLessThan(level.grid.length);
  }
});

test("levels should have increasing difficulty", () => {
  // Check actual difficulty progression (levels 1-6 are original, 7-11 are new)
  const difficulties = levels.map((level) => level.difficulty);
  expect(difficulties).toEqual([1, 2, 3, 4, 5, 5, 2, 3, 3, 4, 5]);
});

test("levels should have unique ids", () => {
  const ids = levels.map((level) => level.id);
  const uniqueIds = new Set(ids);
  expect(uniqueIds.size).toBe(levels.length);
});
