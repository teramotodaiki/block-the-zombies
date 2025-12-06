import { TileType, type Vector2 } from './types';

export interface SpawnPoint {
    position: Vector2; // Grid coordinates
    interval: number; // ms
    count: number;
}

export interface ZombieSpawn {
    position: Vector2; // Grid coordinates
    time: number; // ms from start
    interval?: number; // ms, if periodic
}

export interface LevelConfig {
    id: string;
    biome: string;
    width: number;
    height: number;
    tiles: TileType[][]; // [y][x]
    villagerSpawn: SpawnPoint;
    zombieSpawns: ZombieSpawn[];
    goal: {
        position: Vector2; // Grid coordinates
        requiredCount: number;
    };
    maxBlocks: number;
    forbiddenTiles: Vector2[];
}

// LEVELS constant moved to src/levels/index.ts

export function parseLevelGrid(grid: string[]): TileType[][] {
    const height = grid.length;
    const width = grid[0].length;
    const tiles: TileType[][] = [];

    for (let y = 0; y < height; y++) {
        const row: TileType[] = [];
        const line = grid[y];
        for (let x = 0; x < width; x++) {
            const char = line[x];
            switch (char) {
                case '.':
                    row.push(TileType.Empty);
                    break;
                case '#':
                    row.push(TileType.Bedrock);
                    break;
                case 'G':
                    row.push(TileType.Ground);
                    break;
                case 'M':
                    row.push(TileType.Magma);
                    break;
                case '*':
                    row.push(TileType.Goal);
                    break;
                default:
                    // Strict mode: throw error on unknown character
                    throw new Error(`Invalid character '${char}' in level grid at row ${y}, col ${x}`);
            }
        }
        tiles.push(row);
    }
    return tiles;
}
