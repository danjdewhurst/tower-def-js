import { Game } from "./engine/Game";
import type { LevelConfig } from "./types/Level";
import { LevelSelector } from "./ui/LevelSelector";

class GameApp {
  private game: Game;
  private gameContainer: HTMLElement;
  private levelSelectorContainer: HTMLElement;

  constructor() {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    this.gameContainer = document.getElementById("gameContainer") as HTMLElement;
    this.levelSelectorContainer = document.getElementById("levelSelectorContainer") as HTMLElement;

    if (!canvas || !this.gameContainer || !this.levelSelectorContainer) {
      throw new Error("Could not find required DOM elements");
    }

    this.game = new Game(canvas);
    new LevelSelector(this.levelSelectorContainer, (level) => this.startLevel(level));

    this.setupMenuButton();
    this.showLevelSelector();
  }

  private setupMenuButton(): void {
    const menuBtn = document.getElementById("menuBtn");
    menuBtn?.addEventListener("click", () => this.showLevelSelector());
  }

  private startLevel(level: LevelConfig): void {
    this.game.loadLevel(level);
    this.showGame();
    this.game.start();
  }

  private showLevelSelector(): void {
    this.levelSelectorContainer.style.display = "block";
    this.gameContainer.style.display = "none";
  }

  private showGame(): void {
    this.levelSelectorContainer.style.display = "none";
    this.gameContainer.style.display = "block";
  }
}

new GameApp();
