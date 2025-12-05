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
        this.load.image('icon-block', 'assets/game/icon_block.png');
        this.load.image('ui-level-clear', 'assets/game/ui_level_clear.png');
        this.load.image('ui-game-over', 'assets/game/ui_game_over.png');
        // this.load.image('ui-paused', 'assets/game/ui_paused.png'); // Removed per user request

        // Video
        this.load.video('title-bg', 'assets/game/title_bg.mp4');

        // Tiles
        this.load.image('tile-ground', 'assets/game/tile_ground.png');
        this.load.image('tile-bedrock', 'assets/game/tile_bedrock.png');
        // this.load.image('tile-magma', 'assets/game/tile_magma.png'); // Replaced by anim
        this.load.spritesheet('tile-magma-anim', 'assets/game/tile_magma_anim.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('tile-goal', 'assets/game/goal_sheet.png', {
            frameWidth: 425,
            frameHeight: 325,
        });

        // Entities
        this.load.spritesheet('entity-villager', 'assets/game/villager.png', {
            frameWidth: 64,
            frameHeight: 192,
        });
        this.load.spritesheet('entity-zombie', 'assets/game/zombie.png', {
            frameWidth: 64,
            frameHeight: 192,
        });
    }

    create() {
        this.createPlaceholderTextures();

        // Create Animations
        this.anims.create({
            key: 'villager-walk',
            frames: this.anims.generateFrameNumbers('entity-villager', {
                start: 0,
                end: 3,
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: 'zombie-walk',
            frames: this.anims.generateFrameNumbers('entity-zombie', {
                start: 0,
                end: 3,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // Transition to Title
        this.scene.start('TitleScene');
    }

    private createPlaceholderTextures() {
        // Magma Tile
        if (!this.textures.exists('tile-magma')) {
            const g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0xff4500); // OrangeRed
            g.fillRect(0, 0, 64, 64);
            g.fillStyle(0xffd700); // Gold bubbles
            g.fillCircle(16, 16, 8);
            g.fillCircle(48, 48, 10);
            g.generateTexture('tile-magma', 64, 64);
            g.destroy();
        }

        // Icon Block
        if (!this.textures.exists('icon-block')) {
            const g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x8b4513); // SaddleBrown
            g.fillRect(8, 8, 48, 48);
            g.lineStyle(2, 0x000000);
            g.strokeRect(8, 8, 48, 48);
            g.generateTexture('icon-block', 64, 64);
            g.destroy();
        }

        // Icon Lock
        if (!this.textures.exists('icon-lock')) {
            const g = this.make.graphics({ x: 0, y: 0 });
            // Body
            g.fillStyle(0x808080);
            g.fillRect(16, 24, 32, 24);
            // Shackle
            g.lineStyle(4, 0x808080);
            g.beginPath();
            g.arc(32, 24, 10, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(0));
            g.strokePath();
            g.generateTexture('icon-lock', 64, 64);
            g.destroy();
        }

        // Icon Unlock
        if (!this.textures.exists('icon-unlock')) {
            const g = this.make.graphics({ x: 0, y: 0 });
            // Body
            g.fillStyle(0xffd700); // Gold
            g.fillRect(16, 24, 32, 24);
            // Shackle (Open)
            g.lineStyle(4, 0xffd700);
            g.beginPath();
            g.moveTo(22, 24);
            g.lineTo(22, 14);
            g.arc(32, 14, 10, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(0));
            g.strokePath();
            g.generateTexture('icon-unlock', 64, 64);
            g.destroy();
        }

        // HUD Goal Empty (Grey Human)
        if (!this.textures.exists('hud-goal-empty')) {
            const g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x555555);
            // Head
            g.fillCircle(32, 20, 12);
            // Body
            g.beginPath();
            g.moveTo(32, 34);
            g.lineTo(52, 60);
            g.lineTo(12, 60);
            g.closePath();
            g.fillPath();
            g.generateTexture('hud-goal-empty', 64, 64);
            g.destroy();
        }

        // HUD Goal Full (Green Human)
        if (!this.textures.exists('hud-goal-full')) {
            const g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x4caf50); // Green
            // Head
            g.fillCircle(32, 20, 12);
            // Body
            g.beginPath();
            g.moveTo(32, 34);
            g.lineTo(52, 60);
            g.lineTo(12, 60);
            g.closePath();
            g.fillPath();
            g.generateTexture('hud-goal-full', 64, 64);
            g.destroy();
        }
    }
}
