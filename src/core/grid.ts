import { TILE_SIZE } from './constants';
import { TileType, type Vector2 } from './types';

export class Grid {
    private tiles: TileType[][];
    private _width: number;
    private _height: number;

    constructor(width: number, height: number, tiles?: TileType[][]) {
        this._width = width;
        this._height = height;
        if (tiles) {
            this.tiles = tiles;
        } else {
            this.tiles = [];
            for (let y = 0; y < height; y++) {
                const row = new Array(width).fill(TileType.Empty);
                this.tiles.push(row);
            }
        }
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
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
            y: Math.floor(worldY / TILE_SIZE),
        };
    }
}
