import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 6: 階段を作れ (Build the Stairs)
 * テーマ: 高低差の克服
 * 意図:
 * - 村人は1段の高さしか登れないことを学ぶ。
 * - 2段以上の壁を越えるには、階段状にブロックを配置する必要がある。
 * - ゴールは高台にあり、ブロックで階段を作らないと到達できない。
 */
export const PLAINS_06: LevelConfig = {
    id: 'plains-06',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '................',
        '..............**',
        '..............GG',
        '..............GG',
        '..............GG',
        'GGGGGGGGG.....GG',
        'GGGGGGGGG.....GG',
        '#########.....##',
        '################',
        '################',
    ]),
    villagerSpawn: { position: { x: 0, y: 6 }, interval: 2500, count: 3 },
    zombieSpawns: [],
    goal: { position: { x: 14, y: 3 }, requiredCount: 3 },
    maxBlocks: 8,
    forbiddenTiles: [],
};
