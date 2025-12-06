import { describe, expect, it } from 'vitest';
// Create an index file later or just import individually if needed,
// but for now I'll assume I can import them.
// Since I don't have an index of all levels yet, I will import specific ones or all from index if available.
// Let's assume I'll update src/levels/index.ts to export all, and import LEVELS from there.
// For now, I will import the ones I am working on.
import { PLAINS_01 } from './plains/plains-01';
import { PLAINS_02 } from './plains/plains-02';
import { PLAINS_03 } from './plains/plains-03';
import { PLAINS_04 } from './plains/plains-04';
import { PLAINS_05 } from './plains/plains-05';
import { validateLevel } from './validator';

const LEVEL_LIST = [PLAINS_01, PLAINS_02, PLAINS_03, PLAINS_04, PLAINS_05];

describe('Level Validation', () => {
    LEVEL_LIST.forEach((level) => {
        it(`Level ${level.id} should pass validation`, () => {
            const errors = validateLevel(level);
            if (errors.length > 0) {
                console.error(errors.join('\n'));
            }
            expect(errors).toEqual([]);
        });
    });
});
