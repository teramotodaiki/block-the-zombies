import type Phaser from 'phaser';
import { TILE_SIZE } from '../core/constants';
import type { Game } from '../core/game';
import { TileType } from '../core/types';

export class Renderer {
    private scene: Phaser.Scene;
    private game: Game;

    private tileGroup: Phaser.GameObjects.Group;
    private villagerGroup: Phaser.GameObjects.Group;
    private zombieGroup: Phaser.GameObjects.Group;

    // Since entities are objects, we can use a Map<Entity, Sprite>
    private spriteMap: Map<any, Phaser.GameObjects.Sprite>;

    constructor(scene: Phaser.Scene, game: Game) {
        this.scene = scene;
        this.game = game;
        this.tileGroup = scene.add.group();
        this.villagerGroup = scene.add.group();
        this.zombieGroup = scene.add.group();
        this.spriteMap = new Map();
    }

    init() {
        this.renderTiles();
    }

    render() {
        // Update Entities
        this.syncSprites();
    }

    private renderTiles() {
        this.tileGroup.clear(true, true);

        // const tiles = this.game.grid['tiles']; // Accessing private property for rendering... ideally Grid exposes a way to iterate
        // Or just iterate by width/height
        const width = this.game.grid.width;
        const height = this.game.grid.height;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = this.game.grid.getTile(x, y);
                if (tile !== TileType.Empty) {
                    const worldX = x * TILE_SIZE + TILE_SIZE / 2;
                    const worldY = y * TILE_SIZE + TILE_SIZE / 2;

                    if (tile === TileType.Goal) {
                        // Render Goal as an image with specific properties
                        const goal = this.scene.add.image(worldX, worldY, 'tile-goal');
                        goal.setOrigin(0.5, 0.75); // Anchor bottom-ish to stand on tile
                        goal.setDisplaySize(96, 96);
                        this.tileGroup.add(goal);
                    } else {
                        // Render other tiles as sprites
                        let texture = '';
                        switch (tile) {
                            case TileType.Ground:
                                texture = 'tile-ground';
                                break;
                            case TileType.Bedrock:
                                texture = 'tile-bedrock';
                                break;
                            case TileType.Magma:
                                texture = 'tile-magma';
                                break;
                            // TileType.Goal is handled above
                        }

                        if (texture) {
                            const sprite = this.scene.add.sprite(
                                worldX,
                                worldY,
                                texture,
                            );

                            // Scale tile to match TILE_SIZE (48px)
                            // Assets are 64x64, so we scale them down.
                            // Or we could use setDisplaySize(TILE_SIZE, TILE_SIZE)
                            sprite.setDisplaySize(TILE_SIZE, TILE_SIZE);
                            this.tileGroup.add(sprite);
                        }
                    }
                }
            }
        }
    }

    // Optimized tile update (instead of clearing all)
    // For now, let's just re-render all tiles if dirty? Or just update changed ones?
    // Since blocks change, we should probably have a method `updateTile(x, y)` called by game events.
    // But for MVP, let's just re-render tiles every frame? No, too expensive.
    // Let's assume tiles are static mostly, except player blocks.
    // We can just clear and redraw for now, or optimize later.
    // Actually, `render()` is called every frame. We shouldn't redraw tiles every frame.
    // We need a way to know if grid changed.
    // For now, let's just NO_OPT update tiles in render() and assume they are static,
    // EXCEPT when we implement block placement, we will need to update the view.
    // Let's add a public method `refreshTiles()` that GameScene can call if needed,
    // or just handle it in InputManager when action succeeds.

    public refreshTile(_x: number, _y: number) {
        // Find existing sprite at this location and remove it
        // This is inefficient with Groups.
        // Better: Clear all and redraw (simple) or use a 2D array of sprites.
        this.renderTiles(); // Simple but slow. OK for MVP with small maps.
    }

    private syncSprites() {
        // Track which entities are still alive
        const activeEntities = new Set<any>();

        // Villagers
        for (const villager of this.game.villagers) {
            activeEntities.add(villager);
            let sprite = this.spriteMap.get(villager);
            if (!sprite) {
                sprite = this.scene.add.sprite(
                    villager.position.x,
                    villager.position.y,
                    'entity-villager',
                );
                // sprite.setOrigin(0.5, 1); // Reverted to default (Center) as physics uses Center
                sprite.play('villager-walk');
                this.villagerGroup.add(sprite);
                this.spriteMap.set(villager, sprite);
            }

            sprite.x = villager.position.x;
            sprite.y = villager.position.y + 4;
            sprite.setScale(1.0);
            sprite.flipX = villager.direction === -1;
        }

        // Zombies
        for (const zombie of this.game.zombies) {
            activeEntities.add(zombie);
            let sprite = this.spriteMap.get(zombie);
            if (!sprite) {
                sprite = this.scene.add.sprite(
                    zombie.position.x,
                    zombie.position.y,
                    'entity-zombie',
                );
                // sprite.setOrigin(0.5, 1);
                sprite.play('zombie-walk');
                this.zombieGroup.add(sprite);
                this.spriteMap.set(zombie, sprite);
            }

            sprite.x = zombie.position.x;
            sprite.y = zombie.position.y - 60 + TILE_SIZE;
            sprite.setScale(1.0);
            sprite.flipX = zombie.direction === -1;
        }

        // Remove dead sprites
        for (const [entity, sprite] of this.spriteMap.entries()) {
            if (!activeEntities.has(entity)) {
                sprite.destroy();
                this.spriteMap.delete(entity);
            }
        }
    }
}
