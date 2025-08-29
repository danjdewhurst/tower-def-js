import { expect, test } from "bun:test";
import { Renderer } from "./Renderer";

// Mock canvas and context
const mockContext = {
  clearRect: () => {},
  strokeStyle: "",
  lineWidth: 0,
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  stroke: () => {},
  fillStyle: "",
  fillRect: () => {},
  fillText: () => {},
  arc: () => {},
  fill: () => {},
  save: () => {},
  restore: () => {},
  scale: () => {},
  translate: () => {},
  setLineDash: () => {},
} as any;

const mockCanvas = {
  getContext: () => mockContext,
  width: 800,
  height: 600,
} as any;

test("should create renderer", () => {
  const renderer = new Renderer(mockCanvas);
  expect(renderer).toBeDefined();
});

test("should throw error when canvas context unavailable", () => {
  const badCanvas = {
    getContext: () => null,
  } as any;

  expect(() => new Renderer(badCanvas)).toThrow("Could not get 2D context from canvas");
});

test("should convert grid to pixel coordinates", () => {
  const renderer = new Renderer(mockCanvas);

  const pixel = renderer.gridToPixel(5, 10);

  // Cell size is 30, so center should be at (5*30+15, 10*30+15) = (165, 315)
  expect(pixel.x).toBe(165);
  expect(pixel.y).toBe(315);
});

test("should convert pixel to grid coordinates", () => {
  const renderer = new Renderer(mockCanvas);

  const grid = renderer.pixelToGrid(165, 315);

  // Should convert back to grid coordinates
  expect(grid.x).toBe(5);
  expect(grid.y).toBe(10);
});

test("should convert pixel to grid with camera transform", () => {
  const renderer = new Renderer(mockCanvas);

  // Mock camera
  const mockCamera = {
    screenToWorldX: (x: number) => x + 100,
    screenToWorldY: (y: number) => y + 50,
  } as any;

  renderer.setCamera(mockCamera);

  const grid = renderer.pixelToGrid(30, 30);

  // Should use camera transform: (30+100, 30+50) = (130, 80) -> grid (4, 2)
  expect(grid.x).toBe(4);
  expect(grid.y).toBe(2);
});

test("should handle grid to pixel conversion for edge cases", () => {
  const renderer = new Renderer(mockCanvas);

  // Test (0,0)
  const origin = renderer.gridToPixel(0, 0);
  expect(origin.x).toBe(15); // cellSize/2
  expect(origin.y).toBe(15);

  // Test negative values (though shouldn't happen in normal game)
  const negative = renderer.gridToPixel(-1, -1);
  expect(negative.x).toBe(-15);
  expect(negative.y).toBe(-15);
});

test("should handle pixel to grid conversion for boundary values", () => {
  const renderer = new Renderer(mockCanvas);

  // Test boundary values
  const grid1 = renderer.pixelToGrid(29, 29); // Just before next cell
  expect(grid1.x).toBe(0);
  expect(grid1.y).toBe(0);

  const grid2 = renderer.pixelToGrid(30, 30); // Exactly at next cell boundary
  expect(grid2.x).toBe(1);
  expect(grid2.y).toBe(1);
});

test("should render without errors", () => {
  const renderer = new Renderer(mockCanvas);

  // All render methods should not throw
  expect(() => renderer.clear()).not.toThrow();
  expect(() => renderer.startWorldRender()).not.toThrow();
  expect(() => renderer.endWorldRender()).not.toThrow();
  expect(() => renderer.drawGrid()).not.toThrow();
  expect(() => renderer.drawTowers([])).not.toThrow();
  expect(() => renderer.drawEnemies([])).not.toThrow();
  expect(() => renderer.drawProjectiles([])).not.toThrow();
});

test("should get context", () => {
  const renderer = new Renderer(mockCanvas);

  expect(renderer.getContext()).toBe(mockContext);
});

test("should draw level with different cell types", () => {
  const renderer = new Renderer(mockCanvas);

  const testLevel = {
    grid: [
      ["path", "tower_slot", "spawn"],
      ["goal", "blocked", "tower_slot"],
    ],
  } as any;

  expect(() => renderer.drawLevel(testLevel)).not.toThrow();
});

test("should draw tower range", () => {
  const renderer = new Renderer(mockCanvas);

  const position = { x: 100, y: 100 };
  const range = 50;

  expect(() => renderer.drawTowerRange(position, range)).not.toThrow();
});

test("should draw entities without errors", () => {
  const renderer = new Renderer(mockCanvas);

  // Create proper mock entities using the actual classes
  const { Tower } = require("../entities/Tower");
  const { Enemy } = require("../entities/Enemy");
  const { Projectile } = require("../entities/Projectile");
  const { TowerType } = require("../types/Game");

  const tower = new Tower(100, 100, 5, 5, TowerType.BASIC);
  const enemy = new Enemy(150, 150, [{ x: 0, y: 0 }]);
  const projectile = new Projectile(200, 200, enemy, 50);

  expect(() => renderer.drawTowers([tower])).not.toThrow();
  expect(() => renderer.drawEnemies([enemy])).not.toThrow();
  expect(() => renderer.drawProjectiles([projectile])).not.toThrow();
});
