import type { NotificationEvent } from '@bronevik/schemas';

export type InboxEventIconProps = {
  event: NotificationEvent;
  size?: 'md' | 'sm';
  className?: string;
};
