import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 1: 穴を埋める (The Gap)
 * テーマ: 落下の阻止
 * 意図:
 * - スタート直後に穴（Magma）があり、何もしないと村人が落下死する。
 * - プレイヤーは「ブロックで足場を作る」ことを学ぶ。
 * - 3人の村人を全員ゴールさせるには、素早い判断が必要。
 */
export const PLAINS_01: LevelConfig = {
    id: 'plains-01',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '................',
        '................',
        '.............**.',
        '.............**.',
        'GGG...GGGGGGGGGG',
        'GGG...GGGGGGGGGG',
        '###MMM##########',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 6 }, interval: 2000, count: 3 },
    zombieSpawns: [],
    goal: { position: { x: 13, y: 5 }, requiredCount: 3 },
    maxBlocks: 15,
    forbiddenTiles: [],
};
