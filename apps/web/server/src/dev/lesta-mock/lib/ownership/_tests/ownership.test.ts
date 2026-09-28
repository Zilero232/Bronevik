import { describe, expect, it } from 'vitest';

import type { MockTankState, MockVehicle } from '../../../lesta-mock.types';

import { MOCK_OWNERSHIP, MOCK_TIME } from '../../../config';
import { emptyTotals } from '../../stats';
import { DAY, fixtureWorld } from '../../world/_tests/fixtures';
import { isInGarage, soldShare } from '../ownership';

const AT = MOCK_TIME.anchor + 100 * DAY;

const tankOf = (vehicle: MockVehicle, lastBattle: number): MockTankState => ({
  vehicle,
  lastBattle,
  random: emptyTotals(),
  other: emptyTotals(),
  moeEma: 0,
  bestMoePercent: 0
});

describe('soldShare', () => {
  it('keeps every recently played tank and never sells more than the cap', () => {
    expect(soldShare(MOCK_OWNERSHIP.keepDays)).toBe(0);
    expect(soldShare(10_000)).toBe(MOCK_OWNERSHIP.soldMax);
  });

  it('sells more of the tanks left idle for longer', () => {
    expect(soldShare(400)).toBeGreaterThan(soldShare(60));
  });
});

describe('isInGarage', () => {
  const regular = fixtureWorld.catalog.vehicles.filter((entry) => !entry.isPremium && !entry.isCollectible);
  const premium = fixtureWorld.catalog.vehicles.find((entry) => entry.isPremium);

  it('keeps a tank played yesterday and a premium tank however old', () => {
    const [vehicle] = regular;

    if (!vehicle || !premium) {
      throw new Error('fixture catalog lacks a regular or premium vehicle');
    }

    expect(isInGarage({ seed: fixtureWorld.seed, accountId: 1, tank: tankOf(vehicle, AT - DAY), at: AT })).toBe(true);
    expect(isInGarage({ seed: fixtureWorld.seed, accountId: 1, tank: tankOf(premium, AT - 900 * DAY), at: AT })).toBe(true);
  });

  it('sells some of the regular tanks idle for years', () => {
    const kept = regular.map((vehicle) => isInGarage({ seed: fixtureWorld.seed, accountId: 7, tank: tankOf(vehicle, AT - 900 * DAY), at: AT }));

    expect(kept.includes(false)).toBe(true);
  });
});
