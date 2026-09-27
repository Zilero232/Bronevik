import type { NotificationEvent } from '@otmetki/schemas';

export type ToggleEventInput = {
  events: readonly NotificationEvent[];
  event: NotificationEvent;
  isOn: boolean;
};

export type EventGroupInput = {
  events: readonly NotificationEvent[];
  group: readonly NotificationEvent[];
};

export type MergeGroupInput = EventGroupInput & {
  next: readonly NotificationEvent[];
};
