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

        // Play Button
        this.createButton(this.cameras.main.centerX, 450, 'btn-play', () => {
            this.scene.start('LevelSelectScene');
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: () => this.scene.start('GameScene'), // Shortcut
            goToTitle: () => {},
            restartLevel: () => {},
            forceGameOver: () => {},
            forceLevelClear: () => {},
            getCurrentScene: () => 'TitleScene',
        };
    }

    private createButton(x: number, y: number, texture: string, onClick: () => void) {
        const btn = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 96, 96, 0x4caf50);
        bg.setStrokeStyle(4, 0x2e7d32);
        const shadow = this.add.rectangle(0, 48, 96, 8, 0x2e7d32).setOrigin(0.5, 0);

        const icon = this.add.image(0, 0, texture);
        icon.setDisplaySize(64, 64);

        btn.add([shadow, bg, icon]);
        btn.setSize(96, 96);
        btn.setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            bg.y += 8;
            icon.y += 8;
            shadow.visible = false;
        });

        btn.on('pointerup', () => {
            bg.y = 0;
            icon.y = 0;
            shadow.visible = true;
            onClick();
        });

        btn.on('pointerout', () => {
            bg.y = 0;
            icon.y = 0;
            shadow.visible = true;
        });
    }
}
