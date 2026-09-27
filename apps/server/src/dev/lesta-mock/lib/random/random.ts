import { uniformFloat64 } from 'pure-rand/distribution/uniformFloat64';
import { uniformInt } from 'pure-rand/distribution/uniformInt';
import { xoroshiro128plus } from 'pure-rand/generator/xoroshiro128plus';

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

const ACKLAM = {
  a: [-39.696_830_286_653_76, 220.946_098_424_520_5, -275.928_510_446_968_7, 138.357_751_867_269, -30.664_798_066_147_16, 2.506_628_277_459_239],
  b: [-54.476_098_798_224_06, 161.585_836_858_040_9, -155.698_979_859_886_6, 66.801_311_887_719_72, -13.280_681_552_885_72],
  c: [
    -0.007_784_894_002_430_293, -0.322_396_458_041_136_5, -2.400_758_277_161_838, -2.549_732_539_343_734, 4.374_664_141_464_968, 2.938_163_982_698_783
  ],
  d: [0.007_784_695_709_041_462, 0.322_467_129_070_039_8, 2.445_134_137_142_996, 3.754_408_661_907_416],
  low: 0.024_25
} as const;

export const normalQuantile = (probability: number): number => {
  const p = Math.min(1 - 1e-12, Math.max(1e-12, probability));
  const { a, b, c, d, low } = ACKLAM;

  if (p < low || p > 1 - low) {
    const q = Math.sqrt(-2 * Math.log(p < low ? p : 1 - p));
    const value = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);

    return p < low ? value : -value;
  }

  const q = p - 0.5;
  const r = q * q;

  return (
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
};

export const normalCdf = (value: number): number => {
  const t = 1 / (1 + 0.231_641_9 * Math.abs(value));
  const density = Math.exp((-value * value) / 2) / Math.sqrt(2 * Math.PI);
  const tail = density * t * (0.319_381_53 + t * (-0.356_563_782 + t * (1.781_477_937 + t * (-1.821_255_978 + t * 1.330_274_429))));

  return value >= 0 ? 1 - tail : tail;
};

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
