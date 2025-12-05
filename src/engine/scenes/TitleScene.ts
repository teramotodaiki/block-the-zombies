import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    private video?: Phaser.GameObjects.Video;
    private isVideoScaled = false;

    create() {
        // Video Background
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.video = this.add.video(width / 2, height / 2, 'title-bg');
        this.video.play(true); // Loop
        this.video.setPaused(false);

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

    update() {
        // Wait for video metadata to load
        // Phaser video width might default to 256 before loading
        if (
            !this.isVideoScaled &&
            this.video &&
            this.video.video &&
            this.video.video.readyState >= 1 &&
            this.video.width > 256
        ) {
            const width = this.cameras.main.width;
            // Scale to fit width (letterbox)
            const scale = width / this.video.width;
            this.video.setScale(scale);
            this.isVideoScaled = true;
        }
    }
}
