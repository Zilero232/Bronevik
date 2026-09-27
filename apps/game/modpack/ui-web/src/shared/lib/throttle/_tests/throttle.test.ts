import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createThrottle } from '../throttle';

const INTERVAL_MS = 150;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe(createThrottle, () => {
  it('lets the first call through and holds the next ones for the interval', () => {
    const throttle = createThrottle(INTERVAL_MS);

    expect(throttle(false)).toBe(true);
    vi.advanceTimersByTime(INTERVAL_MS - 1);
    expect(throttle(false)).toBe(false);
    vi.advanceTimersByTime(1);
    expect(throttle(false)).toBe(true);
  });

  it('always lets a forced call through and restarts the interval', () => {
    const throttle = createThrottle(INTERVAL_MS);

    throttle(false);

    expect(throttle(true)).toBe(true);
    vi.advanceTimersByTime(INTERVAL_MS - 1);
    expect(throttle(false)).toBe(false);
  });
});
