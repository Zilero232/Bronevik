import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';

import { PushSubscriptionsService } from '../push-subscriptions.service';

const createService = (publicKey = '') => {
  const prisma = mockDeep<PrismaService>();
  const config = mock<AppConfigService>();

  config.get.mockReturnValue(publicKey);

  return { service: new PushSubscriptionsService(prisma, config), prisma };
};

describe('PushSubscriptionsService', () => {
  it('exposes a null public key when web push is not configured', () => {
    expect(createService('').service.publicKey()).toEqual({ publicKey: null });
    expect(createService('BPublic').service.publicKey()).toEqual({ publicKey: 'BPublic' });
  });

  it('moves an endpoint to the user that subscribed last', async () => {
    const { service, prisma } = createService();

    await service.subscribe({ userId: 'b', endpoint: 'https://push.example/1', keys: { p256dh: 'k', auth: 'a' }, userAgent: null });

    expect(prisma.pushSubscription.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { endpoint: 'https://push.example/1' }, update: expect.objectContaining({ userId: 'b' }) })
    );
  });

  it('only removes the endpoint of the requesting user', async () => {
    const { service, prisma } = createService();

    await service.unsubscribe({ userId: 'a', endpoint: 'https://push.example/1' });

    expect(prisma.pushSubscription.deleteMany).toHaveBeenCalledWith({ where: { userId: 'a', endpoint: 'https://push.example/1' } });
  });
});
