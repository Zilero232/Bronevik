import { describe, expect, it } from 'vitest';

import { TANK_SPEC_GROUPS } from '@/entities/tank/tank';

import { barFill, buildStatGroups, STAT_BAR } from '..';

const BASE = { reloadTime: 10, shellDamage: 400, viewRange: 400, maxHealth: null };

const rowOf = (groups: ReturnType<typeof buildStatGroups>, key: string) => groups.flatMap(({ rows }) => rows).find((row) => row.key === key);

describe('barFill', () => {
  it('places the base value on the base mark', () => {
    expect(barFill({ key: 'shellDamage', value: 400, base: 400 })).toBeCloseTo(STAT_BAR.baseMark);
  });

  it('grows the bar when a lower-is-better stat drops', () => {
    expect(barFill({ key: 'reloadTime', value: 9, base: 10 })).toBeGreaterThan(STAT_BAR.baseMark);
  });

  it('never exceeds a full bar', () => {
    expect(barFill({ key: 'shellDamage', value: 4000, base: 400 })).toBe(1);
  });

  it('is empty when the value is unknown', () => {
    expect(barFill({ key: 'shellDamage', value: null, base: 400 })).toBe(0);
  });
});

describe('buildStatGroups', () => {
  it('orders groups the way the spec sheet does', () => {
    const order = buildStatGroups({ base: BASE, a: BASE }).map(({ group }) => TANK_SPEC_GROUPS.indexOf(group));

    expect(order).toEqual([...order].sort((left, right) => left - right));
  });

  it('skips stats the tank does not have', () => {
    expect(rowOf(buildStatGroups({ base: BASE, a: BASE }), 'maxHealth')).toBeUndefined();
  });

  it('marks a faster reload as better than the base', () => {
    const row = rowOf(buildStatGroups({ base: BASE, a: { ...BASE, reloadTime: 9 } }), 'reloadTime');

    expect(row?.verdict).toBe('better');
  });

  it('reports the delta against the base', () => {
    const row = rowOf(buildStatGroups({ base: BASE, a: { ...BASE, viewRange: 440 } }), 'viewRange');

    expect(row?.delta).toBe(440 - BASE.viewRange);
  });

  it('leaves the comparison empty without a second build', () => {
    const row = rowOf(buildStatGroups({ base: BASE, a: BASE }), 'reloadTime');

    expect([row?.b, row?.diff, row?.winner]).toEqual([null, null, null]);
  });

  it('computes B minus A and crowns the better build', () => {
    const row = rowOf(buildStatGroups({ base: BASE, a: { ...BASE, reloadTime: 9 }, b: { ...BASE, reloadTime: 8.5 } }), 'reloadTime');

    expect([row?.diff, row?.diffVerdict, row?.winner]).toEqual([8.5 - 9, 'better', 'b']);
  });

  it('colours each side against the other build, respecting lower-is-better stats', () => {
    const row = rowOf(buildStatGroups({ base: BASE, a: { ...BASE, reloadTime: 9 }, b: { ...BASE, reloadTime: 8.5 } }), 'reloadTime');

    expect([row?.sideVerdictA, row?.sideVerdictB]).toEqual(['worse', 'better']);
  });

  it('marks both sides the same when the builds are equal', () => {
    const row = rowOf(buildStatGroups({ base: BASE, a: BASE, b: BASE }), 'reloadTime');

    expect([row?.diff, row?.sideVerdictA, row?.sideVerdictB]).toEqual([0, 'same', 'same']);
  });

  it('crowns no one when both builds are equal', () => {
    const row = rowOf(buildStatGroups({ base: BASE, a: BASE, b: BASE }), 'shellDamage');

    expect(row?.winner).toBeNull();
  });
});
