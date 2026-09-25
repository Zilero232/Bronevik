import { describe, expect, it } from 'vitest';

import { SEARCH } from '../search.constants';
import { searchQuerySchema, searchResultSchema } from '../search.schemas';

describe('searchQuerySchema', () => {
  it('trims the query and applies the default limit', () => {
    expect(searchQuerySchema.parse({ q: '  neki ' })).toEqual({ q: 'neki', limit: SEARCH.defaultLimit });
  });

  it('rejects a query shorter than the minimum', () => {
    expect(searchQuerySchema.safeParse({ q: 'n'.repeat(SEARCH.minLength - 1) }).success).toBe(false);
  });

  it('parses kinds from a comma-separated list', () => {
    expect(searchQuerySchema.parse({ q: 'is-7', kinds: 'tank,player' }).kinds).toEqual(['tank', 'player']);
  });
});

describe('searchResultSchema', () => {
  it('discriminates results by kind', () => {
    const clan = { kind: 'clan', clanId: 1, tag: 'TAG', name: 'Clan', membersCount: 10, emblem: null };

    expect(searchResultSchema.parse(clan).kind).toBe('clan');
    expect(searchResultSchema.safeParse({ ...clan, kind: 'player' }).success).toBe(false);
  });
});
