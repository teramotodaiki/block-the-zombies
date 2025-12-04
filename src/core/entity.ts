import { Vector2, Direction } from './types';
import { GRAVITY, MOVE_SPEED, MAX_FALL_SPEED, TILE_SIZE } from './constants';
import { Grid } from './grid';

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
        // Simple collision detection (treat entity as a single point at bottom center for simplicity first, or box)
        // For this game, tile-based collision is usually sufficient.
        // Let's check the tile at the bottom-center of the entity.

        // Check horizontal collision
        // If moving right
        if (this.velocity.x > 0) {
            const rightEdge = nextX + this.width / 2;
            const tileX = Math.floor(rightEdge / TILE_SIZE);
            const tileY = Math.floor((this.position.y - 1) / TILE_SIZE); // Check slightly above bottom
            if (grid.isSolid(tileX, tileY)) {
                this.velocity.x *= -1; // Bounce/Turn
                return;
            }
        } else if (this.velocity.x < 0) {
            const leftEdge = nextX - this.width / 2;
            const tileX = Math.floor(leftEdge / TILE_SIZE);
            const tileY = Math.floor((this.position.y - 1) / TILE_SIZE);
            if (grid.isSolid(tileX, tileY)) {
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
            const bottomEdge = nextY + this.height / 2; // Bottom relative to center
            const tileX = Math.floor(this.position.x / TILE_SIZE);
            const tileY = Math.floor(bottomEdge / TILE_SIZE);

            // Check if we entered a solid tile
            if (grid.isSolid(tileX, tileY)) {
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
