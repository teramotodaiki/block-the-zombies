import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'public/assets/game';

async function createPlaceholders() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const assets = [
        { name: 'villager.png', width: 32, height: 96, color: { r: 0, g: 0, b: 255, alpha: 1 } }, // Blue
        { name: 'zombie.png', width: 32, height: 96, color: { r: 0, g: 255, b: 0, alpha: 1 } }, // Green
        { name: 'btn_next.png', width: 80, height: 80, color: { r: 100, g: 100, b: 100, alpha: 1 } },
        { name: 'btn_pause.png', width: 48, height: 48, color: { r: 200, g: 200, b: 200, alpha: 1 } },
        { name: 'icon_lock.png', width: 64, height: 64, color: { r: 50, g: 50, b: 50, alpha: 1 } },
        { name: 'icon_unlock.png', width: 64, height: 64, color: { r: 50, g: 200, b: 50, alpha: 1 } }
    ];

    for (const asset of assets) {
        const filePath = path.join(OUTPUT_DIR, asset.name);
        if (fs.existsSync(filePath)) {
            console.log(`Skipping ${asset.name} (already exists)`);
            continue;
        }

        await sharp({
            create: {
                width: asset.width,
                height: asset.height,
                channels: 4,
                background: asset.color
            }
        })
            .png()
            .toFile(filePath);
        console.log(`Created ${asset.name}`);
    }
}

createPlaceholders();
