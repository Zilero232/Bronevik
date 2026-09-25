import type { InboxPage, MarkReadInput, MarkReadResult, PushKey, PushSubscriptionInput, PushUnsubscribeInput } from '@bronevik/schemas';

import { inboxPageSchema, markReadResultSchema, pushKeySchema } from '@bronevik/schemas';

import type { InboxPageInput } from './notifications.types';

import { api } from '../http';
import { fromSource } from '../source';
import { mockNotifications } from './mock/notifications.mock';
import { NOTIFICATIONS_PATHS } from './notifications.constants';

const WITH_SESSION = { withCredentials: true } as const;

export const getInbox = ({ limit, before, signal }: InboxPageInput = {}): Promise<InboxPage> =>
  fromSource({
    signal,
    mock: () => inboxPageSchema.parse(mockNotifications.inbox({ limit, before })),
    fetch: async () => inboxPageSchema.parse((await api.get(NOTIFICATIONS_PATHS.inbox, { ...WITH_SESSION, params: { limit, before }, signal })).data)
  });

export const markInboxRead = (input: MarkReadInput = {}): Promise<MarkReadResult> =>
  fromSource({
    mock: () => markReadResultSchema.parse(mockNotifications.markRead(input)),
    fetch: async () => markReadResultSchema.parse((await api.post(NOTIFICATIONS_PATHS.read, input, WITH_SESSION)).data)
  });

export const getPushKey = (): Promise<PushKey> =>
  fromSource({
    mock: () => pushKeySchema.parse(mockNotifications.pushKey()),
    fetch: async () => pushKeySchema.parse((await api.get(NOTIFICATIONS_PATHS.pushKey)).data)
  });

export const subscribePush = (input: PushSubscriptionInput): Promise<void> =>
  fromSource({
    mock: () => undefined,
    fetch: async () => {
      await api.post(NOTIFICATIONS_PATHS.push, input, WITH_SESSION);
    }
  });

export const unsubscribePush = (input: PushUnsubscribeInput): Promise<void> =>
  fromSource({
    mock: () => undefined,
    fetch: async () => {
      await api.delete(NOTIFICATIONS_PATHS.push, { ...WITH_SESSION, data: input });
    }
  });
