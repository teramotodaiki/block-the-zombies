import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 13: 孤島への道 (Path to the Island)
 * テーマ: 複数の橋渡し
 * 意図:
 * - 複数のマグマの穴を越えて孤島のゴールに到達する。
 * - 各穴に橋を架ける必要があり、ブロック管理が重要。
 * - 効率的なブロック配置を考える必要がある。
 */
export const PLAINS_13: LevelConfig = {
    id: 'plains-13',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '................',
        '................',
        '...........**...',
        '...........**...',
        'GGG..GGG..GGGG..',
        'GGG..GGG..GGGG..',
        '###MM###MM######',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 6 }, interval: 3000, count: 3 },
    zombieSpawns: [],
    goal: { position: { x: 11, y: 5 }, requiredCount: 3 },
    maxBlocks: 8,
    forbiddenTiles: [],
};
