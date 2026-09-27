import type { NotificationEvent } from '@otmetki/schemas';

import type { EventGroupInput, MergeGroupInput, ToggleEventInput } from './event-selection.types';

export const toggleEvent = ({ events, event, isOn }: ToggleEventInput): NotificationEvent[] => {
  const others = events.filter((item) => item !== event);

  return isOn ? [...others, event] : others;
};

export const groupValue = ({ events, group }: EventGroupInput): NotificationEvent[] => events.filter((event) => group.includes(event));

export const mergeGroup = ({ events, group, next }: MergeGroupInput): NotificationEvent[] => [
  ...events.filter((event) => !group.includes(event)),
  ...next
];
