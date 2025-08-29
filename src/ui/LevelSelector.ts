import { isLevelUnlocked, loadProgress } from "../engine/SaveManager";
import { levels } from "../levels";
import { CellType, GAME_CONFIG } from "../types/Game";
import type { LevelConfig } from "../types/Level";

export class LevelSelector {
  private container: HTMLElement;
  private onLevelSelect: (level: LevelConfig) => void;

  constructor(container: HTMLElement, onLevelSelect: (level: LevelConfig) => void) {
    this.container = container;
    this.onLevelSelect = onLevelSelect;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div id="levelSelector" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
        background: #1a1a1a;
        color: white;
        min-height: 100vh;
      ">
        <h1 style="margin-bottom: 40px; color: #4ECDC4;">Tower Defense</h1>
        <h2 style="margin-bottom: 30px; color: #ccc;">Select Level</h2>
        <div id="levelGrid" style="
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 800px;
        ">
          ${levels.map((level) => this.createLevelCard(level)).join("")}
        </div>
      </div>
    `;

    // Add click listeners
    levels.forEach((level, _index) => {
      const card = document.getElementById(`level-${level.id}`);
      card?.addEventListener("click", () => {
        const isUnlocked = isLevelUnlocked(
          level.id,
          levels.map((l) => l.id),
        );
        if (isUnlocked) {
          this.onLevelSelect(level);
        }
      });
    });
  }

  private createLevelCard(level: LevelConfig): string {
    const thumbnail = this.generateThumbnail(level);
    const difficultyStars = "★".repeat(level.difficulty) + "☆".repeat(5 - level.difficulty);
    const progress = loadProgress();
    const isUnlocked = isLevelUnlocked(
      level.id,
      levels.map((l) => l.id),
    );
    const isCompleted = progress.completedLevels.includes(level.id);
    const highScore = progress.highScores[level.id];

    const opacity = isUnlocked ? "1" : "0.5";
    const cursor = isUnlocked ? "pointer" : "not-allowed";
    const completedBadge = isCompleted
      ? '<div style="position: absolute; top: 8px; right: 8px; background: #4ECDC4; color: #000; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: bold;">✓</div>'
      : "";
    const scoreDisplay = highScore
      ? `<div style="color: #FFD700; font-size: 11px;">Best: ${highScore}</div>`
      : "";

    return `
      <div id="level-${level.id}" style="
        border: 2px solid #333;
        border-radius: 8px;
        padding: 16px;
        background: #2a2a2a;
        cursor: ${cursor};
        transition: all 0.2s;
        text-align: center;
        width: 200px;
        opacity: ${opacity};
        position: relative;
      " onmouseover="if(${isUnlocked}) this.style.borderColor='#4ECDC4'" onmouseout="this.style.borderColor='#333'">
        ${completedBadge}
        <div style="
          width: 120px;
          height: 120px;
          margin: 0 auto 12px;
          border: 1px solid #555;
          background: #333;
          position: relative;
        ">
          ${thumbnail}
        </div>
        <h3 style="margin: 8px 0; color: white;">${level.name}</h3>
        <div style="color: #FFD700; margin: 4px 0;">${difficultyStars}</div>
        <div style="color: #888; font-size: 12px;">${level.waves.length} waves</div>
        ${scoreDisplay}
      </div>
    `;
  }

  private generateThumbnail(level: LevelConfig): string {
    const scale = 120 / GAME_CONFIG.gridSize; // 120px thumbnail / 50 grid = 2.4px per cell
    let html = "";

    // First render the background (tower slots)
    html += `<div style="
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: 120px;
      background: #1a4a1a;
    "></div>`;

    // Then render specific cell types on top
    for (let y = 0; y < level.grid.length; y++) {
      const row = level.grid[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        const cellType = row[x];
        let color = null;

        switch (cellType) {
          case CellType.PATH:
            color = "#D2691E"; // Orange/brown path
            break;
          case CellType.SPAWN:
            color = "#FF4444"; // Bright red spawn
            break;
          case CellType.GOAL:
            color = "#44FF44"; // Bright green goal
            break;
          case CellType.BLOCKED:
            color = "#222"; // Dark blocked
            break;
        }

        if (color) {
          const size = Math.max(1, scale); // Ensure minimum 1px size
          html += `<div style="
            position: absolute;
            left: ${x * scale}px;
            top: ${y * scale}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
          "></div>`;
        }
      }
    }

    return html;
  }

  show(): void {
    this.container.style.display = "block";
  }

  hide(): void {
    this.container.style.display = "none";
  }
}
