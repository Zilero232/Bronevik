import { describe, expect, it } from 'vitest';

import type { MockBattle } from '../../../lesta-mock.types';

import { DAY, fixtureWorld } from '../../../_tests/fixtures';
import { MOCK_SALT, MOCK_TIME } from '../../../config';
import { createRng } from '../../random';
import { battlesBetween } from '../../simulation';
import { mockArenaWeight, mockMedals, mockQueueSec, mockShots } from '../battle-extras';
import { MOCK_ARENA_WEIGHT, MOCK_MEDALS, MOCK_QUEUE, MOCK_SHOTS } from '../battle-extras.constants';

const FROM = MOCK_TIME.anchor + 100 * DAY;
const BATTLES = fixtureWorld.players
  .filter((_, index) => index % 40 === 0)
  .flatMap((player) => battlesBetween({ world: fixtureWorld, player, from: FROM, to: FROM + 5 * DAY }));

const inputOf = (battle: MockBattle, salt = 0) => {
  const vehicle = fixtureWorld.catalog.vehicleById.get(battle.tankId);

  if (!vehicle) {
    throw new Error(`fixture has no vehicle ${battle.tankId}`);
  }

  return { battle, vehicle, rng: createRng(fixtureWorld.seed, MOCK_SALT.extras, battle.endedAt, salt) };
};

describe('mockShots', () => {
  it('matches the battle totals of shots, hits and piercings', () => {
    for (const battle of BATTLES.slice(0, 200)) {
      const shots = mockShots(inputOf(battle)) ?? [];
      const total = Math.min(battle.shots, MOCK_SHOTS.maxShots);

      expect(shots).toHaveLength(total);
      expect(shots.filter((shot) => shot.outcome !== 'miss')).toHaveLength(Math.min(battle.hits, total));
      expect(shots.filter((shot) => shot.outcome === 'damage')).toHaveLength(Math.min(battle.piercings, battle.hits, total));
    }
  });

  it('keeps every non-fatal roll inside the spread around the nominal damage', () => {
    const rolls = BATTLES.flatMap((battle) => mockShots(inputOf(battle)) ?? []).filter((shot) => shot.outcome === 'damage' && !shot.fatal);

    expect(rolls.length).toBeGreaterThan(0);

    for (const shot of rolls) {
      expect(Math.abs(shot.damage / (shot.nominal ?? 1) - 1)).toBeLessThanOrEqual(MOCK_SHOTS.spread + 0.01);
    }
  });
});

describe('mockQueueSec', () => {
  it('stays inside the configured bounds', () => {
    for (const battle of BATTLES) {
      const seconds = mockQueueSec(inputOf(battle));

      expect(seconds).toBeGreaterThanOrEqual(MOCK_QUEUE.minSec);
      expect(seconds).toBeLessThanOrEqual(MOCK_QUEUE.maxSec);
    }
  });

  it('waits longer at the quietest hour than at the busiest one', () => {
    const [battle] = BATTLES;

    if (!battle) {
      throw new Error('fixture produced no battles');
    }

    const factors: readonly number[] = MOCK_QUEUE.hourFactor;
    const quietest = factors.indexOf(Math.max(...factors));
    const busiest = factors.indexOf(Math.min(...factors));
    const at = (hour: number) => MOCK_TIME.anchor + hour * 3600 + battle.durationSec + 60;
    const median = (hour: number) => {
      const samples = Array.from({ length: 101 }, (_, salt) => mockQueueSec(inputOf({ ...battle, endedAt: at(hour), mode: 'random' }, salt)));

      return samples.toSorted((left, right) => left - right)[50] ?? 0;
    };

    expect(median(quietest)).toBeGreaterThan(median(busiest));
  });
});

describe('mockMedals', () => {
  it('awards the warrior medal exactly when the battle reaches its frag count', () => {
    for (const battle of BATTLES) {
      expect(mockMedals(inputOf(battle)).includes('warrior')).toBe(battle.frags >= MOCK_MEDALS.warrior.frags);
    }
  });
});

describe('mockArenaWeight', () => {
  it('never drops an arena below the floor weight', () => {
    for (const tier of [1, 5, 10]) {
      expect(mockArenaWeight({ seed: fixtureWorld.seed, index: 3, tier })).toBeGreaterThanOrEqual(MOCK_ARENA_WEIGHT.floor);
    }
  });
});
