import { describe, expect, it } from 'vitest';
import { TILE_SIZE } from './constants';
import { Game } from './game';
import type { LevelConfig } from './level';
import { TileType } from './types';

const mockLevel: LevelConfig = {
    id: 'test-level',
    biome: 'plains',
    width: 10,
    height: 10,
    tiles: Array.from({ length: 10 }, (_, y) =>
        Array.from({ length: 10 }, (_, x) => {
            if (y === 9) return TileType.Ground;
            if (y === 8 && x === 5) return TileType.Goal;
            return TileType.Empty;
        }),
    ),
    villagerSpawn: { position: { x: 0, y: 8 }, interval: 1000, count: 1 },
    zombieSpawns: [],
    goal: { position: { x: 5, y: 8 }, requiredCount: 1 },
    maxBlocks: 10,
    forbiddenTiles: [],
};

describe('Game Physics & Goal', () => {
    it('should spawn villager at correct height (Center)', () => {
        const game = new Game(mockLevel);
        for (let i = 0; i < 11; i++) game.update(0.1); // Spawn
        const villager = game.villagers[0];

        // Grid Y=8. Center should be:
        // (8 + 1) * 48 - 96/2 = 432 - 48 = 384.
        // Feet at 9 * 48 = 432.
        // Ground is at Y=9 (starts at 432).

        expect(villager.position.y).toBe(384);
    });

    it('should stay on ground without sinking', () => {
        const game = new Game(mockLevel);
        for (let i = 0; i < 11; i++) game.update(0.1); // Spawn
        const villager = game.villagers[0];

        // Simulate gravity falling
        for (let i = 0; i < 10; i++) {
            game.update(0.1);
        }

        // Should still be at 384 (Center) if feet are at 432 (Ground Top)
        expect(villager.position.y).toBe(384);
    });

    it('should detect goal', () => {
        const game = new Game(mockLevel);
        for (let i = 0; i < 11; i++) game.update(0.1); // Spawn
        const villager = game.villagers[0];

        // Teleport to goal X
        // Goal is at 5, 8.
        // World X = 5 * 48 + 24 = 264.
        villager.position.x = 264;

        game.update(0.01); // Trigger collision check

        expect(villager.isDead).toBe(true);
        expect(game.goalCount).toBe(1);
    });
});
