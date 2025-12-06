import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 7: 二方向からの脅威 (Dual Threat)
 * テーマ: 複数のゾンビへの対処
 * 意図:
 * - 左右両方からゾンビが接近してくる。
 * - 村人を中央のゴールに導きつつ、両側のゾンビを隔離する必要がある。
 * - 限られたブロックで効率的に壁を作る判断力が求められる。
 */
export const PLAINS_07: LevelConfig = {
    id: 'plains-07',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '................',
        '................',
        '.......**.......',
        '.......**.......',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        '################',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 7, y: 6 }, interval: 2000, count: 3 },
    zombieSpawns: [
        { position: { x: 0, y: 6 }, time: 500 },
        { position: { x: 15, y: 6 }, time: 1000 },
    ],
    goal: { position: { x: 7, y: 5 }, requiredCount: 3 },
    maxBlocks: 6,
    forbiddenTiles: [],
};
