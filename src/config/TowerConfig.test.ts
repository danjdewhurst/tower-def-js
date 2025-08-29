import { expect, test } from "bun:test";
import { TowerType } from "../types/Game";
import { TowerConfig } from "./TowerConfig";

test("should get tower stats", () => {
  const basicStats = TowerConfig.getStats(TowerType.BASIC);
  expect(basicStats.range).toBe(90);
  expect(basicStats.damage).toBe(50);
  expect(basicStats.fireRate).toBe(1);
  expect(basicStats.cost).toBe(50);
  expect(basicStats.color).toBe("#00FF00");
  expect(basicStats.displayName).toBe("Basic Tower");
  expect(basicStats.description).toBe("Balanced damage and range tower");
});

test("should return copy of stats to prevent mutation", () => {
  const stats1 = TowerConfig.getStats(TowerType.BASIC);
  const stats2 = TowerConfig.getStats(TowerType.BASIC);
  expect(stats1).not.toBe(stats2);
  expect(stats1).toEqual(stats2);
});

test("should throw error for invalid tower type", () => {
  expect(() => TowerConfig.getStats("invalid" as TowerType)).toThrow("Invalid tower type: invalid");
});

test("should get tower range", () => {
  expect(TowerConfig.getRange(TowerType.BASIC)).toBe(90);
  expect(TowerConfig.getRange(TowerType.SNIPER)).toBe(180);
  expect(TowerConfig.getRange(TowerType.RAPID)).toBe(60);
});

test("should get tower damage", () => {
  expect(TowerConfig.getDamage(TowerType.BASIC)).toBe(50);
  expect(TowerConfig.getDamage(TowerType.SNIPER)).toBe(100);
  expect(TowerConfig.getDamage(TowerType.RAPID)).toBe(25);
});

test("should get tower fire rate", () => {
  expect(TowerConfig.getFireRate(TowerType.BASIC)).toBe(1);
  expect(TowerConfig.getFireRate(TowerType.SNIPER)).toBe(0.5);
  expect(TowerConfig.getFireRate(TowerType.RAPID)).toBe(3);
});

test("should get tower cost", () => {
  expect(TowerConfig.getCost(TowerType.BASIC)).toBe(50);
  expect(TowerConfig.getCost(TowerType.SNIPER)).toBe(100);
  expect(TowerConfig.getCost(TowerType.RAPID)).toBe(75);
});

test("should get tower color", () => {
  expect(TowerConfig.getColor(TowerType.BASIC)).toBe("#00FF00");
  expect(TowerConfig.getColor(TowerType.SNIPER)).toBe("#0080FF");
  expect(TowerConfig.getColor(TowerType.RAPID)).toBe("#FF8000");
});

test("should get tower display name", () => {
  expect(TowerConfig.getDisplayName(TowerType.BASIC)).toBe("Basic Tower");
  expect(TowerConfig.getDisplayName(TowerType.SNIPER)).toBe("Sniper Tower");
  expect(TowerConfig.getDisplayName(TowerType.RAPID)).toBe("Rapid Fire Tower");
});

test("should get tower description", () => {
  expect(TowerConfig.getDescription(TowerType.BASIC)).toBe("Balanced damage and range tower");
  expect(TowerConfig.getDescription(TowerType.SNIPER)).toBe(
    "Long range, high damage, slow firing tower",
  );
  expect(TowerConfig.getDescription(TowerType.RAPID)).toBe(
    "Short range, low damage, fast firing tower",
  );
});

test("should get all tower types", () => {
  const types = TowerConfig.getAllTowerTypes();
  expect(types).toContain(TowerType.BASIC);
  expect(types).toContain(TowerType.SNIPER);
  expect(types).toContain(TowerType.RAPID);
  expect(types.length).toBe(3);
});

test("should validate tower type", () => {
  expect(TowerConfig.isValidTowerType(TowerType.BASIC)).toBe(true);
  expect(TowerConfig.isValidTowerType(TowerType.SNIPER)).toBe(true);
  expect(TowerConfig.isValidTowerType(TowerType.RAPID)).toBe(true);
  expect(TowerConfig.isValidTowerType("invalid")).toBe(false);
});
