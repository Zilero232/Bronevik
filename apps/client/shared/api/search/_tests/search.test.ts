import { SEARCH } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { search } from '../search';

describe('search', () => {
  it('answers a query shorter than the minimum with no results and no request', async () => {
    const result = await search({ query: ` ${'x'.repeat(SEARCH.minLength - 1)} ` });

    expect(result).toEqual({ query: 'x'.repeat(SEARCH.minLength - 1), correctedQuery: null, results: [] });
  });
});
