import type { z } from 'zod';

import type { playerStatsSchema } from '../../dto/community-core.schemas';
import type { statRequirementsSchema } from './requirements.schemas';

export type StatRequirements = z.infer<typeof statRequirementsSchema>;

export type PlayerStats = z.infer<typeof playerStatsSchema>;

export type CheckRequirementsInput = {
  stats: PlayerStats | null;
  requirements: StatRequirements;
};

export type RequirementFailure = 'maxWn8' | 'minBattles' | 'minWinRate' | 'minWn8' | 'noStats';
