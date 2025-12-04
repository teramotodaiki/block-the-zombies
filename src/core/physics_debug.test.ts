import { describe, it, expect, beforeEach } from 'vitest';
import { Grid } from './grid';
import { Villager } from './entity';
import { TileType } from './types';
import { TILE_SIZE, MOVE_SPEED } from './constants';

describe('Physics Debug', () => {
    let grid: Grid;
    let villager: Villager;

    beforeEach(() => {
        // 10x10 grid
        grid = new Grid(10, 10);
        // Ground at Y=9
        for (let x = 0; x < 10; x++) {
            grid.setTile(x, 9, TileType.Ground);
        }
        // Villager at (1, 8) -> Standing on (1, 9)
        // Villager height 96 (2 tiles).
        // Center Y should be:
        // Tile 9 Top = 9 * 48 = 432.
        // Villager Bottom = 432.
        // Villager Center = 432 - 48 = 384.
        // Grid Y for 384 is 8.
        // So Villager occupies Tile 7 and 8?
        // Top: 384 - 48 = 336. (Tile 7: 336-384)
        // Bottom: 384 + 48 = 432. (Tile 8: 384-432)
        // Wait, Tile 9 is 432-480.
        // So if Bottom is 432, it is ON TOP of Tile 9.
        // Occupies Tile 7 and 8.

        // Let's spawn at X=1. WorldX = 1 * 48 + 24 = 72.
        // WorldY = 384.
        villager = new Villager(72, 384);
        villager.velocity.x = 0; // Stop movement for falling test
    });

    it('should fall if ground is removed', () => {
        // Verify initial state
        expect(villager.position.y).toBe(384);

        // Update once to settle (gravity might pull down if not exactly snapped)
        villager.update(0.1, grid);
        expect(villager.position.y).toBe(384); // Should be grounded
        expect(villager.isGrounded).toBe(true);

        // Remove ground (and neighbor to prevent catching ledge due to auto-walk)
        grid.setTile(1, 9, TileType.Empty);
        grid.setTile(2, 9, TileType.Empty);

        // Update
        villager.update(0.1, grid);

        // Should fall
        expect(villager.position.y).toBeGreaterThan(384);
        expect(villager.isGrounded).toBe(false);
    });

    it('should collide with wall at feet level', () => {
        // Wall at (3, 8). Villager at (1, 8). Moving Right.
        // Villager occupies Y tiles 7 and 8.
        // If we place wall at (3, 8), it should block the feet.
        grid.setTile(3, 8, TileType.Ground);

        // Move towards wall
        // Distance to wall:
        // Villager X = 72. Width 32. Right Edge = 72 + 16 = 88.
        // Wall X = 3 * 48 = 144.
        // Gap = 144 - 88 = 56.
        // Speed 100. 1 sec to hit.

        for (let i = 0; i < 10; i++) {
            villager.update(0.1, grid);
        }

        // Should stop before entering tile 3
        // Tile 3 starts at 144.
        // Villager Right Edge should be <= 144.
        // Center <= 144 - 16 = 128.
        expect(villager.position.x).toBeLessThanOrEqual(128 + 1); // Tolerance
    });

    it('should collide with wall at head level', () => {
        // Wall at (3, 7). Villager at (1, 8). Occupies 7 and 8.
        grid.setTile(3, 7, TileType.Ground);

        for (let i = 0; i < 10; i++) {
            villager.update(0.1, grid);
        }

        expect(villager.position.x).toBeLessThanOrEqual(128 + 1);
    });
});
