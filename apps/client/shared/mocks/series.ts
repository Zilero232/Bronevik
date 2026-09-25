import type { MockSeriesInput, MockSeriesPoint } from './mocks.types';

import { seededRandom } from '../lib/seeded-random';

export const mockSeries = ({ seed, length, base, amplitude, drift = 0 }: MockSeriesInput): MockSeriesPoint[] => {
  const random = seededRandom(seed);

  let value = base;

  return Array.from({ length }, (_, day) => {
    value += (random() - 0.5) * amplitude + drift;

    return { day, value: Math.round(value * 100) / 100 };
  });
};
