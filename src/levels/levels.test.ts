import { describe, it, expect } from 'vitest';
import { validateLevel } from './validator';
import { LEVELS } from './index';

describe('Level Validation', () => {
    LEVELS.forEach(level => {
        it(`Level ${level.id} should pass validation`, () => {
            const errors = validateLevel(level);
            if (errors.length > 0) {
                console.error(`Validation Errors for ${level.id}:\n${errors.join('\n')}`);
            }
            expect(errors).toEqual([]);
        });
    });
});
