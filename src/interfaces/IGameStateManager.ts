import type { GameState } from "../types/Game";
import type { LevelConfig } from "../types/Level";

export interface GameOverData {
  won: boolean;
  score: number;
  level: LevelConfig;
}

export interface IGameStateManager {
  getGameState(): GameState;
  setGameState(state: GameState): void;
  isPlaying(): boolean;
  isPaused(): boolean;
  togglePause(): boolean;
  handleGameOver(data: GameOverData): void;
  restartLevel(): void;
  handleVictory(level: LevelConfig, money: number, lives: number): void;
  handleDefeat(): void;
}
