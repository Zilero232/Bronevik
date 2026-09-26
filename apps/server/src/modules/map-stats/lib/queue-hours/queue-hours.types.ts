import type { QueueCell } from '../../map-stats.types';

export type ZoneHourInput = {
  at: Date;
  zone: string;
};

export type QueueNowInput = {
  cells: readonly QueueCell[];
  hour: number;
  tier: number;
  minSamples: number;
};
