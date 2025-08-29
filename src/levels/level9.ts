import { CellType } from "../types/Game";
import type { LevelConfig } from "../types/Level";

const createGrid = (): CellType[][] => {
  const grid: CellType[][] = Array(50)
    .fill(null)
    .map(() => Array(50).fill(CellType.TOWER_SLOT));

  // Create "The Gauntlet" - long straight path with defensive alcoves
  const pathCoords = [
    // Main straight highway from left to right
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
  ];

  // Create defensive alcoves (recessed areas) along the path
  const _alcoveCoords = [
    // Top alcoves (north of main path)
    [8, 20],
    [9, 20],
    [10, 20],
    [8, 21],
    [9, 21],
    [10, 21],
    [8, 22],
    [9, 22],
    [10, 22],
    [8, 23],
    [9, 23],
    [10, 23],
    [18, 18],
    [19, 18],
    [20, 18],
    [21, 18],
    [18, 19],
    [19, 19],
    [20, 19],
    [21, 19],
    [18, 20],
    [19, 20],
    [20, 20],
    [21, 20],
    [18, 21],
    [19, 21],
    [20, 21],
    [21, 21],
    [30, 20],
    [31, 20],
    [32, 20],
    [30, 21],
    [31, 21],
    [32, 21],
    [30, 22],
    [31, 22],
    [32, 22],
    [30, 23],
    [31, 23],
    [32, 23],
    [40, 18],
    [41, 18],
    [42, 18],
    [43, 18],
    [40, 19],
    [41, 19],
    [42, 19],
    [43, 19],
    [40, 20],
    [41, 20],
    [42, 20],
    [43, 20],
    [40, 21],
    [41, 21],
    [42, 21],
    [43, 21],
    // Bottom alcoves (south of main path)
    [8, 27],
    [9, 27],
    [10, 27],
    [8, 28],
    [9, 28],
    [10, 28],
    [8, 29],
    [9, 29],
    [10, 29],
    [8, 30],
    [9, 30],
    [10, 30],
    [18, 27],
    [19, 27],
    [20, 27],
    [21, 27],
    [18, 28],
    [19, 28],
    [20, 28],
    [21, 28],
    [18, 29],
    [19, 29],
    [20, 29],
    [21, 29],
    [18, 30],
    [19, 30],
    [20, 30],
    [21, 30],
    [30, 27],
    [31, 27],
    [32, 27],
    [30, 28],
    [31, 28],
    [32, 28],
    [30, 29],
    [31, 29],
    [32, 29],
    [30, 30],
    [31, 30],
    [32, 30],
    [40, 27],
    [41, 27],
    [42, 27],
    [43, 27],
    [40, 28],
    [41, 28],
    [42, 28],
    [43, 28],
    [40, 29],
    [41, 29],
    [42, 29],
    [43, 29],
    [40, 30],
    [41, 30],
    [42, 30],
    [43, 30],
  ];

  // Create barriers to force enemies into the gauntlet
  const barrierCoords = [
    // Top barriers
    [0, 15],
    [1, 15],
    [2, 15],
    [3, 15],
    [4, 15],
    [5, 15],
    [6, 15],
    [7, 15],
    [11, 15],
    [12, 15],
    [13, 15],
    [14, 15],
    [15, 15],
    [16, 15],
    [17, 15],
    [22, 15],
    [23, 15],
    [24, 15],
    [25, 15],
    [26, 15],
    [27, 15],
    [28, 15],
    [29, 15],
    [33, 15],
    [34, 15],
    [35, 15],
    [36, 15],
    [37, 15],
    [38, 15],
    [39, 15],
    [44, 15],
    [45, 15],
    [46, 15],
    [47, 15],
    [48, 15],
    [49, 15],
    // Bottom barriers
    [0, 35],
    [1, 35],
    [2, 35],
    [3, 35],
    [4, 35],
    [5, 35],
    [6, 35],
    [7, 35],
    [11, 35],
    [12, 35],
    [13, 35],
    [14, 35],
    [15, 35],
    [16, 35],
    [17, 35],
    [22, 35],
    [23, 35],
    [24, 35],
    [25, 35],
    [26, 35],
    [27, 35],
    [28, 35],
    [29, 35],
    [33, 35],
    [34, 35],
    [35, 35],
    [36, 35],
    [37, 35],
    [38, 35],
    [39, 35],
    [44, 35],
    [45, 35],
    [46, 35],
    [47, 35],
    [48, 35],
    [49, 35],
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

  // Alcoves remain as TOWER_SLOT (already default)
  // Set barriers as BLOCKED
  for (const coord of barrierCoords) {
    const [x, y] = coord;
    if (x !== undefined && y !== undefined && x >= 0 && x < 50 && y >= 0 && y < 50) {
      const row = grid[y];
      if (row) {
        row[x] = CellType.BLOCKED;
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

export const level9: LevelConfig = {
  id: "level9",
  name: "The Gauntlet",
  description: "A straight road with strategic alcoves - test your crossfire tactics",
  difficulty: 3,
  grid: createGrid(),
  spawn: { x: 0, y: 25 },
  goal: { x: 49, y: 25 },
  waves: [
    {
      id: 1,
      enemies: [{ count: 12, interval: 900, enemyType: "basic" }],
      delay: 1000,
    },
    {
      id: 2,
      enemies: [{ count: 16, interval: 750, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 3,
      enemies: [{ count: 20, interval: 650, enemyType: "basic" }],
      delay: 2500,
    },
    {
      id: 4,
      enemies: [{ count: 25, interval: 550, enemyType: "basic" }],
      delay: 3000,
    },
    {
      id: 5,
      enemies: [{ count: 30, interval: 500, enemyType: "basic" }],
      delay: 3500,
    },
    {
      id: 6,
      enemies: [{ count: 35, interval: 450, enemyType: "basic" }],
      delay: 4000,
    },
  ],
  startingMoney: 180,
};
