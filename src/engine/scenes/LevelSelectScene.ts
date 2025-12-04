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
            color: '#ffffff'
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
        this.createButton(60, 540, '⬅️', () => {
            this.scene.start('TitleScene');
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: () => this.scene.start('GameScene'),
            goToTitle: () => this.scene.start('TitleScene'),
            restartLevel: () => { },
            forceGameOver: () => { },
            forceLevelClear: () => { },
            getCurrentScene: () => 'LevelSelectScene'
        };
    }

    private createLevelNode(x: number, y: number, label: string, unlocked: boolean) {
        const circle = this.add.circle(x, y, 32, unlocked ? 0x4CAF50 : 0x7f8c8d);
        circle.setStrokeStyle(4, 0xffffff);

        const text = this.add.text(x, y, label, {
            fontFamily: '"VT323", monospace',
            fontSize: '32px',
            color: '#ffffff'
        });
        text.setOrigin(0.5);

        if (unlocked) {
            circle.setInteractive({ useHandCursor: true });
            circle.on('pointerdown', () => {
                this.scene.start('GameScene');
            });

            circle.on('pointerover', () => circle.setScale(1.1));
            circle.on('pointerout', () => circle.setScale(1.0));
        }
    }

    private createButton(x: number, y: number, label: string, onClick: () => void) {
        const btn = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 64, 64, 0xe0e0e0);
        bg.setStrokeStyle(4, 0x4a4a4a);
        const shadow = this.add.rectangle(0, 32, 64, 4, 0x4a4a4a).setOrigin(0.5, 0);

        const text = this.add.text(0, 0, label, { fontSize: '32px', color: '#333' }).setOrigin(0.5);

        btn.add([shadow, bg, text]);
        btn.setSize(64, 64);
        btn.setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            bg.y += 4;
            text.y += 4;
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
