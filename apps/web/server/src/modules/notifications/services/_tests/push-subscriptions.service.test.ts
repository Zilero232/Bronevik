import { ConfigService } from '@nestjs/config';
import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { Env } from '../../../../config/env';
import type { PrismaService } from '../../../../core';
import type { WebPushEnv } from '../../lib';

import { AppConfigService } from '../../../../config';
import { PushSubscriptionsService } from '../push-subscriptions.service';

const CONFIGURED: WebPushEnv = { VAPID_PUBLIC_KEY: 'BPublic', VAPID_PRIVATE_KEY: 'private', VAPID_SUBJECT: 'mailto:ops@example.com' };
const UNCONFIGURED: WebPushEnv = { VAPID_PUBLIC_KEY: '', VAPID_PRIVATE_KEY: '', VAPID_SUBJECT: '' };
const SUBSCRIPTION = { userId: 'b', endpoint: 'https://push.example/1', keys: { p256dh: 'k', auth: 'a' }, userAgent: null };

const createService = (env: WebPushEnv = CONFIGURED) => {
  const prisma = mockDeep<PrismaService>();
  const config = new AppConfigService(new ConfigService<Env, true>(env));

  return { service: new PushSubscriptionsService(prisma, config), prisma };
};

describe('PushSubscriptionsService', () => {
  it('exposes a null public key when web push is not configured', () => {
    expect(createService(UNCONFIGURED).service.publicKey()).toEqual({ publicKey: null });
    expect(createService().service.publicKey()).toEqual({ publicKey: CONFIGURED.VAPID_PUBLIC_KEY });
  });

  it('hides the public key while the private key is missing, since nothing could be sent', () => {
    expect(createService({ ...CONFIGURED, VAPID_PRIVATE_KEY: '' }).service.publicKey()).toEqual({ publicKey: null });
  });

  it('refuses a subscription with an integration-unavailable error when web push is not configured', async () => {
    const { service, prisma } = createService(UNCONFIGURED);

    await expect(service.subscribe(SUBSCRIPTION)).rejects.toMatchObject({
      status: 404,
      response: { code: 'INTEGRATION_UNAVAILABLE' }
    });

    expect(prisma.pushSubscription.upsert).not.toHaveBeenCalled();
  });

  it('moves an endpoint to the user that subscribed last', async () => {
    const { service, prisma } = createService();

    await service.subscribe(SUBSCRIPTION);

    expect(prisma.pushSubscription.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { endpoint: 'https://push.example/1' }, update: expect.objectContaining({ userId: 'b' }) })
    );
  });

  it('only removes the endpoint of the requesting user', async () => {
    const { service, prisma } = createService();

    await service.unsubscribe({ userId: 'a', endpoint: 'https://push.example/1' });

    expect(prisma.pushSubscription.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'a', endpoint: 'https://push.example/1' } })
    );
  });
});
