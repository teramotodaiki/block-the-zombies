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
            // Check if this is the latest unlocked level
            // It is latest if it is unlocked AND the next one is NOT unlocked
            // AND it is NOT the final level (user request: "when all levels unlocked, newest should not glow")
            const isNextLocked = !levelManager.isLevelUnlocked(i + 1);
            const isLatest = isUnlocked && isNextLocked && (i < levelCount - 1);

            this.createLevelButton(x, y, i + 1, isUnlocked, isLatest, () => {
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
        isLatest: boolean,
        onClick: () => void,
    ) {
        const btn = this.add.container(x, y);

        // Colors based on state
        const color = isUnlocked ? 0x4caf50 : 0x888888;
        const strokeColor = isUnlocked ? 0x2e7d32 : 0x555555;
        const shadowColor = 0x000000;

        // If latest, add a glowing background behind the button
        if (isLatest) {
            // Stronger glow: bigger size, pulsing scale
            const glow = this.add.rectangle(0, 0, 110, 110, 0xffff00, 1.0);
            glow.setStrokeStyle(4, 0xffd700);
            btn.add(glow);

            this.tweens.add({
                targets: glow,
                alpha: { from: 1.0, to: 0.2 },
                scale: { from: 1.0, to: 1.2 },
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

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
