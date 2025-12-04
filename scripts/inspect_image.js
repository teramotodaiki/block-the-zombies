import sharp from 'sharp';

const files = ['public/assets/game/title_logo.png'];

async function inspect() {
    for (const file of files) {
        try {
            const metadata = await sharp(file).metadata();
            console.log(`File: ${file}`);
            console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
        } catch (err) {
            console.log(`Error reading ${file}: ${err.message}`);
        }
    }
}

inspect();
