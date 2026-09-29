import { describe, expect, it } from 'vitest';

import { DAILY_PUZZLE_KEYS } from '../../../config';
import { otherPuzzles } from '../puzzle-catalog';

describe('otherPuzzles', () => {
  it('lists every other puzzle once and never the current one', () => {
    DAILY_PUZZLE_KEYS.forEach((current) => {
      const others = otherPuzzles(current);

      expect(others).not.toContain(current);
      expect(others).toHaveLength(DAILY_PUZZLE_KEYS.length - 1);
    });
  });
});
