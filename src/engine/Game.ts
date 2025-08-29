import { TowerConfig } from "../config/TowerConfig";
import type { Enemy } from "../entities/Enemy";
import { Projectile } from "../entities/Projectile";
import { Tower } from "../entities/Tower";
import type { InputCallbacks, MouseClickData } from "../interfaces/IInputManager";
// Import interfaces
import type { UIUpdateData } from "../interfaces/IUIManager";
import { type GameStateCallbacks, GameStateManager } from "../managers/GameStateManager";
import { InputManager } from "../managers/InputManager";
// Import managers
import { UIManager } from "../managers/UIManager";
import { WaveManager, type WaveSpawnCallbacks } from "../managers/WaveManager";
import { GAME_CONFIG } from "../types/Game";
import type { LevelConfig } from "../types/Level";
import { AudioManager } from "./AudioManager";
import { Camera } from "./Camera";
import { ParticleSystem } from "./ParticleSystem";
import { Renderer } from "./Renderer";
import { setLastPlayedLevel } from "./SaveManager";
import { TowerPlacement } from "./TowerPlacement";

export class Game {
  // Core systems
  private renderer: Renderer;
  private camera: Camera;
  private audio: AudioManager;
  private particles: ParticleSystem;

  // Managers
  private uiManager: UIManager;
  private waveManager: WaveManager;
  private gameStateManager: GameStateManager;

  // Game state
  private currentLevel: LevelConfig | null = null;
  private money: number = GAME_CONFIG.startingMoney;
  private lives: number = 10;
  private enemies: Enemy[] = [];
  private towers: Tower[] = [];
  private projectiles: Projectile[] = [];
  private lastTime: number = 0;
  private hoveredCell: { x: number; y: number } | null = null;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize core systems
    this.renderer = new Renderer(canvas);
    this.camera = new Camera(canvas);
    this.renderer.setCamera(this.camera);
    this.audio = new AudioManager();
    this.particles = new ParticleSystem();

    // Initialize managers with dependency injection
    this.uiManager = new UIManager();

    this.waveManager = new WaveManager(this.renderer, this.createWaveCallbacks());

    this.gameStateManager = new GameStateManager(this.audio, this.createGameStateCallbacks());

    // Initialize input manager
    new InputManager(canvas, this.renderer, this.camera, this.createInputCallbacks());
  }

  private createWaveCallbacks(): WaveSpawnCallbacks {
    return {
      onWaveStart: () => {
        this.audio.playWaveStart();
        this.updateUIDisplays();
      },
      onWaveComplete: () => {
        this.updateUIDisplays();
        // Check if all waves are complete
        if (this.waveManager.isAllWavesComplete()) {
          if (this.currentLevel) {
            this.gameStateManager.handleVictory(this.currentLevel, this.money, this.lives);
          }
        }
      },
      onEnemySpawn: (enemy: Enemy) => {
        this.enemies.push(enemy);
      },
    };
  }

  private createGameStateCallbacks(): GameStateCallbacks {
    return {
      onRestart: () => {
        this.restartLevel();
      },
    };
  }

  private createInputCallbacks(): InputCallbacks {
    return {
      onMouseClick: (data: MouseClickData) => {
        if (!this.currentLevel) return;

        // Resume audio context on first user interaction
        this.audio.resumeContext();

        if (this.canPlaceTower(data.gridX, data.gridY)) {
          this.placeTower(data.gridX, data.gridY);
        }
      },
      onMouseMove: (gridX: number, gridY: number) => {
        this.hoveredCell = { x: gridX, y: gridY };
      },
      onStartWave: () => {
        this.waveManager.startNextWave();
      },
      onTogglePause: () => {
        const isPaused = this.gameStateManager.togglePause();
        this.uiManager.updatePauseButton(isPaused);
      },
      onResetCamera: () => {
        this.camera.centerOnGame();
      },
      onZoomIn: () => {
        this.camera.zoom = Math.min(3, this.camera.zoom * 1.2);
      },
      onZoomOut: () => {
        this.camera.zoom = Math.max(0.2, this.camera.zoom / 1.2);
      },
    };
  }

  private canPlaceTower(gridX: number, gridY: number): boolean {
    if (!this.currentLevel) return false;
    return TowerPlacement.canPlaceTower(
      gridX,
      gridY,
      this.currentLevel,
      this.towers,
      this.money,
      this.uiManager.getSelectedTowerType(),
    );
  }

  private placeTower(gridX: number, gridY: number): void {
    const pixelPos = this.renderer.gridToPixel(gridX, gridY);
    const selectedType = this.uiManager.getSelectedTowerType();
    const tower = new Tower(pixelPos.x, pixelPos.y, gridX, gridY, selectedType);
    this.towers.push(tower);
    this.money -= tower.cost;
    this.updateUIDisplays();
    this.audio.playTowerPlace();
  }

  loadLevel(level: LevelConfig): void {
    this.currentLevel = level;
    this.money = level.startingMoney || GAME_CONFIG.startingMoney;
    this.lives = 10;
    this.enemies = [];
    this.towers = [];
    this.projectiles = [];

    // Load level into managers
    this.waveManager.loadLevel(level);
    this.updateUIDisplays();
    setLastPlayedLevel(level.id);

    // Initialize camera viewport after level loads
    this.camera.updateViewport();
  }

  start(): void {
    this.gameLoop(0);
  }

  private gameLoop = (currentTime: number): void => {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    if (!this.gameStateManager.isPlaying()) return;

    this.updateEntities(deltaTime);
    this.handleCombat();
    this.cleanupEntities();
    this.waveManager.checkWaveComplete(this.enemies.length);
  }

  private updateEntities(deltaTime: number): void {
    for (const enemy of this.enemies) {
      enemy.update(deltaTime);
    }
    for (const tower of this.towers) {
      tower.update(deltaTime);
    }
    for (const projectile of this.projectiles) {
      projectile.update(deltaTime);
    }
    this.particles.update(deltaTime);
  }

  private handleCombat(): void {
    // Tower shooting
    for (const tower of this.towers) {
      if (tower.canShoot()) {
        const target = tower.findTarget(this.enemies);
        if (target) {
          tower.shoot(target);
          const projectile = new Projectile(
            tower.position.x,
            tower.position.y,
            target,
            tower.damage,
          );
          this.projectiles.push(projectile);
          this.audio.playShoot();
          this.particles.createMuzzleFlash(
            tower.position.x,
            tower.position.y,
            target.position.x,
            target.position.y,
          );
        }
      }
    }
  }

  private cleanupEntities(): void {
    // Handle enemy deaths and escapes
    for (const enemy of this.enemies) {
      if (!enemy.isAlive() && enemy.health <= 0) {
        this.money += enemy.reward;
        this.audio.playEnemyDeath();
        this.particles.createExplosion(enemy.position.x, enemy.position.y);
      } else if (enemy.hasReachedGoal()) {
        this.lives--;
        if (this.lives <= 0) {
          this.gameStateManager.handleDefeat();
        }
      }
    }

    // Filter out dead/completed entities
    this.enemies = this.enemies.filter((enemy) => enemy.isAlive() && !enemy.hasReachedGoal());
    this.projectiles = this.projectiles.filter((projectile) => !projectile.shouldRemove());

    this.updateUIDisplays();
  }

  private updateUIDisplays(): void {
    const uiData: UIUpdateData = {
      money: this.money,
      wave: this.waveManager.getCurrentWave(),
      totalWaves: this.waveManager.getTotalWaves(),
      lives: this.lives,
      waveInProgress: this.waveManager.isWaveInProgress(),
    };
    this.uiManager.updateAllDisplays(uiData);
  }

  private restartLevel(): void {
    if (this.currentLevel) {
      this.loadLevel(this.currentLevel);
    }
  }

  private render(): void {
    this.renderer.clear();

    // Start world rendering with camera transform
    this.renderer.startWorldRender();

    if (this.currentLevel) {
      this.renderer.drawLevel(this.currentLevel);
    }

    this.renderer.drawGrid();
    this.renderer.drawTowers(this.towers);
    this.renderer.drawEnemies(this.enemies);
    this.renderer.drawProjectiles(this.projectiles);
    this.particles.render(this.renderer.getContext());

    // Draw tower range preview
    if (this.hoveredCell && this.canPlaceTower(this.hoveredCell.x, this.hoveredCell.y)) {
      const pixelPos = this.renderer.gridToPixel(this.hoveredCell.x, this.hoveredCell.y);
      const selectedType = this.uiManager.getSelectedTowerType();
      const range = TowerConfig.getRange(selectedType);
      this.renderer.drawTowerRange(pixelPos, range);
    }

    // End world rendering
    this.renderer.endWorldRender();
  }
}
