import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 3: ゾンビ登場 (The Threat)
 * テーマ: 敵の対処
 * 意図:
 * - 前方からゾンビが歩いてくるため、何もしないと村人が襲われる。
 * - プレイヤーはブロックで壁を作り、ゾンビを隔離するか進路を変える必要がある。
 * - 敵への能動的な対処（ブロック）を学ぶ。
 */
export const PLAINS_03: LevelConfig = {
    id: 'plains-03',
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
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 6 }, interval: 1000, count: 3 },
    zombieSpawns: [{ position: { x: 12, y: 6 }, time: 100 }],
    goal: { position: { x: 14, y: 5 }, requiredCount: 3 },
    maxBlocks: 5,
    forbiddenTiles: [],
};
