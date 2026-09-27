import { describe, expect, it } from 'vitest';

import { clanOgCard, tankOgCard } from '../entity-og-card';

const vehicle = {
  tankId: 1,
  name: 'Объект 140',
  shortName: 'Об. 140',
  slug: 'object-140',
  nation: 'ussr',
  type: 'mediumTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  images: { small: null, contour: null, big: null }
} as const;

describe('tankOgCard', () => {
  it('describes a tank with dashes for missing stats', () => {
    const card = tankOgCard({ tank: { vehicle, serverStats: [] }, kind: 'build', locale: 'ru', host: 'example.ru' });

    expect(card.title).toBe('Объект 140');
    expect(card.url).toBe('example.ru/builds/object-140');
    expect(card.subtitle).toContain('X');
    expect(card.metrics.map(({ value }) => value)).toEqual(['—', '—', '—']);
  });
});

describe('clanOgCard', () => {
  it('shows the tag, name and member count', () => {
    const page = {
      clan: {
        clanId: 1,
        tag: 'KOPTE',
        name: 'Кортеж',
        color: null,
        motto: null,
        emblem: null,
        membersCount: 100,
        createdAt: null,
        isDisbanded: false
      },
      stats: {
        avgWinRate: null,
        avgWn8: { value: null, tier: null },
        avgBattlesPerDay: null,
        activeMembers7d: null,
        eloRating10: null,
        strongholdLevel: null,
        provincesCount: 0
      }
    };

    const card = clanOgCard({ page, locale: 'en', host: 'example.ru' });

    expect(card.title).toBe('[KOPTE]');
    expect(card.subtitle).toBe('Кортеж');
    expect(card.url).toBe('example.ru/c/KOPTE');
    expect(card.metrics.at(-1)?.value).toBe('100');
  });
});
