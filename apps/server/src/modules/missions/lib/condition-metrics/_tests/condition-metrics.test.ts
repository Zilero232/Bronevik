import { describe, expect, it } from 'vitest';

import { conditionMetric, missionMetric } from '../condition-metrics';

describe('conditionMetric', () => {
  it.each([
    ['damage', 'damage'],
    ['damageInBattleSeries', 'damage'],
    ['topByDamageAdv', 'damage'],
    ['piercings', 'damage'],
    ['blockedDamage', 'blocked'],
    ['damageDealtReceivedAndBlocked', 'blocked'],
    ['hitsReceived', 'blocked'],
    ['assistedHits', 'spotting'],
    ['spotNumber', 'spotting'],
    ['stunTimeSeries', 'spotting'],
    ['killsDiversity', 'frags'],
    ['topByKillsAdv', 'frags'],
    ['topByExp', 'xp'],
    ['alive', 'survival']
  ])('maps %s to %s', (progressId, metric) => {
    expect(conditionMetric(progressId)).toBe(metric);
  });

  it('leaves conditions without a matching stat unmapped', () => {
    expect(conditionMetric('win')).toBeNull();
    expect(conditionMetric('baseCapture')).toBeNull();
    expect(conditionMetric('installedModules')).toBeNull();
  });
});

describe('missionMetric', () => {
  it('ranks by the first mapped main condition, skipping headers and honors', () => {
    expect(
      missionMetric([
        { progressId: 'alive', isMain: false, isHeader: false },
        { progressId: 'battlesSeries', isMain: true, isHeader: true },
        { progressId: 'win', isMain: true, isHeader: false },
        { progressId: 'kills', isMain: true, isHeader: false }
      ])
    ).toEqual({ metric: 'frags', progressId: 'kills' });
  });

  it('falls back to win rate when no main condition maps to a stat', () => {
    expect(missionMetric([{ progressId: 'win', isMain: true, isHeader: false }])).toEqual({ metric: 'winRate', progressId: null });
  });
});
