import { TileType, Vector2 } from './types';
import { TILE_SIZE } from './constants';

export class Grid {
    private tiles: TileType[][];
    private width: number;
    private height: number;

    constructor(width: number, height: number, initialTiles?: TileType[][]) {
        this.width = width;
        this.height = height;
        this.tiles = initialTiles || Array.from({ length: height }, () => Array(width).fill(TileType.Empty));
    }

    getTile(x: number, y: number): TileType {
        if (!this.isValid(x, y)) return TileType.Bedrock; // Treat out of bounds as solid
        return this.tiles[y][x];
    }

    setTile(x: number, y: number, type: TileType): boolean {
        if (!this.isValid(x, y)) return false;
        this.tiles[y][x] = type;
        return true;
    }

    isValid(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    isSolid(x: number, y: number): boolean {
        const tile = this.getTile(x, y);
        return tile === TileType.Ground || tile === TileType.Bedrock;
    }

    // Helper to convert world coordinates to grid coordinates
    toGrid(worldX: number, worldY: number): Vector2 {
        return {
            x: Math.floor(worldX / TILE_SIZE),
            y: Math.floor(worldY / TILE_SIZE)
        };
    }
}
