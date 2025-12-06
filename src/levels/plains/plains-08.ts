import { type LevelConfig, parseLevelGrid } from '../../core/level';

export const PLAINS_08: LevelConfig = {
    id: 'plains-08',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '................',
        '................',
        '............**..', // y=5. x=12,13.
        '............**..', // y=6.
        'GGGGG......GGGGG', // y=7.
        'GGGGG......GGGGG',
        '#####MMMMMM#####',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 6 }, interval: 3000, count: 3 }, // y=6 is air above y=7(G). Correct.
    zombieSpawns: [{ position: { x: 15, y: 6 }, time: 500, interval: 2000 }],
    goal: { position: { x: 12, y: 5 }, requiredCount: 3 },
    maxBlocks: 20,
    forbiddenTiles: [],
};
