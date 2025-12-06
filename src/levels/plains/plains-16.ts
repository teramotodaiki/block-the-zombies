import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 16: 最終試練 (Final Trial)
 * テーマ: 全技術の総合
 * 意図:
 * - これまでの全ての技術を駆使する最終ステージ。
 * - マグマ、ゾンビ、高低差、複雑な地形が組み合わさる。
 * - 3人全員を救出できれば真のマスター。
 */
export const PLAINS_16: LevelConfig = {
    id: 'plains-16',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '**..............',
        '**..............',
        'GG..........GGGG',
        '##..........####',
        '......GG........',
        '......##........',
        '..GG............',
        '..##............',
        'GG..............',
        '##MMMM##MMMM####',
        '################',
    ]),
    villagerSpawn: { position: { x: 15, y: 2 }, interval: 2500, count: 3 },
    zombieSpawns: [
        { position: { x: 6, y: 4 }, time: 1000 },
        { position: { x: 2, y: 6 }, time: 3000 },
    ],
    goal: { position: { x: 0, y: 1 }, requiredCount: 3 },
    maxBlocks: 15,
    forbiddenTiles: [],
};
