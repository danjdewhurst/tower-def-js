import { CellType } from "../types/Game";
import type { LevelConfig } from "../types/Level";

const createGrid = (): CellType[][] => {
  const grid: CellType[][] = Array(50)
    .fill(null)
    .map(() => Array(50).fill(CellType.TOWER_SLOT));

  // Create a zigzag path from left to right
  const pathCoords = [
    // Start at spawn (0,25)
    [0, 25],
    [1, 25],
    [2, 25],
    [3, 25],
    [4, 25],
    [5, 25],
    [6, 25],
    [7, 25],
    [8, 25],
    [9, 25],
    // Up diagonal
    [10, 24],
    [11, 23],
    [12, 22],
    [13, 21],
    [14, 20],
    [15, 19],
    [16, 18],
    [17, 17],
    [18, 16],
    [19, 15],
    // Right
    [20, 15],
    [21, 15],
    [22, 15],
    [23, 15],
    [24, 15],
    [25, 15],
    [26, 15],
    [27, 15],
    [28, 15],
    [29, 15],
    // Down diagonal
    [30, 16],
    [31, 17],
    [32, 18],
    [33, 19],
    [34, 20],
    [35, 21],
    [36, 22],
    [37, 23],
    [38, 24],
    [39, 25],
    // Right to goal
    [40, 25],
    [41, 25],
    [42, 25],
    [43, 25],
    [44, 25],
    [45, 25],
    [46, 25],
    [47, 25],
    [48, 25],
    [49, 25],
  ];

  // Set path cells
  for (const coord of pathCoords) {
    const [x, y] = coord;
    if (x !== undefined && y !== undefined && x >= 0 && x < 50 && y >= 0 && y < 50) {
      const row = grid[y];
      if (row) {
        row[x] = CellType.PATH;
      }
    }
  }

  // Set spawn and goal
  const spawnRow = grid[25];
  const goalRow = grid[25];
  if (spawnRow) spawnRow[0] = CellType.SPAWN;
  if (goalRow) goalRow[49] = CellType.GOAL;

  return grid;
};

export const level2: LevelConfig = {
  id: "level2",
  name: "Zigzag Challenge",
  description: "Navigate the winding path",
  difficulty: 2,
  grid: createGrid(),
  spawn: { x: 0, y: 25 },
  goal: { x: 49, y: 25 },
  waves: [
    {
      id: 1,
      enemies: [{ count: 8, interval: 800, enemyType: "basic" }],
      delay: 1000,
    },
    {
      id: 2,
      enemies: [{ count: 12, interval: 600, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 3,
      enemies: [{ count: 16, interval: 500, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 4,
      enemies: [{ count: 20, interval: 400, enemyType: "basic" }],
      delay: 3000,
    },
  ],
  startingMoney: 120,
};
