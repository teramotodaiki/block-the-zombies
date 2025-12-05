import { type LevelConfig, parseLevelGrid } from '../../core/level';

export const PLAINS_05: LevelConfig = {
    id: 'plains-05',
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
        'GG..............',
        'GG..MMMMMMMM..GG',
        'GGGGMMMMMMMMGGGG',
        '################',
    ]),
    villagerSpawn: { position: { x: 1, y: 7 }, interval: 2000, count: 5 },
    zombieSpawns: [
        { position: { x: 14, y: 7 }, time: 8000 },
        { position: { x: 1, y: 7 }, time: 15000 }
    ],
    goal: { position: { x: 14, y: 7 }, requiredCount: 3 },
    maxBlocks: 12,
    forbiddenTiles: [],
};
