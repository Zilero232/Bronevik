import type { ClanMember } from '@bronevik/schemas';

import { clanRoleSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { ROLE_GROUP_KEYS, ROLE_GROUPS } from '../../../config';
import { filterRoster, roleGroup, toRosterRows } from '../roster';

const NOW = '2026-09-24T09:00:00+03:00';

const member = (overrides: Partial<ClanMember>): ClanMember => ({
  accountId: 1,
  nickname: 'Tester',
  role: 'private',
  joinedAt: '2026-09-14T09:00:00+03:00',
  lastBattleAt: NOW,
  inactiveDays: 0,
  battles: 1_000,
  winRate: 50,
  wn8: { value: 1_000, tier: null },
  recentWn8: { value: 1_000, tier: null },
  ...overrides
});

const MEMBERS = [
  member({ accountId: 1, role: 'commander', inactiveDays: 0 }),
  member({ accountId: 2, role: 'combat_officer', inactiveDays: 9 }),
  member({ accountId: 3, role: 'private', inactiveDays: 20 }),
  member({ accountId: 4, role: 'reservist', inactiveDays: 40 }),
  member({ accountId: 5, role: 'recruit', inactiveDays: null })
];

const ROWS = toRosterRows({ members: MEMBERS, now: NOW });

const ids = (rows: { accountId: number }[]) => rows.map(({ accountId }) => accountId);

describe('roleGroup', () => {
  it('places every clan role into exactly one group', () => {
    clanRoleSchema.options.forEach((role) => {
      const owners = ROLE_GROUP_KEYS.filter((group) => ROLE_GROUPS[group].includes(role));

      expect(owners).toHaveLength(1);
      expect(roleGroup(role)).toBe(owners[0]);
    });
  });
});

describe('toRosterRows', () => {
  it('counts the days a member has spent in the clan up to the snapshot', () => {
    expect(ROWS[0]?.daysInClan).toBe(10);
  });

  it('leaves the tenure unknown when the join date is missing', () => {
    expect(toRosterRows({ members: [member({ joinedAt: null })], now: NOW })[0]?.daysInClan).toBeNull();
  });
});

describe('filterRoster', () => {
  it('keeps the whole roster when no filter is set', () => {
    expect(filterRoster({ rows: ROWS, role: 'all', inactive: 'all' })).toHaveLength(ROWS.length);
  });

  it('keeps only members of the chosen role group', () => {
    expect(ids(filterRoster({ rows: ROWS, role: 'soldiers', inactive: 'all' }))).toEqual([3, 5]);
  });

  it('shows members who have not played for at least the chosen number of days', () => {
    expect(ids(filterRoster({ rows: ROWS, role: 'all', inactive: '14' }))).toEqual([3, 4, 5]);
  });

  it('never shrinks the idle list when the threshold gets shorter', () => {
    const long = filterRoster({ rows: ROWS, role: 'all', inactive: '30' });
    const short = filterRoster({ rows: ROWS, role: 'all', inactive: '7' });

    expect(short.length).toBeGreaterThanOrEqual(long.length);
  });

  it('combines the role and idle filters', () => {
    expect(ids(filterRoster({ rows: ROWS, role: 'officers', inactive: '7' }))).toEqual([2]);
  });
});
