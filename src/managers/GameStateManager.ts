import type { AudioManager } from "../engine/AudioManager";
import { markLevelComplete, setHighScore } from "../engine/SaveManager";
import type { GameOverData, IGameStateManager } from "../interfaces/IGameStateManager";
import { GameState } from "../types/Game";
import type { LevelConfig } from "../types/Level";

export interface GameStateCallbacks {
  onRestart: () => void;
}

export class GameStateManager implements IGameStateManager {
  private gameState: GameState = GameState.PLAYING;
  private audio: AudioManager;
  private callbacks: GameStateCallbacks;

  constructor(audio: AudioManager, callbacks: GameStateCallbacks) {
    this.audio = audio;
    this.callbacks = callbacks;
  }

  getGameState(): GameState {
    return this.gameState;
  }

  setGameState(state: GameState): void {
    this.gameState = state;
  }

  isPlaying(): boolean {
    return this.gameState === GameState.PLAYING;
  }

  isPaused(): boolean {
    return this.gameState === GameState.PAUSED;
  }

  togglePause(): boolean {
    if (this.gameState === GameState.PLAYING) {
      this.gameState = GameState.PAUSED;
      return true;
    } else if (this.gameState === GameState.PAUSED) {
      this.gameState = GameState.PLAYING;
      return false;
    }
    return this.isPaused();
  }

  handleGameOver(data: GameOverData): void {
    this.gameState = GameState.GAME_OVER;
    const message = data.won
      ? "Victory! All waves defeated!"
      : "Game Over! Enemies reached the goal!";

    if (data.won) {
      this.audio.playVictory();
      // Save progress for victories
      if (data.level?.id) {
        markLevelComplete(data.level.id);
        setHighScore(data.level.id, data.score);
      }
    } else {
      this.audio.playDefeat();
    }

    // Use setTimeout to ensure the audio has time to start
    setTimeout(() => {
      if (confirm(`${message}\n\nRestart level?`)) {
        this.restartLevel();
      }
    }, 100);
  }

  restartLevel(): void {
    this.gameState = GameState.PLAYING;
    this.callbacks.onRestart();
  }

  handleVictory(level: LevelConfig, money: number, lives: number): void {
    const score = money + lives * 10; // Score based on remaining money and lives
    this.handleGameOver({
      won: true,
      score,
      level,
    });
  }

  handleDefeat(): void {
    // Create a dummy level for defeat - we don't have level info at this point
    this.handleGameOver({
      won: false,
      score: 0,
      level: {} as LevelConfig,
    });
  }
}
