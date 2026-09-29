import { isMapCamouflage } from '@/entities/map/map';

import type { CamouflageHint, CompareMapsInput, MapHints, SizeHint } from './map-hints.types';

const camouflageHint = ({ guess, target }: CompareMapsInput): CamouflageHint => {
  if (!isMapCamouflage(guess.camouflage) || !isMapCamouflage(target.camouflage)) {
    return 'unknown';
  }

  return guess.camouflage === target.camouflage ? 'match' : 'miss';
};

const sizeHint = ({ guess, target }: CompareMapsInput): SizeHint => {
  if (guess.sizeMeters === null || target.sizeMeters === null) {
    return 'unknown';
  }

  if (target.sizeMeters === guess.sizeMeters) {
    return 'match';
  }

  return target.sizeMeters > guess.sizeMeters ? 'larger' : 'smaller';
};

export const compareMaps = (input: CompareMapsInput): MapHints => ({
  isCorrect: input.guess.arenaId === input.target.arenaId,
  camouflage: camouflageHint(input),
  size: sizeHint(input)
});
