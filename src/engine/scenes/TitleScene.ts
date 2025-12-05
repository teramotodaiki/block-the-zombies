import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        // Video Background
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const video = this.add.video(width / 2, height / 2, 'title-bg');
        video.play(true); // Loop
        video.setPaused(false);

        // Scale to cover (simulating background-size: cover)
        const scaleX = width / video.width;
        const scaleY = height / video.height;
        const scale = Math.max(scaleX, scaleY);
        video.setScale(scale);

        // Title Logo
        const logo = this.add.image(
            this.cameras.main.centerX,
            200,
            'title-logo',
        );
        logo.setOrigin(0.5);
        // Logo is 1024x1024, scale it down to fit width
        const targetWidth = 600;
        const logoScale = targetWidth / logo.width;
        logo.setScale(logoScale);

        // Tap anywhere to start
        this.input.on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: (levelIndex?: number) =>
                this.scene.start('GameScene', { levelIndex: levelIndex ?? 0 }),
            goToTitle: () => this.scene.start('TitleScene'),
            restartLevel: () => { },
            forceGameOver: () => { },
            forceLevelClear: () => { },
            getCurrentScene: () => 'TitleScene',
        };
    }
}
