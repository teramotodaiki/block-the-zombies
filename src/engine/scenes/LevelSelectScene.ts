import Phaser from 'phaser';
import { LevelManager } from '../../core/level-manager';
import { LEVELS } from '../../levels';

export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super('LevelSelectScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

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

            const isUnlocked = levelManager.isLevelUnlocked(i);

            this.createLevelButton(x, y, i + 1, isUnlocked, () => {
                if (isUnlocked) {
                    this.scene.start('GameScene', { levelIndex: i });
                }
            });
        }

        // Back Button
        this.createButton(60, 540, 'btn-home', () => {
            this.scene.start('TitleScene');
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: (levelIndex?: number) =>
                this.scene.start('GameScene', { levelIndex: levelIndex ?? 0 }),
            goToTitle: () => this.scene.start('TitleScene'),
            restartLevel: () => {},
            forceGameOver: () => {},
            forceLevelClear: () => {},
            getCurrentScene: () => 'LevelSelectScene',
        };
    }

    private createLevelButton(
        x: number,
        y: number,
        level: number,
        isUnlocked: boolean,
        onClick: () => void,
    ) {
        const btn = this.add.container(x, y);

        // Colors based on state
        const color = isUnlocked ? 0x4caf50 : 0x888888;
        const strokeColor = isUnlocked ? 0x2e7d32 : 0x555555;
        const shadowColor = 0x000000;

        const bg = this.add.rectangle(0, 0, 100, 100, color);
        bg.setStrokeStyle(4, strokeColor);
        const shadow = this.add.rectangle(0, 4, 100, 100, shadowColor, 0.5);

        btn.add(shadow);
        btn.add(bg);

        if (isUnlocked) {
            const text = this.add
                .text(0, 0, level.toString(), {
                    fontSize: '48px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                })
                .setOrigin(0.5);
            btn.add(text);

            // Interaction
            btn.setSize(100, 100);
            btn.setInteractive({ useHandCursor: true });

            btn.on('pointerdown', () => {
                bg.y += 4;
                text.y += 4;
                shadow.visible = false;
                this.sound.play('se-click');
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
        } else {
            // Locked visual
            const icon = this.add.image(0, 0, 'icon-lock');
            icon.setDisplaySize(48, 48);
            icon.setTint(0xdddddd);
            btn.add(icon);
        }
    }

    private createButton(
        x: number,
        y: number,
        texture: string,
        onClick: () => void,
    ) {
        const btn = this.add.container(x, y);

        const icon = this.add.image(0, 0, texture);
        icon.setDisplaySize(64, 64);

        btn.add(icon);
        btn.setSize(64, 64);
        btn.setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            icon.setTint(0xcccccc);
            this.sound.play('se-click');
        });

        btn.on('pointerup', () => {
            icon.clearTint();
            onClick();
        });

        btn.on('pointerout', () => {
            icon.clearTint();
        });
    }
}
