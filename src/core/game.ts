import { TILE_SIZE } from './constants';
import { type Entity, Villager, Zombie } from './entity';
import { Grid } from './grid';
import type { LevelConfig } from './level';
import { TileType, type Vector2 } from './types';

export class Game {
    grid: Grid;
    entities: Entity[];
    villagers: Villager[];
    zombies: Zombie[];

    levelConfig: LevelConfig;
    timeElapsed: number;

    villagerSpawnTimer: number;
    villagersSpawnedCount: number;

    // Track next spawn time for each zombie spawner
    zombieNextSpawnTimes: number[];

    goalCount: number;
    isGameOver: boolean;
    isLevelCleared: boolean;
    isPaused: boolean;

    // Callbacks for events (audio/effects)
    public onEntityEvent?: (eventName: string, entity: Entity) => void;

    constructor(config: LevelConfig) {
        // Deep copy config to prevent mutation of original level data
        this.levelConfig = JSON.parse(JSON.stringify(config));

        this.grid = new Grid(
            this.levelConfig.width,
            this.levelConfig.height,
            this.cloneTiles(this.levelConfig.tiles),
        );
        this.entities = [];
        this.villagers = [];
        this.zombies = [];
        this.timeElapsed = 0;

        this.villagerSpawnTimer = 0;
        this.villagersSpawnedCount = 0;

        // Initialize next spawn times
        this.zombieNextSpawnTimes = this.levelConfig.zombieSpawns.map(
            (zoom) => zoom.time,
        );

        this.goalCount = 0;
        this.isGameOver = false;
        this.isLevelCleared = false;
        this.isPaused = false;
    }

    private cloneTiles(tiles: TileType[][]): TileType[][] {
        return tiles.map((row) => [...row]);
    }

    update(delta: number) {
        if (this.isGameOver || this.isLevelCleared || this.isPaused) return;

        this.timeElapsed += delta; // delta in seconds

        // Spawn Villagers
        this.updateVillagerSpawn(delta);

        // Spawn Zombies
        this.updateZombieSpawn(delta);

        // Update Entities
        for (const entity of this.entities) {
            entity.update(delta, this.grid);
            if (entity.isDead && entity.position.y > this.grid.height * TILE_SIZE) {
                if (entity instanceof Villager) {
                    this.onEntityEvent?.('villager-died', entity);
                } else if (entity instanceof Zombie) {
                    this.onEntityEvent?.('zombie-died', entity);
                }
            }
        }

        // Check Collisions / Game Rules
        this.checkEntityCollisions();
        this.checkGoal();
        this.checkGameOver();

        // Cleanup dead entities
        this.entities = this.entities.filter((e) => !e.isDead);
        this.villagers = this.villagers.filter((e) => !e.isDead);
        this.zombies = this.zombies.filter((e) => !e.isDead);
    }

    private updateVillagerSpawn(delta: number) {
        const spawn = this.levelConfig.villagerSpawn;
        // Infinite spawn: do not check count limit
        // if (this.villagersSpawnedCount >= spawn.count) return;

        // Limit concurrent villagers on screen
        if (this.villagers.length >= 3) return;

        this.villagerSpawnTimer += delta * 1000; // Convert to ms
        if (this.villagerSpawnTimer >= spawn.interval) {
            this.villagerSpawnTimer -= spawn.interval;
            this.spawnVillager(spawn.position);
        }
    }

    private spawnVillager(pos: Vector2) {
        // Convert grid pos to world pos
        // Spawn so feet are at the bottom of the tile
        const height = 96; // Villager height
        const worldX = pos.x * TILE_SIZE + TILE_SIZE / 2;
        const worldY = (pos.y + 1) * TILE_SIZE - height / 2;
        const villager = new Villager(worldX, worldY);
        this.addEntity(villager);
        this.villagersSpawnedCount++;
    }

    private updateZombieSpawn(_delta: number) {
        const currentTimeMs = this.timeElapsed * 1000;

        for (let i = 0; i < this.levelConfig.zombieSpawns.length; i++) {
            const nextTime = this.zombieNextSpawnTimes[i];
            if (nextTime === Infinity) continue;

            if (currentTimeMs >= nextTime) {
                // Check if we reached the limit of zombies on screen
                // Max 3 zombies at once (similar to villagers)
                if (this.zombies.length < 3) {
                    const spawnDef = this.levelConfig.zombieSpawns[i];
                    this.spawnZombie(spawnDef.position);

                    // If interval is defined, schedule next spawn
                    if (spawnDef.interval && spawnDef.interval > 0) {
                        this.zombieNextSpawnTimes[i] += spawnDef.interval;
                    } else {
                        // One-shot
                        this.zombieNextSpawnTimes[i] = Infinity;
                    }
                } else {
                    // Skip this spawn window if max zombies reached?
                    // OR should we defer it?
                    // Implementation choice: Defer it by pushing the timer forward?
                    // Or just skip it and wait for next interval?
                    // If we just skip, we might miss the "beat".
                    // If we check again next frame, we spawn immediately when slot opens.
                    // Let's NOT advance the time if we failed to spawn due to cap.
                    // BUT for interval based, we usually want regular intervals.
                    // If interval based, let's advance the timer anyway to keep the "beat",
                    // effectively skipping this wave.
                    const spawnDef = this.levelConfig.zombieSpawns[i];
                    if (spawnDef.interval && spawnDef.interval > 0) {
                        this.zombieNextSpawnTimes[i] += spawnDef.interval;
                    } else {
                        // One-shot but blocked? Retry next frame?
                        // If one-shot and blocked, we should probably retry.
                        // So do NOT change nextTime.
                    }

                    // Actually, if it's interval based and we skip, it might feel weird if no zombies appear for a long time.
                    // Let's Retry logic: Do NOT advance timer. Wait until space frees up.
                    // But then we spawn immediately.
                    // Let's stick to: "If blocked, retry next frame".
                    // So we only advance timer if we actually spawned OR if we decided to skip.
                    // Simple approach: Only spawn and advance if (zombies.length < 3).
                }
            }
        }
    }

    private spawnZombie(pos: Vector2) {
        const height = 48; // Zombie height (approx)
        const worldX = pos.x * TILE_SIZE + TILE_SIZE / 2;
        const worldY = (pos.y + 1) * TILE_SIZE - height / 2;
        const zombie = new Zombie(worldX, worldY);
        this.addEntity(zombie);
    }

    private addEntity(entity: Entity) {
        this.entities.push(entity);
        if (entity instanceof Villager) this.villagers.push(entity);
        if (entity instanceof Zombie) this.zombies.push(entity);
    }

    private checkEntityCollisions() {
        // Zombie vs Villager
        for (const zombie of this.zombies) {
            if (zombie.isDead) continue;
            for (const villager of this.villagers) {
                if (villager.isDead) continue;
                if (this.checkOverlap(zombie, villager)) {
                    villager.isDead = true;
                    this.onEntityEvent?.('villager-eaten', villager);
                }
            }
        }

        // Magma check
        for (const entity of this.entities) {
            const gridPos = this.grid.toGrid(
                entity.position.x,
                entity.position.y,
            );
            if (this.grid.getTile(gridPos.x, gridPos.y) === TileType.Magma) {
                entity.isDead = true;
                if (entity instanceof Zombie) {
                    this.onEntityEvent?.('zombie-died', entity);
                } else if (entity instanceof Villager) {
                    this.onEntityEvent?.('villager-died', entity);
                }
            }
        }
    }

    private checkOverlap(a: Entity, b: Entity): boolean {
        // Simple AABB
        return (
            Math.abs(a.position.x - b.position.x) < (a.width + b.width) / 2 &&
            Math.abs(a.position.y - b.position.y) < (a.height + b.height) / 2
        );
    }

    private checkGoal() {
        for (const villager of this.villagers) {
            // Check bounding box against Goal tiles
            const top = villager.position.y - villager.height / 2;
            const bottom = villager.position.y + villager.height / 2;
            const left = villager.position.x - villager.width / 2;
            const right = villager.position.x + villager.width / 2;

            const startX = Math.floor(left / TILE_SIZE);
            const endX = Math.floor(right / TILE_SIZE);
            const startY = Math.floor(top / TILE_SIZE);
            const endY = Math.floor(bottom / TILE_SIZE);

            let hitGoal = false;
            for (let y = startY; y <= endY; y++) {
                for (let x = startX; x <= endX; x++) {
                    if (this.grid.getTile(x, y) === TileType.Goal) {
                        hitGoal = true;
                        break;
                    }
                }
                if (hitGoal) break;
            }

            if (hitGoal) {
                villager.isDead = true; // Reached goal, remove from game
                this.goalCount++;
                this.onEntityEvent?.('villager-goal', villager);
            }
        }

        if (this.goalCount >= this.levelConfig.goal.requiredCount) {
            this.isLevelCleared = true;
        }
    }

    private checkGameOver() {
        // No Game Over logic per user request.
        // Villagers spawn infinitely.
    }

    // Input handling
    toggleBlock(gridX: number, gridY: number): boolean {
        // Check bounds
        if (!this.grid.isValid(gridX, gridY)) return false;

        const currentTile = this.grid.getTile(gridX, gridY);

        if (currentTile === TileType.Empty || currentTile === TileType.Magma) {
            // Place
            // Check max blocks
            if (this.levelConfig.maxBlocks <= 0) return false;

            // Check rules: adjacent to solid
            if (this.hasSolidNeighbor(gridX, gridY)) {
                this.grid.setTile(gridX, gridY, TileType.Ground);
                this.levelConfig.maxBlocks--; // Decrement inventory
                return true;
            }
            return false;
        } else if (currentTile === TileType.Ground) {
            // Break
            this.grid.setTile(gridX, gridY, TileType.Empty);
            this.levelConfig.maxBlocks++; // Increment inventory
            return true;
        }

        return false;
    }

    private hasSolidNeighbor(x: number, y: number): boolean {
        const neighbors = [
            { x: x, y: y - 1 }, // Top
            { x: x, y: y + 1 }, // Bottom
            { x: x - 1, y: y }, // Left
            { x: x + 1, y: y }, // Right
        ];

        for (const n of neighbors) {
            if (this.grid.isValid(n.x, n.y) && this.grid.isSolid(n.x, n.y)) {
                return true;
            }
        }
        return false;
    }
}
