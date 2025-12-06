import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const INPUT_FILE = path.join(
    process.cwd(),
    'workbench/ui_sheet_transparent.png',
);
const OUTPUT_DIR = path.join(process.cwd(), 'workbench/sliced');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function sliceSprites() {
    console.log(`Loading ${INPUT_FILE}...`);
    const image = sharp(INPUT_FILE);
    const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    const visited = new Uint8Array(width * height);
    const blobs = [];

    // Helper to get pixel index
    const idx = (x, y) => (y * width + x) * 4;

    // BFS to find connected components
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (visited[y * width + x]) continue;

            const alpha = data[idx(x, y) + 3];
            if (alpha > 10) {
                // Non-transparent
                // Found a new blob
                const blob = { minX: x, maxX: x, minY: y, maxY: y, pixels: [] };
                blobs.push(blob);

                const queue = [[x, y]];
                visited[y * width + x] = 1;

                while (queue.length > 0) {
                    const [cx, cy] = queue.shift();

                    blob.minX = Math.min(blob.minX, cx);
                    blob.maxX = Math.max(blob.maxX, cx);
                    blob.minY = Math.min(blob.minY, cy);
                    blob.maxY = Math.max(blob.maxY, cy);

                    // Check neighbors
                    const neighbors = [
                        [cx + 1, cy],
                        [cx - 1, cy],
                        [cx, cy + 1],
                        [cx, cy - 1],
                    ];

                    for (const [nx, ny] of neighbors) {
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            if (!visited[ny * width + nx]) {
                                const nAlpha = data[idx(nx, ny) + 3];
                                if (nAlpha > 10) {
                                    visited[ny * width + nx] = 1;
                                    queue.push([nx, ny]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    console.log(`Found ${blobs.length} sprites.`);

    // Extract sprites
    for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        const w = blob.maxX - blob.minX + 1;
        const h = blob.maxY - blob.minY + 1;

        console.log(`Sprite ${i}: ${w}x${h} at (${blob.minX}, ${blob.minY})`);

        // Filter out tiny noise
        if (w < 16 || h < 16) {
            console.log(`  -> Skipping (too small)`);
            continue;
        }

        await sharp(INPUT_FILE)
            .extract({ left: blob.minX, top: blob.minY, width: w, height: h })
            .toFile(path.join(OUTPUT_DIR, `sprite_${i}.png`));
    }
}

sliceSprites().catch(console.error);
