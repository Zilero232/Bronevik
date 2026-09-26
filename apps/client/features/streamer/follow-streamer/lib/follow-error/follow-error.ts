import { isPlusRequiredError } from '@/shared/api/source';

import type { FollowErrorKey } from './follow-error.types';

export const followErrorKey = (error: unknown): FollowErrorKey => {
  if (!isPlusRequiredError(error)) {
    return 'failed';
  }

  return error.code === 'PLAN_LIMIT_REACHED' ? 'limit' : 'plusRequired';
};
