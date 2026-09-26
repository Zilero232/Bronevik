import type { z } from 'zod';

import type { statRequirementsSchema } from './requirements.schemas';

export type StatRequirements = z.infer<typeof statRequirementsSchema>;

export type PlayerStats = {
  battles: number;
  wn8: number | null;
  winRate: number | null;
};

export type CheckRequirementsInput = {
  stats: PlayerStats | null;
  requirements: StatRequirements;
};

export type RequirementFailure = 'maxWn8' | 'minBattles' | 'minWinRate' | 'minWn8' | 'noStats';
