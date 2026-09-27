import { describe, expect, it } from 'vitest';

import { isLowerBetter, TANK_SPEC_GROUPS, TANK_SPEC_KEYS } from '@/entities/tank/tank';

import { compareRow, specSections } from '../compare-rows';

const HIGHER_KEY = TANK_SPEC_KEYS.find((key) => !isLowerBetter(key)) ?? 'shellDamage';
const LOWER_KEY = TANK_SPEC_KEYS.find((key) => isLowerBetter(key)) ?? 'reloadTime';

describe('compareRow', () => {
  it('marks the largest value as best when higher is better', () => {
    const cells = compareRow({ key: HIGHER_KEY, values: [300, 440, 390] });

    expect(cells.map(({ isBest }) => isBest)).toEqual([false, true, false]);
  });

  it('marks the smallest value as best when lower is better', () => {
    const cells = compareRow({ key: LOWER_KEY, values: [9.2, 7.4, 11] });

    expect(cells.map(({ isBest }) => isBest)).toEqual([false, true, false]);
  });

  it('gives the best value a full bar and the others a shorter one', () => {
    for (const key of [HIGHER_KEY, LOWER_KEY]) {
      const cells = compareRow({ key, values: [10, 20, 15] });
      const best = cells.find(({ isBest }) => isBest);

      expect(best?.ratio).toBe(1);
      expect(cells.filter(({ isBest }) => !isBest).every(({ ratio }) => ratio !== null && ratio < 1)).toBe(true);
    }
  });

  it('marks nobody when every tank has the same value', () => {
    const cells = compareRow({ key: HIGHER_KEY, values: [5, 5] });

    expect(cells.some(({ isBest }) => isBest)).toBe(false);
    expect(cells.every(({ ratio }) => ratio === 1)).toBe(true);
  });

  it('keeps a missing value empty instead of treating it as zero', () => {
    const [missing] = compareRow({ key: HIGHER_KEY, values: [null, 4, 8] });

    expect(missing).toMatchObject({ value: null, ratio: null, isBest: false, isWorst: false, delta: null });
  });

  it('marks the worst value and gives the rest a signed delta to the best', () => {
    const higher = compareRow({ key: HIGHER_KEY, values: [300, 400, 350] });
    const lower = compareRow({ key: LOWER_KEY, values: [10, 8, 12] });

    expect(higher.map(({ isWorst }) => isWorst)).toEqual([true, false, false]);
    expect(higher.map(({ delta }) => delta)).toEqual([-0.25, null, -0.125]);
    expect(lower.map(({ isWorst }) => isWorst)).toEqual([false, false, true]);
    expect(lower[2].delta).toBe(0.5);
  });

  it('draws no bar for negative values', () => {
    const cells = compareRow({ key: 'winRateDiff', values: [-0.02, 0.01] });

    expect(cells[0].ratio).toBeNull();
  });
});

describe('specSections', () => {
  it('keeps the configured group order', () => {
    const sections = specSections({
      specs: [
        { [HIGHER_KEY]: 1, [LOWER_KEY]: 2 },
        { [HIGHER_KEY]: 3, [LOWER_KEY]: 4 }
      ]
    });

    const order = sections.map(({ group }) => TANK_SPEC_GROUPS.indexOf(group));

    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('hides specs no compared tank has', () => {
    const sections = specSections({ specs: [{ [HIGHER_KEY]: 1 }, { [HIGHER_KEY]: 2 }] });

    expect(sections.flatMap(({ rows }) => rows.map(({ key }) => key))).toEqual([HIGHER_KEY]);
  });

  it('produces one cell per tank in every row', () => {
    const specs = [{ [HIGHER_KEY]: 1 }, { [HIGHER_KEY]: null }, { [HIGHER_KEY]: 2 }];

    expect(
      specSections({ specs })
        .flatMap(({ rows }) => rows)
        .every(({ cells }) => cells.length === specs.length)
    ).toBe(true);
  });
});
