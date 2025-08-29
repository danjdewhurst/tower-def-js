import { beforeEach, expect, test } from "bun:test";
import { AudioManager } from "./AudioManager";

// Mock Web Audio API
const mockOscillator = {
  connect: () => {},
  frequency: { setValueAtTime: () => {} },
  type: "sine",
  start: () => {},
  stop: () => {},
};

const mockGainNode = {
  connect: () => {},
  gain: {
    setValueAtTime: () => {},
    exponentialRampToValueAtTime: () => {},
  },
};

const mockAudioContext = {
  createOscillator: () => mockOscillator,
  createGain: () => mockGainNode,
  destination: {},
  currentTime: 0,
  state: "running",
  resume: async () => {},
};

// Override global AudioContext
global.AudioContext = (() => mockAudioContext) as any;

let audioManager: AudioManager;

beforeEach(() => {
  audioManager = new AudioManager();
});

test("should create audio manager", () => {
  expect(audioManager).toBeDefined();
});

test("should handle unsupported audio context", () => {
  // Test with broken AudioContext
  const originalAudioContext = global.AudioContext;
  global.AudioContext = (() => {
    throw new Error("Not supported");
  }) as any;

  const manager = new AudioManager();
  expect(manager).toBeDefined();

  // Restore
  global.AudioContext = originalAudioContext;
});

test("should play shoot sound", () => {
  // Should not throw error
  expect(() => audioManager.playShoot()).not.toThrow();
});

test("should play enemy hit sound", () => {
  expect(() => audioManager.playEnemyHit()).not.toThrow();
});

test("should play enemy death sound", () => {
  expect(() => audioManager.playEnemyDeath()).not.toThrow();
});

test("should play tower place sound", () => {
  expect(() => audioManager.playTowerPlace()).not.toThrow();
});

test("should play wave start sound", () => {
  expect(() => audioManager.playWaveStart()).not.toThrow();
});

test("should play victory sound", () => {
  expect(() => audioManager.playVictory()).not.toThrow();
});

test("should play defeat sound", () => {
  expect(() => audioManager.playDefeat()).not.toThrow();
});

test("should resume audio context when suspended", async () => {
  const mockSuspendedContext = {
    ...mockAudioContext,
    state: "suspended",
    resume: async () => "resumed",
  };

  const originalAudioContext = global.AudioContext;
  global.AudioContext = (() => mockSuspendedContext) as any;

  const manager = new AudioManager();
  await expect(manager.resumeContext()).resolves.toBe(undefined);

  // Restore
  global.AudioContext = originalAudioContext;
});

test("should not resume when context is already running", async () => {
  await expect(audioManager.resumeContext()).resolves.toBe(undefined);
});

test("should handle audio context creation failure gracefully", () => {
  const originalAudioContext = global.AudioContext;
  global.AudioContext = (() => {
    throw new Error("AudioContext not available");
  }) as any;

  const manager = new AudioManager();

  // Should not throw when calling audio methods
  expect(() => manager.playShoot()).not.toThrow();
  expect(() => manager.playEnemyDeath()).not.toThrow();

  // Restore
  global.AudioContext = originalAudioContext;
});

test("should create tones with different parameters", () => {
  const manager = new AudioManager();

  // Test all tone types used in the class
  expect(() => manager.playShoot()).not.toThrow(); // square wave
  expect(() => manager.playEnemyHit()).not.toThrow(); // sawtooth
  expect(() => manager.playEnemyDeath()).not.toThrow(); // triangle
  expect(() => manager.playTowerPlace()).not.toThrow(); // sine
});
