# 🏰 Tower Defense JS

> **Note**: This repository is a work in progress and serves as an educational testing project for exploring game development concepts with TypeScript and Bun.

A modern, high-performance tower defense game built with TypeScript, HTML5 Canvas, and Bun runtime. Features a complete entity-component architecture, multiple tower types, challenging levels, and procedural audio effects.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-black?logo=bun)](https://bun.sh)
[![Canvas API](https://img.shields.io/badge/Canvas-API-orange?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![CI Pipeline](https://github.com/danjdewhurst/tower-def-js/workflows/CI%20Pipeline/badge.svg)](https://github.com/danjdewhurst/tower-def-js/actions/workflows/ci.yml)
[![Code Quality](https://github.com/danjdewhurst/tower-def-js/workflows/Code%20Quality/badge.svg)](https://github.com/danjdewhurst/tower-def-js/actions/workflows/code-quality.yml)
[![Test Suite](https://github.com/danjdewhurst/tower-def-js/workflows/Comprehensive%20Test%20Suite/badge.svg)](https://github.com/danjdewhurst/tower-def-js/actions/workflows/test-suite.yml)

## 🎮 Game Features

- **11 Unique Levels**: From simple S-curves to complex multi-path mazes
- **3 Tower Types**: Basic, Sniper, and Rapid-Fire with distinct strategies
- **Smooth 60fps Gameplay**: Optimized rendering and game loop
- **Procedural Audio**: Dynamic sound effects using Web Audio API
- **Visual Effects**: Particle systems for explosions and muzzle flash
- **Progress Tracking**: Level unlocking system with localStorage persistence
- **Responsive Design**: Scales to different screen sizes

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.2.17 or higher

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/danjdewhurst/tower-def-js.git
cd tower-def-js

# Install dependencies
bun install

# Start the development server
bun --hot ./index.ts
```

Visit `http://localhost:3000` to play the game!

## 🏗️ Architecture

### Core Systems

- **Entity-Component System**: Modular architecture with `Entity` base class
- **Grid-Based Pathfinding**: 50x50 logical grid with pixel-perfect rendering
- **Performance Optimized**: Object pooling and efficient collision detection
- **State Management**: Clean separation between game states and UI

### Project Structure

```
src/
├── config/          # Configuration files
│   └── TowerConfig.ts # Tower statistics and settings
├── engine/          # Core game engine
│   ├── Game.ts      # Main game loop and state management
│   ├── Renderer.ts  # Canvas rendering system
│   ├── AudioManager.ts # Procedural sound effects
│   ├── ParticleSystem.ts # Visual effects
│   ├── Camera.ts    # Camera and viewport management
│   ├── SaveManager.ts # Game progress persistence
│   └── TowerPlacement.ts # Tower placement logic
├── entities/        # Game objects
│   ├── Entity.ts    # Base entity class
│   ├── Tower.ts     # Tower types and logic
│   ├── Enemy.ts     # Enemy pathfinding and health
│   └── Projectile.ts # Bullet physics and collision
├── interfaces/      # TypeScript interfaces
│   ├── IGameStateManager.ts
│   ├── IInputManager.ts
│   ├── IUIManager.ts
│   └── IWaveManager.ts
├── levels/          # Level definitions (11 levels)
│   ├── index.ts     # Level registry
│   └── level*.ts    # Individual level configurations
├── managers/        # Game state management
│   ├── GameStateManager.ts
│   ├── InputManager.ts
│   ├── UIManager.ts
│   └── WaveManager.ts
├── testing/         # Test suites
│   ├── PerformanceTestSuite.ts
│   ├── StressTestSuite.ts
│   └── UITestSuite.ts
├── ui/              # User interface
│   └── LevelSelector.ts # Level selection screen
├── types/           # TypeScript type definitions
│   ├── Game.ts
│   └── Level.ts
└── utils/           # Utility functions
    └── PathfindingUtils.ts
```

## 🎯 Tower Types

| Tower | Cost | Range | Damage | Fire Rate | Best For |
|-------|------|-------|--------|-----------|----------|
| **Basic** 🟢 | $50 | 3 cells | 50 | 1.0/sec | Balanced defense |
| **Sniper** 🔵 | $100 | 6 cells | 100 | 0.5/sec | Long-range elimination |
| **Rapid-Fire** 🟠 | $75 | 2 cells | 25 | 3.0/sec | Crowd control |

## 🗺️ Levels

The game includes 11 progressive levels with increasing difficulty:

1. **First Steps** - A simple introduction to tower defense
2. **Sharp Turns** - Learn to handle directional changes
3. **The Spiral** - Enemies circle inward to the center
4. **Cross Roads** - Four-way intersection with strategic chokepoints
5. **The Maze** - Complex winding path with multiple decision points
6. **Twin Paths** - Two separate routes require divided attention
7. **The Gauntlet** - Extended challenging pathway
8. **Fortress Assault** - Advanced defensive positioning
9. **The Labyrinth** - Most complex maze design
10. **Twin Spirals** - Dual spiral paths converging
11. **Final Challenge** - Ultimate test of strategic placement

## 🎮 Gameplay

### Objective
Defend your base by strategically placing towers to eliminate waves of enemies before they reach the goal.

### Controls
- **Click**: Place towers on available slots (green squares)
- **Mouse**: Hover over towers to see range indicators
- **UI**: Use the bottom panel to select tower types

### Scoring
- Start with $100-300 depending on level difficulty
- Earn $5 for each enemy eliminated
- Lose 1 life for each enemy that reaches the goal
- Survive all waves to advance to the next level

## 🛠️ Development

### Scripts

```bash
# Development with hot reload
bun --hot ./index.ts

# Code formatting and linting
bun run lint          # Check code quality
bun run lint:fix      # Auto-fix linting issues
bun run format        # Check formatting
bun run format:fix    # Auto-format code
bun run fix           # Fix both linting and formatting

# Testing
bun test              # Run test suite
```

### Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime with built-in bundler
- **Language**: TypeScript 5.0+ for type safety
- **Graphics**: HTML5 Canvas API for 2D rendering
- **Audio**: Web Audio API for procedural sound generation
- **Storage**: localStorage for game progress persistence
- **Development**: Hot module replacement and automatic bundling

### Code Quality

- **Biome**: Integrated linting and formatting
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Strict type checking enabled
- **Testing**: Bun's built-in test runner

## 🎨 Game Design

### Visual Style
- Minimalist geometric design with clear color coding
- Grid-based layout for intuitive tower placement
- Particle effects for engaging combat feedback
- Smooth animations with delta-time calculations

### Audio Design
- Procedural sound generation using Web Audio API
- Distinct audio cues for different game events
- No external audio files required

### Performance
- Maintains 60fps on modern browsers
- Efficient entity management with object pooling
- Optimized collision detection algorithms
- Minimal memory allocation during gameplay

## 📈 Future Enhancements

- Additional tower types and upgrade system
- More complex enemy varieties with special abilities
- Multiplayer support with WebSocket integration
- Level editor for community-created content
- Achievement system and statistics tracking

## 🤝 Contributing

This is an educational testing repository for personal use. Contributions are not being accepted at this time.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with [Bun](https://bun.sh) - the fast all-in-one JavaScript runtime that makes development a joy.
