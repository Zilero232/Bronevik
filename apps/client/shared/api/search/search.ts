import type { SearchResponse } from '@bronevik/schemas';

import { SEARCH, searchResponseSchema } from '@bronevik/schemas';

import { env } from '@/shared/config';

import type { SearchInput, WaitInput } from './search.types';

import { api } from '../http';
import { SEARCH_REQUEST } from './search.constants';
import { mockSearch } from './search.mock';

const wait = ({ ms, signal }: WaitInput) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);

    signal?.addEventListener('abort', () => clearTimeout(timer), { once: true });
  });

export const search = async ({ query, signal }: SearchInput): Promise<SearchResponse> => {
  const trimmed = query.trim();

  if (trimmed.length < SEARCH.minLength) {
    return { query: trimmed, correctedQuery: null, results: [] };
  }

  if (env.NEXT_PUBLIC_USE_MOCKS) {
    await wait({ ms: SEARCH_REQUEST.mockLatencyMs, signal });

    return mockSearch(trimmed);
  }

  const { data } = await api.get('/search', { params: { q: trimmed, limit: SEARCH_REQUEST.limit }, signal });

  return searchResponseSchema.parse(data);
};
