export interface Position {
  x: number;
  y: number;
}

export interface GridPosition {
  x: number;
  y: number;
}

export enum GameState {
  MENU = "menu",
  PLAYING = "playing",
  PAUSED = "paused",
  GAME_OVER = "game_over",
}

export enum CellType {
  PATH = "path",
  TOWER_SLOT = "tower_slot",
  BLOCKED = "blocked",
  SPAWN = "spawn",
  GOAL = "goal",
}

export interface GameConfig {
  gridSize: number;
  cellSize: number;
  canvasWidth: number;
  canvasHeight: number;
  startingMoney: number;
}

export enum TowerType {
  BASIC = "basic",
  SNIPER = "sniper",
  RAPID = "rapid",
}

export const GAME_CONFIG: GameConfig = {
  gridSize: 50,
  cellSize: 30,
  canvasWidth: 1500,
  canvasHeight: 1500,
  startingMoney: 100,
};
