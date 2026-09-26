import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCountdown } from '..';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useCountdown', () => {
  it('splits the remaining time into clock parts', () => {
    const { result } = renderHook(() => useCountdown({ seconds: 2 * 86_400 + 3_723 }));

    expect(result.current).toEqual({ left: 2 * 86_400 + 3_723, hours: 49, minutes: 2, seconds: 3, isExpired: false });
  });

  it('reads a lazy start only once', () => {
    const start = vi.fn(() => 10);
    const { rerender } = renderHook(() => useCountdown({ seconds: start }));

    rerender();

    expect(start).toHaveBeenCalledTimes(1);
  });

  it('reads no clock and reports no expiry while rendering on the server', () => {
    const start = vi.fn(() => 10);
    const Probe = () => String(useCountdown({ seconds: start }).isExpired);

    expect(renderToString(createElement(Probe))).toBe('false');
    expect(start).not.toHaveBeenCalled();
  });

  it('ticks down and fires onExpire at zero', () => {
    const onExpire = vi.fn();
    const { result } = renderHook(() => useCountdown({ seconds: 2, onExpire }));

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
});
