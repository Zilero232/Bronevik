import type { FeedBadgeView } from '../../social.types';

import { challengeOfBadge } from '../../lib';
import { toChallengeRule } from '../challenge-rule';

export const toFeedBadge = (code: string): FeedBadgeView => {
  const challenge = challengeOfBadge(code);

  return { code, challenge: challenge ? toChallengeRule(challenge) : null };
};
