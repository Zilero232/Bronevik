import type { NotificationEvent } from '@otmetki/schemas';

export type ToggleEventInput = {
  events: readonly NotificationEvent[];
  event: NotificationEvent;
  isOn: boolean;
};
