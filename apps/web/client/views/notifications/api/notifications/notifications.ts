import type { PushKey, PushSubscriptionInput, PushUnsubscribeInput } from '@otmetki/schemas';

import { notificationsControllerPushKey, notificationsControllerSubscribe, notificationsControllerUnsubscribe } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getPushKey = (): Promise<PushKey> => fromSdk(() => notificationsControllerPushKey());

export const subscribePush = async (input: PushSubscriptionInput): Promise<void> => {
  await fromSdk(() => notificationsControllerSubscribe({ ...SESSION_REQUEST, body: input, headers: { 'user-agent': navigator.userAgent } }));
};

export const unsubscribePush = async (input: PushUnsubscribeInput): Promise<void> => {
  await fromSdk(() => notificationsControllerUnsubscribe({ ...SESSION_REQUEST, body: input }));
};
