import { inboxPageSchema, markReadResultSchema, pushKeySchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { mockNotifications } from '../mock/notifications.mock';

describe('mockNotifications', () => {
  it('serves an inbox page and a push key that match the shared contract', () => {
    expect(() => inboxPageSchema.parse(mockNotifications.inbox({}))).not.toThrow();
    expect(() => pushKeySchema.parse(mockNotifications.pushKey())).not.toThrow();
  });

  it('pages strictly older items with the before cursor', () => {
    const first = mockNotifications.inbox({ limit: 3 });
    const cursor = first.items.at(-1)?.createdAt;
    const next = mockNotifications.inbox({ limit: 3, before: cursor });

    expect(first.items).toHaveLength(3);
    expect(next.items.every(({ createdAt }) => cursor !== undefined && createdAt < cursor)).toBe(true);
  });

  it('marks the given items read and lowers the unread count by the same amount', () => {
    const { items, unread } = mockNotifications.inbox({});
    const target = items.find(({ readAt }) => readAt === null);
    const result = markReadResultSchema.parse(mockNotifications.markRead({ ids: target ? [target.id] : undefined }));

    expect(mockNotifications.inbox({}).unread).toBe(unread - result.updated);
  });
});
