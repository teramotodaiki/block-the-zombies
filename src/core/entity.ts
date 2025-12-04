import { GRAVITY, MAX_FALL_SPEED, MOVE_SPEED, TILE_SIZE } from './constants';
import type { Grid } from './grid';
import { Direction, type Vector2 } from './types';

export abstract class Entity {
    position: Vector2;
    velocity: Vector2;
    width: number;
    height: number;
    isGrounded: boolean;
    isDead: boolean;

    constructor(x: number, y: number, width: number, height: number) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.width = width;
        this.height = height;
        this.isGrounded = false;
        this.isDead = false;
    }

    abstract update(delta: number, grid: Grid): void;

    protected applyGravity(delta: number) {
        this.velocity.y += GRAVITY * delta;
        if (this.velocity.y > MAX_FALL_SPEED) {
            this.velocity.y = MAX_FALL_SPEED;
        }
    }

    protected moveX(delta: number, grid: Grid) {
        const nextX = this.position.x + this.velocity.x * delta;
        const topY = this.position.y - this.height; // Top is y - height (since y is bottom center? No, y is center? Let's check constructor)
        // Constructor: this.position = { x, y };
        // moveY logic: this.position.y = tileY * TILE_SIZE - this.height / 2;
        // This implies position.y is the CENTER of the entity.
        // So Top = y - height / 2.
        // Bottom = y + height / 2.

        const topEdge = this.position.y - this.height / 2;
        const bottomEdge = this.position.y + this.height / 2 - 0.1; // Epsilon to avoid checking tile below when standing exactly on it

        // Check horizontal collision
        if (this.velocity.x > 0) {
            const rightEdge = nextX + this.width / 2;
            const tileX = Math.floor(rightEdge / TILE_SIZE);

            // Check all vertical tiles occupied by the entity
            const startTileY = Math.floor(topEdge / TILE_SIZE);
            const endTileY = Math.floor(bottomEdge / TILE_SIZE);

            let collision = false;
            for (let ty = startTileY; ty <= endTileY; ty++) {
                if (grid.isSolid(tileX, ty)) {
                    collision = true;
                    break;
                }
            }

            if (collision) {
                this.velocity.x *= -1;
                return;
            }
        } else if (this.velocity.x < 0) {
            const leftEdge = nextX - this.width / 2;
            const tileX = Math.floor(leftEdge / TILE_SIZE);

            const startTileY = Math.floor(topEdge / TILE_SIZE);
            const endTileY = Math.floor(bottomEdge / TILE_SIZE);

            let collision = false;
            for (let ty = startTileY; ty <= endTileY; ty++) {
                if (grid.isSolid(tileX, ty)) {
                    collision = true;
                    break;
                }
            }

            if (collision) {
                this.velocity.x *= -1;
                return;
            }
        }

        this.position.x = nextX;
    }

    protected moveY(delta: number, grid: Grid) {
        const nextY = this.position.y + this.velocity.y * delta;

        // Check downward collision (landing)
        if (this.velocity.y > 0) {
            const bottomEdge = nextY + this.height / 2;
            const tileY = Math.floor(bottomEdge / TILE_SIZE);

            const leftEdge = this.position.x - this.width / 2;
            const rightEdge = this.position.x + this.width / 2;

            const startTileX = Math.floor(leftEdge / TILE_SIZE);
            const endTileX = Math.floor(rightEdge / TILE_SIZE);

            let collision = false;
            for (let tx = startTileX; tx <= endTileX; tx++) {
                if (grid.isSolid(tx, tileY)) {
                    collision = true;
                    break;
                }
            }

            // Check if we entered a solid tile
            if (collision) {
                // Landed
                // Snap so bottom edge is at top of tile
                this.position.y = tileY * TILE_SIZE - this.height / 2;
                this.velocity.y = 0;
                this.isGrounded = true;
                return;
            }
        }

        this.position.y = nextY;
        this.isGrounded = false;
    }
}

export class Villager extends Entity {
    direction: Direction;

    constructor(x: number, y: number) {
        super(x, y, 32, 96); // Height 96 (2 tiles)
        this.direction = Direction.Right;
        this.velocity.x = MOVE_SPEED;
    }

    update(delta: number, grid: Grid) {
        if (this.isDead) return;

        this.applyGravity(delta);

        // Auto-walk
        this.velocity.x = this.direction * MOVE_SPEED;

        // Check for wall ahead (1 block high)
        // If wall is 1 block high, can we climb?
        // Spec says: "Can climb 1 block high steps. Cannot climb 2 blocks."
        // Implementation: If wall ahead, check tile above it. If empty, jump/snap up.

        this.moveX(delta, grid);
        this.moveY(delta, grid);

        // Update direction based on velocity (if it flipped due to collision)
        if (this.velocity.x > 0) this.direction = Direction.Right;
        if (this.velocity.x < 0) this.direction = Direction.Left;
    }
}

export class Zombie extends Entity {
    direction: Direction;

    constructor(x: number, y: number) {
        super(x, y, 32, 48);
        this.direction = Direction.Right; // Or random?
        this.velocity.x = MOVE_SPEED; // Maybe slower?
    }

    update(delta: number, grid: Grid) {
        if (this.isDead) return;

        this.applyGravity(delta);
        this.velocity.x = this.direction * MOVE_SPEED;

        this.moveX(delta, grid);
        this.moveY(delta, grid);

        if (this.velocity.x > 0) this.direction = Direction.Right;
        if (this.velocity.x < 0) this.direction = Direction.Left;
    }
}
