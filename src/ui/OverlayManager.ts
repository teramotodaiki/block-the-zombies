import Phaser from 'phaser';

export class OverlayManager extends Phaser.GameObjects.Container {
    private overlay!: Phaser.GameObjects.Rectangle;
    private messageText!: Phaser.GameObjects.Text;
    private buttons: Phaser.GameObjects.Container[] = [];

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        this.scene.add.existing(this);
        this.setScrollFactor(0);
        this.setDepth(100); // Ensure it's on top of HUD
        this.visible = false;

        this.createBackground();
    }

    private createBackground() {
        // Full screen semi-transparent black
        this.overlay = this.scene.add.rectangle(
            400,
            300,
            800,
            600,
            0x000000,
            0.7,
        );
        this.overlay.setInteractive(); // Block input below
        this.add(this.overlay);

        // Message Text
        this.messageText = this.scene.add
            .text(400, 200, '', {
                fontFamily: '"VT323", monospace',
                fontSize: '64px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
            })
            .setOrigin(0.5);
        this.add(this.messageText);
    }

    showGameOver(onRetry: () => void, onHome: () => void) {
        this.reset();
        this.messageText.setText('GAME OVER');
        this.messageText.setColor('#ff4444');

        // Retry Button
        this.createButton(300, 400, 'btn-retry', 0xffffff, onRetry);

        // Home Button
        this.createButton(500, 400, 'btn-home', 0xffffff, onHome);

        this.show();
    }

    public showLevelClear(onNext: () => void) {
        this.reset(); // Clear existing buttons and hide
        this.messageText.setText('LEVEL CLEAR!');
        this.messageText.setColor('#44ff44');

        // Next Level Button (Center)
        this.createButton(400, 350, 'btn-next', 0x4caf50, onNext);

        this.show();
    }

    private createButton(x: number, y: number, key: string, _color: number, callback: () => void) {
        const container = this.scene.add.container(x, y);

        const btn = this.scene.add.image(0, 0, key);
        btn.setDisplaySize(64, 64); // Uniform size
        btn.setInteractive({ useHandCursor: true });

        container.add(btn);

        btn.on('pointerdown', () => {
            btn.setTint(0xcccccc);
        });

        btn.on('pointerup', () => {
            btn.clearTint();
            callback();
        });

        btn.on('pointerout', () => {
            btn.clearTint();
        });

        this.add(container);
        this.buttons.push(container);
    }

    private reset() {
        for (const btn of this.buttons) {
            btn.destroy();
        }
        this.buttons = [];
    }

    private show() {
        this.visible = true;
        this.alpha = 0;
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 300,
        });
    }

    public showPauseMenu(onResume: () => void, onRetry: () => void, onHome: () => void) {
        this.reset();
        this.messageText.setText('PAUSED');
        this.messageText.setColor('#ffffff');

        // Resume Button
        this.createButton(400, 300, 'btn-play', 0x2196f3, onResume);

        // Retry Button
        this.createButton(300, 420, 'btn-retry', 0xff9800, onRetry);

        // Home Button
        this.createButton(500, 420, 'btn-home', 0xf44336, onHome);

        this.show();
    }

    hide() {
        this.visible = false;
        this.reset();
    }
}
