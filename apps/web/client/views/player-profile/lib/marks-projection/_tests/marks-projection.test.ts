import { moeDamageForPercent } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import type { PlayerMarkRow } from '@/entities/player/profile';

import { projectMarks } from '../marks-projection';

const THRESHOLDS = { p65: 2_000, p85: 2_600, p95: 3_000, p100: 3_600 };

const ROW: PlayerMarkRow = {
  vehicle: {
    tankId: 1,
    name: 'ИС-7',
    shortName: 'ИС-7',
    slug: 'is-7',
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    isPremium: false,
    isCollectible: false,
    status: 'researchable',
    images: { small: null, contour: null, big: null }
  },
  battles: 400,
  marksOnGun: 2,
  markOfMastery: 3,
  moePercent: 88,
  movingDamage: 2_700,
  avgCombinedDamage: null,
  combinedDamageSource: null,
  thresholds: THRESHOLDS,
  nextMarkPercent: 95,
  damageToNextMark: 300,
  updatedAt: null
};

const TARGET = 95;

const targetDamage = moeDamageForPercent({
  percent: TARGET,
  thresholds: { oneMark: THRESHOLDS.p65, twoMarks: THRESHOLDS.p85, threeMarks: THRESHOLDS.p95 }
});

describe('projectMarks', () => {
  it('reports a finished mark once the percent is at the target', () => {
    expect(projectMarks({ row: { ...ROW, moePercent: TARGET }, averageDamage: 1_000, targetPercent: TARGET })).toEqual({ kind: 'done' });
  });

  it('cannot project a tank without a known percent', () => {
    expect(projectMarks({ row: { ...ROW, moePercent: null }, averageDamage: 3_500, targetPercent: TARGET })).toEqual({ kind: 'unknown' });
  });

  it('cannot project without the player average', () => {
    expect(projectMarks({ row: ROW, averageDamage: null, targetPercent: TARGET })).toEqual({ kind: 'unknown' });
  });

  it('projects from the combined damage of the row before the fallback average', () => {
    const row = { ...ROW, avgCombinedDamage: targetDamage * 1.4, combinedDamageSource: 'battles' as const };

    expect(projectMarks({ row, averageDamage: null, targetPercent: TARGET })).toEqual(
      projectMarks({ row: ROW, averageDamage: targetDamage * 1.4, targetPercent: TARGET })
    );

    expect(projectMarks({ row, averageDamage: targetDamage, targetPercent: TARGET }).kind).toBe('projected');
  });

  it('calls a target unreachable when the average never beats the threshold', () => {
    expect(projectMarks({ row: ROW, averageDamage: targetDamage, targetPercent: TARGET })).toEqual({ kind: 'unreachable' });
  });

  it('needs fewer battles the harder the player hits', () => {
    const slow = projectMarks({ row: ROW, averageDamage: targetDamage * 1.05, targetPercent: TARGET });
    const fast = projectMarks({ row: ROW, averageDamage: targetDamage * 1.4, targetPercent: TARGET });

    expect(slow.kind).toBe('projected');
    expect(fast.kind).toBe('projected');

    if (slow.kind === 'projected' && fast.kind === 'projected') {
      expect(fast.battles).toBeLessThan(slow.battles);
    }
  });
});
