import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // UI
        this.load.image('title-logo', 'assets/game/title_logo.png');
        this.load.image('btn-play', 'assets/game/btn_play.png');
        this.load.image('btn-home', 'assets/game/btn_home.png');
        this.load.image('btn-retry', 'assets/game/btn_retry.png');
        this.load.image('btn-next', 'assets/game/btn_next.png');
        this.load.image('btn-pause', 'assets/game/btn_pause.png');
        this.load.image('icon-lock', 'assets/game/icon_lock.png');
        this.load.image('icon-unlock', 'assets/game/icon_unlock.png');

        // Tiles
        this.load.image('tile-ground', 'assets/game/tile_ground.png');
        this.load.image('tile-bedrock', 'assets/game/tile_bedrock.png');
        this.load.image('tile-magma', 'assets/game/tile_magma.png');
        this.load.image('tile-goal', 'assets/game/goal.png');

        // Entities
        this.load.spritesheet('entity-villager', 'assets/game/villager.png', { frameWidth: 32, frameHeight: 96 });
        this.load.spritesheet('entity-zombie', 'assets/game/zombie.png', { frameWidth: 32, frameHeight: 96 });
    }

    create() {
        // Create Animations
        this.anims.create({
            key: 'villager-walk',
            frames: this.anims.generateFrameNumbers('entity-villager', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'zombie-walk',
            frames: this.anims.generateFrameNumbers('entity-zombie', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        // Transition to Title
        this.scene.start('TitleScene');
    }
}
