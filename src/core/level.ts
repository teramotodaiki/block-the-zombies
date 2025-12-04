import { TileType, type Vector2 } from './types';

export interface SpawnPoint {
    position: Vector2; // Grid coordinates
    interval: number; // ms
    count: number;
}

export interface ZombieSpawn {
    position: Vector2; // Grid coordinates
    time: number; // ms from start
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

export const LEVELS: LevelConfig[] = [
    {
        id: 'plains-1',
        biome: 'plains',
        width: 16,
        height: 12,
        tiles: parseLevelGrid([
            '................',
            '................',
            '................',
            '................',
            '................',
            '................',
            '................',
            '................',
            '..............**',
            '..............**',
            'GGGGG.GGGGGGGGGG',
            '################',
        ]),
        villagerSpawn: { position: { x: 1, y: 9 }, interval: 2000, count: 5 },
        zombieSpawns: [],
        goal: { position: { x: 14, y: 9 }, requiredCount: 3 },
        maxBlocks: 10,
        forbiddenTiles: [],
    },
];

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
                    row.push(TileType.Empty);
                    break;
            }
        }
        tiles.push(row);
    }
    return tiles;
}
