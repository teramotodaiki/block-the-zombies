import Phaser from 'phaser';
import type { Game } from '../core/game';

export class HUD extends Phaser.GameObjects.Container {
    private gameCore: Game;
    private blockCountText!: Phaser.GameObjects.Text;
    private goalIcons: Phaser.GameObjects.Rectangle[] = [];

    private homeBtn!: Phaser.GameObjects.Container;
    private restartBtn!: Phaser.GameObjects.Container;
    private pauseBtn!: Phaser.GameObjects.Container;

    private readonly LONG_PRESS_DURATION = 1000;
    private longPressTimer?: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, gameCore: Game) {
        super(scene, 0, 0);
        this.gameCore = gameCore;
        this.scene.add.existing(this);
        this.setScrollFactor(0); // Fix to camera

        this.createElements();

        // Update loop
        this.scene.events.on('update', this.updateUI, this);
    }

    private createElements() {
        // Background Bar
        const bg = this.scene.add.rectangle(400, 30, 800, 60, 0x000000, 0.5);
        this.add(bg);

        // --- Left Controls ---
        this.homeBtn = this.createButton(40, 30, 'btn-home', () => {
            // Long press handled separately
        });
        this.setupLongPress(this.homeBtn, () => {
            console.log('Home Long Press');
            this.scene.scene.start('TitleScene');
        });

        this.restartBtn = this.createButton(100, 30, 'btn-retry', () => {});
        this.setupLongPress(this.restartBtn, () => {
            console.log('Restart Long Press');
            this.scene.scene.restart();
        });

        this.pauseBtn = this.createButton(160, 30, 'btn-pause', () => {
            console.log('Pause Clicked');
            // Toggle pause logic here
        });

        // --- Right Status ---

        // Goal Icons Area
        this.scene.add
            .text(550, 30, '🏠', { fontSize: '24px' })
            .setOrigin(0.5, 0.5);
        // Icons will be created dynamically in update

        // Block Count
        this.scene.add
            .text(700, 30, '🧱', { fontSize: '24px' })
            .setOrigin(0.5, 0.5);
        this.blockCountText = this.scene.add
            .text(730, 30, '0', {
                fontFamily: '"VT323", monospace',
                fontSize: '32px',
                color: '#ffffff',
            })
            .setOrigin(0.5, 0.5);
        this.add(this.blockCountText);
    }

    private createButton(
        x: number,
        y: number,
        texture: string,
        onClick: () => void,
    ): Phaser.GameObjects.Container {
        const btn = this.scene.add.container(x, y);

        // Button Shape (Blocky)
        const bg = this.scene.add.rectangle(0, 0, 48, 48, 0xe0e0e0);
        bg.setStrokeStyle(4, 0x4a4a4a);

        // 3D effect (bottom border)
        const shadow = this.scene.add
            .rectangle(0, 24, 48, 4, 0x4a4a4a)
            .setOrigin(0.5, 0);

        const icon = this.scene.add.image(0, 0, texture);
        icon.setDisplaySize(32, 32);

        btn.add([shadow, bg, icon]);
        btn.setSize(48, 48);
        btn.setInteractive({ useHandCursor: true });

        // Click effect
        btn.on('pointerdown', () => {
            bg.y += 4;
            icon.y += 4;
            shadow.visible = false;
        });

        const resetBtn = () => {
            bg.y = 0;
            icon.y = 0;
            shadow.visible = true;
        };

        btn.on('pointerup', () => {
            resetBtn();
            onClick();
        });
        btn.on('pointerout', resetBtn);

        this.add(btn);
        return btn;
    }

    private setupLongPress(
        btn: Phaser.GameObjects.Container,
        callback: () => void,
    ) {
        btn.off('pointerup'); // Remove default click handler if any (simplified)

        // Re-implement pointerdown for long press
        btn.on('pointerdown', () => {
            // Visual feedback
            (btn.list[1] as Phaser.GameObjects.Rectangle).setFillStyle(
                0xffeb3b,
            ); // Yellow

            this.longPressTimer = this.scene.time.delayedCall(
                this.LONG_PRESS_DURATION,
                () => {
                    callback();
                    this.longPressTimer = undefined;
                },
            );
        });

        const cancel = () => {
            if (this.longPressTimer) {
                this.longPressTimer.remove();
                this.longPressTimer = undefined;
            }
            // Check if button is still valid before accessing children
            if (btn.scene && btn.list && btn.list.length > 1) {
                (btn.list[1] as Phaser.GameObjects.Rectangle).setFillStyle(
                    0xe0e0e0,
                ); // Reset color
            }
        };

        btn.on('pointerup', cancel);
        btn.on('pointerout', cancel);
    }

    private updateUI() {
        if (!this.scene) return;

        // Update Block Count
        this.blockCountText.setText(`${this.gameCore.levelConfig.maxBlocks}`);

        // Update Goal Icons
        const required = this.gameCore.levelConfig.goal.requiredCount;
        const current = this.gameCore.goalCount;

        // Init icons if needed
        if (this.goalIcons.length !== required) {
            for (const icon of this.goalIcons) {
                icon.destroy();
            }
            this.goalIcons = [];
            for (let i = 0; i < required; i++) {
                const icon = this.scene.add.rectangle(
                    600 + i * 30,
                    30,
                    20,
                    20,
                    0x555555,
                );
                icon.setStrokeStyle(2, 0x222222);
                this.add(icon);
                this.goalIcons.push(icon);
            }
        }

        // Update status
        for (let i = 0; i < required; i++) {
            if (i < current) {
                this.goalIcons[i].setFillStyle(0xffd700); // Gold
            } else {
                this.goalIcons[i].setFillStyle(0x555555);
            }
        }
    }

    destroy(fromScene?: boolean) {
        if (this.scene) {
            this.scene.events.off('update', this.updateUI, this);
        }
        super.destroy(fromScene);
    }
}
