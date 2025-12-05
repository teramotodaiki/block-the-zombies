import Phaser from 'phaser';
import type { Game } from '../core/game';

export class HUD extends Phaser.GameObjects.Container {
    private gameCore: Game;
    private blockCountText!: Phaser.GameObjects.Text;
    private pauseBtn!: Phaser.GameObjects.Image;

    public onPauseClick?: () => void;
    public onHomeClick?: () => void;
    public onRetryClick?: () => void;

    constructor(scene: Phaser.Scene, gameCore: Game) {
        super(scene, 0, 0);
        this.gameCore = gameCore;
        this.scene.add.existing(this);
        this.setScrollFactor(0); // Fix to camera
        this.setDepth(200); // Ensure HUD is on top

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

        // Control Buttons (Center)
        this.createControlButtons();
    }

    private createControlButtons() {
        const startX = 400; // Center
        const y = 40;
        const spacing = 70;

        // Home Button
        this.createButton(startX - spacing, y, 'btn-home', () => {
            if (this.onHomeClick) this.onHomeClick();
        });

        // Retry Button
        this.createButton(startX, y, 'btn-retry', () => {
            if (this.onRetryClick) this.onRetryClick();
        });

        // Pause/Play Button
        this.pauseBtn = this.createButton(startX + spacing, y, 'btn-pause', () => {
            if (this.onPauseClick) this.onPauseClick();
        });
    }

    private createButton(x: number, y: number, key: string, callback: () => void): Phaser.GameObjects.Image {
        const container = this.scene.add.container(x, y);
        const btn = this.scene.add.image(0, 0, key);
        btn.setDisplaySize(48, 48);
        btn.setInteractive({ useHandCursor: true });

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

        container.add(btn);
        this.add(container);

        return btn;
    }

    private updateUI() {
        if (!this.scene) return;

        // Update Block Count
        this.blockCountText.setText(`${this.gameCore.levelConfig.maxBlocks}`);

        // Update Pause Button Texture
        if (this.gameCore.isPaused) {
            this.pauseBtn.setTexture('btn-play');
        } else {
            this.pauseBtn.setTexture('btn-pause');
        }
        this.pauseBtn.setDisplaySize(48, 48);
    }

    destroy(fromScene?: boolean) {
        if (this.scene) {
            this.scene.events.off('update', this.updateUI, this);
        }
        super.destroy(fromScene);
    }
}
