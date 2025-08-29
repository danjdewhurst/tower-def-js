import { TowerType } from "../types/Game";

export interface TowerStats {
  range: number;
  damage: number;
  fireRate: number;
  cost: number;
  color: string;
  displayName: string;
  description: string;
}

export class TowerConfig {
  private static readonly TOWER_STATS: Record<TowerType, TowerStats> = {
    [TowerType.BASIC]: {
      range: 90,
      damage: 50,
      fireRate: 1,
      cost: 50,
      color: "#00FF00",
      displayName: "Basic Tower",
      description: "Balanced damage and range tower",
    },
    [TowerType.SNIPER]: {
      range: 180,
      damage: 100,
      fireRate: 0.5,
      cost: 100,
      color: "#0080FF",
      displayName: "Sniper Tower",
      description: "Long range, high damage, slow firing tower",
    },
    [TowerType.RAPID]: {
      range: 60,
      damage: 25,
      fireRate: 3,
      cost: 75,
      color: "#FF8000",
      displayName: "Rapid Fire Tower",
      description: "Short range, low damage, fast firing tower",
    },
  };

  static getStats(towerType: TowerType): TowerStats {
    const stats = TowerConfig.TOWER_STATS[towerType];
    if (!stats) {
      throw new Error(`Invalid tower type: ${towerType}`);
    }
    return { ...stats }; // Return a copy to prevent mutation
  }

  static getRange(towerType: TowerType): number {
    return TowerConfig.getStats(towerType).range;
  }

  static getDamage(towerType: TowerType): number {
    return TowerConfig.getStats(towerType).damage;
  }

  static getFireRate(towerType: TowerType): number {
    return TowerConfig.getStats(towerType).fireRate;
  }

  static getCost(towerType: TowerType): number {
    return TowerConfig.getStats(towerType).cost;
  }

  static getColor(towerType: TowerType): string {
    return TowerConfig.getStats(towerType).color;
  }

  static getDisplayName(towerType: TowerType): string {
    return TowerConfig.getStats(towerType).displayName;
  }

  static getDescription(towerType: TowerType): string {
    return TowerConfig.getStats(towerType).description;
  }

  static getAllTowerTypes(): TowerType[] {
    return Object.values(TowerType);
  }

  static isValidTowerType(towerType: string): towerType is TowerType {
    return Object.values(TowerType).includes(towerType as TowerType);
  }
}
