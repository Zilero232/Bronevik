import type { ClanSearchResult, PlayerSearchResult, SearchResponse, TankSearchResult } from '@bronevik/schemas';

import { ratingTier } from '@bronevik/ratings';

import { MOCK_CLANS, MOCK_PLAYERS, MOCK_TANKS, mockVehicleImages } from '@/shared/mocks';

import type { MatchesInput } from './search.types';

import { SEARCH_REQUEST } from './search.constants';

const matches = ({ value, query }: MatchesInput) => value.toLocaleLowerCase('ru').includes(query.toLocaleLowerCase('ru'));

const playerResults = (query: string): PlayerSearchResult[] =>
  MOCK_PLAYERS.filter(({ nickname }) => matches({ value: nickname, query }))
    .slice(0, SEARCH_REQUEST.perKind)
    .map(({ id, nickname, clanTag, wn8, battles }) => ({
      kind: 'player',
      accountId: id,
      nickname,
      clanTag,
      matchedNickname: null,
      wn8: { value: wn8, tier: ratingTier({ scale: 'wn8', value: wn8 }) },
      battles
    }));

const tankResults = (query: string): TankSearchResult[] =>
  MOCK_TANKS.filter(({ name, slug }) => matches({ value: name, query }) || matches({ value: slug, query }))
    .slice(0, SEARCH_REQUEST.perKind)
    .map(({ id, slug, name, nation, type, tier, isPremium }) => ({
      kind: 'tank',
      vehicle: {
        tankId: id,
        name,
        shortName: name,
        slug,
        nation,
        type,
        tier,
        isPremium,
        isCollectible: false,
        images: mockVehicleImages(name)
      }
    }));

const clanResults = (query: string): ClanSearchResult[] =>
  MOCK_CLANS.filter(({ tag, name }) => matches({ value: tag, query }) || matches({ value: name, query }))
    .slice(0, SEARCH_REQUEST.perKind)
    .map(({ id, tag, name, members }) => ({ kind: 'clan', clanId: id, tag, name, membersCount: members, emblem: null }));

export const mockSearch = (query: string): SearchResponse => ({
  query,
  correctedQuery: null,
  results: [...playerResults(query), ...tankResults(query), ...clanResults(query)]
});
