import type { PlayerSearchResult, SearchResponse, TankSearchResult } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { SEARCH } from '@otmetki/schemas';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { search } from '@/entities/search/search/api/search/search';
import { SEARCH_REQUEST } from '@/entities/search/search/api/search/search.constants';

import type { PickableKind } from '../../../../lib/search-kind';
import type { UseEntitySearchInput } from '../use-entity-search.types';

import { useEntitySearch } from '../use-entity-search';

vi.hoisted(() => vi.resetModules());

vi.mock('@/entities/search/search/api/search/search', () => ({ search: vi.fn() }));

const QUERY = 'is-7';

const PLAYER: PlayerSearchResult = {
  kind: 'player',
  accountId: 1001,
  nickname: 'IS7_fan',
  clanTag: null,
  matchedNickname: null,
  wn8: { value: null, tier: null },
  battles: null
};

const TANK: TankSearchResult = {
  kind: 'tank',
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
  }
};

const RESPONSE: SearchResponse = { query: QUERY, correctedQuery: null, results: [PLAYER, TANK] };

const renderSearch = <K extends PickableKind>(initialProps: UseEntitySearchInput<K>) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

  return renderHook((input: UseEntitySearchInput<K>) => useEntitySearch(input), { initialProps, wrapper });
};

const settle = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

afterAll(() => {
  vi.resetModules();
});

describe('useEntitySearch', () => {
  it('keeps only results of the requested kind', async () => {
    vi.mocked(search).mockResolvedValue(RESPONSE);
    const tanks = renderSearch({ kind: 'tank', query: QUERY });
    const players = renderSearch({ kind: 'player', query: QUERY });

    await settle(SEARCH_REQUEST.debounceMs);

    expect(tanks.result.current.results).toEqual([TANK]);
    expect(players.result.current.results).toEqual([PLAYER]);
  });

  it('searches the trimmed query only after the debounce settles', async () => {
    vi.mocked(search).mockResolvedValue(RESPONSE);
    const { rerender } = renderSearch({ kind: 'tank', query: '' });

    rerender({ kind: 'tank', query: ` ${QUERY} ` });
    await settle(SEARCH_REQUEST.debounceMs - 1);
    expect(search).not.toHaveBeenCalled();

    await settle(1);

    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith(expect.objectContaining({ query: QUERY }));
  });

  it('returns nothing for a query below the minimum length even after earlier results', async () => {
    vi.mocked(search).mockResolvedValue(RESPONSE);
    const { result, rerender } = renderSearch({ kind: 'tank', query: QUERY });

    await settle(SEARCH_REQUEST.debounceMs);
    rerender({ kind: 'tank', query: QUERY.slice(0, SEARCH.minLength - 1) });
    await settle(SEARCH_REQUEST.debounceMs);

    expect(result.current.isEnabled).toBe(false);
    expect(result.current.results).toEqual([]);
    expect(result.current.isFetching).toBe(false);
  });
});
