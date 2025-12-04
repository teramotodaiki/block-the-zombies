import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        // Title Logo
        const logo = this.add.image(this.cameras.main.centerX, 200, 'title-logo');
        logo.setOrigin(0.5);
        // Logo is 1024x1024, scale it down to fit width
        const targetWidth = 600;
        const scale = targetWidth / logo.width;
        logo.setScale(scale);

        // Tap anywhere to start
        this.input.on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: (levelIndex?: number) => this.scene.start('GameScene', { levelIndex: levelIndex ?? 0 }),
            goToTitle: () => this.scene.start('TitleScene'),
            restartLevel: () => {},
            forceGameOver: () => {},
            forceLevelClear: () => {},
            getCurrentScene: () => 'TitleScene',
        };
    }
}
