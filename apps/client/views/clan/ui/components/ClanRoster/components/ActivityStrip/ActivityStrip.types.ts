import type { ActivityStatus } from '../../../../../lib/activity-status';

export type ActivityStripProps = {
  distribution: Record<ActivityStatus, number>;
  shares: Record<ActivityStatus, number>;
};
