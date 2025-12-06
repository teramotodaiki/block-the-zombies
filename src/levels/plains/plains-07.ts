import { type LevelConfig, parseLevelGrid } from '../../core/level';

export const PLAINS_07: LevelConfig = {
    id: 'plains-07',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '..............**', // y=3
        '..............**', // y=4. Goal at (14,3)-(15,4)
        '...........GGG..',
        '...........GGG..',
        '........GGG.....',
        '........GGG.....',
        '.....GGG........',
        '..GGG...........', // y=10. x=2 is G.
        '################',
    ]),
    villagerSpawn: { position: { x: 2, y: 9 }, interval: 3000, count: 3 }, // y=9 is air above y=10(G). Correct.
    zombieSpawns: [{ position: { x: 13, y: 4 }, time: 1000, interval: 4000 }],
    goal: { position: { x: 14, y: 3 }, requiredCount: 3 },
    maxBlocks: 10,
    forbiddenTiles: [],
};
