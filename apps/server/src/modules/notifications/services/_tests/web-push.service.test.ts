import { describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PushSubscription } from '../../../../../generated';
import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';

import { WEB_PUSH } from '../../config';

const { sendNotification, lookup } = vi.hoisted(() => ({
  sendNotification: vi.fn(),
  lookup: vi.fn<(host: string) => Promise<{ address: string; family: number }[]>>()
}));

vi.mock('web-push', async (importOriginal) => ({ ...(await importOriginal<typeof import('web-push')>()), sendNotification }));

vi.mock('node:dns/promises', async (importOriginal) => ({ ...(await importOriginal<typeof import('node:dns/promises')>()), lookup }));

vi.resetModules();

const { WebPushError } = await import('web-push');
const { WebPushService } = await import('../web-push.service');

const subscription = (id: string): PushSubscription =>
  mock<PushSubscription>({ id, endpoint: `https://fcm.googleapis.com/fcm/send/${id}`, p256dh: 'key', auth: 'auth' });

const gone = (statusCode: number) => new WebPushError('gone', statusCode, {}, '', 'https://push.example');

const createService = ({ enabled = true, subscriptions = [subscription('a'), subscription('b')] } = {}) => {
  const prisma = mockDeep<PrismaService>();
  const config = mock<AppConfigService>();

  config.get.mockReturnValue(enabled ? 'configured' : '');
  prisma.pushSubscription.findMany.mockResolvedValue(subscriptions);
  sendNotification.mockReset();
  lookup.mockReset();
  lookup.mockResolvedValue([{ address: '142.250.74.10', family: 4 }]);
  sendNotification.mockResolvedValue({ statusCode: 201, body: '', headers: {} });

  return { service: new WebPushService(prisma, config), prisma };
};

const INPUT = { userId: 'user', title: 'Title', body: 'Body', url: '/me' };

describe('WebPushService.sendToUser', () => {
  it('does nothing without VAPID keys', async () => {
    const { service, prisma } = createService({ enabled: false });

    await service.sendToUser(INPUT);

    expect(service.isEnabled).toBe(false);
    expect(prisma.pushSubscription.findMany).not.toHaveBeenCalled();
    expect(sendNotification).not.toHaveBeenCalled();
  });

  it('sends the payload to every subscription of the user', async () => {
    const { service, prisma } = createService();

    await service.sendToUser(INPUT);

    expect(sendNotification).toHaveBeenCalledTimes(2);
    expect(JSON.parse(String(sendNotification.mock.calls[0]?.[1]))).toEqual({ title: 'Title', body: 'Body', url: '/me' });
    expect(prisma.pushSubscription.deleteMany).not.toHaveBeenCalled();
  });

  it('never posts to an endpoint outside the known push services', async () => {
    const { service } = createService({
      subscriptions: [mock<PushSubscription>({ id: 'x', endpoint: 'https://10.0.0.5:8443/push', p256dh: 'k', auth: 'a' })]
    });

    await service.sendToUser(INPUT);

    expect(sendNotification).not.toHaveBeenCalled();
  });

  it('never posts to a push host that resolves to a private address', async () => {
    const { service } = createService();

    lookup.mockResolvedValue([{ address: '10.0.0.5', family: 4 }]);

    await service.sendToUser(INPUT);

    expect(sendNotification).not.toHaveBeenCalled();
  });

  it.each(WEB_PUSH.goneStatuses)('removes a subscription the push service reports as %i', async (status) => {
    const { service, prisma } = createService();

    sendNotification.mockRejectedValueOnce(gone(status));

    await service.sendToUser(INPUT);

    expect(prisma.pushSubscription.deleteMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: { in: ['a'] } } }));
  });

  it('keeps a subscription after a transient push error', async () => {
    const { service, prisma } = createService();

    sendNotification.mockRejectedValueOnce(gone(500));

    await expect(service.sendToUser(INPUT)).resolves.toBeUndefined();
    expect(prisma.pushSubscription.deleteMany).not.toHaveBeenCalled();
  });

  it('fails so the job retries when every live subscription failed', async () => {
    const { service } = createService();

    sendNotification.mockRejectedValue(new Error('network'));

    await expect(service.sendToUser(INPUT)).rejects.toThrow(/every subscription/);
  });

  it('does not fail when the only failures were expired subscriptions', async () => {
    const { service, prisma } = createService();

    sendNotification.mockRejectedValue(gone(410));

    await expect(service.sendToUser(INPUT)).resolves.toBeUndefined();
    expect(prisma.pushSubscription.deleteMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: { in: ['a', 'b'] } } }));
  });

  it('succeeds for a user without subscriptions', async () => {
    const { service } = createService({ subscriptions: [] });

    await expect(service.sendToUser(INPUT)).resolves.toBeUndefined();
  });
});
