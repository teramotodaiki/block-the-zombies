import { type LevelConfig, parseLevelGrid } from '../../core/level';

export const PLAINS_11: LevelConfig = {
    id: 'plains-11',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '.......**.......',
        '.......**.......',
        '.......GG.......',
        '.......GG.......', // y=5
        'GG............GG', // y=6
        'GG............GG',
        '################',
        '#M############M#', // y=9. Bounded Magma.
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 5 }, interval: 1000, count: 3 }, // y=5 is air above y=6(G). Correct.
    zombieSpawns: [
        { position: { x: 15, y: 5 }, time: 500, interval: 1500 },
        { position: { x: 15, y: 5 }, time: 1200, interval: 1500 }
    ],
    goal: { position: { x: 7, y: 2 }, requiredCount: 3 },
    maxBlocks: 20,
    forbiddenTiles: [],
};
