import type { GridPosition } from "../types/Game";
import { GAME_CONFIG } from "../types/Game";
import { Entity } from "./Entity";

export class Enemy extends Entity {
  public health: number = 100;
  public maxHealth: number = 100;
  public speed: number = 60; // pixels per second
  public reward: number = 5;
  public pathIndex: number = 0;
  private path: GridPosition[];

  constructor(x: number, y: number, path: GridPosition[]) {
    super(x, y);
    this.path = path;
  }

  update(deltaTime: number): void {
    // Only allow positive deltaTime to prevent time travel
    if (deltaTime <= 0 || !this.isAlive() || this.pathIndex >= this.path.length) {
      return;
    }

    const targetGrid = this.path[this.pathIndex];
    if (!targetGrid) return;

    const target = {
      x: targetGrid.x * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2,
      y: targetGrid.y * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2,
    };

    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      this.pathIndex++;
      return;
    }

    const moveDistance = this.speed * deltaTime;
    const ratio = moveDistance / distance;

    this.position.x += dx * ratio;
    this.position.y += dy * ratio;
  }

  takeDamage(damage: number): void {
    // Only accept positive damage values to prevent healing
    if (damage > 0) {
      this.health = Math.max(0, this.health - damage);
    }
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  hasReachedGoal(): boolean {
    return this.pathIndex >= this.path.length;
  }
}
