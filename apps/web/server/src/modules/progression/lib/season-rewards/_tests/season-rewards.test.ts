import { SEASON_TRACK } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { earnedRewards, seasonRewardViews, trackRewards } from '../season-rewards';

describe('earnedRewards', () => {
  it('earns nothing at level zero and everything at the top', () => {
    expect(earnedRewards({ season: '2026-q3', level: 0 })).toEqual([]);
    expect(earnedRewards({ season: '2026-q3', level: SEASON_TRACK.maxLevel })).toHaveLength(SEASON_TRACK.rewards.length);
  });

  it('includes a reward exactly on its level', () => {
    const [first] = SEASON_TRACK.rewards;

    expect(earnedRewards({ season: '2026-q3', level: first.level })).toHaveLength(1);
    expect(earnedRewards({ season: '2026-q3', level: first.level - 1 })).toHaveLength(0);
  });

  it('makes cosmetic rewards unique per season', () => {
    const codes = (season: string) => trackRewards(season).flatMap((reward) => (reward.kind === 'cosmetic' ? [reward.code] : []));
    const first = new Set(codes('2026-q3'));

    expect(codes('2026-q4').some((code) => first.has(code))).toBe(false);
  });
});

describe('seasonRewardViews', () => {
  it('marks earned rewards as claimed and later ones as open', () => {
    const level = SEASON_TRACK.rewards[1].level;
    const views = seasonRewardViews({ season: '2026-q3', level });

    expect(views.filter((view) => view.isClaimed)).toHaveLength(2);
    expect(views).toHaveLength(SEASON_TRACK.rewards.length);
  });
});
