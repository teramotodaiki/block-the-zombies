import { describe, it, expect } from 'vitest';
import { Game } from './game';
import { LevelConfig } from './level';
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
    forbiddenTiles: []
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
        const success = game.toggleBlock(5, 5);
        expect(success).toBe(true);
        expect(game.grid.getTile(5, 5)).toBe(TileType.Ground);
    });

    it('should remove blocks', () => {
        const game = new Game(mockLevel);
        game.toggleBlock(5, 5); // Place
        const success = game.toggleBlock(5, 5); // Remove
        expect(success).toBe(true);
        expect(game.grid.getTile(5, 5)).toBe(TileType.Empty);
    });
});
