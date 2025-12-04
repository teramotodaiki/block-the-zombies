import sharp from 'sharp';

const files = ['workbench/unknown_1.png', 'workbench/unknown_2.jpeg'];

async function inspect() {
    for (const file of files) {
        try {
            const metadata = await sharp(file).metadata();
            console.log(`File: ${file}`);
            console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
            console.log(`Format: ${metadata.format}`);
        } catch (err) {
            console.log(`Error reading ${file}: ${err.message}`);
        }
    }
}

inspect();
