interface GameProgress {
  completedLevels: string[];
  highScores: Record<string, number>;
  lastPlayedLevel: string | null;
}

const SAVE_KEY = "towerDefenseProgress";

function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn("Could not save progress:", e);
  }
}

export function loadProgress(): GameProgress {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not load progress:", e);
  }

  return {
    completedLevels: [],
    highScores: {},
    lastPlayedLevel: null,
  };
}

export function markLevelComplete(levelId: string): void {
  const progress = loadProgress();
  if (!progress.completedLevels.includes(levelId)) {
    progress.completedLevels.push(levelId);
    saveProgress(progress);
  }
}

export function setHighScore(levelId: string, score: number): void {
  const progress = loadProgress();
  if (!progress.highScores[levelId] || score > progress.highScores[levelId]) {
    progress.highScores[levelId] = score;
    saveProgress(progress);
  }
}

export function setLastPlayedLevel(levelId: string): void {
  const progress = loadProgress();
  progress.lastPlayedLevel = levelId;
  saveProgress(progress);
}

export function isLevelUnlocked(levelId: string, allLevels: string[]): boolean {
  const progress = loadProgress();
  const levelIndex = allLevels.indexOf(levelId);

  // First level is always unlocked
  if (levelIndex === 0) return true;

  // Check if previous level is completed
  const previousLevelId = allLevels[levelIndex - 1];
  return previousLevelId ? progress.completedLevels.includes(previousLevelId) : false;
}
