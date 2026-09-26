import type { PlayerSearchResult, SearchResponse } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { SEARCH } from '@otmetki/schemas';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { search } from '@/entities/search/search/api/search/search';
import { SEARCH_REQUEST } from '@/entities/search/search/api/search/search.constants';

import { useEntityPicker } from '../use-entity-picker';

vi.hoisted(() => vi.resetModules());

vi.mock('@/entities/search/search/api/search/search', () => ({ search: vi.fn() }));

const QUERY = 'jove';

const PLAYER: PlayerSearchResult = {
  kind: 'player',
  accountId: 1001,
  nickname: 'Jove',
  clanTag: null,
  matchedNickname: null,
  wn8: { value: null, tier: null },
  battles: null
};

const PICKED: PlayerSearchResult = { ...PLAYER, accountId: 2002, nickname: 'Jove_twin' };

const RESPONSE: SearchResponse = { query: QUERY, correctedQuery: null, results: [PLAYER, PICKED] };

const renderPicker = (excludeIds: readonly number[] = []) => {
  const onPick = vi.fn<(result: PlayerSearchResult) => void>();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

  return { onPick, ...renderHook(() => useEntityPicker({ kind: 'player', excludeIds, onPick }), { wrapper }) };
};

const type = async (onQueryChange: (value: string) => void, value: string) => {
  act(() => onQueryChange(value));
  await act(() => vi.advanceTimersByTimeAsync(SEARCH_REQUEST.debounceMs));
  await act(() => vi.advanceTimersByTimeAsync(0));
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.mocked(search).mockResolvedValue(RESPONSE);
});

afterEach(() => {
  vi.useRealTimers();
});

afterAll(() => {
  vi.resetModules();
});

describe('useEntityPicker', () => {
  it('stays closed while the query is too short to search', async () => {
    const { result } = renderPicker();

    await type(result.current.onQueryChange, QUERY.slice(0, SEARCH.minLength - 1));

    expect(result.current.isOpen).toBe(false);
    expect(search).not.toHaveBeenCalled();
  });

  it('opens with results once a searchable query is typed', async () => {
    const { result } = renderPicker();

    await type(result.current.onQueryChange, QUERY);

    expect(result.current.isOpen).toBe(true);
    expect(result.current.visible).toEqual([PLAYER, PICKED]);
  });

  it('hides results that are already picked', async () => {
    const { result } = renderPicker([PICKED.accountId]);

    await type(result.current.onQueryChange, QUERY);

    expect(result.current.visible).toEqual([PLAYER]);
  });

  it('hands the choice over, clears the query and closes', async () => {
    const { result, onPick } = renderPicker();

    await type(result.current.onQueryChange, QUERY);
    act(() => result.current.onSelect(PLAYER));

    expect(onPick).toHaveBeenCalledWith(PLAYER);
    expect(result.current.query).toBe('');
    expect(result.current.isOpen).toBe(false);
  });

  it('reopens the existing results after being closed', async () => {
    const { result } = renderPicker();

    await type(result.current.onQueryChange, QUERY);
    act(() => result.current.onClose());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.onOpen());

    expect(result.current.isOpen).toBe(true);
    expect(search).toHaveBeenCalledTimes(1);
  });
});
