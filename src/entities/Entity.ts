import type { Position } from "../types/Game";

export abstract class Entity {
  public position: Position;
  public id: string;

  constructor(x: number, y: number, id?: string) {
    this.position = { x, y };
    this.id = id || Math.random().toString(36).substr(2, 9);
  }

  abstract update(deltaTime: number): void;
}
