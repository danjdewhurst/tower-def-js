import { TowerConfig } from "../config/TowerConfig";
import type { Tower } from "../entities/Tower";
import { CellType, GAME_CONFIG, type TowerType } from "../types/Game";
import type { LevelConfig } from "../types/Level";

export class TowerPlacement {
  static canPlaceTower(
    gridX: number,
    gridY: number,
    level: LevelConfig,
    towers: Tower[],
    money: number,
    selectedTowerType: TowerType,
  ): boolean {
    if (!level) return false;
    if (gridX < 0 || gridX >= GAME_CONFIG.gridSize || gridY < 0 || gridY >= GAME_CONFIG.gridSize)
      return false;

    const towerCost = TowerConfig.getCost(selectedTowerType);
    if (money < towerCost) return false;
    const row = level.grid[gridY];
    if (!row || row[gridX] !== CellType.TOWER_SLOT) return false;

    // Check if any tower already exists at this grid position
    return !towers.some((tower) => {
      return tower.gridX === gridX && tower.gridY === gridY;
    });
  }

  static getTowerCost(towerType: TowerType): number {
    return TowerConfig.getCost(towerType);
  }
}
