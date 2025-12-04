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

    goalCount: number;
    isGameOver: boolean;
    isLevelCleared: boolean;

    constructor(config: LevelConfig) {
        this.levelConfig = config;
        this.grid = new Grid(config.width, config.height, this.cloneTiles(config.tiles));
        this.entities = [];
        this.villagers = [];
        this.zombies = [];
        this.timeElapsed = 0;

        this.villagerSpawnTimer = 0;
        this.villagersSpawnedCount = 0;
        this.goalCount = 0;
        this.isGameOver = false;
        this.isLevelCleared = false;
    }

    private cloneTiles(tiles: TileType[][]): TileType[][] {
        return tiles.map((row) => [...row]);
    }

    update(delta: number) {
        if (this.isGameOver || this.isLevelCleared) return;

        this.timeElapsed += delta; // delta in seconds? No, usually ms in Phaser, but let's standardize on seconds for core logic?
        // Let's assume delta is in SECONDS for physics calculations as per constants.

        // Spawn Villagers
        this.updateVillagerSpawn(delta);

        // Spawn Zombies
        this.updateZombieSpawn(delta);

        // Update Entities
        for (const entity of this.entities) {
            entity.update(delta, this.grid);
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
        if (this.villagersSpawnedCount >= spawn.count) return;

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
        // TBD: Efficiently check zombie spawns
        for (const _spawn of this.levelConfig.zombieSpawns) {
            // Check if it's time to spawn
            // This is a simple check, might need a flag to prevent double spawning if we just check time > spawn.time
            // For now, let's assume we remove them from a list or mark as spawned.
            // But levelConfig is immutable ideally.
            // Let's just check if timeElapsed crosses the threshold in this frame?
            // Or keep an index?
        }
        // Simplified for now:
        // We need a state to track which zombies have spawned.
    }

    private addEntity(entity: Entity) {
        this.entities.push(entity);
        if (entity instanceof Villager) this.villagers.push(entity);
        if (entity instanceof Zombie) this.zombies.push(entity);
    }

    private checkEntityCollisions() {
        // Zombie vs Villager
        for (const zombie of this.zombies) {
            for (const villager of this.villagers) {
                if (this.checkOverlap(zombie, villager)) {
                    villager.isDead = true;
                    // TODO: Effect?
                }
            }
        }

        // Magma check
        for (const entity of this.entities) {
            const gridPos = this.grid.toGrid(entity.position.x, entity.position.y);
            if (this.grid.getTile(gridPos.x, gridPos.y) === TileType.Magma) {
                entity.isDead = true;
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
            }
        }

        if (this.goalCount >= this.levelConfig.goal.requiredCount) {
            this.isLevelCleared = true;
        }
    }

    private checkGameOver() {
        // If all villagers are dead/gone and goal not reached
        if (
            this.villagersSpawnedCount >= this.levelConfig.villagerSpawn.count &&
            this.villagers.length === 0 &&
            !this.isLevelCleared
        ) {
            this.isGameOver = true;
        }
    }

    // Input handling
    toggleBlock(gridX: number, gridY: number): boolean {
        // Check bounds
        if (!this.grid.isValid(gridX, gridY)) return false;

        const currentTile = this.grid.getTile(gridX, gridY);

        // Destroy
        // TODO: Check if it's a player block (we need to track which blocks are player placed vs level geometry)
        // For now, let's assume Ground is destroyable if we implement that distinction.
        // Spec says: "Player can place/break blocks". "Bedrock is indestructible".
        // We might need a separate layer or flag for player blocks.
        // Or just use TileType.Ground and assume all Ground is breakable?
        // "Bedrock is indestructible".

        if (currentTile === TileType.Empty) {
            // Place
            // Check rules: adjacent to solid, max blocks, etc.
            // For now, just place
            this.grid.setTile(gridX, gridY, TileType.Ground);
            return true;
        } else if (currentTile === TileType.Ground) {
            // Break
            this.grid.setTile(gridX, gridY, TileType.Empty);
            return true;
        }

        return false;
    }
}
