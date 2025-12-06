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
        '**..............',
        '**..............',
        'GGGGGGGGGGGG....',
        'GGGGGGGGGGG#M#.#', // Bounded Magma (Left #, Right #)
        '############M###',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 8, y: 6 }, interval: 2000, count: 3 },
    zombieSpawns: [],
    goal: { position: { x: 0, y: 5 }, requiredCount: 3 },
    maxBlocks: 15,
    forbiddenTiles: [],
};
