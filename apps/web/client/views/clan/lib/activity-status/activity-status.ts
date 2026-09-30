import { countBy } from 'remeda';

import type { ActivityStatus } from './activity-status.types';

import { ACTIVITY_LIMITS } from '../../config';

export const activityStatus = (inactiveDays: number | null): ActivityStatus => {
  if (inactiveDays === null) {
    return 'gone';
  }

  if (inactiveDays <= ACTIVITY_LIMITS.active) {
    return 'active';
  }

  if (inactiveDays <= ACTIVITY_LIMITS.recent) {
    return 'recent';
  }

  return inactiveDays <= ACTIVITY_LIMITS.idle ? 'idle' : 'gone';
};

export const activityDistribution = (days: readonly (number | null)[]): Record<ActivityStatus, number> => ({
  active: 0,
  recent: 0,
  idle: 0,
  gone: 0,
  ...countBy(days, activityStatus)
});
