import { describe, expect, it } from 'vitest';

import { latestWrappedYear, WRAPPED_YEAR } from '@/shared/lib';

const at = ({ year, month, day }: { year: number; month: number; day: number }) => new Date(Date.UTC(year, month, day, 12));

describe('latestWrappedYear', () => {
  it('points at the previous year while the current one is still running', () => {
    expect(latestWrappedYear(at({ year: 2026, month: 8, day: 28 }))).toBe(2025);
  });

  it('points at the previous year in January, never at an empty year', () => {
    expect(latestWrappedYear(at({ year: 2027, month: 0, day: 2 }))).toBe(2026);
  });

  it('opens the current year on the configured December day', () => {
    expect(latestWrappedYear(at({ year: 2026, month: WRAPPED_YEAR.opensMonth, day: WRAPPED_YEAR.opensDay - 1 }))).toBe(2025);
    expect(latestWrappedYear(at({ year: 2026, month: WRAPPED_YEAR.opensMonth, day: WRAPPED_YEAR.opensDay }))).toBe(2026);
  });
});
