import { describe, expect, it } from 'vitest';
import { TILE_SIZE } from './constants';
import { Villager } from './entity';
import { Grid } from './grid';
import { TileType } from './types';

describe('Smart Cliff Detection', () => {
    it('should turn back at a 2-block deep cliff', () => {
        // Setup Grid
        // Grid must be deeper to accommodate entity height (96px = 2 tiles) + headroom
        // Row 0: Empty (Head room)
        // Row 1: Empty (Body room)
        // Row 2: Ground (Floor)
        // Row 3: Ground ... Empty (Drop 1)
        // Row 4: Ground ... Empty (Drop 2) - At x=2
        const grid = new Grid(10, 6, [
            [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
            [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
            [TileType.Ground, TileType.Ground, TileType.Empty, TileType.Empty, TileType.Empty], // Floor at y=2
            [TileType.Ground, TileType.Ground, TileType.Empty, TileType.Empty, TileType.Empty], // y=3
            [TileType.Ground, TileType.Ground, TileType.Empty, TileType.Empty, TileType.Empty], // y=4
            [TileType.Ground, TileType.Ground, TileType.Ground, TileType.Ground, TileType.Ground], // y=5 (Bottom)
        ]);

        // Spawn Villager at x=1, y=2
        // Standing on Row 2 (Index 2).
        // Feet Y = 3 * 48 = 144.
        // Center Y = 144 - 48 = 96.
        // Needs to be past center of Tile 1 (48..96). Center=72.
        // Spawning at 1*48 + 32 = 80. 80 > 72. Should trigger check.
        const v = new Villager(1 * TILE_SIZE + 32, 96);
        v.position.y = 96;
        v.isGrounded = true;
        v.velocity.x = 100;

        v.update(0.1, grid);

        expect(v.velocity.x).toBeLessThan(0); // Should turn left
    });

    it('should NOT turn back at a 1-block drop', () => {
        // Row 0: Empty
        // Row 1: Empty
        // Row 2: Ground ... Empty (Drop start x=2)
        // Row 3: Ground ... Ground (Landing x=2)
        const grid = new Grid(10, 6, [
            [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
            [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
            [TileType.Ground, TileType.Ground, TileType.Empty, TileType.Empty, TileType.Empty], // Floor at y=2
            [TileType.Ground, TileType.Ground, TileType.Ground, TileType.Empty, TileType.Empty], // Landing at y=3
            [TileType.Ground, TileType.Ground, TileType.Ground, TileType.Ground, TileType.Ground],
            [TileType.Ground, TileType.Ground, TileType.Ground, TileType.Ground, TileType.Ground],
        ]);

        const v = new Villager(1 * TILE_SIZE + 16, 96);
        v.position.y = 96;
        v.isGrounded = true;
        v.velocity.x = 100;

        v.update(0.1, grid);

        expect(v.velocity.x).toBeGreaterThan(0); // Should continue right
    });
});
