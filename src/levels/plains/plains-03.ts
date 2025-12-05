import { type LevelConfig, parseLevelGrid } from '../../core/level';

export const PLAINS_03: LevelConfig = {
    id: 'plains-03',
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
        '.........**.....',
        '.........**.....',
        'GGGGGGGGGGGGGGGG',
        '################',
    ]),
    villagerSpawn: { position: { x: 1, y: 9 }, interval: 3000, count: 3 },
    zombieSpawns: [
        { position: { x: 14, y: 9 }, time: 1000 }, // Zombie spawns near goal early
    ],
    goal: { position: { x: 13, y: 7 }, requiredCount: 3 }, // Goal is slightly elevated or just at the end
    maxBlocks: 5,
    forbiddenTiles: [],
};
