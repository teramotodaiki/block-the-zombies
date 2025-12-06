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

        const topEdge = this.position.y - this.height / 2;
        const bottomEdge = this.position.y + this.height / 2 - 0.1; // Epsilon to avoid checking tile below when standing exactly on it

        // Check horizontal collision
        let collision = false;
        let wallTileX = -1;
        let wallTileY = -1;

        if (this.velocity.x > 0) {
            const rightEdge = nextX + this.width / 2;
            const tileX = Math.floor(rightEdge / TILE_SIZE);
            const startTileY = Math.floor(topEdge / TILE_SIZE);
            const endTileY = Math.floor(bottomEdge / TILE_SIZE);

            for (let ty = startTileY; ty <= endTileY; ty++) {
                if (grid.isSolid(tileX, ty)) {
                    collision = true;
                    wallTileX = tileX;
                    wallTileY = ty;
                    break;
                }
            }
        } else if (this.velocity.x < 0) {
            const leftEdge = nextX - this.width / 2;
            const tileX = Math.floor(leftEdge / TILE_SIZE);
            const startTileY = Math.floor(topEdge / TILE_SIZE);
            const endTileY = Math.floor(bottomEdge / TILE_SIZE);

            for (let ty = startTileY; ty <= endTileY; ty++) {
                if (grid.isSolid(tileX, ty)) {
                    collision = true;
                    wallTileX = tileX;
                    wallTileY = ty;
                    break;
                }
            }
        }

        if (collision) {
            if (this.isGrounded) {
                // Check if the collision is at foot level
                const footTileY = Math.floor(
                    (this.position.y + this.height / 2 - 0.1) / TILE_SIZE,
                );

                // If the wall we hit is at foot level
                if (wallTileY === footTileY) {
                    // Check tile above the wall
                    // Also check tile above our head (to ensure we don't bump head when climbing)
                    // Actually, we just need to check if (wallTileX, wallTileY - 1) is not solid.
                    if (!grid.isSolid(wallTileX, wallTileY - 1)) {
                        // Climb!
                        this.position.y =
                            wallTileY * TILE_SIZE - this.height / 2;
                        this.position.x = nextX;
                        return;
                    }
                }
            }

            this.velocity.x *= -1;
            return;
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

        // Check out of bounds (Bottom)
        if (this.position.y > grid.height * TILE_SIZE + 200) {
            this.isDead = true;
        }
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

        // Cliff Detection
        if (this.isGrounded) {
            const lookAheadX = this.direction === Direction.Right ? 1 : -1;

            // Check if we are close enough to the edge to care
            // Only check if we are in the latter half of the tile in moving direction
            const offsetX = this.position.x % TILE_SIZE;
            const inRightHalf = offsetX > TILE_SIZE / 2;
            const inLeftHalf = offsetX < TILE_SIZE / 2;

            // Determine if we should perform the check based on position within tile
            let shouldCheck = false;
            if (this.direction === Direction.Right && inRightHalf) shouldCheck = true;
            if (this.direction === Direction.Left && inLeftHalf) shouldCheck = true;

            if (shouldCheck) {
                const gridY = Math.floor((this.position.y + this.height / 2) / TILE_SIZE); // Tile below Feet
                const currentGridX = Math.floor(this.position.x / TILE_SIZE);
                const nextGridX = currentGridX + lookAheadX;

                // Check if the immediate tile we are stepping onto is empty (Hole)
                if (grid.isValid(nextGridX, gridY) && !grid.isSolid(nextGridX, gridY)) {
                    // It's a drop. Check depth.
                    if (grid.isValid(nextGridX, gridY + 1) && !grid.isSolid(nextGridX, gridY + 1)) {
                        // Drop of 2+, turn back
                        this.direction = this.direction === Direction.Right ? Direction.Left : Direction.Right;
                        this.velocity.x = this.direction * MOVE_SPEED;
                    }
                }
            }
        }

        this.velocity.x = this.direction * MOVE_SPEED;

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

        // Cliff Detection
        if (this.isGrounded) {
            const lookAheadX = this.direction === Direction.Right ? 1 : -1;

            // Check if we are close enough to the edge to care
            // Only check if we are in the latter half of the tile in moving direction
            const offsetX = this.position.x % TILE_SIZE;
            const inRightHalf = offsetX > TILE_SIZE / 2;
            const inLeftHalf = offsetX < TILE_SIZE / 2;

            let shouldCheck = false;
            if (this.direction === Direction.Right && inRightHalf) shouldCheck = true;
            if (this.direction === Direction.Left && inLeftHalf) shouldCheck = true;

            if (shouldCheck) {
                const gridY = Math.floor((this.position.y + this.height / 2) / TILE_SIZE); // Tile below Feet
                const currentGridX = Math.floor(this.position.x / TILE_SIZE);
                const nextGridX = currentGridX + lookAheadX;

                // Check if the immediate tile we are stepping onto is empty (Hole)
                if (grid.isValid(nextGridX, gridY) && !grid.isSolid(nextGridX, gridY)) {
                    // It's a drop. Check depth.
                    if (grid.isValid(nextGridX, gridY + 1) && !grid.isSolid(nextGridX, gridY + 1)) {
                        // Drop of 2+, turn back
                        this.direction = this.direction === Direction.Right ? Direction.Left : Direction.Right;
                        this.velocity.x = this.direction * MOVE_SPEED;
                    }
                }
            }
        }

        this.velocity.x = this.direction * MOVE_SPEED;

        this.moveX(delta, grid);
        this.moveY(delta, grid);

        if (this.velocity.x > 0) this.direction = Direction.Right;
        if (this.velocity.x < 0) this.direction = Direction.Left;
    }
}
