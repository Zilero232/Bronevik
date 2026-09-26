import { tankLevelOf, xpForLevel } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { levelProgress } from '../level-progress';

describe('levelProgress', () => {
  it('starts an exact level threshold at zero', () => {
    const { levelXp, nextLevelXp } = tankLevelOf(xpForLevel(4));

    expect(levelProgress({ current: xpForLevel(4), start: levelXp, next: nextLevelXp })).toMatchObject({ value: 0, isMax: false });
  });

  it('measures progress inside the current level only', () => {
    const xp = xpForLevel(6) + 10;
    const { levelXp, nextLevelXp } = tankLevelOf(xp);
    const progress = levelProgress({ current: xp, start: levelXp, next: nextLevelXp });

    expect(progress.value).toBe(10);
    expect(progress.max).toBe(xpForLevel(7) - xpForLevel(6));
  });

  it('shows a full bar at the maximum level', () => {
    expect(levelProgress({ current: 10, start: 5, next: null })).toEqual({ value: 1, max: 1, isMax: true });
  });
});
