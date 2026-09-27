import type { RatingTone } from '@/shared/lib';

import type { QueueCell } from '../../api';

export type QueueHeatInput = {
  cells: readonly QueueCell[];
  minSamples: number;
  hours: number;
  tones: readonly RatingTone[];
};

export type WaitToneInput = {
  value: number;
  min: number;
  max: number;
  tones: readonly RatingTone[];
};

export type QueueHeatCell = {
  hour: number;
  cell: QueueCell | null;
  tone: RatingTone | null;
};

export type QueueHeatRow = {
  tier: number;
  cells: QueueHeatCell[];
};

export type QueueHeat = {
  rows: QueueHeatRow[];
  fastestSec: number | null;
  slowestSec: number | null;
};
