import type { Enemy } from "./Enemy";
import { Entity } from "./Entity";

export class Projectile extends Entity {
  public target: Enemy;
  public damage: number;
  public speed: number = 300; // pixels per second
  public hasHit: boolean = false;

  constructor(x: number, y: number, target: Enemy, damage: number) {
    super(x, y);
    this.target = target;
    this.damage = damage;
  }

  update(deltaTime: number): void {
    if (this.hasHit || !this.target.isAlive()) {
      return;
    }

    const dx = this.target.position.x - this.position.x;
    const dy = this.target.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      this.hit();
      return;
    }

    const moveDistance = this.speed * deltaTime;
    const ratio = moveDistance / distance;

    this.position.x += dx * ratio;
    this.position.y += dy * ratio;
  }

  private hit(): void {
    this.hasHit = true;
    const _wasAlive = this.target.isAlive();
    this.target.takeDamage(this.damage);
  }

  shouldRemove(): boolean {
    return this.hasHit || !this.target.isAlive();
  }
}
