import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Create placeholder graphics
        const graphics = this.make.graphics({ x: 0, y: 0 });

        // Tile: Ground (Brown)
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 0, 48, 48);
        graphics.generateTexture('tile-ground', 48, 48);
        graphics.clear();

        // Tile: Bedrock (Gray)
        graphics.fillStyle(0x808080);
        graphics.fillRect(0, 0, 48, 48);
        graphics.generateTexture('tile-bedrock', 48, 48);
        graphics.clear();

        // Tile: Magma (Red)
        graphics.fillStyle(0xFF0000);
        graphics.fillRect(0, 0, 48, 48);
        graphics.generateTexture('tile-magma', 48, 48);
        graphics.clear();

        // Tile: Goal (Yellow)
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(0, 0, 48, 48);
        graphics.generateTexture('tile-goal', 48, 48);
        graphics.clear();

        // Entity: Villager (Green)
        graphics.fillStyle(0x00FF00);
        graphics.fillRect(0, 0, 32, 48);
        graphics.generateTexture('entity-villager', 32, 48);
        graphics.clear();

        // Entity: Zombie (Purple)
        graphics.fillStyle(0x800080);
        graphics.fillRect(0, 0, 32, 48);
        graphics.generateTexture('entity-zombie', 32, 48);
        graphics.clear();
    }

    create() {
        this.scene.start('GameScene');
    }
}
