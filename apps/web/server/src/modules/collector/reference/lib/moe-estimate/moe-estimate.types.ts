import type { MoeThresholdRecord } from '../../../../reference';

export type MoeEstimateLevel = {
  damage: number;
  players: number;
};

export type MoeEstimate = Pick<MoeThresholdRecord, 'p100' | 'p65' | 'p85' | 'p95' | 'tankId'> & {
  sampleSize: number;
};
