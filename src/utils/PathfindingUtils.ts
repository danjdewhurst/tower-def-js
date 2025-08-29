import { CellType, GAME_CONFIG } from "../types/Game";
import type { LevelConfig } from "../types/Level";

export interface GridPosition {
  x: number;
  y: number;
}

export class PathfindingUtils {
  static generatePath(level: LevelConfig): GridPosition[] {
    if (!level) return [];

    const path: GridPosition[] = [];
    const visited = new Set<string>();
    const queue: GridPosition[] = [level.spawn];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;
      const key = `${current.x},${current.y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      if (PathfindingUtils.isValidPathCell(level, current)) {
        path.push(current);

        if (current.x === level.goal.x && current.y === level.goal.y) {
          break;
        }
      }

      const neighbors = PathfindingUtils.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (PathfindingUtils.isInBounds(neighbor) && !visited.has(`${neighbor.x},${neighbor.y}`)) {
          const row = level.grid[neighbor.y];
          if (!row) continue;
          const cellType = row[neighbor.x];
          if (cellType === CellType.PATH || cellType === CellType.GOAL) {
            queue.push(neighbor);
          }
        }
      }
    }

    return path;
  }

  private static isValidPathCell(level: LevelConfig, position: GridPosition): boolean {
    const row = level.grid[position.y];
    if (!row) return false;
    const cellType = row[position.x];
    return cellType === CellType.PATH || cellType === CellType.SPAWN || cellType === CellType.GOAL;
  }

  private static getNeighbors(position: GridPosition): GridPosition[] {
    return [
      { x: position.x + 1, y: position.y },
      { x: position.x - 1, y: position.y },
      { x: position.x, y: position.y + 1 },
      { x: position.x, y: position.y - 1 },
    ];
  }

  private static isInBounds(position: GridPosition): boolean {
    return (
      position.x >= 0 &&
      position.x < GAME_CONFIG.gridSize &&
      position.y >= 0 &&
      position.y < GAME_CONFIG.gridSize
    );
  }

  static findDistance(from: GridPosition, to: GridPosition): number {
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    return dx + dy; // Manhattan distance
  }

  static isAdjacent(pos1: GridPosition, pos2: GridPosition): boolean {
    return PathfindingUtils.findDistance(pos1, pos2) === 1;
  }
}
