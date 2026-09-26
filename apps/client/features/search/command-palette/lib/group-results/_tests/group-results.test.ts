import type { SearchResult } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { countSearchGroups, groupSearchResults } from '../group-results';

const MAP: SearchResult = { kind: 'map', arenaId: 'himmelsdorf', slug: 'himmelsdorf', name: 'Химмельсдорф', image: null };

const player = (accountId: number): SearchResult => ({
  kind: 'player',
  accountId,
  nickname: `player_${accountId}`,
  clanTag: null,
  matchedNickname: null,
  wn8: { value: null, tier: null },
  battles: null
});

const TANK: SearchResult = {
  kind: 'tank',
  vehicle: {
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
  }
};

const CLAN: SearchResult = { kind: 'clan', clanId: 7, tag: 'TAG', name: 'Clan', membersCount: 10, emblem: null };

const RESULTS: SearchResult[] = [player(2), TANK, MAP, player(1), CLAN];

describe('groupSearchResults', () => {
  it('puts every result under the group of its kind', () => {
    const { players, tanks, clans } = groupSearchResults(RESULTS);

    expect(players.every((result) => result.kind === 'player')).toBe(true);
    expect(tanks).toEqual([TANK]);
    expect(clans).toEqual([CLAN]);
  });

  it('keeps the order the API ranked them in', () => {
    const { players } = groupSearchResults(RESULTS);

    expect(players).toEqual([player(2), player(1)]);
  });

  it('drops kinds the palette does not show', () => {
    const groups = groupSearchResults([MAP]);

    expect(countSearchGroups(groups)).toBe(0);
  });

  it('counts every grouped result', () => {
    expect(countSearchGroups(groupSearchResults(RESULTS))).toBe(RESULTS.length - 1);
  });
});
