import type { BattleSample } from '../battle-samples';

export type XpOfSamplesInput = {
  samples: readonly BattleSample[];
  tier: number;
};
