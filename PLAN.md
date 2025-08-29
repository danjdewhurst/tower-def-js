# Tower Defense Game - Development Plan

## Project Overview

A high-performance tower defense game built with TypeScript and Bun, featuring:
- Low-poly aesthetic with simple geometric shapes
- 50x50 grid-based levels 
- Canvas rendering for 60fps smooth gameplay
- Configurable levels and wave systems
- Economic tower placement mechanics

## Architecture Overview

### Game States
- **Menu**: Level selector with previews
- **Playing**: Active gameplay with towers, enemies, and waves
- **Paused**: Game paused, overlay menu
- **GameOver**: Win/loss screen with restart options

### Core Systems
1. **Game Engine**: Main game loop, state management, delta time
2. **Rendering**: Canvas-based high-performance graphics
3. **Input**: Mouse handling for clicks, hover, placement
4. **Physics**: Basic collision detection and movement
5. **Audio**: Sound effects and background music (future)

## Technical Stack

### Dependencies
- **Bun**: Runtime and bundler
- **TypeScript**: Type safety and development experience  
- **Canvas API**: High-performance 2D rendering
- **HTML/CSS**: UI overlay system

### File Structure
```
src/
├── engine/
│   ├── Game.ts           # Main game class and loop
│   ├── Renderer.ts       # Canvas rendering system
│   ├── InputManager.ts   # Mouse/keyboard input
│   └── AssetManager.ts   # Asset loading/caching
├── entities/
│   ├── Tower.ts          # Tower game object
│   ├── Enemy.ts          # Enemy game object  
│   ├── Projectile.ts     # Bullet/projectile system
│   └── Entity.ts         # Base entity class
├── systems/
│   ├── LevelManager.ts   # Level loading and management
│   ├── WaveManager.ts    # Wave spawning and progression
│   ├── EconomyManager.ts # Money and costs
│   └── PathFinder.ts     # Enemy pathfinding
├── levels/
│   ├── level1.ts         # Level configurations
│   ├── level2.ts
│   └── index.ts          # Level registry
├── ui/
│   ├── LevelSelector.tsx # Level selection screen
│   ├── GameHUD.tsx       # In-game overlay
│   └── MainMenu.tsx      # Main menu component
└── types/
    ├── Level.ts          # Level configuration types
    ├── Wave.ts           # Wave configuration types
    └── Game.ts           # Game state types
```

## Level System Design

### Grid Configuration
- **Size**: 50x50 grid (2500 cells total)
- **Cell Types**: 
  - `PATH` - Enemy movement path
  - `TOWER_SLOT` - Valid tower placement
  - `BLOCKED` - Impassable terrain
  - `SPAWN` - Enemy spawn point
  - `GOAL` - Enemy exit point

### Level Config Format
```typescript
interface LevelConfig {
  id: string;
  name: string;
  description?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  grid: CellType[][];        // 50x50 array
  spawn: { x: number; y: number };
  goal: { x: number; y: number };
  waves: WaveConfig[];
  startingMoney?: number;    // Default: 100
}

enum CellType {
  PATH = 'path',
  TOWER_SLOT = 'tower_slot', 
  BLOCKED = 'blocked',
  SPAWN = 'spawn',
  GOAL = 'goal'
}
```

### Level Creation Process
1. Design layout on paper/digital tool
2. Convert to 50x50 grid array
3. Define connected path from spawn to goal
4. Place tower slots strategically 
5. Configure wave progression
6. Generate thumbnail preview

## Wave System Design

### Wave Configuration
```typescript
interface WaveConfig {
  id: number;
  enemies: EnemySpawn[];
  delay?: number;           // Delay before wave starts (ms)
}

interface EnemySpawn {
  count: number;
  interval: number;         // Time between spawns (ms)  
  enemyType: 'basic';       // Start with one type
}
```

### Wave Mechanics
- Sequential waves (complete one to unlock next)
- Manual wave start initially (auto-start later)
- 3-5 second delay between waves for planning
- Progressive difficulty increase
- Wave preview before starting

### Enemy Behavior
- **Movement**: Follow predefined path grid cells
- **Pathfinding**: Simple connected cell traversal
- **Stats**: Health (100hp), Speed (2 cells/second), Reward ($5)
- **Rendering**: Red circle, 16px diameter
- **Death**: Disappear with money reward

## Tower System Design

### Tower Mechanics
- **Placement**: Click empty TOWER_SLOT cells
- **Cost**: $50 per tower
- **Range**: 3 grid cells (150px at 30px/cell)
- **Targeting**: Nearest enemy in range
- **Damage**: 50 damage per shot
- **Fire Rate**: 1 shot per second
- **Rendering**: Green square, 20px size

### Tower Placement Flow
1. Player clicks tower slot cell
2. Validate money >= $50
3. Deduct money and place tower
4. Show range circle on hover
5. Begin auto-targeting enemies

### Projectile System  
- **Speed**: 5 cells/second (fast travel)
- **Rendering**: Small yellow circle
- **Collision**: Hit enemy when projectile reaches target position
- **Cleanup**: Remove projectile after hit

## Rendering System Design

### Canvas Setup
- **Resolution**: 1500x1500px (50x50 grid at 30px/cell)
- **Scaling**: CSS scaling for different screen sizes
- **Layers**: Background grid → Path → Towers → Enemies → Projectiles → UI overlays

### Performance Optimizations
- **Object Pooling**: Reuse enemy/projectile instances
- **Viewport Culling**: Only render visible entities
- **Delta Time**: Smooth animation regardless of framerate
- **Entity Batching**: Group similar rendering operations
- **Efficient Collision**: Spatial grid for fast proximity queries

### Drawing Pipeline
```typescript
render(deltaTime: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawGrid();           // Background grid lines
  drawPath();          // Path highlighting  
  drawTowers();        // Green squares
  drawEnemies();       // Red circles
  drawProjectiles();   // Yellow dots
  drawEffects();       // Damage numbers, explosions
}
```

## UI System Design

### Level Selector
- **Layout**: 3x3 grid of level cards
- **Card Content**: Thumbnail, name, difficulty stars, lock state
- **Thumbnail Generation**: Mini-render of level layout
- **Navigation**: Click level → load game, back button → main menu

### Game HUD (HTML Overlay)
- **Top Bar**: Money ($XXX), Lives (♥♥♥), Wave progress
- **Bottom Bar**: Start wave button, pause button, menu button  
- **Tower Placement**: Hover preview, range indicators
- **Responsive**: Scale with game canvas

### Game States UI
- **Pause Menu**: Resume, restart level, main menu options
- **Game Over**: Victory/defeat message, stats, next level/retry buttons
- **Main Menu**: Play, settings, credits (minimal initially)

## Implementation Phases

### Phase 1: Core Foundation ✅ COMPLETED
1. ✅ Set up canvas rendering system and game loop
2. ✅ Implement basic grid drawing and coordinate system
3. ✅ Create level configuration loader
4. ✅ Add basic enemy movement along predefined path
5. ✅ Implement tower placement mechanics
6. ✅ Add projectile system and collision detection

**Status**: Phase 1 complete! Game is fully playable with:
- 50x50 grid rendering with path visualization
- Enemy spawning and movement along S-shaped path
- Tower placement with $50 cost and range preview
- Projectile system with collision detection
- Wave progression system
- Clean low-poly visual design

### Phase 2: Game Mechanics ✅ COMPLETED
1. ✅ Implement wave spawning system
2. ✅ Add enemy-projectile collision and damage
3. ✅ Create economy system (money, costs, rewards)
4. ✅ Add win/loss conditions
5. ✅ Implement basic game state management

**Status**: Phase 2 complete! Game mechanics fully functional with:
- Enemy health system with visual health bars
- Tower shooting with projectile collision
- Economy system: $5 reward per enemy kill, lose lives for escaped enemies
- Win condition: Complete all waves
- Loss condition: Lives reach 0
- Pause/resume functionality

### Phase 3: UI and Polish ✅ COMPLETED
1. ✅ Create level selector with thumbnails
2. ✅ Build game HUD with money/wave display
3. ✅ Add pause/menu functionality
4. ✅ Implement level progression system
5. ✅ Performance optimization and testing

**Status**: Phase 3 complete! Professional UI with:
- Beautiful level selector with 3 levels and thumbnail previews
- Complete HUD: Money, Lives, Wave counter, control buttons
- Level navigation: Menu button to return to level selector
- 3 levels with increasing difficulty (3-5 waves each)
- Smooth 60fps performance with efficient rendering

### Phase 4: Content and Expansion ✅ COMPLETED
1. ✅ Create 6 levels with increasing difficulty and unique layouts
2. ✅ Add sound effects for all game actions  
3. ✅ Implement 3 tower types (Basic, Sniper, Rapid-Fire)
4. ✅ Add particle effects and visual polish
5. ✅ Save/load progress system with level unlocking

**Status**: Phase 4 complete! Full-featured tower defense game with:
- **6 Unique Levels**: S-curve, Zigzag, Spiral, Cross, Maze, Multi-path
- **3 Tower Types**: Basic ($50), Sniper ($100, long range), Rapid-Fire ($75, fast)
- **Audio System**: Shooting, enemy death, tower placement, wave start, victory/defeat
- **Particle Effects**: Muzzle flash, enemy explosions, impact effects
- **Progress System**: Level unlocking, high scores, save/load via localStorage
- **Professional UI**: Level selector with thumbnails, tower selection bar, complete HUD

**GAME IS PRODUCTION READY!** 🎮

## Technical Considerations

### Performance Targets
- **FPS**: Consistent 60fps on modern browsers
- **Memory**: Minimize garbage collection with object pooling
- **Startup**: Fast level loading (<500ms)
- **Responsiveness**: UI interactions <100ms response time

### Code Quality
- **TypeScript**: Strict mode, comprehensive typing
- **Testing**: Unit tests for core game logic
- **Architecture**: Clean separation of concerns, modular design
- **Documentation**: Inline code documentation for complex algorithms

### Browser Compatibility  
- **Target**: Modern browsers with Canvas support
- **Mobile**: Touch support for tower placement (future)
- **Performance**: Efficient rendering on various devices

## Development Workflow

1. **Setup**: Initialize Bun project with proper TypeScript configuration
2. **Core Development**: Build systems incrementally with testing
3. **Integration**: Combine systems into cohesive game experience
4. **Content Creation**: Design and implement levels
5. **Polish**: Visual effects, audio, and user experience improvements
6. **Testing**: Comprehensive testing across different scenarios and devices

This plan prioritizes a solid foundation with clean architecture that can be extended for future features like multiple tower types, enemy varieties, special abilities, and multiplayer capabilities.