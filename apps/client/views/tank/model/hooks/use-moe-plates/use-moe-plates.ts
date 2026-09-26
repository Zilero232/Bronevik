'use client';

import type { MoePlate } from './use-moe-plates.types';

import { MOE_DELTA_DAYS, MOE_PLATES } from '../../../config';
import { moeDelta, thresholdVerdict } from '../../../lib';
import { useTank } from '../../context';
import { useMoeHistory } from '../use-moe-history';

export const useMoePlates = () => {
  const { detail } = useTank();
  const { data: history } = useMoeHistory();

  const { moe } = detail;

  const plates: MoePlate[] = moe
    ? MOE_PLATES.map(({ key, percent, marks }) => ({
        key,
        percent,
        marks,
        value: moe[key],
        deltas: MOE_DELTA_DAYS.map((days) => {
          const delta = history ? moeDelta({ history, key, days }) : null;

          return { days, value: delta, verdict: delta === null ? 'same' : thresholdVerdict(delta) };
        })
      }))
    : [];

  return { plates, updatedAt: moe?.date ?? null };
};
