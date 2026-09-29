import type { TankDetail } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { isSameTank } from '../tank-match';

const DETAIL = {
  vehicle: {
    tankId: 7169,
    name: 'IS-7',
    shortName: 'IS-7',
    slug: 'is-7',
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    isPremium: false,
    isCollectible: false,
    status: 'researchable',
    images: { small: null, contour: null, big: null }
  },
  description: null,
  specs: null,
  stats: { stock: null, top: null },
  serverStats: [],
  moe: null,
  mastery: null,
  topPlayers: [],
  obtain: {
    status: 'researchable',
    role: null,
    sources: ['techTree'],
    priceCredits: null,
    priceGold: null,
    researchFrom: [],
    offers: { total: 0, items: [] },
    news: [],
    missions: [],
    editorial: []
  },
  economy: { tankId: 7169, windowDays: 30, all: null, premium: null, standard: null, computedAt: null },
  learning: { tankId: 7169, windowDays: 90, buckets: [], gain: null, difficulty: null, computedAt: null },
  sweat: { moe: null, moeLevel: null, mastery: null, masteryLevel: null }
} satisfies TankDetail;

describe('isSameTank', () => {
  it('matches the detail by its slug', () => {
    expect(isSameTank({ detail: DETAIL, idOrSlug: DETAIL.vehicle.slug })).toBe(true);
  });

  it('matches the detail by its numeric id written as a string', () => {
    expect(isSameTank({ detail: DETAIL, idOrSlug: String(DETAIL.vehicle.tankId) })).toBe(true);
  });

  it('rejects another tank', () => {
    expect(isSameTank({ detail: DETAIL, idOrSlug: `${DETAIL.vehicle.slug}-x` })).toBe(false);
  });
});
