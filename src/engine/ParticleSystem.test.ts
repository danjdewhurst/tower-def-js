import { expect, test } from "bun:test";
import { ParticleSystem } from "./ParticleSystem";

// Mock canvas context
const mockContext = {
  globalAlpha: 1,
  fillStyle: "",
  beginPath: () => {},
  arc: () => {},
  fill: () => {},
} as any;

test("should create empty particle system", () => {
  const particles = new ParticleSystem();
  expect(particles).toBeDefined();
});

test("should create explosion particles", () => {
  const particles = new ParticleSystem();

  particles.createExplosion(100, 100);

  // Should create 8 particles for explosion
  const particleCount = particles.particles.length;
  expect(particleCount).toBe(8);
});

test("should create explosion with custom color", () => {
  const particles = new ParticleSystem();
  const customColor = "#00FF00";

  particles.createExplosion(100, 100, customColor);

  const particle = particles.particles[0];
  expect(particle.color).toBe(customColor);
});

test("should create impact particles", () => {
  const particles = new ParticleSystem();

  particles.createImpact(100, 100);

  // Should create 4 particles for impact
  const particleCount = particles.particles.length;
  expect(particleCount).toBe(4);
});

test("should create muzzle flash particles", () => {
  const particles = new ParticleSystem();

  particles.createMuzzleFlash(100, 100, 200, 150);

  // Should create 3 particles for muzzle flash
  const particleCount = particles.particles.length;
  expect(particleCount).toBe(3);
});

test("should update particle positions and life", () => {
  const particles = new ParticleSystem();
  particles.createImpact(100, 100);

  const particle = particles.particles[0];
  const initialX = particle.x;
  const initialY = particle.y;
  const initialLife = particle.life;

  particles.update(0.1); // 0.1 seconds

  // Position should change based on velocity
  expect(particle.x).not.toBe(initialX);
  expect(particle.y).not.toBe(initialY);

  // Life should decrease
  expect(particle.life).toBeLessThan(initialLife);
});

test("should apply gravity to particles", () => {
  const particles = new ParticleSystem();
  particles.createImpact(100, 100);

  const particle = particles.particles[0];
  const initialVy = particle.vy;

  particles.update(0.1);

  // Gravity should increase downward velocity
  expect(particle.vy).toBeGreaterThan(initialVy);
});

test("should remove dead particles", () => {
  const particles = new ParticleSystem();
  particles.createImpact(100, 100);

  const initialCount = particles.particles.length;
  expect(initialCount).toBeGreaterThan(0);

  // Update for a long time to kill all particles
  particles.update(10.0);

  const finalCount = particles.particles.length;
  expect(finalCount).toBe(0);
});

test("should render particles", () => {
  const particles = new ParticleSystem();
  particles.createExplosion(100, 100);

  // Should not throw when rendering
  expect(() => particles.render(mockContext)).not.toThrow();
});

test("should set particle properties correctly", () => {
  const particles = new ParticleSystem();
  particles.createExplosion(100, 100, "#FF0000");

  const particle = particles.particles[0];

  expect(particle.x).toBe(100);
  expect(particle.y).toBe(100);
  expect(particle.color).toBe("#FF0000");
  expect(particle.life).toBeGreaterThan(0);
  expect(particle.maxLife).toBe(1);
  expect(particle.size).toBeGreaterThan(0);
});

test("should calculate muzzle flash direction correctly", () => {
  const particles = new ParticleSystem();

  // Muzzle flash from (0, 0) to (100, 0) - should go right
  particles.createMuzzleFlash(0, 0, 100, 0);

  const particle = particles.particles[0];

  // Velocity should generally point towards target (positive X direction)
  expect(particle.vx).toBeGreaterThan(0);
});
