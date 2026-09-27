import type { Throttle } from './throttle.types';

export const createThrottle = (intervalMs: number): Throttle => {
  let last = Number.NEGATIVE_INFINITY;

  return (force) => {
    const now = Date.now();

    if (!force && now - last < intervalMs) {
      return false;
    }

    last = now;

    return true;
  };
};
