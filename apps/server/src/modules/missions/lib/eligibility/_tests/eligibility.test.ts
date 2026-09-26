import { describe, expect, it } from 'vitest';

import { missionFilter } from '../eligibility';

describe('missionFilter', () => {
  it('limits a class branch to its class and tier range', () => {
    expect(
      missionFilter({ mission: { minTier: 4, maxTier: 10, vehicleClasses: [] }, branch: { kind: 'vehicleClass', key: 'AT-SPG', nations: [] } })
    ).toEqual({ tiers: [4, 5, 6, 7, 8, 9, 10], types: ['AT-SPG'] });
  });

  it('limits an alliance branch to its nations and honours a class tag on the mission', () => {
    expect(
      missionFilter({
        mission: { minTier: 6, maxTier: 10, vehicleClasses: ['SPG'] },
        branch: { kind: 'alliance', key: 'Alliance-USA', nations: ['usa', 'uk'] }
      })
    ).toEqual({ tiers: [6, 7, 8, 9, 10], types: ['SPG'], nations: ['usa', 'uk'] });
  });

  it('leaves a level-group branch open to every class and nation', () => {
    expect(
      missionFilter({ mission: { minTier: 10, maxTier: 11, vehicleClasses: [] }, branch: { kind: 'levelGroup', key: 'LevelGroup3', nations: [] } })
    ).toEqual({
      tiers: [10, 11]
    });
  });
});
