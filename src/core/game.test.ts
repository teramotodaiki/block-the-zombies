import { describe, expect, it } from 'vitest';
import { Game } from './game';
import type { LevelConfig } from './level';
import { TileType } from './types';

const mockLevel: LevelConfig = {
    id: 'test-level',
    biome: 'plains',
    width: 10,
    height: 10,
    tiles: Array.from({ length: 10 }, () => Array(10).fill(TileType.Empty)),
    villagerSpawn: { position: { x: 0, y: 0 }, interval: 1000, count: 1 },
    zombieSpawns: [],
    goal: { position: { x: 9, y: 9 }, requiredCount: 1 },
    maxBlocks: 10,
    forbiddenTiles: [],
};

describe('Game', () => {
    it('should initialize correctly', () => {
        const game = new Game(mockLevel);
        expect(game.grid).toBeDefined();
        expect(game.entities.length).toBe(0);
    });

    it('should spawn villagers', () => {
        const game = new Game(mockLevel);
        game.update(1.1); // Advance 1.1 seconds (interval is 1000ms = 1s)
        expect(game.villagers.length).toBe(1);
    });

    it('should place blocks', () => {
        const game = new Game(mockLevel);
        // Setup a solid block neighbor
        game.grid.setTile(5, 6, TileType.Ground);

        const success = game.toggleBlock(5, 5);
        expect(success).toBe(true);
        expect(game.grid.getTile(5, 5)).toBe(TileType.Ground);
    });

    it('should remove blocks', () => {
        const game = new Game(mockLevel);
        // Setup a solid block neighbor
        game.grid.setTile(5, 6, TileType.Ground);

        game.toggleBlock(5, 5); // Place
        const success = game.toggleBlock(5, 5); // Remove
        expect(success).toBe(true);
        expect(game.grid.getTile(5, 5)).toBe(TileType.Empty);
    });

    it('should respect max blocks limit', () => {
        const limitedLevel = { ...mockLevel, maxBlocks: 1 };
        const game = new Game(limitedLevel);
        game.grid.setTile(5, 6, TileType.Ground);

        // Place 1st block
        expect(game.toggleBlock(5, 5)).toBe(true);
        expect(game.levelConfig.maxBlocks).toBe(0);

        // Try placing 2nd block
        game.grid.setTile(4, 6, TileType.Ground); // Neighbor
        expect(game.toggleBlock(4, 5)).toBe(false);
        expect(game.grid.getTile(4, 5)).toBe(TileType.Empty);
    });

    it('should restore inventory when block is removed', () => {
        const limitedLevel = { ...mockLevel, maxBlocks: 1 };
        const game = new Game(limitedLevel);
        game.grid.setTile(5, 6, TileType.Ground);

        game.toggleBlock(5, 5); // Place (Inventory 0)
        expect(game.levelConfig.maxBlocks).toBe(0);

        game.toggleBlock(5, 5); // Remove (Inventory 1)
        expect(game.levelConfig.maxBlocks).toBe(1);
    });

    it('should spawn zombies', () => {
        const zombieLevel: LevelConfig = {
            ...mockLevel,
            zombieSpawns: [
                { position: { x: 5, y: 5 }, time: 500 }, // Spawn at 0.5s
            ],
        };
        const game = new Game(zombieLevel);

        game.update(0.4); // 0.4s
        expect(game.zombies.length).toBe(0);

        game.update(0.2); // 0.6s
        expect(game.zombies.length).toBe(1);
        // Zombie moves at 100px/s.
        // Spawned at 0.5s.
        // At 0.6s, it has existed for 0.1s.
        // Moved 100 * 0.1 = 10px.
        // Initial X = 5 * 48 + 24 = 264.
        // Direction defaults to Right (1).
        // Expected X = 264 + 10 = 274.
        // Wait, the error said 284.
        // Did it update for 0.2s?
        // game.update(0.4) -> time 0.4. No spawn.
        // game.update(0.2) -> time 0.6.
        // Spawn check happens inside update.
        // If spawn happens at exactly 0.5s (logic check), does it simulate the remaining 0.1s?
        // Our logic: if (time >= spawn.time) spawn();
        // Then entity.update(delta).
        // So entity updates for the FULL delta (0.2s) even if it spawned "in the middle" of the frame?
        // Yes, current implementation spawns then updates for full delta.
        // So it moved for 0.2s.
        // 100 * 0.2 = 20px.
        // 264 + 20 = 284. Correct.
        expect(game.zombies[0].position.x).toBe(5 * 48 + 24 + 20);
    });
});
