import Phaser from 'phaser';

export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super('LevelSelectScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#2c3e50');

        // Header
        const titleText = this.add.text(this.cameras.main.centerX, 50, 'SELECT LEVEL', {
            fontFamily: '"VT323", monospace',
            fontSize: '48px',
            color: '#ffffff',
        });
        titleText.setOrigin(0.5);

        // Draw Map Nodes
        this.createLevelNode(200, 300, '1', true);
        this.createLevelNode(400, 300, '2', false);
        this.createLevelNode(600, 300, '3', false);

        // Draw Lines
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xffffff);
        graphics.lineBetween(232, 300, 368, 300);
        graphics.lineBetween(432, 300, 568, 300);

        // Back Button
        this.createButton(60, 540, 'btn-home', () => {
            this.scene.start('TitleScene');
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: () => this.scene.start('GameScene'),
            goToTitle: () => this.scene.start('TitleScene'),
            restartLevel: () => {},
            forceGameOver: () => {},
            forceLevelClear: () => {},
            getCurrentScene: () => 'LevelSelectScene',
        };
    }

    private createLevelNode(x: number, y: number, label: string, unlocked: boolean) {
        const texture = unlocked ? 'icon-unlock' : 'icon-lock';
        const icon = this.add.image(x, y, texture);
        icon.setDisplaySize(64, 64);

        if (unlocked) {
            // Add level number on top if unlocked?
            // Or just rely on the icon being distinct.
            // Let's add the number for clarity.
            const text = this.add.text(x, y + 40, label, {
                fontFamily: '"VT323", monospace',
                fontSize: '32px',
                color: '#ffffff',
            });
            text.setOrigin(0.5);

            icon.setInteractive({ useHandCursor: true });
            icon.on('pointerdown', () => {
                this.scene.start('GameScene');
            });

            icon.on('pointerover', () => icon.setScale(1.1));
            icon.on('pointerout', () => icon.setScale(1.0));
        } else {
            // Locked text
            const text = this.add.text(x, y + 40, label, {
                fontFamily: '"VT323", monospace',
                fontSize: '32px',
                color: '#7f8c8d',
            });
            text.setOrigin(0.5);
        }
    }

    private createButton(x: number, y: number, texture: string, onClick: () => void) {
        const btn = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 64, 64, 0xe0e0e0);
        bg.setStrokeStyle(4, 0x4a4a4a);
        const shadow = this.add.rectangle(0, 32, 64, 4, 0x4a4a4a).setOrigin(0.5, 0);

        const icon = this.add.image(0, 0, texture);
        icon.setDisplaySize(48, 48);

        btn.add([shadow, bg, icon]);
        btn.setSize(64, 64);
        btn.setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            bg.y += 4;
            icon.y += 4;
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
