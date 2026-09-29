import type { VapidDetails, WebPushEnv } from './web-push-config.types';

export const vapidDetails = (env: WebPushEnv): VapidDetails | null =>
  env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY && env.VAPID_SUBJECT
    ? { subject: env.VAPID_SUBJECT, publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY }
    : null;
