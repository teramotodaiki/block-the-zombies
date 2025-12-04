import Phaser from 'phaser';
import { Game } from '../../core/game';
import { LEVELS, type LevelConfig } from '../../core/level';
import { LevelManager } from '../../core/level-manager';
import { TileType } from '../../core/types';
import { HUD } from '../../ui/HUD';
import { OverlayManager } from '../../ui/OverlayManager';
import { InputManager } from '../InputManager';
import { Renderer } from '../Renderer';

export class GameScene extends Phaser.Scene {
    private gameCore!: Game;
    private gameRenderer!: Renderer;
    // @ts-expect-error
    private inputManager!: InputManager;
    private hud!: HUD;
    private overlayManager!: OverlayManager;
    private isGameEnded = false;

    constructor() {
        super('GameScene');
    }

    create(data: { levelIndex?: number }) {
        const levelIndex = data.levelIndex ?? 0;
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
        this.inputManager = new InputManager(this, this.gameCore);
        this.hud = new HUD(this, this.gameCore);
        this.overlayManager = new OverlayManager(this);

        // Initial render
        this.gameRenderer.init();

        this.events.on('tile-changed', (pos: { x: number; y: number }) => {
            this.gameRenderer.refreshTile(pos.x, pos.y);
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: (levelIndex?: number) => {
                const idx = levelIndex ?? 0;
                const levelManager = this.registry.get('levelManager') as LevelManager;
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
            this.overlayManager.showLevelClear(
                () => {
                    console.log('Next Level');
                    const levelManager = this.registry.get('levelManager') as LevelManager;
                    if (levelManager.hasNextLevel()) {
                        levelManager.nextLevel();
                        this.scene.restart({ levelIndex: undefined }); // Use current index from manager
                    } else {
                        console.log('All levels cleared!');
                        this.scene.start('TitleScene');
                    }
                },
                () => this.scene.restart(),
                () => this.scene.start('TitleScene'),
            );
        }
    }
}
