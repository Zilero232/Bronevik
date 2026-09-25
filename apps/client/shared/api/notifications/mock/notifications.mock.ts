import type { InboxItem, InboxPage, MarkReadInput, MarkReadResult, NotificationEvent, PushKey } from '@bronevik/schemas';

import { INBOX } from '@bronevik/schemas';
import { subMinutes } from 'date-fns';

import { seededRandom } from '@/shared/lib';
import { mockUuid } from '@/shared/mocks';

import type { InboxPageInput } from '../notifications.types';

import { NOTIFICATIONS_MOCK } from './notifications.mock.constants';

const random = seededRandom(1_917);

const items: InboxItem[] = NOTIFICATIONS_MOCK.items.map(({ event, title, body, url, minutesAgo, isRead }) => ({
  id: mockUuid(random),
  event: event satisfies NotificationEvent,
  title,
  body,
  url,
  createdAt: subMinutes(new Date(), minutesAgo).toISOString(),
  readAt: isRead ? subMinutes(new Date(), minutesAgo - 1).toISOString() : null
}));

const unread = () => items.filter(({ readAt }) => readAt === null).length;

export const mockNotifications = {
  inbox: ({ limit = INBOX.defaultLimit, before }: InboxPageInput): InboxPage => {
    const older = before ? items.filter(({ createdAt }) => createdAt < before) : items;

    return { items: older.slice(0, limit), unread: unread() };
  },
  markRead: ({ ids }: MarkReadInput): MarkReadResult => {
    const targets = items.filter(({ id, readAt }) => readAt === null && (!ids || ids.includes(id)));
    const readAt = new Date().toISOString();

    targets.forEach((item) => {
      item.readAt = readAt;
    });

    return { updated: targets.length };
  },
  pushKey: (): PushKey => ({ publicKey: NOTIFICATIONS_MOCK.vapidKey })
};
