import { type LevelConfig, parseLevelGrid } from '../../core/level';

export const PLAINS_10: LevelConfig = {
    id: 'plains-10',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '..............**',
        '..............**',
        '..............GG',
        '..............GG',
        'GGGGGGGGGGGGGGGG',
        'G.......G......#',
        '#.......#......#',
        '########M#######',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 5 }, interval: 2000, count: 3 },
    zombieSpawns: [{ position: { x: 2, y: 6 }, time: 1000, interval: 2000 }],
    goal: { position: { x: 14, y: 2 }, requiredCount: 3 },
    maxBlocks: 10,
    forbiddenTiles: [],
};
