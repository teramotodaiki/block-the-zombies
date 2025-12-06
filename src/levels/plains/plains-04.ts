import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 4: レスキューミッション (Rescue Mission)
 * テーマ: 高低差と隔離
 * 意図:
 * - マグマプールとゾンビが存在する複雑な地形。
 * - 村人はゾンビのいる場所の上を通る必要がある。
 * - ゾンビを閉じ込めるか、村人の安全なルートを確保する応用力が求められる。
 */
export const PLAINS_04: LevelConfig = {
    id: 'plains-04',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '.............**.',
        '.............**.',
        'GG...........GG.',
        'GG...........GG.',
        '................',
        '.....GGGGG......',
        '.....GGGGG......',
        '.....#####......',
        '#MMMM#####MMMM##',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 3 }, interval: 2000, count: 3 },
    zombieSpawns: [{ position: { x: 7, y: 6 }, time: 1000 }],
    goal: { position: { x: 13, y: 2 }, requiredCount: 3 },
    maxBlocks: 15,
    forbiddenTiles: [],
};
