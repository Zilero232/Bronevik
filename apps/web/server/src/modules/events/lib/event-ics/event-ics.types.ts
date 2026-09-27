import type { GameEvent } from '@otmetki/schemas';

export type EventsIcsInput = {
  events: readonly GameEvent[];
  calName: string;
};
