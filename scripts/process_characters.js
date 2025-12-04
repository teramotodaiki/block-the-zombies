import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_FRAME_WIDTH = 32;
const TARGET_FRAME_HEIGHT = 96;
const FRAMES = 4;

const configs = [
    {
        input: 'workbench/zombie_source.png',
        output: 'public/assets/game/zombie.png',
        bgColors: [
            { r: 70, g: 203, b: 62 },
            { r: 99, g: 243, b: 86 }
        ],
        tolerance: 10 // Strict tolerance
    },
    {
        input: 'workbench/villager_source.jpeg',
        output: 'public/assets/game/villager.png',
        bgColors: [
            { r: 58, g: 252, b: 78 },
            { r: 42, g: 210, b: 71 }
        ],
        tolerance: 30 // JPEG might have artifacts, need slightly higher tolerance
    }
];

async function process() {
    for (const config of configs) {
        console.log(`Processing ${config.input}...`);

        const image = sharp(config.input).ensureAlpha();
        const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

        // Pixel manipulation for background removal
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Check against bg colors
            for (const bg of config.bgColors) {
                const dist = Math.sqrt(
                    Math.pow(r - bg.r, 2) +
                    Math.pow(g - bg.g, 2) +
                    Math.pow(b - bg.b, 2)
                );

                if (dist < config.tolerance) {
                    data[i + 3] = 0; // Alpha = 0
                    break;
                }
            }
        }

        // Create new sharp instance from modified data
        let pipeline = sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        });

        // Trim transparent pixels
        pipeline = pipeline.trim();

        // Resize to target strip size
        // We want height to be 96. Width should be 32 * 4 = 128.
        // We force this size.
        pipeline = pipeline.resize(TARGET_FRAME_WIDTH * FRAMES, TARGET_FRAME_HEIGHT, {
            fit: 'fill' // Stretch to fit if aspect ratio doesn't match exactly
        });

        await pipeline.toFile(config.output);
        console.log(`  -> Saved to ${config.output}`);
    }
}

process();
