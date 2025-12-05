import type Phaser from 'phaser';
import type { Game } from '../core/game';

export class InputManager {
    private scene: Phaser.Scene;
    private game: Game;

    constructor(scene: Phaser.Scene, game: Game) {
        this.scene = scene;
        this.game = game;

        this.scene.input.on('pointerdown', this.onPointerDown, this);
    }

    private onPointerDown(
        pointer: Phaser.Input.Pointer,
        currentlyOver: Phaser.GameObjects.GameObject[],
    ) {
        if (currentlyOver.length > 0) return;

        // Convert screen to world (if camera is used)
        const worldX = pointer.worldX;
        const worldY = pointer.worldY;

        // Convert to grid
        const gridPos = this.game.grid.toGrid(worldX, worldY);

        // Attempt to toggle block
        const success = this.game.toggleBlock(gridPos.x, gridPos.y);

        if (success) {
            // Trigger visual update
            // Ideally Game emits an event, but for now direct coupling
            // We need access to Renderer to refresh tiles.
            // Since GameScene has both, maybe GameScene should listen?
            // Or we pass Renderer to InputManager?
            // Let's assume GameScene handles the loop, but for immediate feedback:
            // We can just rely on the fact that we changed the data.
            // But Renderer.render() doesn't update tiles.
            // So we need to trigger it.

            // Hack: Let's emit an event on the scene
            this.scene.events.emit('tile-changed', gridPos);
        }
    }
}
