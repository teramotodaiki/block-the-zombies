import Phaser from 'phaser';
import { Game } from '../../core/game';
import { LevelConfig } from '../../core/level';
import { TileType } from '../../core/types';
import { Renderer } from '../Renderer';
import { InputManager } from '../InputManager';

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
            if (y === 9 && x === 14) return TileType.Goal; // Add Goal (House)
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

    constructor() {
        super('GameScene');
    }

    create() {
        this.gameCore = new Game(TEST_LEVEL);
        this.gameRenderer = new Renderer(this, this.gameCore);
        this.inputManager = new InputManager(this, this.gameCore);

        // Initial render
        this.gameRenderer.init();

        // Listen for tile changes
        this.events.on('tile-changed', (pos: { x: number, y: number }) => {
            this.gameRenderer.refreshTile(pos.x, pos.y);
        });
    }

    update(_time: number, delta: number) {
        // Core update (delta is in ms from Phaser, convert to seconds)
        this.gameCore.update(delta / 1000);

        // Render update
        this.gameRenderer.render();
    }
}
