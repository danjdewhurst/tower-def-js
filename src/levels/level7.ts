import { CellType } from "../types/Game";
import type { LevelConfig } from "../types/Level";

const createGrid = (): CellType[][] => {
  const grid: CellType[][] = Array(50)
    .fill(null)
    .map(() => Array(50).fill(CellType.TOWER_SLOT));

  // Create "The Hourglass" - narrow chokepoints at top and bottom
  const pathCoords = [
    // Start at spawn (top-left)
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5],
    [6, 5],
    [7, 5],
    // Funnel down (creating tight chokepoint)
    [8, 6],
    [9, 7],
    [10, 8],
    [11, 9],
    [12, 10],
    [13, 11],
    [14, 12],
    [15, 13],
    [16, 14],
    [17, 15],
    [18, 16],
    [19, 17],
    [20, 18],
    // Narrow center passage (critical chokepoint)
    [21, 19],
    [22, 20],
    [23, 21],
    [24, 22],
    [25, 23],
    [26, 24],
    [27, 25],
    // Expand outward (hourglass widens)
    [28, 26],
    [29, 27],
    [30, 28],
    [31, 29],
    [32, 30],
    [33, 31],
    [34, 32],
    [35, 33],
    [36, 34],
    [37, 35],
    [38, 36],
    [39, 37],
    [40, 38],
    // Final straight to goal
    [41, 39],
    [42, 40],
    [43, 41],
    [44, 42],
    [45, 43],
    [46, 44],
    [47, 45],
    [48, 46],
    [49, 47],
  ];

  // Add blocked cells to create the hourglass walls
  const blockedCoords = [
    // Top funnel walls
    [7, 4],
    [8, 4],
    [9, 4],
    [10, 4],
    [11, 4],
    [12, 4],
    [13, 4],
    [14, 4],
    [7, 6],
    [8, 7],
    [9, 8],
    [10, 9],
    [11, 10],
    [12, 11],
    [13, 12],
    [14, 13],
    [9, 6],
    [10, 6],
    [11, 6],
    [12, 6],
    [13, 6],
    [14, 6],
    [15, 6],
    [16, 6],
    [9, 9],
    [10, 10],
    [11, 11],
    [12, 12],
    [13, 13],
    [14, 14],
    [15, 15],
    [16, 16],
    // Bottom funnel walls
    [28, 25],
    [29, 25],
    [30, 25],
    [31, 25],
    [32, 25],
    [33, 25],
    [34, 25],
    [35, 25],
    [28, 27],
    [29, 28],
    [30, 29],
    [31, 30],
    [32, 31],
    [33, 32],
    [34, 33],
    [35, 34],
    [30, 27],
    [31, 27],
    [32, 27],
    [33, 27],
    [34, 27],
    [35, 27],
    [36, 27],
    [37, 27],
    [30, 30],
    [31, 31],
    [32, 32],
    [33, 33],
    [34, 34],
    [35, 35],
    [36, 36],
    [37, 37],
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

  // Set blocked cells
  for (const coord of blockedCoords) {
    const [x, y] = coord;
    if (x !== undefined && y !== undefined && x >= 0 && x < 50 && y >= 0 && y < 50) {
      const row = grid[y];
      if (row) {
        row[x] = CellType.BLOCKED;
      }
    }
  }

  // Set spawn and goal
  const spawnRow = grid[5];
  const goalRow = grid[47];
  if (spawnRow) spawnRow[0] = CellType.SPAWN;
  if (goalRow) goalRow[49] = CellType.GOAL;

  return grid;
};

export const level7: LevelConfig = {
  id: "level7",
  name: "The Hourglass",
  description: "Two critical chokepoints test your tower positioning skills",
  difficulty: 2,
  grid: createGrid(),
  spawn: { x: 0, y: 5 },
  goal: { x: 49, y: 47 },
  waves: [
    {
      id: 1,
      enemies: [{ count: 8, interval: 1000, enemyType: "basic" }],
      delay: 1000,
    },
    {
      id: 2,
      enemies: [{ count: 12, interval: 800, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 3,
      enemies: [{ count: 15, interval: 700, enemyType: "basic" }],
      delay: 2500,
    },
    {
      id: 4,
      enemies: [{ count: 20, interval: 600, enemyType: "basic" }],
      delay: 3000,
    },
  ],
  startingMoney: 250,
};
