import type { LevelConfig } from '../core/level';
import { TileType } from '../core/types';

export function validateLevel(level: LevelConfig): string[] {
    const errors: string[] = [];

    // 1. requiredCount must be 3
    if (level.goal.requiredCount !== 3) {
        errors.push(`Level ${level.id}: requiredCount must be 3, got ${level.goal.requiredCount}`);
    }

    // 1.5 Dimensions must be 16x12
    if (level.width !== 16 || level.height !== 12) {
        errors.push(`Level ${level.id}: Dimensions must be 16x12, got ${level.width}x${level.height}`);
    }

    // 1.8 Spawn position must not be solid
    const vSpawn = level.villagerSpawn.position;
    if (level.tiles[vSpawn.y] && level.tiles[vSpawn.y][vSpawn.x]) {
        const tile = level.tiles[vSpawn.y][vSpawn.x];
        if (tile !== TileType.Empty && tile !== TileType.Goal) {
            if (tile === TileType.Ground || tile === TileType.Bedrock) {
                errors.push(`Level ${level.id}: Villager spawn at (${vSpawn.x}, ${vSpawn.y}) is inside a solid tile (${tile}).`);
            }
        }
    }

    // 2. Goal tiles must form a 2x2 square
    const goalTiles: { x: number; y: number }[] = [];
    for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
            if (level.tiles[y][x] === TileType.Goal) {
                goalTiles.push({ x, y });
            }
        }
    }

    if (goalTiles.length !== 4) {
        errors.push(`Level ${level.id}: Must have exactly 4 Goal tiles (for 2x2), found ${goalTiles.length}`);
    } else {
        goalTiles.sort((a, b) => a.y - b.y || a.x - b.x);
        const [tl, tr, bl, br] = goalTiles;
        const isSquare =
            tl.x + 1 === tr.x && tl.y === tr.y &&
            bl.x + 1 === br.x && bl.y === br.y &&
            tl.x === bl.x && tl.y + 1 === bl.y;

        if (!isSquare) {
            errors.push(`Level ${level.id}: Goal tiles do not form a 2x2 square.`);
        }
    }

    // 3. Magma must be horizontally bounded by Bedrock (#)
    for (let y = 0; y < level.height; y++) {
        let inMagma = false;
        let startX = -1;

        for (let x = 0; x < level.width; x++) {
            const tile = level.tiles[y][x];
            if (tile === TileType.Magma) {
                if (!inMagma) {
                    inMagma = true;
                    startX = x;
                }
            } else {
                if (inMagma) {
                    inMagma = false;
                    const leftBound = startX > 0 ? level.tiles[y][startX - 1] : null;
                    const rightBound = tile;

                    if (leftBound !== TileType.Bedrock) {
                        errors.push(`Level ${level.id}: Magma at (${startX},${y}) not bounded by Bedrock on Left.`);
                    }
                    if (rightBound !== TileType.Bedrock) {
                        errors.push(`Level ${level.id}: Magma run ending at (${x - 1},${y}) not bounded by Bedrock on Right.`);
                    }
                }
            }
        }
        if (inMagma) {
            errors.push(`Level ${level.id}: Magma at end of row ${y} not bounded by Bedrock on Right.`);
        }
    }

    // 4. Magma must not be stacked vertically (no Magma above/below Magma)
    for (let y = 0; y < level.height - 1; y++) {
        for (let x = 0; x < level.width; x++) {
            if (level.tiles[y][x] === TileType.Magma && level.tiles[y + 1][x] === TileType.Magma) {
                errors.push(`Level ${level.id}: Vertical Magma stacking detected at (${x}, ${y}) and (${x}, ${y + 1}).`);
            }
        }
    }

    // 5. Grid characters are strictly validated by parseLevelGrid() which throws errors.

    return errors;
}
