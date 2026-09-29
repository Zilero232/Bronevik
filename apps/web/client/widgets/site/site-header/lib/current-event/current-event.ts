import type { GameEvent } from '@otmetki/schemas';

import { firstBy } from 'remeda';

import type { CurrentEventInput } from './current-event.types';

const endsAtMs = (event: GameEvent): number => (event.endsAt ? Date.parse(event.endsAt) : Number.POSITIVE_INFINITY);

export const currentEvent = ({ events, now }: CurrentEventInput): GameEvent | null => {
  const at = now.getTime();

  return (
    firstBy(
      events.filter((event) => Date.parse(event.startsAt) <= at && endsAtMs(event) > at),
      endsAtMs
    ) ?? null
  );
};
