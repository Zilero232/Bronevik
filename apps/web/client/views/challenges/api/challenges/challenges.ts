import { socialControllerWeeklyChallenges } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { WeeklyChallenges, WeeklyChallengesInput } from './challenges.types';

export const getWeeklyChallenges = ({ signal }: WeeklyChallengesInput = {}): Promise<WeeklyChallenges> =>
  fromSdk(() => socialControllerWeeklyChallenges({ ...SESSION_REQUEST, signal }));
