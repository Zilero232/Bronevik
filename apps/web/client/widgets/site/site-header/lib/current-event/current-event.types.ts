import type { GameEvent } from '@otmetki/schemas';

export type CurrentEventInput = {
  events: readonly GameEvent[];
  now: Date;
};
