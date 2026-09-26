import type { InboxPage, MarkReadInput, MarkReadResult, PushKey, PushSubscriptionInput, PushUnsubscribeInput } from '@otmetki/schemas';

import type { InboxPageInput } from './notifications.types';

import {
  notificationsControllerList,
  notificationsControllerMarkRead,
  notificationsControllerPushKey,
  notificationsControllerSubscribe,
  notificationsControllerUnsubscribe
} from '../generated';
import { SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

export const getInbox = ({ limit, before, signal }: InboxPageInput = {}): Promise<InboxPage> =>
  fromSdk(() => notificationsControllerList({ ...SESSION_REQUEST, query: { limit, before }, signal }));

export const markInboxRead = (input: MarkReadInput = {}): Promise<MarkReadResult> =>
  fromSdk(() => notificationsControllerMarkRead({ ...SESSION_REQUEST, body: input }));

export const getPushKey = (): Promise<PushKey> => fromSdk(() => notificationsControllerPushKey());

export const subscribePush = async (input: PushSubscriptionInput): Promise<void> => {
  await fromSdk(() => notificationsControllerSubscribe({ ...SESSION_REQUEST, body: input, headers: { 'user-agent': navigator.userAgent } }));
};

export const unsubscribePush = async (input: PushUnsubscribeInput): Promise<void> => {
  await fromSdk(() => notificationsControllerUnsubscribe({ ...SESSION_REQUEST, body: input }));
};
