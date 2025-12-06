import { type LevelConfig, parseLevelGrid } from '../../core/level';

export const PLAINS_06: LevelConfig = {
    id: 'plains-06',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '................',
        '..............**', // 2x2 Goal at 14,15
        '..............**',
        'GGGG...GGGG.....',
        'GGGG...GGGG.....',
        '####M######M####',
        '################',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 5 }, interval: 2500, count: 3 },
    zombieSpawns: [
        { position: { x: 5, y: 6 }, time: 0, interval: 3000 },
        { position: { x: 10, y: 6 }, time: 1500, interval: 3000 }
    ],
    goal: { position: { x: 15, y: 4 }, requiredCount: 3 },
    maxBlocks: 15,
    forbiddenTiles: [],
};
