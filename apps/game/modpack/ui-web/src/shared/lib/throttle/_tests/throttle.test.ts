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
  it('lets the first call through', () => {
    const throttle = createThrottle(INTERVAL_MS);

    expect(throttle(false)).toBe(true);
  });

  it('holds a call within the interval', () => {
    const throttle = createThrottle(INTERVAL_MS);

    throttle(false);

    vi.advanceTimersByTime(INTERVAL_MS - 1);

    expect(throttle(false)).toBe(false);
  });

  it('lets a call through once the interval is over', () => {
    const throttle = createThrottle(INTERVAL_MS);

    throttle(false);

    vi.advanceTimersByTime(INTERVAL_MS);

    expect(throttle(false)).toBe(true);
  });

  it('always lets a forced call through', () => {
    const throttle = createThrottle(INTERVAL_MS);

    throttle(false);

    expect(throttle(true)).toBe(true);
  });

  it('restarts the interval on a forced call', () => {
    const throttle = createThrottle(INTERVAL_MS);

    throttle(false);
    vi.advanceTimersByTime(INTERVAL_MS - 1);
    throttle(true);

    vi.advanceTimersByTime(INTERVAL_MS - 1);

    expect(throttle(false)).toBe(false);
  });
});
