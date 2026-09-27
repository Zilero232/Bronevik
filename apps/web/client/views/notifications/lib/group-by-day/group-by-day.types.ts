import type { InboxItem } from '@otmetki/schemas';

export type InboxDay = {
  key: string;
  date: Date;
  items: InboxItem[];
  unread: number;
};
