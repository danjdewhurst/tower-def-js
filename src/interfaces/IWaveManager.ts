import type { LevelConfig } from "../types/Level";

export interface IWaveManager {
  loadLevel(level: LevelConfig): void;
  canStartNextWave(): boolean;
  startNextWave(): void;
  checkWaveComplete(enemyCount: number): void;
  isAllWavesComplete(): boolean;
  getCurrentWave(): number;
  getTotalWaves(): number;
  isWaveInProgress(): boolean;
}
