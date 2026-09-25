import type { PushSubscriptionInput } from '@bronevik/schemas';

import { pushSubscriptionSchema } from '@bronevik/schemas';

import { isBrowser } from '@/shared/lib';

import type { PushBrowserState } from './push-browser.types';

import { urlBase64ToUint8Array } from '../../lib/url-base64';
import { PUSH_BROWSER } from './push-browser.constants';

const isPushSupported = () => isBrowser() && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

const activeRegistration = () =>
  Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('The service worker is not active')), PUSH_BROWSER.readyTimeoutMs);
    })
  ]);

export const currentPushSubscription = async () => {
  const registration = await navigator.serviceWorker.getRegistration();

  return (await registration?.pushManager.getSubscription()) ?? null;
};

export const inspectPushBrowser = async (): Promise<PushBrowserState> => {
  if (!isPushSupported()) {
    return { isReady: true, isSupported: false, permission: 'default', isSubscribed: false };
  }

  const subscription = await currentPushSubscription();

  return { isReady: true, isSupported: true, permission: Notification.permission, isSubscribed: subscription !== null };
};

export const subscribeBrowserPush = async (publicKey: string): Promise<PushSubscriptionInput> => {
  const registration = await activeRegistration();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  return pushSubscriptionSchema.parse(subscription.toJSON());
};
