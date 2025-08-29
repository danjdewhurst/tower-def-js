import { TowerConfig } from "../config/TowerConfig";
import { TowerType } from "../types/Game";
import type { Enemy } from "./Enemy";
import { Entity } from "./Entity";

export class Tower extends Entity {
  public range: number = 0;
  public damage: number = 0;
  public fireRate: number = 0;
  public cost: number = 0;
  public towerType: TowerType;
  public color: string = "";
  public gridX: number;
  public gridY: number;
  private lastShotTime: number = 0;
  private target: Enemy | null = null;

  constructor(
    x: number,
    y: number,
    gridX: number,
    gridY: number,
    towerType: TowerType = TowerType.BASIC,
  ) {
    super(x, y);
    this.gridX = gridX;
    this.gridY = gridY;
    this.towerType = towerType;
    this.setupTowerStats();
  }

  private setupTowerStats(): void {
    const stats = TowerConfig.getStats(this.towerType);
    this.range = stats.range;
    this.damage = stats.damage;
    this.fireRate = stats.fireRate;
    this.cost = stats.cost;
    this.color = stats.color;
  }

  update(deltaTime: number): void {
    this.lastShotTime += deltaTime;
  }

  findTarget(enemies: Enemy[]): Enemy | null {
    let closestEnemy: Enemy | null = null;
    let closestDistance = Infinity;

    for (const enemy of enemies) {
      if (!enemy.isAlive()) continue;

      const dx = enemy.position.x - this.position.x;
      const dy = enemy.position.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= this.range && distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = enemy;
      }
    }

    return closestEnemy;
  }

  canShoot(): boolean {
    return this.lastShotTime >= 1 / this.fireRate;
  }

  shoot(target: Enemy): void {
    if (!this.canShoot()) return;

    this.lastShotTime = 0;
    this.target = target;
  }

  getTarget(): Enemy | null {
    return this.target;
  }

  clearTarget(): void {
    this.target = null;
  }
}
