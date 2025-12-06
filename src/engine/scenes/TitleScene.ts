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

        // Scale to fit width (letterbox) - Hardcoded video width 1280
        const scale = width / 1280;
        video.setScale(scale);

        // Tap anywhere to start
        this.input.on('pointerdown', () => {
            this.sound.play('se-click');
            this.scene.start('LevelSelectScene');
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: (levelIndex?: number) =>
                this.scene.start('GameScene', { levelIndex: levelIndex ?? 0 }),
            goToTitle: () => this.scene.start('TitleScene'),
            restartLevel: () => {},
            forceGameOver: () => {},
            forceLevelClear: () => {},
            getCurrentScene: () => 'TitleScene',
        };
    }
}
