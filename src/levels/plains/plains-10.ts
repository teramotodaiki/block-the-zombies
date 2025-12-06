import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 10: ゾンビの巣 (Zombie Nest)
 * テーマ: 複数ゾンビの隔離
 * 意図:
 * - 複数のゾンビが異なるタイミングで出現する。
 * - ゾンビを効率的に閉じ込めながら村人をゴールへ導く。
 * - タイミングと位置の両方を考慮した戦略が必要。
 */
export const PLAINS_10: LevelConfig = {
    id: 'plains-10',
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
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        '################',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 8, y: 6 }, interval: 2000, count: 3 },
    zombieSpawns: [
        { position: { x: 15, y: 6 }, time: 0 },
        { position: { x: 14, y: 6 }, time: 2000 },
        { position: { x: 13, y: 6 }, time: 4000 },
    ],
    goal: { position: { x: 0, y: 5 }, requiredCount: 3 },
    maxBlocks: 8,
    forbiddenTiles: [],
};
