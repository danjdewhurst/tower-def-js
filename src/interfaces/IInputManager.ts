export interface MouseClickData {
  gridX: number;
  gridY: number;
  pixelX: number;
  pixelY: number;
}

export interface InputCallbacks {
  onMouseClick: (data: MouseClickData) => void;
  onMouseMove: (gridX: number, gridY: number) => void;
  onStartWave: () => void;
  onTogglePause: () => void;
  onResetCamera: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export interface IInputManager {
  cleanup(): void;
}
