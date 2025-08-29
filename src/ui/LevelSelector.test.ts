import { beforeEach, expect, test } from "bun:test";
import { CellType } from "../types/Game";
import type { LevelConfig } from "../types/Level";
import { LevelSelector } from "./LevelSelector";

// Mock DOM elements
const mockContainer = {
  innerHTML: "",
  style: { display: "block" },
} as any;

const mockDocument = {
  getElementById: () => ({
    addEventListener: () => {},
    style: { display: "block", opacity: "1", cursor: "pointer", borderColor: "#666" },
    textContent: "",
    disabled: false,
  }),
} as any;

global.document = mockDocument;

// Mock localStorage for SaveManager
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

global.localStorage = localStorageMock as any;

const testLevel: LevelConfig = {
  id: "test",
  name: "Test Level",
  difficulty: 3,
  startingMoney: 100,
  spawn: { x: 0, y: 0 },
  goal: { x: 2, y: 0 },
  grid: [
    [CellType.SPAWN, CellType.PATH, CellType.GOAL],
    [CellType.TOWER_SLOT, CellType.BLOCKED, CellType.TOWER_SLOT],
    [CellType.TOWER_SLOT, CellType.TOWER_SLOT, CellType.TOWER_SLOT],
  ],
  waves: [
    { id: 1, enemies: [{ count: 5, interval: 1000, enemyType: "basic" }] },
    { id: 2, enemies: [{ count: 8, interval: 800, enemyType: "basic" }] },
  ],
};

const mockOnLevelSelect = () => {};

let levelSelector: LevelSelector;

beforeEach(() => {
  localStorageMock.clear();
  mockContainer.innerHTML = "";
  levelSelector = new LevelSelector(mockContainer, mockOnLevelSelect);
});

test("should create level selector", () => {
  expect(levelSelector).toBeDefined();
});

test("should render level selector HTML", () => {
  expect(mockContainer.innerHTML).toContain("Tower Defense");
  expect(mockContainer.innerHTML).toContain("Select Level");
});

test("should show level selector", () => {
  levelSelector.hide();
  expect(mockContainer.style.display).toBe("none");

  levelSelector.show();
  expect(mockContainer.style.display).toBe("block");
});

test("should hide level selector", () => {
  levelSelector.show();
  expect(mockContainer.style.display).toBe("block");

  levelSelector.hide();
  expect(mockContainer.style.display).toBe("none");
});

test("should generate thumbnail HTML", () => {
  const thumbnail = levelSelector.generateThumbnail(testLevel);

  expect(thumbnail).toContain("position: absolute");
  expect(thumbnail).toContain("background: #FF4444"); // Spawn color
  expect(thumbnail).toContain("background: #44FF44"); // Goal color
});

test("should create level card HTML", () => {
  const cardHtml = levelSelector.createLevelCard(testLevel);

  expect(cardHtml).toContain("Test Level");
  expect(cardHtml).toContain("★★★☆☆"); // 3 difficulty stars
  expect(cardHtml).toContain("2 waves");
  expect(cardHtml).toContain(`level-${testLevel.id}`);
});

test("should show completed badge for completed levels", () => {
  // Mock completed level
  localStorageMock.setItem(
    "towerDefenseProgress",
    JSON.stringify({
      completedLevels: [testLevel.id],
      highScores: {},
      lastPlayedLevel: null,
    }),
  );

  const cardHtml = levelSelector.createLevelCard(testLevel);
  expect(cardHtml).toContain("✓"); // Completed badge
});

test("should show high score for levels with scores", () => {
  // Mock high score
  localStorageMock.setItem(
    "towerDefenseProgress",
    JSON.stringify({
      completedLevels: [],
      highScores: { [testLevel.id]: 250 },
      lastPlayedLevel: null,
    }),
  );

  const cardHtml = levelSelector.createLevelCard(testLevel);
  expect(cardHtml).toContain("Best: 250");
});

test("should handle thumbnail generation for different cell types", () => {
  const levelWithAllTypes: LevelConfig = {
    ...testLevel,
    grid: [[CellType.SPAWN, CellType.PATH, CellType.GOAL, CellType.TOWER_SLOT, CellType.BLOCKED]],
  };

  const thumbnail = levelSelector.generateThumbnail(levelWithAllTypes);

  expect(thumbnail).toContain("#FF4444"); // Spawn
  expect(thumbnail).toContain("#44FF44"); // Goal
  expect(thumbnail).toContain("#222"); // Blocked
});

test("should calculate thumbnail scale correctly", () => {
  const thumbnail = levelSelector.generateThumbnail(testLevel);

  // Scale should be 120 / GAME_CONFIG.gridSize = 120 / 50 = 2.4px per cell
  // The actual cells are rendered at 2.4px size regardless of our test grid size
  expect(thumbnail).toContain("width: 2.4px");
  expect(thumbnail).toContain("height: 2.4px");
});

test("should set up event listeners", () => {
  let eventListenerCalled = false;

  const mockDocument = {
    getElementById: () => ({
      addEventListener: () => {
        eventListenerCalled = true;
      },
    }),
  };

  const originalDocument = global.document;
  global.document = mockDocument as any;

  new LevelSelector(mockContainer, () => {});

  global.document = originalDocument;

  expect(eventListenerCalled).toBe(true);
});

test("should handle clicking on level cards", () => {
  let levelSelectCalled = false;
  let selectedLevel: LevelConfig | null = null;

  const onLevelSelectSpy = (level: LevelConfig) => {
    levelSelectCalled = true;
    selectedLevel = level;
  };

  // Mock getElementById to return actual DOM elements with event listeners
  const eventHandlers: Record<string, () => void> = {};

  const mockCard = {
    addEventListener: (event: string, handler: () => void) => {
      eventHandlers[event] = handler;
    },
  };

  const originalGetElementById = document.getElementById;
  document.getElementById = (id: string) => {
    if (id === "level-level1") {
      return mockCard as any;
    }
    return null;
  };

  // Create a new selector which will set up the event listeners
  new LevelSelector(mockContainer, onLevelSelectSpy);

  // Simulate clicking the level card by calling its event handler
  if (eventHandlers.click) {
    eventHandlers.click();
  }

  // Restore original getElementById
  document.getElementById = originalGetElementById;

  expect(levelSelectCalled).toBe(true);
  expect(selectedLevel).toBeDefined();
});

test("should handle null card element in event listener setup", () => {
  // Mock getElementById to return null for some cards
  const originalGetElementById = document.getElementById;
  document.getElementById = () => null;

  // Should not throw when card element is null
  expect(() => {
    new LevelSelector(mockContainer, () => {});
  }).not.toThrow();

  // Restore original getElementById
  document.getElementById = originalGetElementById;
});
