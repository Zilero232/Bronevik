import type { TankChallengeMetric } from '@otmetki/schemas';

import type { TankChallengeDefinition } from '../../progression.types';
import type { BattleSample } from '../battle-samples';

export type WeeklyTankChallengesInput = {
  seed: string;
  tier: number;
  hasModData: boolean;
};

export type ResolvedChallenge = {
  code: string;
  metric: TankChallengeMetric;
  target: number;
  threshold: number | null;
};

export type ChallengeProgressInput = {
  challenge: Pick<ResolvedChallenge, 'metric' | 'threshold'>;
  samples: readonly BattleSample[];
};

export type ResolveChallengeInput = {
  definition: TankChallengeDefinition;
  tier: number;
};

export type RoundUpInput = {
  value: number;
  step: number;
};
