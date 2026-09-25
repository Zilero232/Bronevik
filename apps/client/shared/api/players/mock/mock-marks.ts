import type { PlayerMarks } from '@bronevik/schemas';

import { MOE, moeDamageForPercent } from '@bronevik/ratings';

import { seededRandom } from '@/shared/lib';
import { MOCK_TANKS } from '@/shared/mocks';

import { mockPlayerById } from './mock-player';
import { mockProfileOf } from './mock-profile';
import { mockTankRows } from './mock-tanks';
import { isoDaysAgo, round } from './mock.helpers';

const MARK_STEPS = [...MOE.markPercents, MOE.maxPercent];

export const mockMarks = (accountId: number): PlayerMarks => {
  const { summary } = mockProfileOf(mockPlayerById(accountId));

  const items = mockTankRows(accountId).map((row) => {
    const random = seededRandom(accountId + row.vehicle.tankId);
    const reference = row.avgDamage ?? MOCK_TANKS.find(({ id }) => id === row.vehicle.tankId)?.moe3 ?? 3_000;
    const p95 = round(reference * (0.82 + random() * 0.36));
    const thresholds = { p65: round(p95 * 0.68), p85: round(p95 * 0.86), p95, p100: round(p95 * 1.2) };
    const { moePercent } = row;
    const movingDamage =
      moePercent === null
        ? null
        : round(moeDamageForPercent({ percent: moePercent, thresholds: { oneMark: thresholds.p65, twoMarks: thresholds.p85, threeMarks: p95 } }));

    const avgCombinedDamage = row.avgDamage === null ? null : round(row.avgDamage * (1.15 + random() * 0.3));
    const nextMarkPercent = moePercent === null ? null : (MARK_STEPS.find((step) => step > moePercent) ?? null);
    const nextThreshold: Record<number, number> = { 65: thresholds.p65, 85: thresholds.p85, 95: thresholds.p95, 100: thresholds.p100 };

    return {
      vehicle: row.vehicle,
      battles: row.battles,
      marksOnGun: row.marksOnGun,
      markOfMastery: row.markOfMastery,
      moePercent,
      movingDamage,
      avgCombinedDamage,
      combinedDamageSource: avgCombinedDamage === null ? null : moePercent === null ? ('damage' as const) : ('battles' as const),
      thresholds: moePercent === null ? null : thresholds,
      nextMarkPercent,
      damageToNextMark: nextMarkPercent === null || movingDamage === null ? null : Math.max(0, round(nextThreshold[nextMarkPercent] - movingDamage)),
      updatedAt: isoDaysAgo(1)
    };
  });

  return {
    summary: { ...summary.marks, eligible: summary.marks.tanksOwned },
    items
  };
};
