import Phaser from 'phaser';
import { Game } from '../../core/game';
import { LevelConfig } from '../../core/level';
import { TileType } from '../../core/types';
import { Renderer } from '../Renderer';
import { InputManager } from '../InputManager';
import { HUD } from '../../ui/HUD';
import { OverlayManager } from '../../ui/OverlayManager';

// Temporary test level
const TEST_LEVEL: LevelConfig = {
    id: 'test-level',
    biome: 'plains',
    width: 16, // 16 * 48 = 768 < 800
    height: 12, // 12 * 48 = 576 < 600
    tiles: Array.from({ length: 12 }, (_, y) =>
        Array.from({ length: 16 }, (_, x) => {
            if (y === 11) return TileType.Bedrock;
            if (y === 10) {
                // if (x === 5 || x === 6) return TileType.Magma; // Removed for auto-clear test
                return TileType.Ground;
            }
            // Goal 2x2 at (14, 8) and (14, 9), (15, 8), (15, 9)
            if ((y === 8 || y === 9) && (x === 14 || x === 15)) return TileType.Goal;

            if (y === 7 && x === 8) return TileType.Ground; // Platform
            return TileType.Empty;
        })
    ),
    villagerSpawn: { position: { x: 1, y: 9 }, interval: 2000, count: 5 },
    zombieSpawns: [],
    goal: { position: { x: 14, y: 9 }, requiredCount: 3 },
    maxBlocks: 10,
    forbiddenTiles: []
};

export class GameScene extends Phaser.Scene {
    private gameCore!: Game;
    private gameRenderer!: Renderer;
    // @ts-ignore
    private inputManager!: InputManager;
    private hud!: HUD;
    private overlayManager!: OverlayManager;
    private isGameEnded = false;

    constructor() {
        super('GameScene');
    }

    create() {
        this.gameCore = new Game(TEST_LEVEL);
        this.gameRenderer = new Renderer(this, this.gameCore);
        this.inputManager = new InputManager(this, this.gameCore);
        this.hud = new HUD(this, this.gameCore);
        this.overlayManager = new OverlayManager(this);

        // Initial render
        this.gameRenderer.init();

        this.events.on('tile-changed', (pos: { x: number, y: number }) => {
            this.gameRenderer.refreshTile(pos.x, pos.y);
        });

        // Expose Debug API
        window.gameDebug = {
            startLevel: () => { console.log('Already in GameScene'); },
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
            getCurrentScene: () => 'GameScene'
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
                () => this.scene.start('TitleScene')
            );
        } else if (this.gameCore.isLevelCleared) {
            this.isGameEnded = true;
            this.overlayManager.showLevelClear(
                () => {
                    console.log('Next Level - TODO');
                    this.scene.restart(); // Temporary: Restart level
                },
                () => this.scene.restart(),
                () => this.scene.start('TitleScene')
            );
        }
    }
}
