import { describe, it, expect } from 'vitest';
import { Villager } from './entity';
import { Grid } from './grid';
import { TileType, Direction } from './types';
import { TILE_SIZE, MOVE_SPEED } from './constants';

describe('Stair Path Integration Test', () => {
    it('should traverse a staircase up and down successfully', () => {
        // Create a 20x10 grid
        const grid = new Grid(20, 10);
        // Fill base floor
        for (let x = 0; x < 20; x++) {
            grid.setTile(x, 9, TileType.Ground);
        }

        // Build Staircase
        // x=5: y=8
        // x=6: y=7
        // x=7: y=6
        // x=8: y=7
        // x=9: y=8

        grid.setTile(5, 8, TileType.Ground);

        grid.setTile(6, 8, TileType.Ground);
        grid.setTile(6, 7, TileType.Ground);

        grid.setTile(7, 8, TileType.Ground);
        grid.setTile(7, 7, TileType.Ground);
        grid.setTile(7, 6, TileType.Ground);

        grid.setTile(8, 8, TileType.Ground);
        grid.setTile(8, 7, TileType.Ground);

        grid.setTile(9, 8, TileType.Ground);

        // Villager starts at x=2.
        const startY = 9 * 48 - 48; // 384
        const villager = new Villager(2 * 48, startY);
        villager.isGrounded = true;
        villager.direction = Direction.Right;
        villager.velocity.x = MOVE_SPEED;

        // Simulate frames
        // Distance to cover: from x=2 to x=12. 10 * 48 = 480px.
        // Speed 100. Time = 4.8s.
        // Let's run for 6 seconds at 60fps.

        const dt = 1 / 60;
        const frames = 6 * 60;

        let maxHeightReached = startY;

        for (let i = 0; i < frames; i++) {
            villager.update(dt, grid);
            if (villager.position.y < maxHeightReached) {
                maxHeightReached = villager.position.y;
            }
        }

        // Check strict outcomes
        // 1. Should be past the stairs (x > 9 * 48)
        expect(villager.position.x).toBeGreaterThan(11 * 48);

        // 2. Should be at floor level again (y = 384)
        // Might be drifting slightly? No, snaps.
        expect(villager.position.y).toBe(384);

        // 3. Should have climbed to top (y=6 -> pos 6*48-48 = 240)
        // StartY 384.
        // 1 step up (8) -> 336.
        // 2 step up (7) -> 288.
        // 3 step up (6) -> 240.
        expect(maxHeightReached).toBe(240);
    });
});
