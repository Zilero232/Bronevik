import type { RngBucket } from '@otmetki/schemas';

import { HONEST_RNG } from '@otmetki/schemas';

import type { RngLuck } from '../../honest-rng.types';
import type { LuckInput, NormalCdfInput } from './rng-theory.types';

import { summarizeRolls } from '../../../analytics';
import { RNG_LUCK, RNG_THEORY } from '../../config';
import { ERF } from './rng-theory.constants';

export const erf = (x: number): number => {
  const sign = Math.sign(x);
  const value = Math.abs(x);
  const t = 1 / (1 + ERF.p * value);
  const polynomial = ERF.a.reduceRight((sum, coefficient) => sum * t + coefficient, 0) * t;

  return sign * (1 - polynomial * Math.exp(-value * value));
};

const normalCdf = ({ x, sigma }: NormalCdfInput): number => 0.5 * (1 + erf(x / (sigma * Math.SQRT2)));

export const theoryBuckets = (): RngBucket[] => {
  const sigma = HONEST_RNG.spread * RNG_THEORY.sigmaShare;
  const mass = normalCdf({ x: HONEST_RNG.spread, sigma }) - normalCdf({ x: -HONEST_RNG.spread, sigma });

  return summarizeRolls([]).buckets.map((bucket) => ({
    ...bucket,
    share: ((normalCdf({ x: bucket.to, sigma }) - normalCdf({ x: bucket.from, sigma })) / mass) * 100
  }));
};

export const luckVerdict = ({ meanRoll, shots }: LuckInput): RngLuck => {
  if (meanRoll === null || shots < RNG_LUCK.minShots) {
    return 'unknown';
  }

  if (Math.abs(meanRoll) <= RNG_LUCK.evenBand) {
    return 'even';
  }

  return meanRoll > 0 ? 'lucky' : 'unlucky';
};
