import type { InboxItem } from '@bronevik/schemas';

export type InboxDay = {
  key: string;
  date: Date;
  items: InboxItem[];
  unread: number;
};
