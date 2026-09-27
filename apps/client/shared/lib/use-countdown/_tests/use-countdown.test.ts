import { act, renderHook } from '@testing-library/react';
import { addSeconds } from 'date-fns';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCountdown } from '..';

const START = new Date('2026-01-01T00:00:00Z');

const until = (target: Date) => (now: Date) => (target.getTime() - now.getTime()) / 1_000;

beforeEach(() => {
  vi.useFakeTimers({ now: START });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useCountdown', () => {
  it('splits the remaining time into clock parts', () => {
    const { result } = renderHook(() => useCountdown({ seconds: until(addSeconds(START, 2 * 86_400 + 3_723)) }));

    expect(result.current).toEqual({ left: 2 * 86_400 + 3_723, hours: 49, minutes: 2, seconds: 3, isExpired: false });
  });

  it('reads no clock and reports no expiry while rendering on the server', () => {
    const start = vi.fn(() => 10);
    const Probe = () => String(useCountdown({ seconds: start }).isExpired);

    expect(renderToString(createElement(Probe))).toBe('false');
    expect(start).not.toHaveBeenCalled();
  });

  it('ticks down and fires onExpire at zero', () => {
    const onExpire = vi.fn();
    const { result } = renderHook(() => useCountdown({ seconds: until(addSeconds(START, 2)), onExpire }));

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current.left).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current.isExpired).toBe(true);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('restarts from the current target when it moves', () => {
    const onExpire = vi.fn();
    const { result, rerender } = renderHook(({ target }) => useCountdown({ seconds: until(target), onExpire }), {
      initialProps: { target: addSeconds(START, 1) }
    });

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current.isExpired).toBe(true);

    rerender({ target: addSeconds(START, 60) });

    expect(result.current).toMatchObject({ left: 59, isExpired: false });

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current.left).toBe(58);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('does not fire onExpire when mounted already expired', () => {
    const onExpire = vi.fn();

    renderHook(() => useCountdown({ seconds: until(START), onExpire }));

    expect(onExpire).not.toHaveBeenCalled();
  });
});
