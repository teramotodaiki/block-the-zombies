import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 14: 包囲網 (Surrounded)
 * テーマ: 四方からの脅威
 * 意図:
 * - ゾンビが複数の方向から接近してくる。
 * - 村人を守りながらゴールへ導く高度な判断が必要。
 * - 限られたブロックで最大の効果を出す戦略が求められる。
 */
export const PLAINS_14: LevelConfig = {
    id: 'plains-14',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '......**........',
        '......**........',
        '....GGGGGG......',
        '....GGGGGG......',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        '################',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 7, y: 6 }, interval: 2000, count: 3 },
    zombieSpawns: [
        { position: { x: 0, y: 6 }, time: 0 },
        { position: { x: 15, y: 6 }, time: 500 },
        { position: { x: 4, y: 4 }, time: 1500 },
    ],
    goal: { position: { x: 6, y: 3 }, requiredCount: 3 },
    maxBlocks: 8,
    forbiddenTiles: [],
};
