import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 12: 時間との戦い (Race Against Time)
 * テーマ: スピードと判断
 * 意図:
 * - 村人の出現間隔が短く、素早い判断が求められる。
 * - ゾンビも複数出現し、同時に対処する必要がある。
 * - これまでの技術を素早く実行する総合力が試される。
 */
export const PLAINS_12: LevelConfig = {
    id: 'plains-12',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '................',
        '**...............',
        '**...............',
        'GGG...GGGG...GGG',
        'GGG...GGGG...GGG',
        '###...####...###',
        '###MMM####MMM###',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 5 }, interval: 1500, count: 3 },
    zombieSpawns: [
        { position: { x: 15, y: 5 }, time: 0 },
        { position: { x: 8, y: 5 }, time: 2000 },
    ],
    goal: { position: { x: 0, y: 4 }, requiredCount: 3 },
    maxBlocks: 10,
    forbiddenTiles: [],
};
