import Phaser from 'phaser';
import type { Game } from '../core/game';

export class HUD extends Phaser.GameObjects.Container {
    private gameCore: Game;
    private blockCountText!: Phaser.GameObjects.Text;
    private goalIcons: Phaser.GameObjects.Image[] = [];
    private pauseBtn!: Phaser.GameObjects.Container;
    public onPauseClick?: () => void;

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
        // Block Count Display
        // Icon
        const blockIcon = this.scene.add.image(60, 40, 'icon-block'); // TBD asset
        blockIcon.setDisplaySize(48, 48);

        this.blockCountText = this.scene.add.text(100, 20, '0', {
            fontFamily: '"VT323", monospace',
            fontSize: '48px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        });

        this.add([blockIcon, this.blockCountText]);

        // Pause Button
        this.createPauseButton();
    }

    private createPauseButton() {
        this.pauseBtn = this.scene.add.container(750, 40);

        const bg = this.scene.add.rectangle(0, 0, 60, 60, 0x333333);
        bg.setStrokeStyle(2, 0xffffff);

        const icon = this.scene.add.text(0, 0, '||', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.pauseBtn.add([bg, icon]);
        this.pauseBtn.setSize(60, 60);
        this.pauseBtn.setInteractive({ useHandCursor: true });

        this.pauseBtn.on('pointerdown', () => {
            // Visual feedback
            bg.setFillStyle(0x555555);
        });

        this.pauseBtn.on('pointerup', () => {
            bg.setFillStyle(0x333333);
            if (this.onPauseClick) {
                this.onPauseClick();
            }
        });

        this.pauseBtn.on('pointerout', () => {
            bg.setFillStyle(0x333333);
        });

        this.add(this.pauseBtn);
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

            // Center the goal icons
            const startX = 400 - (required * 40) / 2;

            for (let i = 0; i < required; i++) {
                const icon = this.scene.add.image(
                    startX + i * 40,
                    40,
                    'hud-goal-empty',
                );
                icon.setDisplaySize(32, 32);
                this.add(icon);
                this.goalIcons.push(icon);
            }
        }

        // Update status
        for (let i = 0; i < required; i++) {
            if (i < current) {
                this.goalIcons[i].setTexture('hud-goal-full'); // Reached
                // this.goalIcons[i].setTint(0xffd700); // Gold tint
            } else {
                this.goalIcons[i].setTexture('hud-goal-empty'); // Not reached
                // this.goalIcons[i].setTint(0x888888); // Grey tint
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
