import { describe, expect, it } from 'vitest';

import { requirementEntries, requirementsFormSchema, toStatRequirements } from '..';

const EMPTY = { minBattles: '', minWn8: '', maxWn8: '', minWinRate: '' };

describe('requirementEntries', () => {
  it('lists only the set requirements in a stable order', () => {
    expect(requirementEntries({ maxWn8: 2000, minBattles: 5000 }).map(({ key }) => key)).toEqual(['minBattles', 'maxWn8']);
  });

  it('shows the win rate as a percent', () => {
    expect(requirementEntries({ minWinRate: 0.52 })[0]?.value).toBeCloseTo(52);
  });

  it('keeps a zero requirement', () => {
    expect(requirementEntries({ minBattles: 0 })).toEqual([{ key: 'minBattles', value: 0 }]);
  });

  it('is empty without requirements', () => {
    expect(requirementEntries({})).toEqual([]);
  });
});

describe('toStatRequirements', () => {
  it('drops empty fields instead of sending zeros', () => {
    expect(toStatRequirements(EMPTY)).toEqual({});
  });

  it('turns the win rate percent back into the server fraction', () => {
    expect(toStatRequirements({ ...EMPTY, minWinRate: '55' }).minWinRate).toBeCloseTo(0.55);
  });

  it('round-trips through requirementEntries', () => {
    const requirements = toStatRequirements({ minBattles: '3000', minWn8: '1500', maxWn8: '2500', minWinRate: '50' });

    expect(requirementEntries(requirements).map(({ value }) => Math.round(value))).toEqual([3000, 1500, 2500, 50]);
  });
});

describe('requirementsFormSchema', () => {
  it('accepts an all-empty form', () => {
    expect(requirementsFormSchema.safeParse(EMPTY).success).toBe(true);
  });

  it('rejects a win rate above one hundred percent', () => {
    expect(requirementsFormSchema.safeParse({ ...EMPTY, minWinRate: '101' }).success).toBe(false);
  });

  it('rejects a fractional battle count', () => {
    expect(requirementsFormSchema.safeParse({ ...EMPTY, minBattles: '10.5' }).success).toBe(false);
  });

  it('rejects negative values', () => {
    expect(requirementsFormSchema.safeParse({ ...EMPTY, minWn8: '-1' }).success).toBe(false);
  });
});
