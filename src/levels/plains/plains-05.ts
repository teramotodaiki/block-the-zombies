import { type LevelConfig, parseLevelGrid } from '../../core/level';

/**
 * Level 5: 複合チャレンジ (Combined Challenge)
 * テーマ: 総合力
 * 意図:
 * - 足場、階段、マグマ、ゾンビが組み合わさった難関ステージ。
 * - これまでに学んだ「道作り」「反転」「敵隔離」の全てを駆使する。
 * - 3人全員を守り切る達成感を目指す。
 */
export const PLAINS_05: LevelConfig = {
    id: 'plains-05',
    biome: 'plains',
    width: 16,
    height: 12,
    tiles: parseLevelGrid([
        '................',
        '................',
        '**............G.',
        '**...........GG.',
        'GG...G.......GGG',
        '##...G.......###',
        '##...G..GGG..###',
        '#....G..GGG.#M##',
        '#....G..GGG.####',
        '#....G......####',
        '#MMMM###########',
        '################',
    ]),
    villagerSpawn: { position: { x: 14, y: 1 }, interval: 2000, count: 3 },
    zombieSpawns: [{ position: { x: 9, y: 6 }, time: 1500, interval: 5000 }],
    goal: { position: { x: 0, y: 2 }, requiredCount: 3 },
    maxBlocks: 10,
    forbiddenTiles: [],
};
