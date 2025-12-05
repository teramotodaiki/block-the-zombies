
import { type LevelConfig, parseLevelGrid } from '../../core/level';

export const PLAINS_02: LevelConfig = {
    id: 'plains-02',
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
};
