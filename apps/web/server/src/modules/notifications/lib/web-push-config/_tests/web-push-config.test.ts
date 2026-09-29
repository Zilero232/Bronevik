import { describe, expect, it } from 'vitest';

import type { WebPushEnv } from '../web-push-config.types';

import { vapidDetails } from '../web-push-config';

const CONFIGURED: WebPushEnv = { VAPID_PUBLIC_KEY: 'BPublic', VAPID_PRIVATE_KEY: 'private', VAPID_SUBJECT: 'mailto:ops@example.com' };

describe('vapidDetails', () => {
  it('returns the VAPID details when every key is set', () => {
    expect(vapidDetails(CONFIGURED)).toEqual({ subject: 'mailto:ops@example.com', publicKey: 'BPublic', privateKey: 'private' });
  });

  it.each(Object.keys(CONFIGURED))('is null while %s is empty', (key) => {
    expect(vapidDetails({ ...CONFIGURED, [key]: '' })).toBeNull();
  });
});
