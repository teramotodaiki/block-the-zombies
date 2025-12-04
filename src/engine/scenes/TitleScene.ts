import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        // Title Text removed as requested (will be replaced by image later)

        // Play Button
        this.createButton(this.cameras.main.centerX, 400, '▶️', () => {
            this.scene.start('LevelSelectScene');
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: () => this.scene.start('GameScene'), // Shortcut
            goToTitle: () => { },
            restartLevel: () => { },
            forceGameOver: () => { },
            forceLevelClear: () => { },
            getCurrentScene: () => 'TitleScene'
        };
    }

    private createButton(x: number, y: number, label: string, onClick: () => void) {
        const btn = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 96, 96, 0x4CAF50);
        bg.setStrokeStyle(4, 0x2E7D32);
        const shadow = this.add.rectangle(0, 48, 96, 8, 0x2E7D32).setOrigin(0.5, 0);

        const text = this.add.text(0, 0, label, { fontSize: '48px' }).setOrigin(0.5);

        btn.add([shadow, bg, text]);
        btn.setSize(96, 96);
        btn.setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            bg.y += 8;
            text.y += 8;
            shadow.visible = false;
        });

        btn.on('pointerup', () => {
            bg.y = 0;
            text.y = 0;
            shadow.visible = true;
            onClick();
        });

        btn.on('pointerout', () => {
            bg.y = 0;
            text.y = 0;
            shadow.visible = true;
        });
    }
}
