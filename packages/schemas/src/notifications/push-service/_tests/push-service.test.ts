import { describe, expect, it } from 'vitest';

import { pushSubscriptionSchema } from '../../notifications.schemas';
import { isPushServiceUrl } from '../push-service';

const KEYS = { p256dh: 'p', auth: 'a' };

describe('isPushServiceUrl', () => {
  it.each([
    'https://fcm.googleapis.com/fcm/send/abc',
    'https://updates.push.services.mozilla.com/wpush/v2/abc',
    'https://web.push.apple.com/QGx',
    'https://wns2-par02p.notify.windows.com/w/?token=abc'
  ])('accepts the browser push service %s', (url) => {
    expect(isPushServiceUrl(url)).toBe(true);
  });

  it.each([
    'https://10.0.0.5:8443/push',
    'https://localhost/push',
    'https://fcm.googleapis.com.evil.example/push',
    'https://evilnotify.windows.com/push',
    'http://fcm.googleapis.com/fcm/send/abc',
    'https://fcm.googleapis.com:8443/fcm/send/abc',
    'https://user:pass@fcm.googleapis.com/fcm/send/abc',
    'not a url'
  ])('rejects %s', (url) => {
    expect(isPushServiceUrl(url)).toBe(false);
  });
});

describe('pushSubscriptionSchema', () => {
  it('refuses a subscription whose endpoint is not a known push service', () => {
    expect(pushSubscriptionSchema.safeParse({ endpoint: 'https://internal.example/hook', keys: KEYS }).success).toBe(false);
  });

  it('accepts a subscription from a browser push service', () => {
    expect(pushSubscriptionSchema.safeParse({ endpoint: 'https://fcm.googleapis.com/fcm/send/abc', keys: KEYS }).success).toBe(true);
  });
});
