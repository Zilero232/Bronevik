import { describe, expect, it } from 'vitest';

import { weekGroups } from '../week-groups';

const dateOf = (value: string) => new Date(value);

describe('weekGroups', () => {
  it('groups consecutive entries by their ISO week', () => {
    const groups = weekGroups({
      entries: ['2026-09-28T12:00:00Z', '2026-10-01T12:00:00Z', '2026-10-06T12:00:00Z'],
      dateOf
    });

    expect(groups.map((group) => group.entries.length)).toEqual([2, 1]);
    expect(groups[0]?.week).not.toBe(groups[1]?.week);
  });

  it('returns nothing for an empty list', () => {
    expect(weekGroups({ entries: [], dateOf })).toEqual([]);
  });
});
