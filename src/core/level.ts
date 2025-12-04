import { TileType, Vector2 } from './types';

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
