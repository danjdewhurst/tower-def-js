import { CellType } from "../types/Game";
import type { LevelConfig } from "../types/Level";

const createGrid = (): CellType[][] => {
  const grid: CellType[][] = Array(50)
    .fill(null)
    .map(() => Array(50).fill(CellType.TOWER_SLOT));

  // Create "The Dual Helix" - two interweaving paths that cross multiple times
  const pathCoords1 = [
    // First path: starts top-left, spirals clockwise
    [0, 15],
    [1, 15],
    [2, 15],
    [3, 15],
    [4, 15],
    [5, 15],
    [6, 16],
    [7, 17],
    [8, 18],
    [9, 19],
    [10, 20],
    [11, 21],
    [12, 22],
    [13, 23],
    [14, 24],
    [15, 25],
    [16, 26],
    [17, 27],
    [18, 28],
    [19, 29],
    [20, 30],
    [21, 31],
    [22, 32],
    [23, 33],
    [24, 34],
    [25, 35],
    [26, 34],
    [27, 33],
    [28, 32],
    [29, 31],
    [30, 30],
    [31, 29],
    [32, 28],
    [33, 27],
    [34, 26],
    [35, 25],
    [36, 24],
    [37, 23],
    [38, 22],
    [39, 21],
    [40, 20],
    [41, 19],
    [42, 18],
    [43, 17],
    [44, 16],
    [45, 15],
    [46, 15],
    [47, 15],
    [48, 15],
    [49, 15],
  ];

  const pathCoords2 = [
    // Second path: starts bottom-left, spirals counter-clockwise
    [0, 35],
    [1, 35],
    [2, 35],
    [3, 35],
    [4, 35],
    [5, 35],
    [6, 34],
    [7, 33],
    [8, 32],
    [9, 31],
    [10, 30],
    [11, 29],
    [12, 28],
    [13, 27],
    [14, 26],
    [15, 25],
    [16, 24],
    [17, 23],
    [18, 22],
    [19, 21],
    [20, 20],
    [21, 19],
    [22, 18],
    [23, 17],
    [24, 16],
    [25, 15],
    [26, 16],
    [27, 17],
    [28, 18],
    [29, 19],
    [30, 20],
    [31, 21],
    [32, 22],
    [33, 23],
    [34, 24],
    [35, 25],
    [36, 26],
    [37, 27],
    [38, 28],
    [39, 29],
    [40, 30],
    [41, 31],
    [42, 32],
    [43, 33],
    [44, 34],
    [45, 35],
    [46, 35],
    [47, 35],
    [48, 35],
    [49, 35],
  ];

  // Create small islands in the center for strategic tower placement
  const islandCoords = [
    [12, 12],
    [13, 12],
    [14, 12],
    [12, 13],
    [13, 13],
    [14, 13],
    [12, 14],
    [13, 14],
    [14, 14],
    [36, 12],
    [37, 12],
    [38, 12],
    [36, 13],
    [37, 13],
    [38, 13],
    [36, 14],
    [37, 14],
    [38, 14],
    [12, 36],
    [13, 36],
    [14, 36],
    [12, 37],
    [13, 37],
    [14, 37],
    [12, 38],
    [13, 38],
    [14, 38],
    [36, 36],
    [37, 36],
    [38, 36],
    [36, 37],
    [37, 37],
    [38, 37],
    [36, 38],
    [37, 38],
    [38, 38],
  ];

  // Set both path cells
  for (const coord of [...pathCoords1, ...pathCoords2]) {
    const [x, y] = coord;
    if (x !== undefined && y !== undefined && x >= 0 && x < 50 && y >= 0 && y < 50) {
      const row = grid[y];
      if (row) {
        row[x] = CellType.PATH;
      }
    }
  }

  // Set strategic islands as tower slots (they're already tower slots by default)
  // Just ensure they stay as tower slots
  for (const coord of islandCoords) {
    const [x, y] = coord;
    if (x !== undefined && y !== undefined && x >= 0 && x < 50 && y >= 0 && y < 50) {
      const row = grid[y];
      if (row) {
        row[x] = CellType.TOWER_SLOT;
      }
    }
  }

  // Set spawns and goals
  const spawn1Row = grid[15];
  const spawn2Row = grid[35];
  const goal1Row = grid[15];
  const goal2Row = grid[35];
  if (spawn1Row) spawn1Row[0] = CellType.SPAWN;
  if (spawn2Row) spawn2Row[0] = CellType.SPAWN;
  if (goal1Row) goal1Row[49] = CellType.GOAL;
  if (goal2Row) goal2Row[49] = CellType.GOAL;

  return grid;
};

export const level8: LevelConfig = {
  id: "level8",
  name: "The Dual Helix",
  description: "Two interweaving paths create complex tactical decisions",
  difficulty: 3,
  grid: createGrid(),
  spawn: { x: 0, y: 15 }, // Primary spawn (second spawn handled by game logic)
  goal: { x: 49, y: 15 }, // Primary goal (second goal handled by game logic)
  waves: [
    {
      id: 1,
      enemies: [{ count: 6, interval: 1200, enemyType: "basic" }],
      delay: 1000,
    },
    {
      id: 2,
      enemies: [{ count: 10, interval: 1000, enemyType: "basic" }],
      delay: 2000,
    },
    {
      id: 3,
      enemies: [{ count: 8, interval: 800, enemyType: "basic" }],
      delay: 2500,
    },
    {
      id: 4,
      enemies: [{ count: 12, interval: 700, enemyType: "basic" }],
      delay: 3000,
    },
    {
      id: 5,
      enemies: [{ count: 16, interval: 600, enemyType: "basic" }],
      delay: 3500,
    },
  ],
  startingMoney: 200,
};
