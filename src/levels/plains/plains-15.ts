import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 15: 螺旋の塔 (Spiral Tower)
 * テーマ: 複雑な高低差
 * 意図:
 * - 螺旋状に登っていく複雑な地形。
 * - 各段で適切にブロックを配置して道を作る。
 * - 全体を見渡した計画的なプレイが必要。
 */
export const PLAINS_15: LevelConfig = {
    id: 'plains-15',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '..............**',
        '..............**',
        '..........GGGGGG',
        '..........######',
        '......GGGG......',
        '......####......',
        '..GGGG..........',
        '..####..........',
        'GG..............',
        '##..............',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 8 }, interval: 3000, count: 3 },
    zombieSpawns: [{ position: { x: 8, y: 4 }, time: 2000 }],
    goal: { position: { x: 14, y: 1 }, requiredCount: 3 },
    maxBlocks: 12,
    forbiddenTiles: [],
};
