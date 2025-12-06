import { type LevelConfig, parseLevelGrid } from '../../core/level';

export const PLAINS_12: LevelConfig = {
    id: 'plains-12',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '..............**',
        '..............**',
        'GG......GG....GG', // y=4.
        'GG......GG....##',
        '##M#####MM####M#', // y=6. Bounded.
        '################',
        '................',
        '#M############M#', // y=9. Bounded.
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 3 }, interval: 3000, count: 3 }, // y=3 is air above y=4(G). Correct.
    zombieSpawns: [
        { position: { x: 8, y: 3 }, time: 2000, interval: 4000 },
        { position: { x: 15, y: 3 }, time: 5000, interval: 3000 }
    ],
    goal: { position: { x: 14, y: 2 }, requiredCount: 3 },
    maxBlocks: 25,
    forbiddenTiles: [],
};
