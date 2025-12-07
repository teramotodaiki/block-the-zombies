import { describe, it, expect, beforeEach } from 'vitest';
import { Villager } from './entity';
import { Grid } from './grid';
import { TileType, Direction } from './types';
import { TILE_SIZE, MOVE_SPEED } from './constants';

describe('Stair Movement Bug', () => {
    let grid: Grid;
    let villager: Villager;

    beforeEach(() => {
        // 10x10 grid (TILE_SIZE = 48)
        grid = new Grid(10, 10);
        // Fill floor at y=9
        for (let x = 0; x < 10; x++) {
            grid.setTile(x, 9, TileType.Ground);
        }
        // Floor y=9 means top is at 9*48 = 432.
        // Villager height 96. Center offset 48.
        // Standing position y = 432 - 48 = 384.
    });

    it('should climb a single tile step perfectly aligned', () => {
        // Setup a step at x=2, y=8
        grid.setTile(2, 8, TileType.Ground);

        const startY = 9 * TILE_SIZE - 48; // 384
        villager = new Villager(1 * TILE_SIZE + 16, startY);
        villager.isGrounded = true;
        villager.direction = Direction.Right;
        villager.velocity.x = MOVE_SPEED;

        // Move towards x=2 (starts at 96px)
        // Need to cover 16px. Speed 100. 0.2s is enough.
        const delta = 0.2;
        villager.update(delta, grid);

        // Should have climbed to top of tile 8
        // Tile 8 top = 8 * 48 = 384.
        // New position y = 384 - 48 = 336.
        expect(villager.position.y).toBe(336);
    });

    it('should climb a single tile step when slightly sunk (epsilon issue)', () => {
        grid.setTile(2, 8, TileType.Ground);

        const startY = 9 * TILE_SIZE - 48; // 384
        // Sunk by 0.2 pixels
        villager = new Villager(1 * TILE_SIZE + 16, startY + 0.2);
        villager.isGrounded = true;
        villager.direction = Direction.Right;
        villager.velocity.x = MOVE_SPEED;

        const delta = 0.2;
        villager.update(delta, grid);

        // Expected to climb to 336
        expect(villager.position.y).toBe(336);
    });

    it('should descend a single tile step without turning back', () => {
        // Setup:
        // x=0..2: Floor at y=8
        // x=3..9: Floor at y=9
        // Villager at x=2, walking Right.
        grid.setTile(0, 8, TileType.Ground);
        grid.setTile(1, 8, TileType.Ground);
        grid.setTile(2, 8, TileType.Ground);
        // Clean y=9 under these? No, solid is fine.
        // But for "step down" usually it means y=8 is empty at x=3.
        // And y=9 is solid at x=3.

        grid.setTile(3, 8, TileType.Empty);
        grid.setTile(3, 9, TileType.Ground);

        // Provide floor for start
        grid.setTile(2, 9, TileType.Ground); // Just to be safe below solid

        // Standing on tile 8. Top = 384.
        // Pos y = 384 - 48 = 336.
        villager = new Villager(2.5 * TILE_SIZE, 336);
        villager.isGrounded = true;
        villager.direction = Direction.Right;

        const delta = 0.1;
        villager.update(delta, grid);

        // Should NOT turn back
        expect(villager.direction).toBe(Direction.Right);
    });

    it('should descend a single tile step when slightly floating (epsilon issue)', () => {
        // x=3 is hole (y=8), floor at y=9.
        grid.setTile(2, 8, TileType.Ground);
        grid.setTile(3, 8, TileType.Empty);
        grid.setTile(3, 9, TileType.Ground);

        // Floating by 0.2 pixels (y decreased)
        // Correct y = 336. Floating y = 335.8.
        villager = new Villager(2.5 * TILE_SIZE, 335.8);
        villager.isGrounded = true;
        villager.direction = Direction.Right;

        villager.update(0.1, grid);

        expect(villager.direction).toBe(Direction.Right);
    });
});
