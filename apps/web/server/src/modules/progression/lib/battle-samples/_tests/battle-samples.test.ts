import { describe, expect, it } from 'vitest';

import type { BattleSample } from '../battle-samples.types';

import { battlesOf, pickSamplesByTank, sampleFromBattle, sampleFromDelta } from '../battle-samples';

const sample = (tankId: number, battles: number): BattleSample => ({
  tankId,
  battles,
  wins: 0,
  damage: 0,
  spotted: 0,
  frags: 0,
  blocked: 0,
  survived: 0,
  isSingle: battles === 1,
  moeRaised: null
});

describe('sampleFromDelta', () => {
  it('marks only a one-battle delta as a single battle and knows nothing about marks', () => {
    const base = { tankId: 1, wins: 1, damageDealt: 3000, spotted: 1, frags: 1, damageBlocked: 0, survived: 1 };

    expect(sampleFromDelta({ ...base, battles: 1 }).isSingle).toBe(true);
    expect(sampleFromDelta({ ...base, battles: 3 }).isSingle).toBe(false);
    expect(sampleFromDelta({ ...base, battles: 1 }).moeRaised).toBeNull();
  });
});

describe('sampleFromBattle', () => {
  const base = { tankId: 1, damageDealt: 1000, spotted: 0, frags: 0, damageBlocked: 0, survived: false };

  it('counts a win and a survival from the battle result', () => {
    const won = sampleFromBattle({ ...base, result: 'win', survived: true, moePercentDelta: null });

    expect(won).toMatchObject({ battles: 1, wins: 1, survived: 1 });
    expect(sampleFromBattle({ ...base, result: 'loss', moePercentDelta: null }).wins).toBe(0);
  });

  it('raises the mark only on a positive percent change and stays unknown without one', () => {
    expect(sampleFromBattle({ ...base, result: 'win', moePercentDelta: 0.4 }).moeRaised).toBe(true);
    expect(sampleFromBattle({ ...base, result: 'win', moePercentDelta: 0 }).moeRaised).toBe(false);
    expect(sampleFromBattle({ ...base, result: 'win', moePercentDelta: null }).moeRaised).toBeNull();
  });
});

describe('pickSamplesByTank', () => {
  it('takes one source per tank so a battle is never counted twice', () => {
    const picked = pickSamplesByTank({ api: [sample(1, 3), sample(2, 1)], mod: [sample(1, 1), sample(1, 1)] });

    expect(battlesOf(picked.get(1) ?? [])).toBe(3);
    expect(battlesOf(picked.get(2) ?? [])).toBe(1);
  });

  it('prefers the mod on a tie because it carries per-battle detail', () => {
    const mod = [sample(1, 1)];
    const picked = pickSamplesByTank({ api: [sample(1, 1)], mod });

    expect(picked.get(1)).toEqual(mod);
  });

  it('returns nothing for no samples', () => {
    expect(pickSamplesByTank({ api: [], mod: [] }).size).toBe(0);
  });
});
