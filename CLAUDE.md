# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Repository**: https://github.com/danjdewhurst/tower-def-js

---
description: Use Bun instead of Node.js, npm, pnpm, or vite.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## Git and GitHub

Use Git CLI and GitHub CLI for all git and GitHub operations:

- Use `git` commands for version control operations (commit, push, pull, branch, etc.)
- Use `gh` commands for GitHub-specific actions (creating repos, PRs, issues, etc.)
- Prefer command-line tools over web interface for automation and consistency

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";

// import .css files directly and it works
import './index.css';

import { createRoot } from "react-dom/client";

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.

# Tower Defense Game Architecture

This is a complete tower defense game built with TypeScript, Canvas API, and Bun. The game features a modular entity-component architecture optimized for 60fps performance.

## Development Commands

- **Start development server**: `bun --hot ./index.ts` (runs on http://localhost:3000)
- **Run tests**: `bun test` (comprehensive test suite with 172 tests)
- **Build**: Not needed - Bun handles bundling automatically via HTML imports

## Quality Assurance

The project includes a comprehensive test suite covering all game systems:

- **172 tests** with 100% pass rate covering unit, integration, performance, and UI testing
- **Performance testing** validates 60fps target under various load conditions  
- **Stress testing** covers memory management, boundary values, and edge cases
- **UI testing** validates canvas + HTML hybrid interface and accessibility
- **Manual testing checklist** with 200+ checkpoints for comprehensive QA

## Core Architecture

### Game Engine (`src/engine/`)
- **Game.ts**: Main game loop, state management, entity updates, input handling
- **Renderer.ts**: Canvas-based rendering system with grid/pixel coordinate conversion
- **AudioManager.ts**: Web Audio API sound effects with procedural tone generation
- **ParticleSystem.ts**: Visual effects for muzzle flash, explosions, impacts
- **SaveManager.ts**: localStorage progress system with level unlocking

### Entity System (`src/entities/`)
- **Entity.ts**: Base class with position and update loop
- **Enemy.ts**: Red circles that follow predefined paths with health/damage
- **Tower.ts**: Three types (Basic, Sniper, Rapid-Fire) with different stats
- **Projectile.ts**: Yellow bullets with collision detection and targeting

### Level System (`src/levels/`)
- **Grid-based**: 50x50 cells with enum types (PATH, TOWER_SLOT, BLOCKED, SPAWN, GOAL)
- **Wave configuration**: Spawn timing, enemy counts, difficulty progression
- **Eleven levels**: Progressive difficulty from basic S-curve to complex multi-path layouts
- **Auto-generated thumbnails**: For level selector previews

### UI System (`src/ui/`)
- **LevelSelector.ts**: Grid layout with thumbnails, difficulty stars, progress tracking
- **HTML overlays**: HUD with money/lives/wave counters, tower selection bar
- **State management**: Menu ↔ Game navigation with show/hide containers

## Key Design Patterns

### Entity-Component Architecture
All game objects extend `Entity` base class with `position` and `update()`. Game.ts manages all entities in arrays and calls update/render in main loop.

### Grid-Pixel Coordinate System
- **Grid**: 50x50 logical game grid for pathfinding and placement
- **Pixel**: 1500x1500 canvas coordinates for smooth movement/rendering
- **Conversion**: Renderer handles grid↔pixel conversion with 30px cell size

### Configuration-Driven Levels
Levels are TypeScript objects with `LevelConfig` interface containing grid layout and wave definitions. Easy to create new levels by defining path coordinates and wave parameters.

### Performance Optimizations
- **Object pooling**: Entities filtered/reused rather than created/destroyed
- **Efficient rendering**: Single render pass with minimal canvas state changes  
- **Delta time**: Frame-rate independent animation with `requestAnimationFrame`

## Tower Defense Game Logic

### Core Game Loop (60fps)
1. Update all entities with delta time
2. Handle tower targeting and shooting
3. Process projectile collisions  
4. Clean up dead/completed entities
5. Check wave completion and win/loss
6. Render all visual elements

### Economic System
- Start with $100-300 (varies by level)
- Towers cost $50-100 depending on type
- Earn $5 per enemy killed
- Lose 1 life per enemy that reaches goal

### Tower Types and Balance
- **Basic**: Balanced stats, $50, green squares with "B"
- **Sniper**: Long range (6 cells), high damage, slow fire rate, $100, blue with "S"  
- **Rapid-Fire**: Short range, low damage, fast fire rate, $75, orange with "R"

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.