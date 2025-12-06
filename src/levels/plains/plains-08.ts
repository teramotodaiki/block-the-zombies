import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 8: 橋を架けろ (Bridge Builder)
 * テーマ: 長い穴を渡る
 * 意図:
 * - 広いマグマの穴があり、複数のブロックで橋を架ける必要がある。
 * - ブロックの配置タイミングと位置を考える必要がある。
 * - 村人が落ちる前に素早く橋を完成させる。
 */
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
        '..............**',
        '..............**',
        'GGGGG......GGGGG',
        'GGGGG......GGGGG',
        '#####MMMMMM#####',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 6 }, interval: 3000, count: 3 },
    zombieSpawns: [],
    goal: { position: { x: 14, y: 5 }, requiredCount: 3 },
    maxBlocks: 10,
    forbiddenTiles: [],
};
