import type { WeekGroup } from '../../../lib/week-groups';
import type { EventView } from '../../../model/hooks';

export type EventTimelineProps = {
  weeks: WeekGroup<EventView>[];
  emptyTitle: string;
};
