import { uniformFloat64 } from 'pure-rand/distribution/uniformFloat64';
import { uniformInt } from 'pure-rand/distribution/uniformInt';
import { xoroshiro128plus } from 'pure-rand/generator/xoroshiro128plus';
import { errorFunction } from 'simple-statistics';

import type { MockRng, NormalInput, WeightedInput } from './random.types';

const MIX = { a: 2_246_822_507, b: 3_266_489_909, golden: 2_654_435_769 } as const;

const mix = (value: number): number => {
  let hash = value;

  hash ^= hash >>> 16;
  hash = Math.imul(hash, MIX.a);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, MIX.b);
  hash ^= hash >>> 16;

  return hash >>> 0;
};

export const hashSeed = (...parts: readonly number[]): number => {
  let hash: number = MIX.golden;

  for (const part of parts) {
    const low = part % 0x1_0000_0000;
    const high = Math.floor(part / 0x1_0000_0000);

    hash = mix(hash ^ mix(low + Math.imul(high, MIX.golden)));
  }

  return hash;
};

export const unitFloat = (...parts: readonly number[]): number => hashSeed(...parts) / 0x1_0000_0000;

export const normalCdf = (value: number): number => 0.5 * (1 + errorFunction(value / Math.SQRT2));

export const createRng = (...parts: readonly number[]): MockRng => {
  const generator = xoroshiro128plus(hashSeed(...parts) | 0);
  const float = () => uniformFloat64(generator);

  const normal = ({ mean = 0, deviation = 1 }: NormalInput = {}) => {
    const u = Math.max(float(), Number.EPSILON);

    return mean + deviation * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * float());
  };

  const poisson = (mean: number): number => {
    if (mean <= 0) {
      return 0;
    }

    if (mean > 30) {
      return Math.max(0, Math.round(normal({ mean, deviation: Math.sqrt(mean) })));
    }

    const limit = Math.exp(-mean);
    let count = 0;
    let product = float();

    while (product > limit) {
      count += 1;
      product *= float();
    }

    return count;
  };

  const pick = <T>(items: readonly T[]): T => {
    const item = items[uniformInt(generator, 0, items.length - 1)];

    if (item === undefined) {
      throw new RangeError('pick from an empty list');
    }

    return item;
  };

  const weighted = <T>({ items, weight }: WeightedInput<T>): T => {
    const total = items.reduce((sum, item) => sum + Math.max(0, weight(item)), 0);
    let target = float() * total;

    for (const item of items) {
      target -= Math.max(0, weight(item));

      if (target <= 0) {
        return item;
      }
    }

    return pick(items);
  };

  const shuffle = <T>(items: readonly T[]): T[] => {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const other = uniformInt(generator, 0, index);
      const current = copy[index];
      const swap = copy[other];

      if (current !== undefined && swap !== undefined) {
        copy[index] = swap;
        copy[other] = current;
      }
    }

    return copy;
  };

  return {
    float,
    int: ({ min, max }) => uniformInt(generator, Math.ceil(min), Math.floor(max)),
    chance: (probability) => float() < probability,
    normal,
    logNormal: ({ median, sigma }) => median * Math.exp(normal({ mean: 0, deviation: sigma })),
    poisson,
    pick,
    weighted,
    shuffle
  };
};
