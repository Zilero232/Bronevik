import { LEGACY_RANDOM } from '../../config';

export const legacyRandom = (seed: number) => {
  let state = seed >>> 0 || 1;

  return () => {
    state = (state + LEGACY_RANDOM.increment) >>> 0;

    let next = state;

    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);

    return ((next ^ (next >>> 14)) >>> 0) / LEGACY_RANDOM.range;
  };
};
