import type { GameEvent } from '@otmetki/schemas';

import type { CurrentEventInput } from './current-event.types';

const endsAtMs = (event: GameEvent): number => (event.endsAt ? Date.parse(event.endsAt) : Number.POSITIVE_INFINITY);

export const currentEvent = ({ events, now }: CurrentEventInput): GameEvent | null => {
  const at = now.getTime();

  return (
    events
      .filter((event) => Date.parse(event.startsAt) <= at && endsAtMs(event) > at)
      .sort((left, right) => endsAtMs(left) - endsAtMs(right))
      .at(0) ?? null
  );
};
