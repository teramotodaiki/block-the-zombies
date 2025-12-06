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

        // Scale to fit width (letterbox) - Hardcoded video width 1280
        const scale = width / 1280;
        video.setScale(scale);

        // Logic for auto-play vs click-to-play
        const hasInteracted = this.registry.get('hasInteracted');

        if (hasInteracted) {
            // Normal flow: Video plays, tap to start
            video.play(true);
            this.setupStartListener();
        } else {
            // First load: Tap to play video, then tap to start
            // Don't play yet

            // Add visual hint (Play Icon)
            const playIcon = this.add.graphics();
            playIcon.fillStyle(0xffffff, 0.8);
            playIcon.beginPath();
            // Draw Triangle centered at (width/2, height/2)
            // Size approx 100px
            const cx = width / 2;
            const cy = height / 2;
            const size = 60;

            // Triangle vertices
            playIcon.moveTo(cx - size / 2, cy - size / 2); // Top Left
            playIcon.lineTo(cx - size / 2, cy + size / 2); // Bottom Left
            playIcon.lineTo(cx + size / 2, cy);            // Right (Tip)
            playIcon.closePath();
            playIcon.fillPath();

            // Add pulsing animation
            this.tweens.add({
                targets: playIcon,
                alpha: 0.4,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });

            // On first tap:
            this.input.once('pointerdown', () => {
                // Initialize audio context if needed (Phaser handles this on input)
                video.play(true);
                this.registry.set('hasInteracted', true);

                playIcon.destroy();

                // Add a small delay prevents the same click from triggering the next listener immediately
                // if the user holds it too long or double clicks
                this.time.delayedCall(200, () => {
                    this.setupStartListener();
                });
            });
        }
    }

    private setupStartListener() {
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
