import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 2: 折り返し (Turn Around)
 * テーマ: 危険からの回避
 * 意図:
 * - スタート地点のすぐ背後（左）にゴールがある。
 * - 村人は右にあるマグマに向かって歩いていく。
 * - プレイヤーは村人の進路に壁を作り、反転させてゴールへ導くことを学ぶ。
 */
export const PLAINS_02: LevelConfig = {
    id: 'plains-02',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '................',
        '................',
        '**..............',
        '**..............',
        'GGGGGGGGGGGG....',
        'GGGGGGGGGGGGM..#',
        '############M###',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 8, y: 6 }, interval: 2000, count: 3 },
    zombieSpawns: [],
    goal: { position: { x: 0, y: 5 }, requiredCount: 3 },
    maxBlocks: 15,
    forbiddenTiles: [],
};
