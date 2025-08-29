import type { CellType, GridPosition } from "./Game";

export interface LevelConfig {
  id: string;
  name: string;
  description?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  grid: CellType[][];
  spawn: GridPosition;
  goal: GridPosition;
  waves: WaveConfig[];
  startingMoney?: number;
}

export interface WaveConfig {
  id: number;
  enemies: EnemySpawn[];
  delay?: number;
}

export interface EnemySpawn {
  count: number;
  interval: number;
  enemyType: "basic";
}
