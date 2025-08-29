import { beforeEach, expect, test } from "bun:test";
import { Camera } from "./Camera";

// Mock canvas and window for testing
const mockCanvas = {
  addEventListener: () => {},
  style: {},
  width: 800,
  height: 600,
  parentElement: { style: {} },
  getBoundingClientRect: () => ({ left: 0, top: 0 }),
} as any;

global.window = {
  addEventListener: () => {},
  innerWidth: 1024,
  innerHeight: 768,
} as any;

let camera: Camera;

beforeEach(() => {
  camera = new Camera(mockCanvas);
});

test("should create camera with default values", () => {
  expect(camera.x).toBeDefined();
  expect(camera.y).toBeDefined();
  expect(camera.zoom).toBeGreaterThan(0);
  expect(camera.viewport).toBeDefined();
});

test("should convert screen to world coordinates", () => {
  camera.x = 100;
  camera.y = 50;
  camera.zoom = 2;

  const worldX = camera.screenToWorldX(200);
  const worldY = camera.screenToWorldY(100);

  // worldX = x + screenX/zoom = 100 + 200/2 = 200
  // worldY = y + screenY/zoom = 50 + 100/2 = 100
  expect(worldX).toBe(200);
  expect(worldY).toBe(100);
});

test("should convert world to screen coordinates", () => {
  camera.x = 100;
  camera.y = 50;
  camera.zoom = 2;

  const screenX = camera.worldToScreenX(200);
  const screenY = camera.worldToScreenY(100);

  // screenX = (worldX - x) * zoom = (200 - 100) * 2 = 200
  // screenY = (worldY - y) * zoom = (100 - 50) * 2 = 100
  expect(screenX).toBe(200);
  expect(screenY).toBe(100);
});

test("should center on game", () => {
  camera.centerOnGame();

  // Should set position to center the game
  expect(camera.x).toBeDefined();
  expect(camera.y).toBeDefined();
  expect(camera.zoom).toBeGreaterThan(0);
  expect(camera.zoom).toBeLessThanOrEqual(1);
});

test("should update viewport", () => {
  const _initialWidth = camera.viewport.width;
  const _initialHeight = camera.viewport.height;

  camera.updateViewport();

  // Should update based on window size
  expect(camera.viewport.width).toBe(1024); // window.innerWidth
  expect(camera.viewport.height).toBe(708); // window.innerHeight - 60 (HUD height)
});

test("should get world mouse position", () => {
  const mockEvent = {
    clientX: 250,
    clientY: 150,
  } as MouseEvent;

  camera.x = 0;
  camera.y = 0;
  camera.zoom = 1;

  const worldPos = camera.getWorldMousePosition(mockEvent);

  expect(worldPos.x).toBe(250);
  expect(worldPos.y).toBe(150);
});

test("should constrain camera position", () => {
  // Set camera far outside bounds
  camera.x = -1000;
  camera.y = -1000;
  camera.zoom = 1;

  camera.constrainCamera();

  // Should be constrained to allowed area
  expect(camera.x).toBeGreaterThan(-500); // Should not be too far negative
  expect(camera.y).toBeGreaterThan(-500);
});

test("should handle zoom correctly", () => {
  camera.zoom = 0.5;

  const worldX = camera.screenToWorldX(100);
  // With zoom 0.5, screen 100 should map to world 200
  expect(worldX).toBeCloseTo(camera.x + 200, 1);
});

test("should handle context transform operations", () => {
  const mockContext = {
    save: () => {},
    restore: () => {},
    scale: () => {},
    translate: () => {},
  } as any;

  // Should not throw
  expect(() => camera.applyTransform(mockContext)).not.toThrow();
  expect(() => camera.restoreTransform(mockContext)).not.toThrow();
});

test("should handle wheel events", () => {
  const mockEvent = {
    preventDefault: () => {},
    clientX: 100,
    clientY: 100,
    deltaY: -100, // Zoom in
  } as any;

  const initialZoom = camera.zoom;
  camera.handleWheel(mockEvent);

  expect(camera.zoom).toBeGreaterThan(initialZoom);
});

test("should handle mouse down events", () => {
  const mockEvent = {
    preventDefault: () => {},
    button: 1, // Middle mouse
    clientX: 100,
    clientY: 100,
  } as any;

  camera.handleMouseDown(mockEvent);
  expect(camera.isDragging).toBe(true);
});

test("should handle mouse move during drag", () => {
  camera.isDragging = true;
  camera.lastMousePos = { x: 100, y: 100 };
  camera.zoom = 1;

  const mockEvent = {
    clientX: 150,
    clientY: 150,
  } as any;

  // Should not throw when handling mouse move
  expect(() => camera.handleMouseMove(mockEvent)).not.toThrow();
});

test("should handle mouse up events", () => {
  camera.isDragging = true;
  camera.handleMouseUp();

  expect(camera.isDragging).toBe(false);
});

test("should handle touch start event", () => {
  const mockTouchEvent = {
    preventDefault: () => {},
    touches: [{ identifier: 1, clientX: 100, clientY: 150 }],
  } as any;

  (camera as any).handleTouchStart(mockTouchEvent);

  expect((camera as any).touches.size).toBe(1);
  expect((camera as any).touches.get(1)).toEqual({ x: 100, y: 150 });
});

test("should handle touch start with two fingers for pinch", () => {
  const mockTouchEvent = {
    preventDefault: () => {},
    touches: [
      { identifier: 1, clientX: 100, clientY: 100 },
      { identifier: 2, clientX: 200, clientY: 100 },
    ],
  } as any;

  (camera as any).handleTouchStart(mockTouchEvent);

  expect((camera as any).touches.size).toBe(2);
  expect((camera as any).lastTouchDistance).toBeCloseTo(100, 1);
});

test("should handle single finger touch move", () => {
  (camera as any).touches.set(1, { x: 100, y: 100 });
  camera.x = 0;
  camera.y = 0;
  camera.zoom = 1;

  const mockTouchEvent = {
    preventDefault: () => {},
    touches: [{ identifier: 1, clientX: 150, clientY: 150 }],
  } as any;

  const initialX = camera.x;
  const initialY = camera.y;

  (camera as any).handleTouchMove(mockTouchEvent);

  expect(camera.x).not.toBe(initialX);
  expect(camera.y).not.toBe(initialY);
  expect((camera as any).touches.get(1)).toEqual({ x: 150, y: 150 });
});

test("should handle two finger pinch to zoom", () => {
  const initialZoom = camera.zoom;
  (camera as any).lastTouchDistance = 100;

  const mockTouchEvent = {
    preventDefault: () => {},
    touches: [
      { identifier: 1, clientX: 100, clientY: 100 },
      { identifier: 2, clientX: 220, clientY: 100 },
    ],
  } as any;

  mockCanvas.getBoundingClientRect = () => ({ left: 50, top: 50 });

  (camera as any).handleTouchMove(mockTouchEvent);

  expect(camera.zoom).toBeGreaterThan(initialZoom);
  expect((camera as any).lastTouchDistance).toBeCloseTo(120, 1);
});

test("should handle touch end", () => {
  (camera as any).touches.set(1, { x: 100, y: 100 });
  (camera as any).touches.set(2, { x: 200, y: 200 });
  (camera as any).lastTouchDistance = 100;

  const mockTouchEvent = {
    preventDefault: () => {},
    changedTouches: [{ identifier: 1, clientX: 100, clientY: 100 }],
    touches: [{ identifier: 2, clientX: 200, clientY: 200 }],
  } as any;

  (camera as any).handleTouchEnd(mockTouchEvent);

  expect((camera as any).touches.size).toBe(1);
  expect((camera as any).touches.has(1)).toBe(false);
  expect((camera as any).touches.has(2)).toBe(true);
});

test("should reset touch distance when ending pinch", () => {
  (camera as any).lastTouchDistance = 100;

  const mockTouchEvent = {
    preventDefault: () => {},
    changedTouches: [
      { identifier: 1, clientX: 100, clientY: 100 },
      { identifier: 2, clientX: 200, clientY: 200 },
    ],
    touches: [],
  } as any;

  (camera as any).handleTouchEnd(mockTouchEvent);

  expect((camera as any).lastTouchDistance).toBe(0);
});
