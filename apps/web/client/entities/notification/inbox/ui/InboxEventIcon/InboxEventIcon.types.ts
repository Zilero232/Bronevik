import type { NotificationEvent } from '@otmetki/schemas';

export type InboxEventIconProps = {
  event: NotificationEvent;
  size?: 'md' | 'sm';
  className?: string;
};
