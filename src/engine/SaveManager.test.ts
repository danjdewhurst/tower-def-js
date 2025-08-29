import { beforeEach, expect, test } from "bun:test";
import {
  isLevelUnlocked,
  loadProgress,
  markLevelComplete,
  setHighScore,
  setLastPlayedLevel,
} from "./SaveManager";

// Mock localStorage for testing
const localStorageMock = {
  data: {} as Record<string, string>,
  getItem: function (key: string) {
    return this.data[key] || null;
  },
  setItem: function (key: string, value: string) {
    this.data[key] = value;
  },
  removeItem: function (key: string) {
    delete this.data[key];
  },
  clear: function () {
    this.data = {};
  },
};

// Override global localStorage
global.localStorage = localStorageMock as any;

beforeEach(() => {
  localStorageMock.clear();
});

test("should load default progress when no save exists", () => {
  const progress = loadProgress();

  expect(progress.completedLevels).toEqual([]);
  expect(progress.highScores).toEqual({});
  expect(progress.lastPlayedLevel).toBeNull();
});

test("should load saved progress", () => {
  const testProgress = {
    completedLevels: ["level1", "level2"],
    highScores: { level1: 100, level2: 150 },
    lastPlayedLevel: "level2",
  };

  localStorageMock.setItem("towerDefenseProgress", JSON.stringify(testProgress));

  const loaded = loadProgress();
  expect(loaded).toEqual(testProgress);
});

test("should handle corrupted save data", () => {
  localStorageMock.setItem("towerDefenseProgress", "invalid json");

  const progress = loadProgress();

  // Should return default values
  expect(progress.completedLevels).toEqual([]);
  expect(progress.highScores).toEqual({});
  expect(progress.lastPlayedLevel).toBeNull();
});

test("should mark level as complete", () => {
  markLevelComplete("level1");

  const progress = loadProgress();
  expect(progress.completedLevels).toContain("level1");
});

test("should not duplicate completed levels", () => {
  markLevelComplete("level1");
  markLevelComplete("level1"); // Mark same level twice

  const progress = loadProgress();
  const level1Count = progress.completedLevels.filter((id) => id === "level1").length;
  expect(level1Count).toBe(1);
});

test("should set high score when better", () => {
  setHighScore("level1", 100);

  let progress = loadProgress();
  expect(progress.highScores.level1).toBe(100);

  setHighScore("level1", 150); // Better score
  progress = loadProgress();
  expect(progress.highScores.level1).toBe(150);
});

test("should not update high score when worse", () => {
  setHighScore("level1", 150);
  setHighScore("level1", 100); // Worse score

  const progress = loadProgress();
  expect(progress.highScores.level1).toBe(150);
});

test("should set last played level", () => {
  setLastPlayedLevel("level3");

  const progress = loadProgress();
  expect(progress.lastPlayedLevel).toBe("level3");
});

test("should update last played level", () => {
  setLastPlayedLevel("level1");
  setLastPlayedLevel("level2");

  const progress = loadProgress();
  expect(progress.lastPlayedLevel).toBe("level2");
});

test("first level should always be unlocked", () => {
  const allLevels = ["level1", "level2", "level3"];

  expect(isLevelUnlocked("level1", allLevels)).toBe(true);
});

test("later levels should be locked initially", () => {
  const allLevels = ["level1", "level2", "level3"];

  expect(isLevelUnlocked("level2", allLevels)).toBe(false);
  expect(isLevelUnlocked("level3", allLevels)).toBe(false);
});

test("should unlock next level after completing previous", () => {
  const allLevels = ["level1", "level2", "level3"];

  markLevelComplete("level1");

  expect(isLevelUnlocked("level2", allLevels)).toBe(true);
  expect(isLevelUnlocked("level3", allLevels)).toBe(false); // level3 still locked
});

test("should unlock multiple levels in sequence", () => {
  const allLevels = ["level1", "level2", "level3"];

  markLevelComplete("level1");
  markLevelComplete("level2");

  expect(isLevelUnlocked("level1", allLevels)).toBe(true);
  expect(isLevelUnlocked("level2", allLevels)).toBe(true);
  expect(isLevelUnlocked("level3", allLevels)).toBe(true);
});

test("should handle level not in list", () => {
  const allLevels = ["level1", "level2"];

  expect(isLevelUnlocked("nonexistent", allLevels)).toBe(false);
});

test("should handle localStorage save errors", () => {
  // Mock localStorage to throw error on setItem
  const originalSetItem = localStorageMock.setItem;
  localStorageMock.setItem = () => {
    throw new Error("Storage full");
  };

  // Should not throw when save fails
  expect(() => markLevelComplete("level1")).not.toThrow();

  // Restore
  localStorageMock.setItem = originalSetItem;
});
