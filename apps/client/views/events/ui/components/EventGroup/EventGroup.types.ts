import type { EventEntry } from '../../../lib/event-timeline';

export type EventGroupProps = {
  title: string;
  emptyTitle: string;
  entries: EventEntry[];
};
