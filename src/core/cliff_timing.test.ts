import { describe, expect, it } from 'vitest';
import { TILE_SIZE } from './constants';
import { Villager } from './entity';
import { Grid } from './grid';
import { TileType } from './types';

describe('Cliff Detection Timing', () => {
    it('should NOT turn back immediately upon entering a tile with a cliff ahead', () => {
        // Grid setup:
        // Row 2: Ground, Ground, Empty (Cliff at x=2)
        // Row 3: Ground, Ground, Empty (Deep drop)
        const grid = new Grid(10, 5, [
            [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
            [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
            [TileType.Ground, TileType.Ground, TileType.Empty, TileType.Empty, TileType.Empty], // Floor (y=2)
            [TileType.Ground, TileType.Ground, TileType.Empty, TileType.Empty, TileType.Empty], // Drop 1 (y=3)
            [TileType.Ground, TileType.Ground, TileType.Empty, TileType.Empty, TileType.Empty], // Drop 2 (y=4) - Deep!
        ]);

        // Place villager at START of Tile 1 (x=1). Position x slightly > 1*TILE_SIZE.
        const startX = 1 * TILE_SIZE + 1; // Just crossed boundary
        const v = new Villager(startX, 96); // Assuming 96 is ground level matching prev test
        v.position.y = 96;
        v.isGrounded = true;
        v.velocity.x = 100;

        // At this point, getting `nextGridX` (2) returns a CLIFF.
        // But we are at the START of Tile 1. We should keep walking until we are close to the edge.
        v.update(0.1, grid);

        // If it turns back immediately, velocity < 0.
        // We WANT it to NOT turn back yet (velocity > 0).
        expect(v.velocity.x).toBeGreaterThan(0);
    });

    it('should descend a 1-block drop correctly', () => {
        // Row 2: Ground, Ground, Empty   (Cliff at x=2)
        // Row 3: Ground, Ground, Ground  (Landing at x=2, y=3) - 1 block drop
        const grid = new Grid(10, 5, [
            [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
            [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
            [TileType.Ground, TileType.Ground, TileType.Empty, TileType.Empty, TileType.Empty],
            [TileType.Ground, TileType.Ground, TileType.Ground, TileType.Empty, TileType.Empty],
            [TileType.Ground, TileType.Ground, TileType.Ground, TileType.Ground, TileType.Ground],
        ]);

        const v = new Villager(1 * TILE_SIZE + 24, 96); // Center of Tile 1
        v.position.y = 96;
        v.isGrounded = true;
        v.velocity.x = 100;

        // Execute update to check logic
        v.update(0.1, grid);

        // Should NOT turn back
        expect(v.velocity.x).toBeGreaterThan(0);
    });
});
