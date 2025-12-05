import { type LevelConfig } from '../core/level';
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
            // Goal is theoretically passable/background?
            // Actually usually 'Goal' tile in grid replaces background.
            // But if it's solid?
            // TileType.Goal might be solid?
            // Re-checking game.ts... hasSolidNeighbor checks isSolid.
            // Game.ts doesn't show isSolid implementation for Goal.
            // Usually Goal is not solid (villager overlaps it).
            // But Ground/Bedrock/Magma are "solid-ish"?
            // Magma kills. Bedrock/Ground stop movement.
            // Safe to say spawn shouldn't be inside Ground/Bedrock/Magma.
            if (tile === TileType.Ground || tile === TileType.Bedrock) {
                errors.push(`Level ${level.id}: Villager spawn at (${vSpawn.x}, ${vSpawn.y}) is inside a solid tile (${tile}).`);
            }
        }
    }

    // 2. Goal tiles must form a 2x2 square
    // Strategy: Find all goal tiles. There should be exactly 4. They should likely form a 2x2 block.
    // Or at least, the "house" visual requires a 2x2 space.
    // Let's check if the grid contains exactly a 2x2 block of TileType.Goal.
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
        // Check if they form a 2x2 square.
        // Sort by y, then x.
        goalTiles.sort((a, b) => a.y - b.y || a.x - b.x);
        const [tl, tr, bl, br] = goalTiles;
        // tl at (x, y), tr at (x+1, y), bl at (x, y+1), br at (x+1, y+1)
        const isSquare =
            tl.x + 1 === tr.x && tl.y === tr.y &&
            bl.x + 1 === br.x && bl.y === br.y &&
            tl.x === bl.x && tl.y + 1 === bl.y;

        if (!isSquare) {
            errors.push(`Level ${level.id}: Goal tiles do not form a 2x2 square.`);
        }
    }

    // 3. Magma must be horizontally bounded by Bedrock (#)
    // For each Magma tile, check Left and Right bounds in that row.
    // If we trace left, we must hit Bedrock before Empty/Start.
    // Actually, "bounded by Bedrock" usually means directly adjacent?
    // Or just "contained in a pit"?
    // "Magma must be bounded by Bedrock on left and right".
    // I'll interpret this as: A contiguous horizontal run of Magma must have Bedrock immediately to its left and right.

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
                    // Magma run ended at x-1. Check Left (startX-1) and Right (x).
                    inMagma = false;
                    const leftBound = startX > 0 ? level.tiles[y][startX - 1] : null;
                    const rightBound = tile; // Current tile is the one after magma

                    if (leftBound !== TileType.Bedrock) {
                        errors.push(`Level ${level.id}: Magma at (${startX},${y}) not bounded by Bedrock on Left.`);
                    }
                    if (rightBound !== TileType.Bedrock) {
                        errors.push(`Level ${level.id}: Magma run ending at (${x - 1},${y}) not bounded by Bedrock on Right.`);
                    }
                }
            }
        }
        // If row ends with Magma
        if (inMagma) {
            errors.push(`Level ${level.id}: Magma at end of row ${y} not bounded by Bedrock on Right.`);
        }
    }

    // 4. Magma must not be stacked vertically (no Magma above/below Magma)
    // "No vertically connected Magma"
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
