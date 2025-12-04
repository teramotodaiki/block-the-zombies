import type { LevelConfig } from './level';

export class LevelManager {
    private levels: LevelConfig[];
    private currentLevelIndex: number;

    constructor(levels: LevelConfig[]) {
        this.levels = levels;
        this.currentLevelIndex = 0;
    }

    getCurrentLevel(): LevelConfig {
        return this.levels[this.currentLevelIndex];
    }

    nextLevel(): boolean {
        if (this.hasNextLevel()) {
            this.currentLevelIndex++;
            return true;
        }
        return false;
    }

    hasNextLevel(): boolean {
        return this.currentLevelIndex < this.levels.length - 1;
    }

    setLevel(index: number): boolean {
        if (index >= 0 && index < this.levels.length) {
            this.currentLevelIndex = index;
            return true;
        }
        return false;
    }

    getLevelCount(): number {
        return this.levels.length;
    }
}
