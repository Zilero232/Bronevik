import type { VehicleSummary } from '@otmetki/schemas';

import type { FeedDay } from '../../../lib/feed-groups';

export type FeedTimelineProps = {
  days: readonly FeedDay[];
  vehicles: Partial<Record<number, VehicleSummary>>;
};
