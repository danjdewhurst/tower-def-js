import { CellType } from "../types/Game";
import type { LevelConfig } from "../types/Level";

const createGrid = (): CellType[][] => {
  const grid: CellType[][] = Array(50)
    .fill(null)
    .map(() => Array(50).fill(CellType.TOWER_SLOT));

  // Create a complex multi-branching path
  const pathCoords = [
    // Main trunk from spawn
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

    // Split into three branches
    // Left branch
    [24, 10],
    [23, 10],
    [22, 10],
    [21, 10],
    [20, 10],
    [19, 10],
    [18, 10],
    [17, 10],
    [16, 10],
    [15, 10],
    [15, 11],
    [15, 12],
    [15, 13],
    [15, 14],
    [15, 15],
    [15, 16],
    [15, 17],
    [15, 18],
    [15, 19],
    [15, 20],
    [16, 20],
    [17, 20],
    [18, 20],
    [19, 20],
    [20, 20],
    [21, 20],
    [22, 20],
    [23, 20],
    [24, 20],
    [25, 20],

    // Right branch
    [26, 10],
    [27, 10],
    [28, 10],
    [29, 10],
    [30, 10],
    [31, 10],
    [32, 10],
    [33, 10],
    [34, 10],
    [35, 10],
    [35, 11],
    [35, 12],
    [35, 13],
    [35, 14],
    [35, 15],
    [35, 16],
    [35, 17],
    [35, 18],
    [35, 19],
    [35, 20],
    [34, 20],
    [33, 20],
    [32, 20],
    [31, 20],
    [30, 20],
    [29, 20],
    [28, 20],
    [27, 20],
    [26, 20],

    // Center continuation
    [25, 11],
    [25, 12],
    [25, 13],
    [25, 14],
    [25, 15],
    [25, 16],
    [25, 17],
    [25, 18],
    [25, 19],

    // Merge and continue down
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

    // Final split before goal
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
    [15, 31],
    [15, 32],
    [15, 33],
    [15, 34],
    [15, 35],
    [15, 36],
    [15, 37],
    [15, 38],
    [15, 39],
    [15, 40],
    [16, 40],
    [17, 40],
    [18, 40],
    [19, 40],
    [20, 40],
    [21, 40],
    [22, 40],
    [23, 40],
    [24, 40],
    [25, 40],
    [26, 40],
    [27, 40],
    [28, 40],
    [29, 40],
    [30, 40],
    [31, 40],
    [32, 40],
    [33, 40],
    [34, 40],
    [35, 40],
    [35, 41],
    [35, 42],
    [35, 43],
    [35, 44],
    [35, 45],
    [35, 46],
    [35, 47],
    [35, 48],
    [35, 49],

    // Right branch to goal
    [26, 30],
    [27, 30],
    [28, 30],
    [29, 30],
    [30, 30],
    [31, 30],
    [32, 30],
    [33, 30],
    [34, 30],
    [35, 30],
    [36, 30],
    [37, 30],
    [38, 30],
    [39, 30],
    [40, 30],
    [41, 30],
    [42, 30],
    [43, 30],
    [44, 30],
    [45, 30],
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
  const spawnRow = grid[0];
  const goalRow = grid[30];
  if (spawnRow) spawnRow[25] = CellType.SPAWN;
  if (goalRow) goalRow[45] = CellType.GOAL;

  return grid;
};

export const level6: LevelConfig = {
  id: "level6",
  name: "Final Stand",
  description: "The ultimate challenge",
  difficulty: 5,
  grid: createGrid(),
  spawn: { x: 25, y: 0 },
  goal: { x: 45, y: 30 },
  waves: [
    {
      id: 1,
      enemies: [{ count: 25, interval: 300, enemyType: "basic" }],
      delay: 1000,
    },
    {
      id: 2,
      enemies: [{ count: 35, interval: 250, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 3,
      enemies: [{ count: 45, interval: 200, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 4,
      enemies: [{ count: 55, interval: 150, enemyType: "basic" }],
      delay: 3000,
    },
    {
      id: 5,
      enemies: [{ count: 70, interval: 120, enemyType: "basic" }],
      delay: 3000,
    },
    {
      id: 6,
      enemies: [{ count: 90, interval: 100, enemyType: "basic" }],
      delay: 4000,
    },
    {
      id: 7,
      enemies: [{ count: 120, interval: 80, enemyType: "basic" }],
      delay: 5000,
    },
  ],
  startingMoney: 300,
};
