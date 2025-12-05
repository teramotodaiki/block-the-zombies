
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const INPUT_FILE = path.join(process.cwd(), 'workbench/goal_source.png');
const OUTPUT_FILE = path.join(process.cwd(), 'public/assets/game/goal_sheet.png');
const THRESHOLD = 60; // Reset threshold just in case

async function processImage() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error('Input file not found:', INPUT_FILE);
        return;
    }

    console.log(`Processing ${INPUT_FILE}...`);

    const image = sharp(INPUT_FILE);
    const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    // Get background color from top-left pixel
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    console.log(`Detected background color: R=${bgR}, G=${bgG}, B=${bgB}`);

    // Process pixels
    let transparentCount = 0;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Simple Euclidean distance
        const dist = Math.sqrt(
            Math.pow(r - bgR, 2) +
            Math.pow(g - bgG, 2) +
            Math.pow(b - bgB, 2)
        );

        if (dist < THRESHOLD) {
            data[i + 3] = 0; // Alpha = 0
            transparentCount++;
        }
    }

    console.log(`Made ${transparentCount} pixels transparent.`);

    // Save as PNG
    await sharp(data, {
        raw: {
            width: info.width,
            height: info.height,
            channels: 4
        }
    })
        .trim() // Auto-crop transparent pixels
        // Resize if too big (optional, but requested for asset usage)
        // Assuming icons are roughly 64x64, if the sheet is huge it might be better to resize.
        // Let's resize so the height is 64px, assuming it's a horizontal strip?
        // Or just keep it as is for now and let Phaser scale it.
        // User said "1024px... this is unacceptable", implying it should be smaller.
        // Let's resize it to 512px width for now to be safe, or just leave it trimmed.
        // Trimming is key.
        .toFile(OUTPUT_FILE);

    console.log(`Saved to ${OUTPUT_FILE}`);
}

processImage().catch(console.error);
