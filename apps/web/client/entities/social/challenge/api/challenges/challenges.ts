import type { Challenges } from '@/shared/api/generated';

import { socialControllerWeeklyChallenges } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { WeeklyChallengesInput } from './challenges.types';

export const getWeeklyChallenges = ({ signal }: WeeklyChallengesInput = {}): Promise<Challenges> =>
  fromSdk(() => socialControllerWeeklyChallenges({ ...SESSION_REQUEST, signal }));
