import { expect, test } from "bun:test";
import { TowerType } from "../types/Game";
import { Enemy } from "./Enemy";
import { Tower } from "./Tower";

test("should create basic tower with correct stats", () => {
  const tower = new Tower(100, 100, 5, 5, TowerType.BASIC);

  expect(tower.position.x).toBe(100);
  expect(tower.position.y).toBe(100);
  expect(tower.gridX).toBe(5);
  expect(tower.gridY).toBe(5);
  expect(tower.towerType).toBe(TowerType.BASIC);
  expect(tower.range).toBe(90);
  expect(tower.damage).toBe(50);
  expect(tower.fireRate).toBe(1);
  expect(tower.cost).toBe(50);
  expect(tower.color).toBe("#00FF00");
});

test("should create sniper tower with correct stats", () => {
  const tower = new Tower(100, 100, 5, 5, TowerType.SNIPER);

  expect(tower.towerType).toBe(TowerType.SNIPER);
  expect(tower.range).toBe(180);
  expect(tower.damage).toBe(100);
  expect(tower.fireRate).toBe(0.5);
  expect(tower.cost).toBe(100);
  expect(tower.color).toBe("#0080FF");
});

test("should create rapid tower with correct stats", () => {
  const tower = new Tower(100, 100, 5, 5, TowerType.RAPID);

  expect(tower.towerType).toBe(TowerType.RAPID);
  expect(tower.range).toBe(60);
  expect(tower.damage).toBe(25);
  expect(tower.fireRate).toBe(3);
  expect(tower.cost).toBe(75);
  expect(tower.color).toBe("#FF8000");
});

test("should default to basic tower when no type specified", () => {
  const tower = new Tower(100, 100, 5, 5);

  expect(tower.towerType).toBe(TowerType.BASIC);
  expect(tower.range).toBe(90);
});

test("should update shot timer", () => {
  const tower = new Tower(100, 100, 5, 5, TowerType.BASIC);

  expect(tower.canShoot()).toBe(false); // lastShotTime starts at 0

  tower.update(1.0); // Update for 1 second
  expect(tower.canShoot()).toBe(true); // Should be able to shoot after 1 second (fireRate = 1)
});

test("should find closest enemy in range", () => {
  const tower = new Tower(100, 100, 5, 5, TowerType.BASIC); // Range = 90

  const testPath = [{ x: 0, y: 0 }];
  const enemy1 = new Enemy(150, 100, testPath); // Distance = 50 (in range)
  const enemy2 = new Enemy(120, 100, testPath); // Distance = 20 (closer, in range)
  const enemy3 = new Enemy(200, 100, testPath); // Distance = 100 (out of range)

  const enemies = [enemy1, enemy2, enemy3];
  const target = tower.findTarget(enemies);

  expect(target).toBe(enemy2); // Should find closest enemy in range
});

test("should not find target when no enemies in range", () => {
  const tower = new Tower(100, 100, 5, 5, TowerType.BASIC); // Range = 90

  const testPath = [{ x: 0, y: 0 }];
  const enemy1 = new Enemy(300, 100, testPath); // Distance = 200 (out of range)
  const enemy2 = new Enemy(100, 300, testPath); // Distance = 200 (out of range)

  const enemies = [enemy1, enemy2];
  const target = tower.findTarget(enemies);

  expect(target).toBeNull();
});

test("should not target dead enemies", () => {
  const tower = new Tower(100, 100, 5, 5, TowerType.BASIC);

  const testPath = [{ x: 0, y: 0 }];
  const deadEnemy = new Enemy(120, 100, testPath);
  deadEnemy.takeDamage(100); // Kill enemy

  const enemies = [deadEnemy];
  const target = tower.findTarget(enemies);

  expect(target).toBeNull();
});

test("should be able to shoot after cooldown", () => {
  const tower = new Tower(100, 100, 5, 5, TowerType.BASIC); // Fire rate = 1 (1 shot per second)

  expect(tower.canShoot()).toBe(false);

  tower.update(1.0); // Wait 1 second
  expect(tower.canShoot()).toBe(true);

  // Shoot and reset timer
  const testPath = [{ x: 0, y: 0 }];
  const enemy = new Enemy(120, 100, testPath);
  tower.shoot(enemy);

  expect(tower.canShoot()).toBe(false); // Should not be able to shoot immediately after
  expect(tower.getTarget()).toBe(enemy);
});

test("should respect fire rate for different tower types", () => {
  const rapidTower = new Tower(100, 100, 5, 5, TowerType.RAPID); // Fire rate = 3
  const sniperTower = new Tower(100, 100, 5, 5, TowerType.SNIPER); // Fire rate = 0.5

  // Rapid tower should be able to shoot after 1/3 second
  rapidTower.update(0.34);
  expect(rapidTower.canShoot()).toBe(true);

  // Sniper tower should need 2 seconds
  sniperTower.update(1.0);
  expect(sniperTower.canShoot()).toBe(false);
  sniperTower.update(1.0);
  expect(sniperTower.canShoot()).toBe(true);
});

test("should not shoot when cannot shoot", () => {
  const tower = new Tower(100, 100, 5, 5, TowerType.BASIC);

  const testPath = [{ x: 0, y: 0 }];
  const enemy = new Enemy(120, 100, testPath);

  expect(tower.canShoot()).toBe(false);
  tower.shoot(enemy);
  expect(tower.getTarget()).toBeNull(); // Should not set target when can't shoot
});

test("should clear target", () => {
  const tower = new Tower(100, 100, 5, 5, TowerType.BASIC);
  tower.update(1.0); // Enable shooting

  const testPath = [{ x: 0, y: 0 }];
  const enemy = new Enemy(120, 100, testPath);
  tower.shoot(enemy);

  expect(tower.getTarget()).toBe(enemy);
  tower.clearTarget();
  expect(tower.getTarget()).toBeNull();
});
