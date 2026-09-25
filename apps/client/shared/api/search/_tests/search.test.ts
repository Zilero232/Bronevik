import type { SearchResponse } from '@bronevik/schemas';

import { SEARCH, searchResponseSchema } from '@bronevik/schemas';
import { groupBy } from 'remeda';
import { describe, expect, it } from 'vitest';

import { MOCK_PLAYERS, MOCK_TANKS } from '@/shared/mocks';

import { search } from '../search';
import { SEARCH_REQUEST } from '../search.constants';

const byKind = ({ results }: SearchResponse) => groupBy(results, (result) => result.kind);

describe('search', () => {
  it('returns nothing for a query shorter than the minimum', async () => {
    const result = await search({ query: 'x'.repeat(SEARCH.minLength - 1) });

    expect(result.results).toHaveLength(0);
  });

  it('answers in the shape the API contract validates', async () => {
    const result = await search({ query: 'an' });

    expect(() => searchResponseSchema.parse(result)).not.toThrow();
  });

  it('finds a player by part of the nickname, case-insensitively', async () => {
    const [player] = MOCK_PLAYERS;
    const result = await search({ query: player.nickname.slice(0, 6).toUpperCase() });

    expect(result.results).toContainEqual(expect.objectContaining({ kind: 'player', accountId: player.id }));
  });

  it('finds a tank by its Cyrillic name', async () => {
    const tank = MOCK_TANKS.find((item) => /\p{Script=Cyrillic}/u.test(item.name));

    expect(tank).toBeDefined();

    const result = await search({ query: tank?.name ?? '' });

    expect(byKind(result).tank).toContainEqual(expect.objectContaining({ vehicle: expect.objectContaining({ slug: tank?.slug }) }));
  });

  it('never returns more hits per kind than the limit', async () => {
    const responses = await Promise.all(['an', 'ob', 'o'.repeat(SEARCH.minLength)].map((query) => search({ query })));

    responses.forEach((response) => {
      Object.values(byKind(response)).forEach((hits) => expect(hits.length).toBeLessThanOrEqual(SEARCH_REQUEST.perKind));
    });
  });
});
