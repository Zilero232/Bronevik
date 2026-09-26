import type { NotificationEvent } from '@otmetki/schemas';

import type { ToggleEventInput } from './event-toggle.types';

export const toggleEvent = ({ events, event, isOn }: ToggleEventInput): NotificationEvent[] => {
  const others = events.filter((item) => item !== event);

  return isOn ? [...others, event] : others;
};
