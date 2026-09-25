import type { MoeThreshold } from '@bronevik/schemas';

import type { MOE_KEYS } from '../../config';

export type MoeKey = (typeof MOE_KEYS)[number];

export type MoeDeltaInput = {
  history: readonly MoeThreshold[];
  key: MoeKey;
  days: number;
};

export type MoeSeries = {
  labels: string[];
  series: { key: MoeKey; values: number[] }[];
};
