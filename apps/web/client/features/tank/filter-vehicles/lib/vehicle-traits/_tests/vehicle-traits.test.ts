import type { TankRole } from '@otmetki/schemas';

import { TANK_ROLES } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { filterByTraits, matchesKind, matchesRoles, rolesForTypes } from '../vehicle-traits';

const REGULAR = { isPremium: false, isCollectible: false };
const PREMIUM = { isPremium: true, isCollectible: false };
const COLLECTOR = { isPremium: false, isCollectible: true };

const ROWS = [
  { tankId: 1, ...REGULAR },
  { tankId: 2, ...PREMIUM },
  { tankId: 3, ...COLLECTOR }
];

const ROLES = new Map<number, TankRole | null>([
  [1, 'HT_break'],
  [2, 'MT_sniper'],
  [3, null]
]);

const ids = (rows: readonly { tankId: number }[]) => rows.map(({ tankId }) => tankId);

describe('matchesKind', () => {
  it('lets every vehicle through for all', () => {
    expect([REGULAR, PREMIUM, COLLECTOR].every((vehicle) => matchesKind({ kind: 'all', vehicle }))).toBe(true);
  });

  it('puts each vehicle in exactly one narrower kind', () => {
    for (const vehicle of [REGULAR, PREMIUM, COLLECTOR]) {
      const kinds = (['regular', 'premium', 'collector'] as const).filter((kind) => matchesKind({ kind, vehicle }));

      expect(kinds).toHaveLength(1);
    }
  });

  it('treats a collector vehicle flagged premium as a collector', () => {
    expect(matchesKind({ kind: 'collector', vehicle: { isPremium: true, isCollectible: true } })).toBe(true);
    expect(matchesKind({ kind: 'premium', vehicle: { isPremium: true, isCollectible: true } })).toBe(false);
  });
});

describe('matchesRoles', () => {
  it('matches anything when no role is chosen', () => {
    expect(matchesRoles({ role: null, roles: [] })).toBe(true);
  });

  it('drops a vehicle without a role once a role is chosen', () => {
    expect(matchesRoles({ role: null, roles: ['HT_break'] })).toBe(false);
  });
});

describe('filterByTraits', () => {
  it('filters by kind and role together', () => {
    const rows = filterByTraits({
      rows: ROWS,
      vehicleOf: (row) => row,
      kind: 'regular',
      roles: ['HT_break'],
      roleOf: (tankId) => ROLES.get(tankId) ?? null
    });

    expect(ids(rows)).toEqual([1]);
  });

  it('skips the role check while the roles are unknown', () => {
    expect(ids(filterByTraits({ rows: ROWS, vehicleOf: (row) => row, kind: 'all', roles: ['HT_break'], roleOf: null }))).toEqual([1, 2, 3]);
  });
});

describe('rolesForTypes', () => {
  it('offers every role when no class is chosen', () => {
    expect(rolesForTypes([])).toEqual([...TANK_ROLES]);
  });

  it('keeps self-propelled guns apart from tank destroyers', () => {
    const roles = rolesForTypes(['SPG']);

    expect(roles.length).toBeGreaterThan(0);
    expect(roles.every((role) => role.startsWith('SPG'))).toBe(true);
    expect(rolesForTypes(['AT-SPG']).some((role) => roles.includes(role))).toBe(false);
  });
});
