import { describe, expect, it } from 'vitest';

import { GUESS_CLUES, GUESS_VIEW } from '../../../config';
import { silhouetteBlur } from '../silhouette-blur';

describe('silhouetteBlur', () => {
  it('starts at the strongest blur', () => {
    expect(silhouetteBlur({ clueCount: 0, isOver: false })).toBe(GUESS_VIEW.maxBlur);
  });

  it('sharpens with every clue', () => {
    expect(silhouetteBlur({ clueCount: GUESS_CLUES.length, isOver: false })).toBeLessThan(silhouetteBlur({ clueCount: 1, isOver: false }));
  });

  it('is sharp once the game is over', () => {
    expect(silhouetteBlur({ clueCount: 0, isOver: true })).toBe(0);
  });
});
