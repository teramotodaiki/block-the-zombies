import sharp from 'sharp';

const TARGET_FRAME_WIDTH = 64; // Doubled from 32
const TARGET_FRAME_HEIGHT = 192; // Doubled from 96
const FRAMES = 4;

const configs = [
    {
        input: 'workbench/zombie_source.png',
        output: 'public/assets/game/zombie.png',
        bgColors: [
            { r: 70, g: 203, b: 62 },
            { r: 99, g: 243, b: 86 },
        ],
        tolerance: 10, // Strict tolerance
    },
    {
        input: 'workbench/villager_source.jpeg',
        output: 'public/assets/game/villager.png',
        bgColors: [
            { r: 58, g: 252, b: 78 },
            { r: 42, g: 210, b: 71 },
        ],
        tolerance: 30, // JPEG might have artifacts, need slightly higher tolerance
    },
];

async function process() {
    for (const config of configs) {
        console.log(`Processing ${config.input}...`);

        const image = sharp(config.input).ensureAlpha();
        const { data, info } = await image
            .raw()
            .toBuffer({ resolveWithObject: true });

        // Pixel manipulation for background removal
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Check against bg colors
            for (const bg of config.bgColors) {
                const dist = Math.sqrt(
                    (r - bg.r) ** 2 + (g - bg.g) ** 2 + (b - bg.b) ** 2,
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
                channels: 4,
            },
        });

        // Trim transparent pixels - User said "Don't trim" because it's already 4 frames.
        // pipeline = pipeline.trim();

        // Resize to target strip size
        // We want height to be 96. Width should be 32 * 4 = 128.
        // We force this size but use 'contain' to preserve aspect ratio if needed, or 'fill' if we trust the source.
        // User said: "Don't trim or resize if possible. If resize, keep aspect ratio."
        // The source images are likely already in a grid.
        // Let's check the source size. If it's already 128x96 (or proportional), we just resize.
        // If we use 'contain', we might get transparent borders which is what the user suggested (offset in code).

        // However, the user said "It's split into 4 frames horizontally".
        // If we just resize the whole strip to 128x96, it might squash it.
        // Let's assume the source is a valid strip and just resize it to 128x96 to fit our game specs.
        // But the user specifically asked to keep aspect ratio.
        // So we use 'contain' with a transparent background.

        pipeline = pipeline.resize(
            TARGET_FRAME_WIDTH * FRAMES,
            TARGET_FRAME_HEIGHT,
            {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        );

        await pipeline.toFile(config.output);
        console.log(`  -> Saved to ${config.output}`);
    }
}

process();
