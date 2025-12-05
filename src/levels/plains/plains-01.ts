import { type LevelConfig, parseLevelGrid } from '../../core/level';

export const PLAINS_01: LevelConfig = {
    id: 'plains-01',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '................',
        '................',
        '.........**.....',
        '.........**.....',
        'GG.....GGGGGGGGG',
        'GG.....GGGGGGGGG',
        '################',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 1, y: 7 }, interval: 2000, count: 3 },
    zombieSpawns: [],
    goal: { position: { x: 9, y: 5 }, requiredCount: 3 },
    maxBlocks: 5,
    forbiddenTiles: [],
};
