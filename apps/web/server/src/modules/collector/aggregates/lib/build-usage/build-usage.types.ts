import type { BuildCohort, BuildMode } from '@otmetki/schemas';
import type { z } from 'zod';

import type { BuildUsageAggregate } from '../../../../../../generated';
import type { StoredLoadout } from '../../../../mod';
import type { storedBuildUsageSchema } from './build-usage.schemas';

export type StoredBuildUsage = z.infer<typeof storedBuildUsageSchema>;

export type UsageSample = {
  accountId: string;
  mode: BuildMode;
  won: boolean | null;
  damage: number;
  loadout: StoredLoadout;
};

export type UsageSummary = Pick<BuildUsageAggregate, 'avgDamage' | 'battles' | 'players' | 'winRate'> & {
  usage: StoredBuildUsage;
};

export type UsageGroup = UsageSummary & {
  mode: BuildMode;
  cohort: BuildCohort;
};

export type CohortRank = {
  accountId: string;
  rank: number;
};

export type GroupUsageInput = {
  samples: readonly UsageSample[];
  ranks: readonly CohortRank[];
};

export type PickAccumulator = {
  weight: number;
  battles: number;
  wins: number;
  decided: number;
  damage: number;
};

export type AddPickInput = {
  picks: Map<string, PickAccumulator>;
  key: string;
  sample: UsageSample;
  weight: number;
};

export type ToPicksInput = {
  picks: Map<string, PickAccumulator>;
  players: number;
};

export type ShellAccumulator = {
  weight: number;
  battles: number;
  count: number;
  ammo: number;
};

type SkillAccumulator = {
  weight: number;
  count: number;
  positions: number;
};

export type RoleAccumulator = {
  weight: number;
  members: number;
  skills: Map<string, SkillAccumulator>;
};

export type InCohortInput = {
  cohort: BuildCohort;
  rank: number | undefined;
};
