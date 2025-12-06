import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 11: 上下の選択 (High or Low)
 * テーマ: ルート選択
 * 意図:
 * - 上下2つのルートがあり、どちらを使うか選択する。
 * - 上のルートは短いがゾンビがいる。
 * - 下のルートは長いがマグマがある。
 * - プレイヤーの判断でどちらかを安全にする。
 */
export const PLAINS_11: LevelConfig = {
    id: 'plains-11',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '..............**',
        '..............**',
        'GGG..........GGG',
        '###..........###',
        '###..........###',
        'GGG..........GGG',
        'GGG..........GGG',
        '###....MM....###',
        '####MMM##MMM####',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 3 }, interval: 2500, count: 3 },
    zombieSpawns: [{ position: { x: 8, y: 3 }, time: 500 }],
    goal: { position: { x: 14, y: 2 }, requiredCount: 3 },
    maxBlocks: 10,
    forbiddenTiles: [],
};
