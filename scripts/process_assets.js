import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const WORKBENCH_DIR = 'workbench';
const OUTPUT_DIR = 'public/assets/game';

// Target sizes for specific files
const TARGET_SIZES = {
    'btn_play.png': { width: 96, height: 96 },
    'btn_home.png': { width: 48, height: 48 },
    'btn_retry.png': { width: 48, height: 48 },
    'btn_next.png': { width: 80, height: 80 },
    'btn_pause.png': { width: 48, height: 48 },
    'icon_lock.png': { width: 64, height: 64 },
    'icon_unlock.png': { width: 64, height: 64 },
    'villager.png': { width: 32, height: 96 },
    'zombie.png': { width: 32, height: 96 },
    'tile_ground.png': { width: 48, height: 48 },
    'tile_bedrock.png': { width: 48, height: 48 },
    'tile_magma.png': { width: 48, height: 48 },
    'tile_goal.png': { width: 48, height: 48 },
    // title_logo is handled separately (trim only, maybe resize width if too large)
};

async function processAssets() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    if (!fs.existsSync(WORKBENCH_DIR)) {
        console.log(`Workbench directory '${WORKBENCH_DIR}' not found.`);
        return;
    }

    const files = fs.readdirSync(WORKBENCH_DIR);

    for (const file of files) {
        if (!file.endsWith('.png')) continue;

        const inputPath = path.join(WORKBENCH_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file);
        const targetSize = TARGET_SIZES[file];

        console.log(`Processing ${file}...`);

        try {
            let pipeline = sharp(inputPath).trim(); // Trim transparent pixels

            if (targetSize) {
                pipeline = pipeline.resize({
                    width: targetSize.width,
                    height: targetSize.height,
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                });
            } else if (file === 'title_logo.png') {
                // Special handling for title: limit width to 600
                pipeline = pipeline.resize({ width: 600, withoutEnlargement: true });
            }

            await pipeline.toFile(outputPath);
            console.log(`  -> Saved to ${outputPath}`);
        } catch (err) {
            console.error(`  -> Error processing ${file}:`, err);
        }
    }
}

processAssets();
