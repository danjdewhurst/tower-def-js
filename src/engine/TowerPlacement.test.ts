import { expect, test } from "bun:test";
import { Tower } from "../entities/Tower";
import { CellType, TowerType } from "../types/Game";
import type { LevelConfig } from "../types/Level";
import { TowerPlacement } from "./TowerPlacement";

// Simple test level
const testLevel: LevelConfig = {
  id: "test",
  name: "Test Level",
  difficulty: 1,
  startingMoney: 200,
  spawn: { x: 0, y: 0 },
  goal: { x: 4, y: 0 },
  grid: [
    [CellType.SPAWN, CellType.PATH, CellType.PATH, CellType.PATH, CellType.GOAL],
    [
      CellType.TOWER_SLOT,
      CellType.BLOCKED,
      CellType.BLOCKED,
      CellType.BLOCKED,
      CellType.TOWER_SLOT,
    ],
    [
      CellType.TOWER_SLOT,
      CellType.BLOCKED,
      CellType.BLOCKED,
      CellType.BLOCKED,
      CellType.TOWER_SLOT,
    ],
    [
      CellType.TOWER_SLOT,
      CellType.BLOCKED,
      CellType.BLOCKED,
      CellType.BLOCKED,
      CellType.TOWER_SLOT,
    ],
    [
      CellType.TOWER_SLOT,
      CellType.TOWER_SLOT,
      CellType.TOWER_SLOT,
      CellType.TOWER_SLOT,
      CellType.TOWER_SLOT,
    ],
  ],
  waves: [
    {
      enemies: [{ type: "basic", count: 5, interval: 1000 }],
    },
  ],
};

test("should allow placing tower on empty tower slot", () => {
  const towers: Tower[] = [];
  const money = 200;
  const towerType = TowerType.BASIC;

  const canPlace = TowerPlacement.canPlaceTower(0, 1, testLevel, towers, money, towerType);
  expect(canPlace).toBe(true);
});

test("should not allow placing tower on path", () => {
  const towers: Tower[] = [];
  const money = 200;
  const towerType = TowerType.BASIC;

  const canPlace = TowerPlacement.canPlaceTower(1, 0, testLevel, towers, money, towerType);
  expect(canPlace).toBe(false);
});

test("should not allow placing tower on spawn", () => {
  const towers: Tower[] = [];
  const money = 200;
  const towerType = TowerType.BASIC;

  const canPlace = TowerPlacement.canPlaceTower(0, 0, testLevel, towers, money, towerType);
  expect(canPlace).toBe(false);
});

test("should not allow placing tower on goal", () => {
  const towers: Tower[] = [];
  const money = 200;
  const towerType = TowerType.BASIC;

  const canPlace = TowerPlacement.canPlaceTower(4, 0, testLevel, towers, money, towerType);
  expect(canPlace).toBe(false);
});

test("should not allow placing tower when insufficient money", () => {
  const towers: Tower[] = [];
  const money = 25; // Less than basic tower cost of $50
  const towerType = TowerType.BASIC;

  const canPlace = TowerPlacement.canPlaceTower(0, 1, testLevel, towers, money, towerType);
  expect(canPlace).toBe(false);
});

test("should not allow placing tower on top of existing tower", () => {
  const gridX = 0;
  const gridY = 1;
  const money = 200;
  const towerType = TowerType.BASIC;

  // Create existing tower at the target position
  const existingTower = new Tower(30, 45, gridX, gridY, towerType); // pixel coords don't matter for this test
  const towers: Tower[] = [existingTower];

  const canPlace = TowerPlacement.canPlaceTower(gridX, gridY, testLevel, towers, money, towerType);
  expect(canPlace).toBe(false);
});

test("should allow placing multiple towers at different locations", () => {
  const money = 200;
  const towerType = TowerType.BASIC;

  // Create tower at (0, 1)
  const tower1 = new Tower(30, 45, 0, 1, towerType);
  const towers: Tower[] = [tower1];

  // Should be able to place another tower at (4, 1)
  const canPlace = TowerPlacement.canPlaceTower(4, 1, testLevel, towers, money, towerType);
  expect(canPlace).toBe(true);
});

test("getTowerCost returns correct costs", () => {
  expect(TowerPlacement.getTowerCost(TowerType.BASIC)).toBe(50);
  expect(TowerPlacement.getTowerCost(TowerType.SNIPER)).toBe(100);
  expect(TowerPlacement.getTowerCost(TowerType.RAPID)).toBe(75);
});

test("getTowerCost handles invalid tower type", () => {
  // Test that invalid type throws error
  const invalidType = "invalid" as TowerType;
  expect(() => TowerPlacement.getTowerCost(invalidType)).toThrow("Invalid tower type: invalid");
});

test("should not allow placing tower outside grid bounds", () => {
  const towers: Tower[] = [];
  const money = 200;
  const towerType = TowerType.BASIC;

  // Test negative coordinates
  expect(TowerPlacement.canPlaceTower(-1, 0, testLevel, towers, money, towerType)).toBe(false);
  expect(TowerPlacement.canPlaceTower(0, -1, testLevel, towers, money, towerType)).toBe(false);

  // Test coordinates beyond grid size (assuming grid size is 50)
  expect(TowerPlacement.canPlaceTower(50, 0, testLevel, towers, money, towerType)).toBe(false);
  expect(TowerPlacement.canPlaceTower(0, 50, testLevel, towers, money, towerType)).toBe(false);
});
