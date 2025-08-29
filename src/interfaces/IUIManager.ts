import type { TowerType } from "../types/Game";

export interface UIUpdateData {
  money: number;
  wave: number;
  totalWaves: number;
  lives: number;
  waveInProgress: boolean;
}

export interface IUIManager {
  selectTowerType(towerType: TowerType): void;
  getSelectedTowerType(): TowerType;
  updateMoneyDisplay(money: number): void;
  updateWaveDisplay(currentWave: number, totalWaves: number): void;
  updateLivesDisplay(lives: number): void;
  updateStartWaveButton(currentWave: number, totalWaves: number, waveInProgress: boolean): void;
  updateAllDisplays(data: UIUpdateData): void;
  updatePauseButton(isPaused: boolean): void;
}
