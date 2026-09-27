import type { GameEvent } from '@otmetki/schemas';

export type EventPhase = 'current' | 'past' | 'upcoming';

export type EventEntry = {
  event: GameEvent;
  phase: EventPhase;
  progress: number | null;
  days: number | null;
};

export type EventTimeline = Record<EventPhase, EventEntry[]>;

export type EventTimelineInput = {
  events: readonly GameEvent[];
  now: Date;
  openEndedDays: number;
};

export type EventEntryInput = {
  event: GameEvent;
  now: Date;
  openEndedDays: number;
};
