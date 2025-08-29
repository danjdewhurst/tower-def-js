import type { Renderer } from "../engine/Renderer";
import { Enemy } from "../entities/Enemy";
import type { IWaveManager } from "../interfaces/IWaveManager";
import type { LevelConfig, WaveConfig } from "../types/Level";
import { PathfindingUtils } from "../utils/PathfindingUtils";

export interface WaveSpawnCallbacks {
  onWaveStart: () => void;
  onWaveComplete: () => void;
  onEnemySpawn: (enemy: Enemy) => void;
}

export class WaveManager implements IWaveManager {
  private currentLevel: LevelConfig | null = null;
  private currentWave: number = 0;
  private waveInProgress: boolean = false;
  private renderer: Renderer;
  private callbacks: WaveSpawnCallbacks;

  constructor(renderer: Renderer, callbacks: WaveSpawnCallbacks) {
    this.renderer = renderer;
    this.callbacks = callbacks;
  }

  loadLevel(level: LevelConfig): void {
    this.currentLevel = level;
    this.currentWave = 0;
    this.waveInProgress = false;
  }

  canStartNextWave(): boolean {
    if (!this.currentLevel || this.waveInProgress) return false;
    return this.currentWave < this.currentLevel.waves.length;
  }

  startNextWave(): void {
    if (!this.canStartNextWave() || !this.currentLevel) return;

    const waveConfig = this.currentLevel.waves[this.currentWave];
    if (!waveConfig) return;
    this.spawnWave(waveConfig);
    this.waveInProgress = true;
    this.currentWave++;
    this.callbacks.onWaveStart();
  }

  private spawnWave(waveConfig: WaveConfig): void {
    if (!this.currentLevel) return;

    const spawnGrid = this.currentLevel.spawn;
    const spawnPixel = this.renderer.gridToPixel(spawnGrid.x, spawnGrid.y);
    const path = PathfindingUtils.generatePath(this.currentLevel);

    const firstEnemy = waveConfig.enemies[0];
    if (!firstEnemy) return;

    let spawnedCount = 0;
    const spawnInterval = setInterval(() => {
      if (spawnedCount >= firstEnemy.count) {
        clearInterval(spawnInterval);
        return;
      }

      const enemy = new Enemy(spawnPixel.x, spawnPixel.y, path);
      this.callbacks.onEnemySpawn(enemy);
      spawnedCount++;
    }, firstEnemy.interval);
  }

  checkWaveComplete(enemyCount: number): void {
    if (this.waveInProgress && enemyCount === 0) {
      this.waveInProgress = false;
      this.callbacks.onWaveComplete();
    }
  }

  isAllWavesComplete(): boolean {
    return this.currentWave >= (this.currentLevel?.waves.length || 0);
  }

  getCurrentWave(): number {
    return this.currentWave;
  }

  getTotalWaves(): number {
    return this.currentLevel?.waves.length || 0;
  }

  isWaveInProgress(): boolean {
    return this.waveInProgress;
  }
}
