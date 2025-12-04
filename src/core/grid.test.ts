import { describe, it, expect } from 'vitest';
import { Grid } from './grid';
import { TileType } from './types';
import { TILE_SIZE } from './constants';

describe('Grid', () => {
    it('should initialize with empty tiles', () => {
        const grid = new Grid(10, 10);
        expect(grid.getTile(0, 0)).toBe(TileType.Empty);
        expect(grid.getTile(9, 9)).toBe(TileType.Empty);
    });

    it('should set and get tiles', () => {
        const grid = new Grid(10, 10);
        grid.setTile(5, 5, TileType.Ground);
        expect(grid.getTile(5, 5)).toBe(TileType.Ground);
    });

    it('should handle out of bounds', () => {
        const grid = new Grid(10, 10);
        expect(grid.getTile(-1, 0)).toBe(TileType.Bedrock); // Out of bounds is solid
        expect(grid.getTile(10, 0)).toBe(TileType.Bedrock);
        expect(grid.setTile(-1, 0, TileType.Ground)).toBe(false);
    });

    it('should convert world coords to grid coords', () => {
        const grid = new Grid(10, 10);
        const pos = grid.toGrid(TILE_SIZE * 1.5, TILE_SIZE * 2.5);
        expect(pos).toEqual({ x: 1, y: 2 });
    });
});
