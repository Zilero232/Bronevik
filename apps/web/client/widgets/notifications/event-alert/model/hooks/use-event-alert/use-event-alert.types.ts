import type { NotificationEvent } from '@otmetki/schemas';

export type UseEventAlertInput = {
  event: NotificationEvent;
  messages: { enabled: string; disabled: string; failed: string };
};
