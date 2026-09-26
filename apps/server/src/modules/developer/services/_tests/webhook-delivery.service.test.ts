import { WEBHOOK } from '@otmetki/schemas';
import { Webhook } from 'standardwebhooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { WebhookDelivery, WebhookEndpoint } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { WEBHOOK_DELIVERY } from '../../config';
import { generateWebhookSecret } from '../../lib';
import { WebhookDeliveryService } from '../webhook-delivery.service';

const post = vi.hoisted(() => vi.fn<(url: string, options: { headers: Record<string, string> }) => Promise<Response>>());
const lookup = vi.hoisted(() => vi.fn<(host: string) => Promise<{ address: string; family: number }[]>>());

vi.mock('../../../../lib/http', () => ({ http: { post } }));
vi.mock('node:dns/promises', () => ({ lookup }));

const PUBLIC_ADDRESS = [{ address: '93.184.216.34', family: 4 }];

const endpoint: WebhookEndpoint = {
  id: 'endpoint',
  userId: 'user',
  url: 'https://hooks.example.com/otmetki',
  secret: generateWebhookSecret(),
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
    lookup.mockReset();
    lookup.mockResolvedValue(PUBLIC_ADDRESS);
  });

  it('signs the body and records the success', async () => {
    const { service, prisma } = createService();

    post.mockResolvedValue(new Response('ok', { status: 200 }));

    await expect(service.deliver({ deliveryId: 'delivery', attempt: 1, isFinal: false })).resolves.toBe('delivered');

    const [, options] = post.mock.calls[0] ?? [];

    expect(options?.headers).toMatchObject({ [WEBHOOK.eventHeader]: 'mark.gained' });
    expect(new Webhook(endpoint.secret).verify(JSON.stringify(delivery.payload), options?.headers ?? {})).toEqual(delivery.payload);
    expect(prisma.webhookDelivery.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: 'succeeded' }) }));
  });

  it('refuses to post when the host now resolves to a private address', async () => {
    const { service, prisma } = createService();

    lookup.mockResolvedValue([{ address: '10.0.0.5', family: 4 }]);

    await expect(service.deliver({ deliveryId: 'delivery', attempt: 1, isFinal: false })).rejects.toThrow(WEBHOOK_DELIVERY.blockedResponse);
    expect(post).not.toHaveBeenCalled();

    expect(prisma.webhookDelivery.update.mock.calls[0]?.[0].data).toMatchObject({
      status: 'pending',
      responseBody: WEBHOOK_DELIVERY.blockedResponse
    });
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
