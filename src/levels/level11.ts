import { CellType } from "../types/Game";
import type { LevelConfig } from "../types/Level";

const createGrid = (): CellType[][] => {
  const grid: CellType[][] = Array(50)
    .fill(null)
    .map(() => Array(50).fill(CellType.TOWER_SLOT));

  // Create "The Nexus" - multiple paths converging to a single point, then diverging
  const pathCoords1 = [
    // Path 1: Top-left to center
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5],
    [6, 6],
    [7, 7],
    [8, 8],
    [9, 9],
    [10, 10],
    [11, 11],
    [12, 12],
    [13, 13],
    [14, 14],
    [15, 15],
    [16, 16],
    [17, 17],
    [18, 18],
    [19, 19],
    [20, 20],
    [21, 21],
    [22, 22],
    [23, 23],
    [24, 24],
    [25, 25], // Convergence point
  ];

  const pathCoords2 = [
    // Path 2: Top-right to center
    [49, 5],
    [48, 5],
    [47, 5],
    [46, 5],
    [45, 5],
    [44, 5],
    [43, 6],
    [42, 7],
    [41, 8],
    [40, 9],
    [39, 10],
    [38, 11],
    [37, 12],
    [36, 13],
    [35, 14],
    [34, 15],
    [33, 16],
    [32, 17],
    [31, 18],
    [30, 19],
    [29, 20],
    [28, 21],
    [27, 22],
    [26, 23],
    [25, 24],
    [25, 25], // Convergence point
  ];

  const pathCoords3 = [
    // Path 3: Bottom-left to center
    [0, 45],
    [1, 45],
    [2, 45],
    [3, 45],
    [4, 45],
    [5, 45],
    [6, 44],
    [7, 43],
    [8, 42],
    [9, 41],
    [10, 40],
    [11, 39],
    [12, 38],
    [13, 37],
    [14, 36],
    [15, 35],
    [16, 34],
    [17, 33],
    [18, 32],
    [19, 31],
    [20, 30],
    [21, 29],
    [22, 28],
    [23, 27],
    [24, 26],
    [25, 25], // Convergence point
  ];

  const pathCoords4 = [
    // Path 4: Bottom-right to center
    [49, 45],
    [48, 45],
    [47, 45],
    [46, 45],
    [45, 45],
    [44, 45],
    [43, 44],
    [42, 43],
    [41, 42],
    [40, 41],
    [39, 40],
    [38, 39],
    [37, 38],
    [36, 37],
    [35, 36],
    [34, 35],
    [33, 34],
    [32, 33],
    [31, 32],
    [30, 31],
    [29, 30],
    [28, 29],
    [27, 28],
    [26, 27],
    [25, 26],
    [25, 25], // Convergence point
  ];

  // From center, path continues to the single exit
  const pathCoordsExit = [
    [25, 25], // The nexus point
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

  // Create strategic barriers to funnel traffic and create chokepoints
  const barrierCoords = [
    // Center barriers to force convergence
    [23, 23],
    [24, 23],
    [26, 23],
    [27, 23],
    [23, 27],
    [24, 27],
    [26, 27],
    [27, 27],
    // Outer barriers to prevent shortcutting
    [10, 15],
    [15, 10],
    [35, 10],
    [40, 15],
    [10, 35],
    [15, 40],
    [35, 40],
    [40, 35],
    // Create defensive positions
    [20, 25],
    [21, 25],
    [22, 25],
    [28, 25],
    [29, 25],
    [30, 25],
    [25, 20],
    [25, 21],
    [25, 22],
  ];

  // Prime defensive spots (small islands)
  const _defensiveIslands = [
    // Corner islands for long-range coverage
    [12, 12],
    [13, 12],
    [12, 13],
    [13, 13],
    [37, 12],
    [38, 12],
    [37, 13],
    [38, 13],
    [12, 37],
    [13, 37],
    [12, 38],
    [13, 38],
    [37, 37],
    [38, 37],
    [37, 38],
    [38, 38],
    // Central strategic positions
    [22, 30],
    [23, 30],
    [27, 30],
    [28, 30],
  ];

  // Set all path cells
  const allPathCoords = [
    ...pathCoords1,
    ...pathCoords2,
    ...pathCoords3,
    ...pathCoords4,
    ...pathCoordsExit,
  ];
  for (const coord of allPathCoords) {
    const [x, y] = coord;
    if (x !== undefined && y !== undefined && x >= 0 && x < 50 && y >= 0 && y < 50) {
      const row = grid[y];
      if (row) {
        row[x] = CellType.PATH;
      }
    }
  }

  // Set barrier cells as blocked
  for (const coord of barrierCoords) {
    const [x, y] = coord;
    if (x !== undefined && y !== undefined && x >= 0 && x < 50 && y >= 0 && y < 50) {
      const row = grid[y];
      if (row) {
        row[x] = CellType.BLOCKED;
      }
    }
  }

  // Defensive islands remain as TOWER_SLOT (default)

  // Set spawns and goal
  const spawn1Row = grid[5];
  const spawn2Row = grid[5];
  const spawn3Row = grid[45];
  const spawn4Row = grid[45];
  const goalRow = grid[49];
  if (spawn1Row) spawn1Row[0] = CellType.SPAWN;
  if (spawn2Row) spawn2Row[49] = CellType.SPAWN;
  if (spawn3Row) spawn3Row[0] = CellType.SPAWN;
  if (spawn4Row) spawn4Row[49] = CellType.SPAWN;
  if (goalRow) goalRow[25] = CellType.GOAL;

  return grid;
};

export const level11: LevelConfig = {
  id: "level11",
  name: "The Nexus",
  description: "Four paths converge to one point - master the art of convergence defense",
  difficulty: 5,
  grid: createGrid(),
  spawn: { x: 0, y: 5 }, // Primary spawn (others handled by game logic)
  goal: { x: 25, y: 49 },
  waves: [
    {
      id: 1,
      enemies: [{ count: 5, interval: 1500, enemyType: "basic" }],
      delay: 1000,
    },
    {
      id: 2,
      enemies: [{ count: 8, interval: 1200, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 3,
      enemies: [{ count: 12, interval: 1000, enemyType: "basic" }],
      delay: 2500,
    },
    {
      id: 4,
      enemies: [{ count: 16, interval: 850, enemyType: "basic" }],
      delay: 3000,
    },
    {
      id: 5,
      enemies: [{ count: 20, interval: 750, enemyType: "basic" }],
      delay: 3500,
    },
    {
      id: 6,
      enemies: [{ count: 25, interval: 650, enemyType: "basic" }],
      delay: 4000,
    },
    {
      id: 7,
      enemies: [{ count: 30, interval: 550, enemyType: "basic" }],
      delay: 4500,
    },
    {
      id: 8,
      enemies: [{ count: 40, interval: 500, enemyType: "basic" }],
      delay: 5000,
    },
  ],
  startingMoney: 130,
};
