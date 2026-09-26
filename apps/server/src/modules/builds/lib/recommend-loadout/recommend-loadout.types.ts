import type { ProvisionPick } from '@otmetki/schemas';

export type TopIdsInput = {
  picks: readonly ProvisionPick[];
  size: number;
  filled: number;
};

export type CommonSkillEntry = {
  skill: string;
  weight: number;
  positions: number;
};
