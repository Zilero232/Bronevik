import type { EventEntry, EventPhase } from '../../../lib/event-timeline';

export type EventView = EventEntry & {
  href: string | undefined;
};

export type EventViewTimeline = Record<EventPhase, EventView[]>;
