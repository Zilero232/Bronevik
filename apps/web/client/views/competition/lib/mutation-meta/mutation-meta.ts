import type { MutationFeedbackMeta } from '@/shared/api/query-client';

import { communityErrorKey } from '@/features/community/api-error';
import { isPlusRequiredError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import type { CompetitionToastKey } from './mutation-meta.types';

export const competitionMutationMeta = (successKey: CompetitionToastKey): MutationFeedbackMeta => ({
  successKey,
  errorKey: (error) => (isPlusRequiredError(error) ? 'competitions.errors.plus' : communityErrorKey('competitions')(error)),
  invalidates: [QUERY_KEYS.competitions.list({})]
});
