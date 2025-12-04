import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const INPUT_FILE = 'workbench/tiles_source.png';
const OUTPUT_DIR = 'workbench/sliced';
const GRID_SIZE = 16;
const TILE_SIZE = 64; // 1024 / 16

async function slice() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log(`Slicing ${INPUT_FILE} into ${GRID_SIZE}x${GRID_SIZE} tiles...`);

    const image = sharp(INPUT_FILE);
    const metadata = await image.metadata();

    if (metadata.width !== 1024 || metadata.height !== 1024) {
        console.error(`Unexpected image size: ${metadata.width}x${metadata.height}. Expected 1024x1024.`);
        return;
    }

    let count = 0;
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const left = x * TILE_SIZE;
            const top = y * TILE_SIZE;
            const outputFile = path.join(OUTPUT_DIR, `tile_${y}_${x}.png`);

            await image.clone().extract({ left, top, width: TILE_SIZE, height: TILE_SIZE }).toFile(outputFile);

            count++;
        }
    }
    console.log(`Sliced ${count} tiles to ${OUTPUT_DIR}`);
}

slice();
