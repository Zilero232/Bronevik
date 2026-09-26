import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useClientNow } from '..';

const START = new Date('2026-09-25T12:00:00Z');
const TICK_MS = 60_000;

const ServerProbe = () => String(useClientNow());

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(START);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useClientNow', () => {
  it('reads no clock while rendering on the server', () => {
    expect(renderToString(<ServerProbe />)).toBe('null');
  });

  it('returns the current time once mounted in the browser', () => {
    const { result } = renderHook(() => useClientNow());

    expect(result.current?.getTime()).toBe(START.getTime());
  });

  it('keeps the first reading across re-renders without an interval', () => {
    const { result, rerender } = renderHook(() => useClientNow());
    const first = result.current;

    vi.setSystemTime(START.getTime() + TICK_MS);
    rerender();

    expect(result.current).toBe(first);
  });

  it('advances on every interval tick', () => {
    const { result } = renderHook(() => useClientNow({ updateInterval: TICK_MS }));

    act(() => {
      vi.advanceTimersByTime(TICK_MS);
    });

    expect(result.current?.getTime()).toBe(START.getTime() + TICK_MS);
  });
});
