import type { PlayerMarkRow } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import type { LestaAccount } from '../dashboard-picks.types';

import { closestMarks, primaryAccount } from '../dashboard-picks';

const LINKED_AT = '2026-06-01T00:00:00.000Z';

const account = (accountId: number, isPrimary: boolean): LestaAccount => ({
  accountId,
  nickname: `Tanker_${accountId}`,
  isPrimary,
  linkedAt: LINKED_AT,
  tokenExpiresAt: null
});

const row = (tankId: number, moePercent: number | null, nextMarkPercent: number | null): PlayerMarkRow => ({
  vehicle: {
    tankId,
    name: `Tank ${tankId}`,
    shortName: `T${tankId}`,
    slug: `tank-${tankId}`,
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    isPremium: false,
    isCollectible: false,
    images: { small: null, contour: null, big: null }
  },
  battles: 100,
  marksOnGun: 1,
  markOfMastery: 0,
  moePercent,
  movingDamage: null,
  avgCombinedDamage: null,
  combinedDamageSource: null,
  thresholds: null,
  nextMarkPercent,
  damageToNextMark: null,
  updatedAt: null
});

describe('primaryAccount', () => {
  it('prefers the account flagged as primary over the first one', () => {
    expect(primaryAccount([account(1, false), account(2, true)])?.accountId).toBe(2);
  });

  it('falls back to the first account when none is primary', () => {
    expect(primaryAccount([account(3, false), account(4, false)])?.accountId).toBe(3);
  });

  it('returns null when no Lesta account is linked', () => {
    expect(primaryAccount([])).toBeNull();
  });
});

describe('closestMarks', () => {
  const items = [row(1, 60, 65), row(2, 84, 85), row(3, 91, 95), row(4, null, 65), row(5, 97, null)];

  it('orders tanks by the distance left to the next mark', () => {
    expect(closestMarks({ items, limit: 3 }).map(({ row: { vehicle } }) => vehicle.tankId)).toEqual([2, 3, 1]);
  });

  it('skips tanks without mod data or without a next mark', () => {
    const ids = closestMarks({ items, limit: items.length }).map(({ row: { vehicle } }) => vehicle.tankId);

    expect(ids).not.toContain(4);
    expect(ids).not.toContain(5);
  });

  it('never returns more than the limit', () => {
    expect(closestMarks({ items, limit: 1 })).toHaveLength(1);
  });

  it('reports the gap as the difference between the target and the current percent', () => {
    const [first] = closestMarks({ items, limit: 1 });

    expect(first?.gap).toBe((first?.target ?? 0) - (first?.percent ?? 0));
  });

  it('does not reorder the input list', () => {
    const before = items.map(({ vehicle }) => vehicle.tankId);

    closestMarks({ items, limit: 2 });

    expect(items.map(({ vehicle }) => vehicle.tankId)).toEqual(before);
  });
});
