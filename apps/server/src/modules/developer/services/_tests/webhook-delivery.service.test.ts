import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { WebhookDelivery, WebhookEndpoint } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { WEBHOOK_DELIVERY } from '../../config';
import { WebhookDeliveryService } from '../webhook-delivery.service';

const post = vi.hoisted(() => vi.fn<(url: string, options: { headers: Record<string, string> }) => Promise<Response>>());

vi.mock('../../../../lib/http', () => ({ http: { post } }));

const endpoint: WebhookEndpoint = {
  id: 'endpoint',
  userId: 'user',
  url: 'https://hooks.example.com/bronevik',
  secret: 'whsec',
  events: ['moeGained'],
  filter: { accountIds: [1] },
  isActive: true,
  failureCount: 0,
  disabledAt: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

const delivery: WebhookDelivery & { endpoint: WebhookEndpoint } = {
  id: 'delivery',
  endpointId: endpoint.id,
  event: 'moeGained',
  payload: { id: 'delivery', event: 'mark.gained' },
  status: 'pending',
  attempt: 0,
  responseStatus: null,
  responseBody: null,
  nextAttemptAt: null,
  deliveredAt: null,
  createdAt: new Date(),
  endpoint
};

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.webhookDelivery.findUnique.mockResolvedValue(delivery);

  return { service: new WebhookDeliveryService(prisma), prisma };
};

describe('WebhookDeliveryService.deliver', () => {
  beforeEach(() => {
    post.mockReset();
  });

  it('signs the body and records the success', async () => {
    const { service, prisma } = createService();

    post.mockResolvedValue(new Response('ok', { status: 200 }));

    await expect(service.deliver({ deliveryId: 'delivery', attempt: 1, isFinal: false })).resolves.toBe('delivered');

    const [, options] = post.mock.calls[0] ?? [];

    expect(options?.headers).toMatchObject({ 'X-Bronevik-Event': 'mark.gained' });
    expect(prisma.webhookDelivery.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: 'succeeded' }) }));
  });

  it('skips a delivery to a switched-off endpoint', async () => {
    const { service, prisma } = createService();

    const disabled: WebhookDelivery & { endpoint: WebhookEndpoint } = { ...delivery, endpoint: { ...endpoint, isActive: false } };

    prisma.webhookDelivery.findUnique.mockResolvedValue(disabled);

    await expect(service.deliver({ deliveryId: 'delivery', attempt: 1, isFinal: false })).resolves.toBe('skipped');
    expect(post).not.toHaveBeenCalled();
  });

  it('keeps a failed attempt pending and rethrows so the queue retries it', async () => {
    const { service, prisma } = createService();

    post.mockRejectedValue(new Error('timeout'));

    await expect(service.deliver({ deliveryId: 'delivery', attempt: 1, isFinal: false })).rejects.toThrow('timeout');
    expect(prisma.webhookDelivery.update.mock.calls[0]?.[0].data).toMatchObject({ status: 'pending', attempt: 1 });
    expect(prisma.webhookEndpoint.update).not.toHaveBeenCalled();
  });

  it('switches the endpoint off after too many failed deliveries', async () => {
    const { service, prisma } = createService();

    post.mockRejectedValue(new Error('timeout'));
    prisma.webhookEndpoint.update.mockResolvedValue({ ...endpoint, failureCount: WEBHOOK_DELIVERY.disableAfterFailures });

    await expect(service.deliver({ deliveryId: 'delivery', attempt: WEBHOOK_DELIVERY.maxAttempts, isFinal: true })).rejects.toThrow();
    expect(prisma.webhookDelivery.update.mock.calls[0]?.[0].data).toMatchObject({ status: 'failed' });
    expect(prisma.webhookEndpoint.update).toHaveBeenLastCalledWith(expect.objectContaining({ data: expect.objectContaining({ isActive: false }) }));
  });
});
