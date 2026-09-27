import type { WeeklyChallengeProgress } from '../../../../../generated';
import type { ChallengeDefinition } from '../../lib';

export type ToWeeklyChallengeViewInput = {
  definition: ChallengeDefinition;
  progress: readonly WeeklyChallengeProgress[];
};
