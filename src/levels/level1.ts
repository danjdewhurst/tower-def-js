import { CellType } from "../types/Game";
import type { LevelConfig } from "../types/Level";

const createGrid = (): CellType[][] => {
  const grid: CellType[][] = Array(50)
    .fill(null)
    .map(() => Array(50).fill(CellType.TOWER_SLOT));

  // Create a simple S-shaped path from top-left to bottom-right
  const pathCoords = [
    // Start at spawn (0,10)
    [0, 10],
    [1, 10],
    [2, 10],
    [3, 10],
    [4, 10],
    [5, 10],
    [6, 10],
    [7, 10],
    [8, 10],
    [9, 10],
    [10, 10],
    [11, 10],
    [12, 10],
    [13, 10],
    [14, 10],
    [15, 10],
    [16, 10],
    [17, 10],
    [18, 10],
    [19, 10],
    [20, 10],
    [21, 10],
    [22, 10],
    [23, 10],
    [24, 10],
    [25, 10],
    // Turn down
    [25, 11],
    [25, 12],
    [25, 13],
    [25, 14],
    [25, 15],
    [25, 16],
    [25, 17],
    [25, 18],
    [25, 19],
    [25, 20],
    [25, 21],
    [25, 22],
    [25, 23],
    [25, 24],
    [25, 25],
    [25, 26],
    [25, 27],
    [25, 28],
    [25, 29],
    [25, 30],
    // Turn left
    [24, 30],
    [23, 30],
    [22, 30],
    [21, 30],
    [20, 30],
    [19, 30],
    [18, 30],
    [17, 30],
    [16, 30],
    [15, 30],
    [14, 30],
    [13, 30],
    [12, 30],
    [11, 30],
    [10, 30],
    [9, 30],
    [8, 30],
    [7, 30],
    [6, 30],
    [5, 30],
    // Turn down to goal
    [5, 31],
    [5, 32],
    [5, 33],
    [5, 34],
    [5, 35],
    [5, 36],
    [5, 37],
    [5, 38],
    [5, 39],
    [5, 40],
    [5, 41],
    [5, 42],
    [5, 43],
    [5, 44],
    [5, 45],
    [5, 46],
    [5, 47],
    [5, 48],
    [5, 49],
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
  const spawnRow = grid[10];
  const goalRow = grid[49];
  if (spawnRow) spawnRow[0] = CellType.SPAWN;
  if (goalRow) goalRow[5] = CellType.GOAL;

  return grid;
};

export const level1: LevelConfig = {
  id: "level1",
  name: "First Steps",
  description: "A simple introduction to tower defense",
  difficulty: 1,
  grid: createGrid(),
  spawn: { x: 0, y: 10 },
  goal: { x: 5, y: 49 },
  waves: [
    {
      id: 1,
      enemies: [{ count: 5, interval: 1000, enemyType: "basic" }],
      delay: 1000,
    },
    {
      id: 2,
      enemies: [{ count: 8, interval: 800, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 3,
      enemies: [{ count: 12, interval: 600, enemyType: "basic" }],
      delay: 3000,
    },
  ],
  startingMoney: 100,
};
