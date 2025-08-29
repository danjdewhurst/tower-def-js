import { CellType } from "../types/Game";
import type { LevelConfig } from "../types/Level";

const createGrid = (): CellType[][] => {
  const grid: CellType[][] = Array(50)
    .fill(null)
    .map(() => Array(50).fill(CellType.TOWER_SLOT));

  // Create a cross pattern with multiple paths
  const pathCoords = [
    // Horizontal path (left to right)
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
    [36, 25],
    [37, 25],
    [38, 25],
    [39, 25],
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

    // Vertical path (top to bottom at center)
    [25, 0],
    [25, 1],
    [25, 2],
    [25, 3],
    [25, 4],
    [25, 5],
    [25, 6],
    [25, 7],
    [25, 8],
    [25, 9],
    [25, 10],
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
    [25, 26],
    [25, 27],
    [25, 28],
    [25, 29],
    [25, 30],
    [25, 31],
    [25, 32],
    [25, 33],
    [25, 34],
    [25, 35],
    [25, 36],
    [25, 37],
    [25, 38],
    [25, 39],
    [25, 40],
    [25, 41],
    [25, 42],
    [25, 43],
    [25, 44],
    [25, 45],
    [25, 46],
    [25, 47],
    [25, 48],
    [25, 49],
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
  const goalRow = grid[49];
  if (spawnRow) spawnRow[0] = CellType.SPAWN;
  if (goalRow) goalRow[25] = CellType.GOAL;

  return grid;
};

export const level4: LevelConfig = {
  id: "level4",
  name: "Crossroads",
  description: "Multiple paths converge",
  difficulty: 4,
  grid: createGrid(),
  spawn: { x: 0, y: 25 },
  goal: { x: 25, y: 49 },
  waves: [
    {
      id: 1,
      enemies: [{ count: 15, interval: 500, enemyType: "basic" }],
      delay: 1000,
    },
    {
      id: 2,
      enemies: [{ count: 20, interval: 400, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 3,
      enemies: [{ count: 25, interval: 300, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 4,
      enemies: [{ count: 30, interval: 250, enemyType: "basic" }],
      delay: 3000,
    },
    {
      id: 5,
      enemies: [{ count: 35, interval: 200, enemyType: "basic" }],
      delay: 3000,
    },
    {
      id: 6,
      enemies: [{ count: 40, interval: 150, enemyType: "basic" }],
      delay: 4000,
    },
  ],
  startingMoney: 200,
};
