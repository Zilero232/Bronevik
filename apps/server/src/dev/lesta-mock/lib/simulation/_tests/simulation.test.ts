import { accountWn8 } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import type { MockPlayerState } from '../../../lesta-mock.types';

import { battlesBetween, playerStateAt } from '..';
import { MOCK_TIME } from '../../../config';
import { sumTotals } from '../../stats';
import { DAY, fixtureCatalog, fixtureWorld } from '../../world/_tests/fixtures';

const AT = MOCK_TIME.anchor + 200 * DAY + 20 * 3600;
const SAMPLE = fixtureWorld.players.filter((_, index) => index % 5 === 0);

const quantile = (values: readonly number[], probability: number): number => {
  const sorted = [...values].sort((left, right) => left - right);

  return sorted[Math.floor(probability * (sorted.length - 1))] ?? 0;
};

const expected = new Map(
  fixtureCatalog.vehicles.map((vehicle) => [
    vehicle.tankId,
    {
      tankId: vehicle.tankId,
      expDamage: vehicle.expected.damage,
      expFrag: vehicle.expected.frags,
      expSpot: vehicle.expected.spot,
      expDef: vehicle.expected.def,
      expWinRate: vehicle.expected.winRate
    }
  ])
);

const summary = (state: MockPlayerState) => {
  const tanks = [...state.tanks.values()];
  const totals = sumTotals(tanks.map((tank) => tank.random));

  return {
    totals,
    wn8: accountWn8({ tanks: tanks.map((tank) => ({ tankId: tank.vehicle.tankId, ...tank.random })), expected }).wn8 ?? 0
  };
};

const states = SAMPLE.map((player) => ({ player, state: playerStateAt({ world: fixtureWorld, player, at: AT }) }));
const summaries = states.map(({ state }) => summary(state));

describe('skill distribution', () => {
  it('centres win rates near 49% with a unicum tail', () => {
    const rates = summaries.filter(({ totals }) => totals.battles >= 1000).map(({ totals }) => (totals.wins / totals.battles) * 100);

    expect(quantile(rates, 0.5)).toBeGreaterThan(47.5);
    expect(quantile(rates, 0.5)).toBeLessThan(51);
    expect(quantile(rates, 0.95) - quantile(rates, 0.05)).toBeGreaterThan(6);
    expect(quantile(rates, 0.95) - quantile(rates, 0.05)).toBeLessThan(14);
    expect(Math.max(...rates)).toBeLessThan(75);
  });

  it('matches the XVM WN8 shape', () => {
    const values = summaries.filter(({ totals }) => totals.battles >= 500).map(({ wn8 }) => wn8);

    expect(quantile(values, 0.5)).toBeGreaterThan(850);
    expect(quantile(values, 0.5)).toBeLessThan(1450);
    expect(quantile(values, 0.99)).toBeGreaterThan(2300);
    expect(quantile(values, 0.02)).toBeLessThan(600);
  });

  it('spreads career battles from hundreds to tens of thousands', () => {
    const battles = summaries.map(({ totals }) => totals.battles);

    expect(quantile(battles, 0.1)).toBeLessThan(3000);
    expect(quantile(battles, 0.5)).toBeGreaterThan(3000);
    expect(quantile(battles, 0.5)).toBeLessThan(25_000);
    expect(quantile(battles, 0.99)).toBeGreaterThan(40_000);
  });

  it('gives strong players tier X heavy damage in the 2500+ range', () => {
    const strong = states
      .filter((_, index) => (summaries[index]?.wn8 ?? 0) > 2300)
      .flatMap(({ state }) => [...state.tanks.values()])
      .filter((tank) => tank.vehicle.tier === 10 && tank.vehicle.type === 'heavyTank' && tank.random.battles >= 100)
      .map((tank) => tank.random.damageDealt / tank.random.battles);

    expect(strong.length).toBeGreaterThan(0);
    expect(quantile(strong, 0.5)).toBeGreaterThan(2500);
    expect(quantile(strong, 0.5)).toBeLessThan(4500);
  });
});

describe('per-tank consistency', () => {
  it('keeps every counter within its bounds', () => {
    for (const { state } of states) {
      for (const tank of state.tanks.values()) {
        const totals = tank.random;

        expect(totals.wins + totals.losses + totals.draws).toBe(totals.battles);
        expect(totals.survived).toBeLessThanOrEqual(totals.battles);
        expect(totals.survivedWins).toBeLessThanOrEqual(Math.min(totals.wins, totals.survived));
        expect(totals.hits).toBeLessThanOrEqual(totals.shots);
        expect(totals.piercings).toBeLessThanOrEqual(totals.hits);
        expect(totals.maxDamage).toBeLessThanOrEqual(Math.max(totals.damageDealt, 0) || Infinity);
        expect(totals.maxFrags).toBeLessThanOrEqual(15);
      }
    }
  });
});

describe('time evolution', () => {
  it('only ever grows the counters and moves the last battle forward', () => {
    for (const player of SAMPLE.slice(0, 120)) {
      const before = playerStateAt({ world: fixtureWorld, player, at: AT - 7 * DAY });
      const after = playerStateAt({ world: fixtureWorld, player, at: AT });

      expect(after.lastBattle).toBeGreaterThanOrEqual(before.lastBattle);

      for (const [tankId, tank] of before.tanks) {
        expect(after.tanks.get(tankId)?.random.battles ?? 0).toBeGreaterThanOrEqual(tank.random.battles);
      }
    }
  });

  it('plays evening sessions that match the snapshot delta', () => {
    const player = SAMPLE.find((candidate) => candidate.activity === 'regular' && candidate.dayChance > 0.5);

    if (!player) {
      throw new Error('no regular player in the sample');
    }

    const from = AT - 7 * DAY;
    const battles = battlesBetween({ world: fixtureWorld, player, from, to: AT }).filter((battle) => battle.mode === 'random');
    const before = sumTotals([...playerStateAt({ world: fixtureWorld, player, at: from }).tanks.values()].map((tank) => tank.random));
    const after = sumTotals([...playerStateAt({ world: fixtureWorld, player, at: AT }).tanks.values()].map((tank) => tank.random));
    const hours = battles.map((battle) => ((battle.endedAt + MOCK_TIME.zoneOffsetSec) % DAY) / 3600);

    expect(battles.length).toBe(after.battles - before.battles);
    expect(battles.reduce((sum, battle) => sum + battle.damageDealt, 0)).toBe(after.damageDealt - before.damageDealt);
    expect(hours.filter((hour) => hour >= 12 || hour < 3).length / Math.max(1, hours.length)).toBeGreaterThan(0.7);
  });

  it('reproduces the same state from a cold cache', () => {
    const player = SAMPLE[3];

    if (!player) {
      throw new Error('empty sample');
    }

    const first = playerStateAt({ world: fixtureWorld, player, at: AT });
    const earlier = playerStateAt({ world: fixtureWorld, player, at: AT - 30 * DAY });
    const again = playerStateAt({ world: fixtureWorld, player, at: AT });

    expect(earlier.lastBattle).toBeLessThanOrEqual(first.lastBattle);
    expect(summary(again).totals).toEqual(summary(first).totals);
  });
});
