import type { Camera } from "../engine/Camera";
import type { Renderer } from "../engine/Renderer";
import type { IInputManager, InputCallbacks } from "../interfaces/IInputManager";

export class InputManager implements IInputManager {
  private canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private camera: Camera;
  private callbacks: InputCallbacks;

  constructor(
    canvas: HTMLCanvasElement,
    renderer: Renderer,
    camera: Camera,
    callbacks: InputCallbacks,
  ) {
    this.canvas = canvas;
    this.renderer = renderer;
    this.camera = camera;
    this.callbacks = callbacks;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Canvas mouse events
    this.canvas.addEventListener("click", (e) => this.handleClick(e));
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));

    // Game control buttons
    const startWaveBtn = document.getElementById("startWaveBtn");
    startWaveBtn?.addEventListener("click", () => this.callbacks.onStartWave());

    const pauseBtn = document.getElementById("pauseBtn");
    pauseBtn?.addEventListener("click", () => this.callbacks.onTogglePause());

    // Camera control buttons
    const resetCameraBtn = document.getElementById("resetCameraBtn");
    resetCameraBtn?.addEventListener("click", () => this.callbacks.onResetCamera());

    const centerCameraBtn = document.getElementById("centerCameraBtn");
    centerCameraBtn?.addEventListener("click", () => this.callbacks.onResetCamera());

    const zoomInBtn = document.getElementById("zoomInBtn");
    zoomInBtn?.addEventListener("click", () => this.callbacks.onZoomIn());

    const zoomOutBtn = document.getElementById("zoomOutBtn");
    zoomOutBtn?.addEventListener("click", () => this.callbacks.onZoomOut());
  }

  private handleClick(e: MouseEvent): void {
    // Skip if camera is dragging
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) return;

    const worldPos = this.camera.getWorldMousePosition(e);
    const gridPos = this.renderer.pixelToGrid(worldPos.x, worldPos.y);

    this.callbacks.onMouseClick({
      gridX: gridPos.x,
      gridY: gridPos.y,
      pixelX: worldPos.x,
      pixelY: worldPos.y,
    });
  }

  private handleMouseMove(e: MouseEvent): void {
    const worldPos = this.camera.getWorldMousePosition(e);
    const gridPos = this.renderer.pixelToGrid(worldPos.x, worldPos.y);
    this.callbacks.onMouseMove(gridPos.x, gridPos.y);
  }

  cleanup(): void {
    // Remove event listeners if needed
    // This would be useful for cleanup when the game is destroyed
  }
}
