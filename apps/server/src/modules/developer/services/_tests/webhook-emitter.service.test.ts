import type { Queue } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { WebhookEndpoint } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { JOB } from '../../../collector';
import { WEBHOOK_DELIVERY } from '../../config';
import { WebhookEmitterService } from '../webhook-emitter.service';

const endpoint = ({ id, filter }: Pick<WebhookEndpoint, 'filter' | 'id'>): WebhookEndpoint => ({
  id,
  userId: 'user',
  url: 'https://hooks.example.com/bronevik',
  secret: 'whsec',
  events: ['moeGained', 'sessionFinished'],
  filter,
  isActive: true,
  failureCount: 0,
  disabledAt: null,
  createdAt: new Date(),
  updatedAt: new Date()
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const queue = mock<Queue>();

  prisma.webhookEndpoint.findMany.mockResolvedValue([
    endpoint({ id: 'follows-player', filter: { accountIds: [1] } }),
    endpoint({ id: 'follows-clan', filter: { clanIds: [10] } }),
    endpoint({ id: 'follows-nobody-here', filter: { accountIds: [2] } })
  ]);

  return { service: new WebhookEmitterService(prisma, queue), prisma, queue };
};

describe('WebhookEmitterService.emit', () => {
  it('delivers only to the endpoints that follow the player or the clan', async () => {
    const { service, prisma } = createService();

    const sent = await service.emit({ event: 'mark.gained', subject: { accountIds: [1], clanIds: [10] }, data: { tankId: 1 } });

    expect(sent).toBe(2);
    expect(prisma.webhookDelivery.create.mock.calls.map(([{ data }]) => data.endpointId)).toEqual(['follows-player', 'follows-clan']);
  });

  it('queues each delivery with retries, keyed by its id', async () => {
    const { service, queue } = createService();

    await service.emit({ event: 'session.ended', subject: { accountIds: [1], clanIds: [] }, data: {} });

    const [name, payload, options] = queue.add.mock.calls[0] ?? [];

    expect(name).toBe(JOB.developerWebhooks.deliver);
    expect(options).toMatchObject({ jobId: payload?.deliveryId, attempts: WEBHOOK_DELIVERY.maxAttempts });
  });

  it('never throws into the code path that emitted the event', async () => {
    const { service, prisma } = createService();

    prisma.webhookEndpoint.findMany.mockRejectedValue(new Error('down'));

    await expect(service.emit({ event: 'mark.gained', subject: { accountIds: [1], clanIds: [] }, data: {} })).resolves.toBe(0);
  });
});
