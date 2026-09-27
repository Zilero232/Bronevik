import type { StreamerCard, VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { directoryEntry } from '../directory-entry';

const CARD: StreamerCard = {
  slug: 'nick',
  displayName: 'Nick',
  kind: 'claimed',
  channels: [
    { platform: 'telegram', handle: 'nick', url: 'https://t.me/nick', verified: false },
    { platform: 'twitch', handle: 'nick', url: 'https://twitch.tv/nick', verified: true }
  ],
  live: null,
  stats: { battles: 12_000, winRate: 58.4, wn8: 3100 },
  marks3: 40,
  favouriteTanks: [
    { tankId: 1, name: 'Old name', battles: 300 },
    { tankId: 2, name: null, battles: 200 },
    { tankId: 3, name: 'Third', battles: 100 },
    { tankId: 4, name: 'Fourth', battles: 50 }
  ],
  hasSettings: true
};

const VEHICLE: VehicleSummary = {
  tankId: 1,
  tier: 10,
  isPremium: false,
  name: 'Объект 279 (р)',
  shortName: 'Об. 279 (р)',
  slug: 'object-279-r',
  nation: 'ussr',
  type: 'heavyTank',
  isCollectible: false,
  images: { small: null, contour: null, big: null }
};

describe('directoryEntry', () => {
  it('keeps the top three favourites and prefers catalog names', () => {
    const { favourites } = directoryEntry({ card: CARD, index: { 1: VEHICLE } });

    expect(favourites).toEqual([
      { tankId: 1, name: 'Объект 279 (р)', vehicle: VEHICLE },
      { tankId: 2, name: '#2', vehicle: null },
      { tankId: 3, name: 'Third', vehicle: null }
    ]);
  });

  it('orders channels by platform', () => {
    expect(directoryEntry({ card: CARD, index: {} }).channels.map(({ platform }) => platform)).toEqual(['twitch', 'telegram']);
  });

  it('colours the stats by rating and keeps hidden stats empty', () => {
    const { stats } = directoryEntry({ card: CARD, index: {} });

    expect(stats).toMatchObject({ battles: 12_000, winRate: 58.4, wn8: 3100, wn8Tone: 'unicum' });
    expect(directoryEntry({ card: { ...CARD, stats: null }, index: {} }).stats).toBeNull();
  });
});
