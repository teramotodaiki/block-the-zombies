import Phaser from 'phaser';
import { Game } from '../../core/game';
import { LEVELS } from '../../levels';
import { LevelManager } from '../../core/level-manager';
import { HUD } from '../../ui/HUD';
import { OverlayManager } from '../../ui/OverlayManager';
import { InputManager } from '../InputManager';
import { Renderer } from '../Renderer';

export class GameScene extends Phaser.Scene {
    private gameCore!: Game;
    private gameRenderer!: Renderer;
    private overlayManager!: OverlayManager;
    private hud!: HUD;
    private isGameEnded = false;

    constructor() {
        super('GameScene');
    }

    create(data: { levelIndex?: number }) {
        this.isGameEnded = false;

        // Sky Background
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x4A90E2, 0x4A90E2, 0x87CEEB, 0x87CEEB, 1);
        sky.fillRect(0, 0, width, height);
        sky.setScrollFactor(0);
        sky.setDepth(-100); // Behind everything

        // Ideally LevelManager is a singleton or passed from previous scene.
        // For now, let's instantiate it here or get from registry?
        // Better: Pass LevelManager instance? No, data must be serializable.
        // Let's assume we create a new LevelManager or use a global one.
        // For simplicity, let's create a global instance in main.ts or just import LEVELS here.

        // Actually, let's just use the LEVELS array directly for now,
        // or create a LevelManager instance here if it holds state.
        // If we want to track progress across scenes, we need a persistent manager.
        // Let's attach it to the Game registry.

        let levelManager = this.registry.get('levelManager') as LevelManager;
        if (!levelManager) {
            levelManager = new LevelManager(LEVELS);
            this.registry.set('levelManager', levelManager);
        }

        // If specific index requested, set it
        if (data.levelIndex !== undefined) {
            levelManager.setLevel(data.levelIndex);
        }

        this.gameCore = new Game(levelManager.getCurrentLevel());
        this.gameRenderer = new Renderer(this, this.gameCore);
        new InputManager(this, this.gameCore);
        this.hud = new HUD(this, this.gameCore);
        this.overlayManager = new OverlayManager(this);

        this.hud.onHomeClick = () => {
            this.scene.start('TitleScene');
        };

        this.hud.onRetryClick = () => {
            this.scene.restart();
        };

        this.hud.onPauseClick = () => {
            this.gameCore.isPaused = !this.gameCore.isPaused;
            // Optional: Show/Hide a simple "PAUSED" text or overlay background if desired,
            // but user asked to remove the overlay image.
            // If we want to dim the background, we can use overlayManager just for that,
            // but for now let's just toggle state as the buttons are on HUD.
            if (this.gameCore.isPaused) {
                // this.overlayManager.showDim(); // If we implemented a simple dim
            } else {
                // this.overlayManager.hide();
            }
        };

        // Initial render
        this.gameRenderer.init();

        // Create Magma Animation
        if (!this.anims.exists('magma-anim')) {
            this.anims.create({
                key: 'magma-anim',
                frames: this.anims.generateFrameNumbers('tile-magma-anim', {
                    start: 0,
                    end: 3,
                }),
                frameRate: 8,
                repeat: -1,
            });
        }

        this.events.on('tile-changed', (pos: { x: number; y: number }) => {
            this.gameRenderer.refreshTile(pos.x, pos.y);
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: (levelIndex?: number) => {
                const idx = levelIndex ?? 0;
                const levelManager = this.registry.get(
                    'levelManager',
                ) as LevelManager;
                if (levelManager) {
                    levelManager.setLevel(idx);
                }
                this.scene.restart({ levelIndex: idx });
            },
            goToTitle: () => this.scene.start('TitleScene'),
            restartLevel: () => this.scene.restart(),
            forceGameOver: () => {
                this.gameCore.isGameOver = true;
                this.checkGameState();
            },
            forceLevelClear: () => {
                this.gameCore.isLevelCleared = true;
                this.checkGameState();
            },
            getCurrentScene: () => 'GameScene',
        };
    }

    update(_time: number, delta: number) {
        // Core update (delta is in ms from Phaser, convert to seconds)
        if (!this.isGameEnded) {
            this.gameCore.update(delta / 1000);
            this.checkGameState();
        }

        // Render update
        this.gameRenderer.render();
    }

    private checkGameState() {
        if (this.gameCore.isGameOver) {
            this.isGameEnded = true;
            this.overlayManager.showGameOver(
                () => this.scene.restart(),
                () => this.scene.start('TitleScene'),
            );
        } else if (this.gameCore.isLevelCleared) {
            this.isGameEnded = true;
            this.overlayManager.showLevelClear(() => {
                const levelManager = this.registry.get('levelManager') as LevelManager;
                const nextIndex = levelManager.getCurrentLevelIndex() + 1;

                // Unlock next level if it exists
                if (nextIndex < levelManager.getLevelCount()) {
                    levelManager.unlockLevel(nextIndex);
                }

                this.scene.start('LevelSelectScene');
            });
        }
    }
}
