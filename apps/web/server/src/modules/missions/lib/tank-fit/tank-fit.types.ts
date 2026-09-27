import type { MissionMetric } from '@otmetki/schemas';

import type { TankServerStats } from '../../../../../generated';

export type FitCandidate = {
  tankId: number;
  value: number;
  winRate: number;
  battles: number;
};

export type RankedCandidate = FitCandidate & {
  score: number;
};

export type RankTanksInput = {
  candidates: readonly FitCandidate[];
  limit?: number;
};

export type ToCandidateInput = {
  row: Pick<
    TankServerStats,
    'accuracy' | 'avgBlocked' | 'avgDamage' | 'avgFrags' | 'avgSpotted' | 'avgXp' | 'battles' | 'survivalRate' | 'tankId' | 'winRate'
  >;
  metric: MissionMetric;
};
