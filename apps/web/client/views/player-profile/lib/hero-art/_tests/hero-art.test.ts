import { describe, expect, it } from 'vitest';

import { heroArt } from '../hero-art';

const CLAN = { clanId: 1, tag: 'TAG', name: 'Clan', color: null, role: 'private', emblem: 'https://example.com/e.png', joinedAt: null };

describe('heroArt', () => {
  it('prefers the clan emblem', () => {
    expect(heroArt({ clan: CLAN, rows: [] })).toEqual({ kind: 'clan', emblem: CLAN.emblem });
  });

  it('shows the most played tanks without a clan emblem', () => {
    const vehicle = {
      tankId: 1,
      name: 'Tank',
      shortName: 'T',
      slug: 'tank',
      nation: 'ussr',
      type: 'heavyTank',
      tier: 10,
      isPremium: false,
      isCollectible: false,
      status: 'researchable',
      images: { small: null, contour: null, big: null }
    } as const;

    const row = {
      vehicle,
      battles: 10,
      winRate: null,
      avgDamage: null,
      avgFrags: null,
      avgXp: null,
      survivalRate: null,
      wn8: { value: null, tier: null },
      markOfMastery: 0,
      marksOnGun: null,
      moePercent: null,
      damagePercentile: null,
      maxFrags: null,
      maxXp: null,
      lastBattleAt: null,
      recent: null
    };

    expect(heroArt({ clan: null, rows: [row] })).toMatchObject({ kind: 'tanks', tanks: [{ nation: 'ussr', tier: 10 }] });
  });

  it('is empty without clan and battles', () => {
    expect(heroArt({ clan: null, rows: [] })).toBeUndefined();
    expect(heroArt({ clan: { ...CLAN, emblem: null }, rows: [] })).toBeUndefined();
  });
});
