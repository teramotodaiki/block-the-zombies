
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const INPUT_FILE = 'workbench/スクリーンショット 2025-12-06 20.11.39.png';
const PUBLIC_DIR = 'public';

// Ensure public dir exists
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR);
}

async function generateIcons() {
    try {
        const image = sharp(INPUT_FILE);
        const metadata = await image.metadata();
        console.log(`Processing ${INPUT_FILE} (${metadata.width}x${metadata.height})`);

        // 1. OG Image (Keep Aspect Ratio, resize to max 1200 width)
        await image
            .clone()
            .resize(1200, 630, {
                fit: 'cover',
                position: 'center'
            })
            .toFile(path.join(PUBLIC_DIR, 'og-image.png'));
        console.log('Created og-image.png (1200x630)');

        // 2. Square Icons (Crop center)
        const squareProcessor = image.clone().resize({
            width: 1024,
            height: 1024,
            fit: 'cover',
            position: 'center' // Crop center
        });

        // Icon 512
        await squareProcessor
            .clone()
            .resize(512, 512)
            .toFile(path.join(PUBLIC_DIR, 'icon-512.png'));
        console.log('Created icon-512.png');

        // Icon 192 (Android)
        await squareProcessor
            .clone()
            .resize(192, 192)
            .toFile(path.join(PUBLIC_DIR, 'icon-192.png'));
        console.log('Created icon-192.png');

        // Apple Touch Icon 180
        await squareProcessor
            .clone()
            .resize(180, 180)
            .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
        console.log('Created apple-touch-icon.png');

        // Favicon 32 (PNG)
        await squareProcessor
            .clone()
            .resize(32, 32)
            .toFile(path.join(PUBLIC_DIR, 'favicon.png'));
        console.log('Created favicon.png');

        console.log('Icon generation complete.');

    } catch (error) {
        console.error('Error generating icons:', error);
        process.exit(1);
    }
}

generateIcons();
