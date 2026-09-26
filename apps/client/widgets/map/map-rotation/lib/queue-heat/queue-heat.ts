import { clamp, indexBy, range, sortBy, unique } from 'remeda';

import type { RatingTone } from '@/shared/lib';

import type { QueueHeat, QueueHeatInput, WaitToneInput } from './queue-heat.types';

import { MAP_STATS } from '../../config';

export const waitTone = ({ value, min, max, tones }: WaitToneInput): RatingTone | null => {
  const position = max > min ? (value - min) / (max - min) : MAP_STATS.evenWaitPosition;
  const index = clamp(Math.floor(position * tones.length), { min: 0, max: tones.length - 1 });

  return tones[index] ?? null;
};

export const queueHeat = ({ cells, minSamples, hours, tones }: QueueHeatInput): QueueHeat => {
  const reliable = cells.filter((cell) => cell.samples >= minSamples);

  if (reliable.length === 0) {
    return { rows: [], fastestSec: null, slowestSec: null };
  }

  const waits = reliable.map((cell) => cell.medianSec);
  const min = Math.min(...waits);
  const max = Math.max(...waits);
  const byKey = indexBy(reliable, (cell) => `${cell.tier}:${cell.hour}`);
  const tiers = sortBy(unique(reliable.map((cell) => cell.tier)), (tier) => tier);

  return {
    rows: tiers.map((tier) => ({
      tier,
      cells: range(0, hours).map((hour) => {
        const cell = byKey[`${tier}:${hour}`] ?? null;

        return { hour, cell, tone: cell ? waitTone({ value: cell.medianSec, min, max, tones }) : null };
      })
    })),
    fastestSec: min,
    slowestSec: max
  };
};
