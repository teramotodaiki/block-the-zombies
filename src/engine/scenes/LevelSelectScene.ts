import Phaser from 'phaser';

import { LEVELS } from '../../core/level';
import { LevelManager } from '../../core/level-manager';

export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super('LevelSelectScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        // Title
        const title = this.add
            .text(400, 100, 'SELECT LEVEL', {
                fontSize: '48px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6,
            })
            .setOrigin(0.5);

        // Level Grid
        const startX = 200;
        const startY = 250;
        const cols = 4;
        const spacingX = 130;
        const spacingY = 130;

        // Ensure LevelManager exists
        let levelManager = this.registry.get('levelManager') as LevelManager;
        if (!levelManager) {
            levelManager = new LevelManager(LEVELS);
            this.registry.set('levelManager', levelManager);
        }

        const levelCount = levelManager.getLevelCount();

        for (let i = 0; i < levelCount; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

            this.createLevelButton(x, y, i + 1, () => {
                this.scene.start('GameScene', { levelIndex: i });
            });
        }

        // Back Button
        this.createButton(60, 540, 'btn-home', () => {
            this.scene.start('TitleScene');
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: (levelIndex?: number) => this.scene.start('GameScene', { levelIndex: levelIndex ?? 0 }),
            goToTitle: () => this.scene.start('TitleScene'),
            restartLevel: () => {},
            forceGameOver: () => {},
            forceLevelClear: () => {},
            getCurrentScene: () => 'LevelSelectScene',
        };
    }

    private createLevelButton(x: number, y: number, level: number, onClick: () => void) {
        const btn = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 100, 100, 0x4caf50);
        bg.setStrokeStyle(4, 0x2e7d32);
        const shadow = this.add.rectangle(0, 4, 100, 100, 0x000000, 0.5); // Simple shadow

        const text = this.add
            .text(0, 0, level.toString(), {
                fontSize: '48px',
                color: '#ffffff',
                fontStyle: 'bold',
            })
            .setOrigin(0.5);

        btn.add([shadow, bg, text]);
        btn.setSize(100, 100);
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

        // Assuming 'this.buttons' is meant to be defined elsewhere,
        // or this line should be removed if not needed.
        // For now, commenting it out to avoid compilation errors.
        // this.buttons.push(btn);
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
