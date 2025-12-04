import sharp from 'sharp';

const files = ['workbench/zombie_source.png', 'workbench/villager_source.jpeg'];

async function analyze() {
    for (const file of files) {
        try {
            const image = sharp(file);
            const metadata = await image.metadata();

            // Get raw pixel data to check corners
            const buffer = await image.raw().toBuffer();
            const channels = metadata.channels;
            const width = metadata.width;

            // Top-Left (0,0)
            const tl_idx = 0;
            const tl_r = buffer[tl_idx];
            const tl_g = buffer[tl_idx + 1];
            const tl_b = buffer[tl_idx + 2];

            // Top-Right (width-1, 0)
            const tr_idx = (width - 1) * channels;
            const tr_r = buffer[tr_idx];
            const tr_g = buffer[tr_idx + 1];
            const tr_b = buffer[tr_idx + 2];

            console.log(`File: ${file}`);
            console.log(`  Top-Left: rgb(${tl_r}, ${tl_g}, ${tl_b})`);
            console.log(`  Top-Right: rgb(${tr_r}, ${tr_g}, ${tr_b})`);
        } catch (err) {
            console.error(`Error analyzing ${file}:`, err);
        }
    }
}

analyze();
