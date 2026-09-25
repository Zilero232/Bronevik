import type { SearchResult } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { search } from '@/shared/api';

import { countSearchGroups, groupSearchResults } from '../group-results';

const MAP: SearchResult = { kind: 'map', arenaId: 'himmelsdorf', slug: 'himmelsdorf', name: 'Химмельсдорф', image: null };

describe('groupSearchResults', () => {
  it('puts every result under the group of its kind', async () => {
    const { results } = await search({ query: 'an' });
    const { players, tanks, clans } = groupSearchResults(results);

    expect(players.every((result) => result.kind === 'player')).toBe(true);
    expect(tanks.every((result) => result.kind === 'tank')).toBe(true);
    expect(clans.every((result) => result.kind === 'clan')).toBe(true);
  });

  it('keeps the order the API ranked them in', async () => {
    const { results } = await search({ query: 'an' });
    const { players } = groupSearchResults(results);

    expect(players).toEqual(results.filter((result) => result.kind === 'player'));
  });

  it('drops kinds the palette does not show', () => {
    const groups = groupSearchResults([MAP]);

    expect(countSearchGroups(groups)).toBe(0);
  });

  it('counts every grouped result', async () => {
    const { results } = await search({ query: 'an' });

    expect(countSearchGroups(groupSearchResults(results))).toBe(results.filter((result) => result.kind !== 'map').length);
  });
});
