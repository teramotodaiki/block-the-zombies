import { type LevelConfig, parseLevelGrid } from '../../core/level';

export const PLAINS_09: LevelConfig = {
    id: 'plains-09',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '................',
        '................',
        '**..............', // y=5. x=0,1.
        '**..............', // y=6.
        'GG...G...G...G..', // y=7.
        'GG...G...G...G..',
        '##M##M###M###M##', // y=9.
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 2, y: 6 }, interval: 4000, count: 3 }, // y=6 is air above y=7(. empty).
    // Wait. y=7 x=2 is . (Empty). hole.
    // Villager falls immediately?
    // Map: GG...G...
    // x=2 is hole between GG(0,1) and G(5).
    // Tiles check: 'GG...G'.
    // Indices: 0,1=G. 2,3,4=. 5=G.
    // Spawn at 2. Falls to 9 (Magma).
    // Intention: Drop onto recycled bridge?
    // Validator: Spawn inside solid?
    // x=2, y=6 is empty. OK.
    zombieSpawns: [{ position: { x: 14, y: 6 }, time: 5000, interval: 6000 }],
    goal: { position: { x: 0, y: 5 }, requiredCount: 3 }, // x=0, y=5.
    maxBlocks: 3,
    forbiddenTiles: [],
};
