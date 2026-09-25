import type { PopularPlayers } from '@bronevik/schemas';

import { sortBy } from 'remeda';

import { seededRandom } from '@/shared/lib';
import { MOCK_PLAYERS } from '@/shared/mocks';

import type { MockPopularInput } from './mock.types';

import { mockRating, round } from './mock.helpers';

export const mockPopularPlayers = ({ days, limit }: MockPopularInput): PopularPlayers => {
  const random = seededRandom(days * 7_919);

  const items = MOCK_PLAYERS.map(({ id, nickname, clanTag, wn8 }) => ({
    accountId: id,
    nickname,
    clanTag,
    views: round(20 + random() * 40 * days),
    wn8: mockRating({ scale: 'wn8', value: wn8 })
  }));

  return { days, items: sortBy(items, [({ views }) => views, 'desc']).slice(0, limit) };
};
