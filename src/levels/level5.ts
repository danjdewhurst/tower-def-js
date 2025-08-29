import { CellType } from "../types/Game";
import type { LevelConfig } from "../types/Level";

const createGrid = (): CellType[][] => {
  const grid: CellType[][] = Array(50)
    .fill(null)
    .map(() => Array(50).fill(CellType.TOWER_SLOT));

  // Create a maze-like path with narrow corridors
  const pathCoords = [
    // Start from bottom-left
    [5, 45],
    [6, 45],
    [7, 45],
    [8, 45],
    [9, 45],
    [10, 45],
    [11, 45],
    [12, 45],
    [13, 45],
    [14, 45],
    [15, 45],
    // Up
    [15, 44],
    [15, 43],
    [15, 42],
    [15, 41],
    [15, 40],
    [15, 39],
    [15, 38],
    [15, 37],
    [15, 36],
    [15, 35],
    // Left
    [14, 35],
    [13, 35],
    [12, 35],
    [11, 35],
    [10, 35],
    [9, 35],
    [8, 35],
    [7, 35],
    [6, 35],
    [5, 35],
    // Up
    [5, 34],
    [5, 33],
    [5, 32],
    [5, 31],
    [5, 30],
    [5, 29],
    [5, 28],
    [5, 27],
    [5, 26],
    [5, 25],
    // Right
    [6, 25],
    [7, 25],
    [8, 25],
    [9, 25],
    [10, 25],
    [11, 25],
    [12, 25],
    [13, 25],
    [14, 25],
    [15, 25],
    [16, 25],
    [17, 25],
    [18, 25],
    [19, 25],
    [20, 25],
    [21, 25],
    [22, 25],
    [23, 25],
    [24, 25],
    [25, 25],
    [26, 25],
    [27, 25],
    [28, 25],
    [29, 25],
    [30, 25],
    [31, 25],
    [32, 25],
    [33, 25],
    [34, 25],
    [35, 25],
    // Up
    [35, 24],
    [35, 23],
    [35, 22],
    [35, 21],
    [35, 20],
    [35, 19],
    [35, 18],
    [35, 17],
    [35, 16],
    [35, 15],
    // Right to goal
    [36, 15],
    [37, 15],
    [38, 15],
    [39, 15],
    [40, 15],
    [41, 15],
    [42, 15],
    [43, 15],
    [44, 15],
    [45, 15],
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

  // Add some blocked areas to create chokepoints
  const blockedAreas = [
    // Top-left block
    [10, 10],
    [11, 10],
    [12, 10],
    [10, 11],
    [11, 11],
    [12, 11],
    [10, 12],
    [11, 12],
    [12, 12],
    // Top-right block
    [37, 8],
    [38, 8],
    [39, 8],
    [37, 9],
    [38, 9],
    [39, 9],
    [37, 10],
    [38, 10],
    [39, 10],
    // Bottom center block
    [22, 40],
    [23, 40],
    [24, 40],
    [25, 40],
    [26, 40],
    [27, 40],
    [22, 41],
    [23, 41],
    [24, 41],
    [25, 41],
    [26, 41],
    [27, 41],
  ];

  for (const coord of blockedAreas) {
    const [x, y] = coord;
    if (x !== undefined && y !== undefined && x >= 0 && x < 50 && y >= 0 && y < 50) {
      const row = grid[y];
      if (row) {
        row[x] = CellType.BLOCKED;
      }
    }
  }

  // Set spawn and goal
  const spawnRow = grid[45];
  const goalRow = grid[15];
  if (spawnRow) spawnRow[5] = CellType.SPAWN;
  if (goalRow) goalRow[45] = CellType.GOAL;

  return grid;
};

export const level5: LevelConfig = {
  id: "level5",
  name: "Maze Runner",
  description: "Navigate the narrow corridors",
  difficulty: 5,
  grid: createGrid(),
  spawn: { x: 5, y: 45 },
  goal: { x: 45, y: 15 },
  waves: [
    {
      id: 1,
      enemies: [{ count: 20, interval: 400, enemyType: "basic" }],
      delay: 1000,
    },
    {
      id: 2,
      enemies: [{ count: 30, interval: 300, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 3,
      enemies: [{ count: 40, interval: 250, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 4,
      enemies: [{ count: 50, interval: 200, enemyType: "basic" }],
      delay: 3000,
    },
    {
      id: 5,
      enemies: [{ count: 60, interval: 150, enemyType: "basic" }],
      delay: 3000,
    },
    {
      id: 6,
      enemies: [{ count: 80, interval: 100, enemyType: "basic" }],
      delay: 4000,
    },
  ],
  startingMoney: 250,
};
