import type { LevelConfig } from './level';

export class LevelManager {
    private levels: LevelConfig[];
    private currentLevelIndex: number;
    private unlockedLevels: Set<number>;
    private readonly STORAGE_KEY = 'btz_progress';

    constructor(levels: LevelConfig[]) {
        this.levels = levels;
        this.currentLevelIndex = 0;
        this.unlockedLevels = new Set([0]); // Always unlock level 0
        this.loadProgress();
    }

    getCurrentLevel(): LevelConfig {
        return this.levels[this.currentLevelIndex];
    }

    getCurrentLevelIndex(): number {
        return this.currentLevelIndex;
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
        if (index >= 0 && index < this.levels.length && this.isLevelUnlocked(index)) {
            this.currentLevelIndex = index;
            return true;
        }
        return false;
    }

    getLevelCount(): number {
        return this.levels.length;
    }

    unlockLevel(index: number) {
        if (index >= 0 && index < this.levels.length) {
            this.unlockedLevels.add(index);
            this.saveProgress();
        }
    }

    isLevelUnlocked(index: number): boolean {
        return this.unlockedLevels.has(index);
    }

    private saveProgress() {
        try {
            const data = JSON.stringify(Array.from(this.unlockedLevels));
            localStorage.setItem(this.STORAGE_KEY, data);
        } catch (e) {
            console.warn('Failed to save progress', e);
        }
    }

    private loadProgress() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                const arr = JSON.parse(data);
                if (Array.isArray(arr)) {
                    for (const idx of arr) {
                        this.unlockedLevels.add(Number(idx));
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to load progress', e);
        }
    }
}
