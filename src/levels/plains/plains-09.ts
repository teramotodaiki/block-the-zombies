import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 9: 迷路の出口 (Maze Exit)
 * テーマ: 複雑な地形での誘導
 * 意図:
 * - 複数の段差と壁がある迷路状の地形。
 * - 村人を正しいルートに誘導するためにブロックを配置する。
 * - 間違った方向に行くとマグマに落ちる危険がある。
 */
export const PLAINS_09: LevelConfig = {
    id: 'plains-09',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '**..........GG..',
        '**..........GG..',
        'GG..........GG..',
        'GG....GG....GG..',
        '......GG....GG..',
        '......GG........',
        '......GG........',
        '......##........',
        '#MMMM###MMMMMM##',
        '################',
    ]),
    villagerSpawn: { position: { x: 14, y: 1 }, interval: 2500, count: 3 },
    zombieSpawns: [],
    goal: { position: { x: 0, y: 2 }, requiredCount: 3 },
    maxBlocks: 8,
    forbiddenTiles: [],
};
