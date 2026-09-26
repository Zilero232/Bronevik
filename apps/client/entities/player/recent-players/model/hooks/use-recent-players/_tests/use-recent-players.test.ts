import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { RecentPlayer } from '..';

import { useRecentPlayers } from '..';
import { RECENT_PLAYERS } from '../../../../config';

const NOW = new Date('2026-09-26T12:00:00Z');

const player = (accountId: number): Omit<RecentPlayer, 'viewedAt'> => ({ accountId, nickname: `Player${accountId}`, clanTag: null, wn8: null });

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  window.localStorage.removeItem(RECENT_PLAYERS.storageKey);
});

describe('useRecentPlayers', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useRecentPlayers());

    expect(result.current.players).toEqual([]);
  });

  it('puts the latest viewed player first with the view time', () => {
    const { result } = renderHook(() => useRecentPlayers());

    act(() => result.current.remember(player(1)));
    act(() => result.current.remember(player(2)));

    expect(result.current.players.map(({ accountId }) => accountId)).toEqual([2, 1]);
    expect(result.current.players[0].viewedAt).toBe(NOW.toISOString());
  });

  it('moves a revisited player to the front instead of duplicating it', () => {
    const { result } = renderHook(() => useRecentPlayers());

    act(() => result.current.remember(player(1)));
    act(() => result.current.remember(player(2)));
    act(() => result.current.remember({ ...player(1), nickname: 'Renamed' }));

    expect(result.current.players.map(({ accountId }) => accountId)).toEqual([1, 2]);
    expect(result.current.players[0].nickname).toBe('Renamed');
  });

  it('keeps only the most recent players up to the limit', () => {
    const { result } = renderHook(() => useRecentPlayers());
    const total = RECENT_PLAYERS.limit + 2;

    for (let accountId = 1; accountId <= total; accountId += 1) {
      act(() => result.current.remember(player(accountId)));
    }

    expect(result.current.players).toHaveLength(RECENT_PLAYERS.limit);
    expect(result.current.players[0].accountId).toBe(total);
    expect(result.current.players.some(({ accountId }) => accountId === 1)).toBe(false);
  });

  it('survives a reload through local storage', () => {
    const first = renderHook(() => useRecentPlayers());

    act(() => first.result.current.remember(player(7)));
    first.unmount();

    const { result } = renderHook(() => useRecentPlayers());

    expect(result.current.players.map(({ accountId }) => accountId)).toEqual([7]);
  });

  it('forgets everyone on clear', () => {
    const { result } = renderHook(() => useRecentPlayers());

    act(() => result.current.remember(player(1)));
    act(() => result.current.clear());

    expect(result.current.players).toEqual([]);
  });
});
