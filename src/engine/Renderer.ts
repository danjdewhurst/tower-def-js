import type { Enemy } from "../entities/Enemy";
import type { Projectile } from "../entities/Projectile";
import type { Tower } from "../entities/Tower";
import { CellType, GAME_CONFIG } from "../types/Game";
import type { LevelConfig } from "../types/Level";
import type { Camera } from "./Camera";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private camera: Camera | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get 2D context from canvas");
    }
    this.ctx = ctx;
  }

  setCamera(camera: Camera): void {
    this.camera = camera;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  startWorldRender(): void {
    if (this.camera) {
      this.camera.applyTransform(this.ctx);
    }
  }

  endWorldRender(): void {
    if (this.camera) {
      this.camera.restoreTransform(this.ctx);
    }
  }

  drawGrid(): void {
    const { gridSize, cellSize } = GAME_CONFIG;
    this.ctx.strokeStyle = "#444";
    this.ctx.lineWidth = 1 / (this.camera?.zoom || 1); // Adjust line width for zoom

    for (let x = 0; x <= gridSize; x++) {
      const xPos = x * cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(xPos, 0);
      this.ctx.lineTo(xPos, gridSize * cellSize);
      this.ctx.stroke();
    }

    for (let y = 0; y <= gridSize; y++) {
      const yPos = y * cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(0, yPos);
      this.ctx.lineTo(gridSize * cellSize, yPos);
      this.ctx.stroke();
    }
  }

  drawLevel(level: LevelConfig): void {
    const { cellSize } = GAME_CONFIG;

    for (let y = 0; y < level.grid.length; y++) {
      const row = level.grid[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        const cellType = row[x];
        const xPos = x * cellSize;
        const yPos = y * cellSize;

        switch (cellType) {
          case CellType.PATH:
            this.ctx.fillStyle = "#8B4513";
            this.ctx.fillRect(xPos, yPos, cellSize, cellSize);
            break;
          case CellType.TOWER_SLOT:
            this.ctx.fillStyle = "#2F4F2F";
            this.ctx.fillRect(xPos, yPos, cellSize, cellSize);
            break;
          case CellType.SPAWN:
            this.ctx.fillStyle = "#FF6B6B";
            this.ctx.fillRect(xPos, yPos, cellSize, cellSize);
            break;
          case CellType.GOAL:
            this.ctx.fillStyle = "#4ECDC4";
            this.ctx.fillRect(xPos, yPos, cellSize, cellSize);
            break;
          case CellType.BLOCKED:
            this.ctx.fillStyle = "#333";
            this.ctx.fillRect(xPos, yPos, cellSize, cellSize);
            break;
        }
      }
    }
  }

  drawEnemies(enemies: Enemy[]): void {
    for (const enemy of enemies) {
      if (enemy.isAlive()) {
        // Draw enemy body
        this.ctx.fillStyle = "#FF0000";
        this.ctx.beginPath();
        this.ctx.arc(enemy.position.x, enemy.position.y, 8, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw health bar
        const healthPercent = enemy.health / enemy.maxHealth;
        const barWidth = 16;
        const barHeight = 3;
        const barX = enemy.position.x - barWidth / 2;
        const barY = enemy.position.y - 15;

        // Background
        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health
        this.ctx.fillStyle =
          healthPercent > 0.5 ? "#00FF00" : healthPercent > 0.25 ? "#FFFF00" : "#FF0000";
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
      }
    }
  }

  drawTowers(towers: Tower[]): void {
    for (const tower of towers) {
      this.ctx.fillStyle = tower.color;
      const size = 20;
      this.ctx.fillRect(tower.position.x - size / 2, tower.position.y - size / 2, size, size);

      // Draw tower type indicator
      this.ctx.fillStyle = "#FFF";
      this.ctx.font = "10px Arial";
      this.ctx.textAlign = "center";
      const indicator =
        tower.towerType === "sniper" ? "S" : tower.towerType === "rapid" ? "R" : "B";
      this.ctx.fillText(indicator, tower.position.x, tower.position.y + 3);
    }
  }

  drawProjectiles(projectiles: Projectile[]): void {
    this.ctx.fillStyle = "#FFFF00";

    for (const projectile of projectiles) {
      this.ctx.beginPath();
      this.ctx.arc(projectile.position.x, projectile.position.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawTowerRange(position: { x: number; y: number }, range: number): void {
    this.ctx.strokeStyle = "#00FF0080";
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, range, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  gridToPixel(gridX: number, gridY: number): { x: number; y: number } {
    const { cellSize } = GAME_CONFIG;
    return {
      x: gridX * cellSize + cellSize / 2,
      y: gridY * cellSize + cellSize / 2,
    };
  }

  pixelToGrid(x: number, y: number): { x: number; y: number } {
    const { cellSize } = GAME_CONFIG;

    // Convert screen coordinates to world coordinates if camera is available
    let worldX = x;
    let worldY = y;

    if (this.camera) {
      worldX = this.camera.screenToWorldX(x);
      worldY = this.camera.screenToWorldY(y);
    }

    return {
      x: Math.floor(worldX / cellSize),
      y: Math.floor(worldY / cellSize),
    };
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
