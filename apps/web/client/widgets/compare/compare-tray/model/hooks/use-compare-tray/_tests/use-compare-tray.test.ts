import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { COMPARE_SELECTION, COMPARE_TARGET, NO_COMPARE_SELECTION } from '@/features/compare/compare-selection';

import { useCompareTray } from '../use-compare-tray';

const store = (selection: object) =>
  window.localStorage.setItem(COMPARE_SELECTION.storageKey, JSON.stringify({ ...NO_COMPARE_SELECTION, ...selection }));

const players = (count: number) => Array.from({ length: count }, (_, index) => ({ accountId: index + 1, nickname: `p${index + 1}` }));

afterEach(() => {
  window.localStorage.clear();
});

describe('useCompareTray', () => {
  it('stays hidden with nothing picked', () => {
    const { result } = renderHook(() => useCompareTray());

    expect(result.current.isVisible).toBe(false);
  });

  it('needs two picks to open the compare page', () => {
    store({ player: players(1), active: 'player' });

    const { result } = renderHook(() => useCompareTray());

    expect(result.current.isVisible).toBe(true);
    expect(result.current.canOpen).toBe(false);
  });

  it('opens the first picks the compare page holds and flags the rest', () => {
    const { max } = COMPARE_TARGET.player;

    store({ player: players(max + 2), active: 'player' });

    const { result } = renderHook(() => useCompareTray());

    expect(result.current.isOverflow).toBe(true);
    expect(result.current.openCount).toBe(max);
    expect(result.current.href.query.ids.split(',')).toHaveLength(max);
  });

  it('falls back to the kind that has picks and switches kinds through the store', () => {
    store({ player: players(2), active: 'tank' });

    const { result } = renderHook(() => useCompareTray());

    expect(result.current.kind).toBe('player');

    act(() => result.current.onRemove(1));

    expect(result.current.chips.map(({ id }) => id)).toEqual([2]);

    act(() => result.current.onClear());

    expect(result.current.isVisible).toBe(false);
  });
});
