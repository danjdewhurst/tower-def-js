import { GAME_CONFIG } from "../types/Game";

export interface Viewport {
  width: number;
  height: number;
}

export class Camera {
  public x: number = 0;
  public y: number = 0;
  public zoom: number = 1;
  public viewport: Viewport;
  private isDragging: boolean = false;
  private lastMousePos: { x: number; y: number } = { x: 0, y: 0 };
  private canvas: HTMLCanvasElement;
  private touches: Map<number, { x: number; y: number }> = new Map();
  private lastTouchDistance: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.viewport = {
      width: canvas.width,
      height: canvas.height,
    };
    this.setupEventListeners();
    this.centerOnGame();
  }

  private setupEventListeners(): void {
    // Mouse events
    this.canvas.addEventListener("wheel", (e) => this.handleWheel(e));
    this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("mouseup", () => this.handleMouseUp());
    this.canvas.addEventListener("mouseleave", () => this.handleMouseUp());

    // Touch events
    this.canvas.addEventListener("touchstart", (e) => this.handleTouchStart(e));
    this.canvas.addEventListener("touchmove", (e) => this.handleTouchMove(e));
    this.canvas.addEventListener("touchend", (e) => this.handleTouchEnd(e));
    this.canvas.addEventListener("touchcancel", (e) => this.handleTouchEnd(e));

    // Handle window resize
    window.addEventListener("resize", () => this.updateViewport());
    this.updateViewport();
  }

  private handleWheel(e: WheelEvent): void {
    e.preventDefault();

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse position to world coordinates
    const worldX = this.screenToWorldX(mouseX);
    const worldY = this.screenToWorldY(mouseY);

    // Handle trackpad pinch (check for ctrlKey which indicates pinch gesture)
    let zoomFactor: number;
    if (e.ctrlKey) {
      // Trackpad pinch gesture - use deltaY directly for smoother zooming
      zoomFactor = 1 - e.deltaY * 0.01;
    } else {
      // Regular mouse wheel
      zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    }

    const newZoom = Math.max(0.2, Math.min(3, this.zoom * zoomFactor));

    // Adjust camera position to zoom towards mouse/cursor
    this.x += (worldX - this.x) * (1 - newZoom / this.zoom);
    this.y += (worldY - this.y) * (1 - newZoom / this.zoom);

    this.zoom = newZoom;
    this.constrainCamera();
  }

  private handleMouseDown(e: MouseEvent): void {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      // Middle mouse or Ctrl+left click
      e.preventDefault();
      this.isDragging = true;
      this.lastMousePos = { x: e.clientX, y: e.clientY };
      this.canvas.style.cursor = "grabbing";
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    if (this.isDragging) {
      const deltaX = e.clientX - this.lastMousePos.x;
      const deltaY = e.clientY - this.lastMousePos.y;

      this.x -= deltaX / this.zoom;
      this.y -= deltaY / this.zoom;

      this.constrainCamera();

      this.lastMousePos = { x: e.clientX, y: e.clientY };
    }
  }

  private handleMouseUp(): void {
    this.isDragging = false;
    this.canvas.style.cursor = "crosshair";
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();

    // Store touch positions
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch) {
        this.touches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
      }
    }

    // Calculate initial distance for two-finger pinch
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (touch1 && touch2) {
        this.lastTouchDistance = Math.sqrt(
          (touch2.clientX - touch1.clientX) ** 2 + (touch2.clientY - touch1.clientY) ** 2,
        );
      }
    }
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();

    if (e.touches.length === 1) {
      // Single finger - pan
      const touch = e.touches[0];
      if (touch) {
        const lastTouch = this.touches.get(touch.identifier);

        if (lastTouch) {
          const deltaX = touch.clientX - lastTouch.x;
          const deltaY = touch.clientY - lastTouch.y;

          this.x -= deltaX / this.zoom;
          this.y -= deltaY / this.zoom;

          this.constrainCamera();
          this.touches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
        }
      }
    } else if (e.touches.length === 2) {
      // Two finger - pinch to zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      if (touch1 && touch2) {
        const currentDistance = Math.sqrt(
          (touch2.clientX - touch1.clientX) ** 2 + (touch2.clientY - touch1.clientY) ** 2,
        );

        if (this.lastTouchDistance > 0) {
          const zoomFactor = currentDistance / this.lastTouchDistance;
          const newZoom = Math.max(0.2, Math.min(3, this.zoom * zoomFactor));

          // Zoom towards center of pinch
          const centerX = (touch1.clientX + touch2.clientX) / 2;
          const centerY = (touch1.clientY + touch2.clientY) / 2;
          const rect = this.canvas.getBoundingClientRect();
          const worldX = this.screenToWorldX(centerX - rect.left);
          const worldY = this.screenToWorldY(centerY - rect.top);

          this.x += (worldX - this.x) * (1 - newZoom / this.zoom);
          this.y += (worldY - this.y) * (1 - newZoom / this.zoom);

          this.zoom = newZoom;
          this.constrainCamera();
        }

        this.lastTouchDistance = currentDistance;

        // Update touch positions
        this.touches.set(touch1.identifier, { x: touch1.clientX, y: touch1.clientY });
        this.touches.set(touch2.identifier, { x: touch2.clientX, y: touch2.clientY });
      }
    }
  }

  private handleTouchEnd(e: TouchEvent): void {
    e.preventDefault();

    // Remove ended touches
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch) {
        this.touches.delete(touch.identifier);
      }
    }

    // Reset touch distance when pinch ends
    if (e.touches.length < 2) {
      this.lastTouchDistance = 0;
    }
  }

  private constrainCamera(): void {
    const gameWidth = GAME_CONFIG.canvasWidth;
    const gameHeight = GAME_CONFIG.canvasHeight;
    const viewWidth = this.viewport.width / this.zoom;
    const viewHeight = this.viewport.height / this.zoom;

    // Only constrain if viewport is smaller than game world
    if (viewWidth < gameWidth) {
      const padding = 200;
      this.x = Math.max(-padding, Math.min(gameWidth + padding - viewWidth, this.x));
    }

    if (viewHeight < gameHeight) {
      const padding = 200;
      this.y = Math.max(-padding, Math.min(gameHeight + padding - viewHeight, this.y));
    }
  }

  centerOnGame(): void {
    const gameWidth = GAME_CONFIG.canvasWidth;
    const gameHeight = GAME_CONFIG.canvasHeight;

    // Adjust zoom to fit game in viewport first
    const zoomX = this.viewport.width / gameWidth;
    const zoomY = this.viewport.height / gameHeight;
    this.zoom = Math.min(zoomX, zoomY, 1) * 0.9; // 90% to add some padding

    // Center the camera so the game world appears centered in the viewport
    this.x = (gameWidth - this.viewport.width / this.zoom) / 2;
    this.y = (gameHeight - this.viewport.height / this.zoom) / 2;

    // Ensure camera position is valid
    this.constrainCamera();
  }

  updateViewport(): void {
    const container = this.canvas.parentElement;
    if (!container) return;

    // Get the actual available space, accounting for the HUD
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 60; // Subtract HUD height

    this.viewport.width = viewportWidth;
    this.viewport.height = viewportHeight;

    // Update canvas size
    this.canvas.width = this.viewport.width;
    this.canvas.height = this.viewport.height;
    this.canvas.style.width = `${this.viewport.width}px`;
    this.canvas.style.height = `${this.viewport.height}px`;

    // Re-center the camera with new viewport
    this.centerOnGame();
  }

  // Transform screen coordinates to world coordinates
  screenToWorldX(screenX: number): number {
    return this.x + screenX / this.zoom;
  }

  screenToWorldY(screenY: number): number {
    return this.y + screenY / this.zoom;
  }

  // Transform world coordinates to screen coordinates
  worldToScreenX(worldX: number): number {
    return (worldX - this.x) * this.zoom;
  }

  worldToScreenY(worldY: number): number {
    return (worldY - this.y) * this.zoom;
  }

  // Apply camera transform to canvas context
  applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  // Restore canvas context after rendering
  restoreTransform(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }

  // Get mouse position in world coordinates
  getWorldMousePosition(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    return {
      x: this.screenToWorldX(screenX),
      y: this.screenToWorldY(screenY),
    };
  }
}
