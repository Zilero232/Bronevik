import type { IsGainInput } from './celebrate.types';

import { isServer } from '../env';
import { REDUCED_MOTION_QUERY } from '../motion';
import { CELEBRATE } from './celebrate.constants';

export const isGain = ({ previous, next }: IsGainInput): boolean =>
  previous !== null && typeof next === 'number' && Number.isFinite(previous) && Number.isFinite(next) && next > previous;

export const celebrate = async () => {
  if (isServer() || window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    return;
  }

  const { default: confetti } = await import('canvas-confetti');

  for (const burst of CELEBRATE.bursts) {
    void confetti({ ...burst, origin: { ...burst.origin }, colors: [...CELEBRATE.colors], zIndex: CELEBRATE.zIndex, disableForReducedMotion: true });
  }
};
