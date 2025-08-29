import { expect, test } from "bun:test";
import { Entity } from "./Entity";

// Concrete implementation for testing the abstract Entity class
class TestEntity extends Entity {
  public updateCalled = false;
  public lastDeltaTime = 0;

  update(deltaTime: number): void {
    this.updateCalled = true;
    this.lastDeltaTime = deltaTime;
  }
}

test("should create entity with position", () => {
  const entity = new TestEntity(10, 20);

  expect(entity.position.x).toBe(10);
  expect(entity.position.y).toBe(20);
});

test("should generate unique id when not provided", () => {
  const entity1 = new TestEntity(0, 0);
  const entity2 = new TestEntity(0, 0);

  expect(entity1.id).toBeDefined();
  expect(entity2.id).toBeDefined();
  expect(entity1.id).not.toBe(entity2.id);
});

test("should use provided id when given", () => {
  const customId = "test-id-123";
  const entity = new TestEntity(0, 0, customId);

  expect(entity.id).toBe(customId);
});

test("should call update method", () => {
  const entity = new TestEntity(0, 0);
  const deltaTime = 0.016;

  expect(entity.updateCalled).toBe(false);
  entity.update(deltaTime);
  expect(entity.updateCalled).toBe(true);
  expect(entity.lastDeltaTime).toBe(deltaTime);
});
