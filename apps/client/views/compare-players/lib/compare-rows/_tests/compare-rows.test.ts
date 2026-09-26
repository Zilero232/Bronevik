import { describe, expect, it } from 'vitest';

import { COMPARE_METRICS } from '../../../config';
import { compareRows, displayValue } from '../compare-rows';

const sources = [
  { stats: null, marks: { moe3: 3, mastery: 10 } },
  { stats: null, marks: { moe3: 3, mastery: 25 } }
];

const rowOf = (key: string) => compareRows({ sources }).find((row) => row.key === key);

describe('compareRows', () => {
  it('builds one row per metric', () => {
    expect(compareRows({ sources })).toHaveLength(COMPARE_METRICS.length);
  });

  it('marks the player with more mastery badges as best', () => {
    expect(rowOf('mastery')).toMatchObject({ values: [10, 25], best: [1] });
  });

  it('marks every player sharing the best value', () => {
    expect(rowOf('moe3')?.best).toEqual([0, 1]);
  });

  it('leaves values empty when a period has no stats', () => {
    expect(rowOf('battles')).toMatchObject({ values: [null, null], best: [] });
  });
});

describe('displayValue', () => {
  it('turns a percentage into a fraction for the percent format', () => {
    expect(displayValue({ value: 55, format: 'percent' })).toBe(0.55);
  });

  it('keeps other formats as they are', () => {
    expect(displayValue({ value: 1_234, format: 'integer' })).toBe(1_234);
  });
});
