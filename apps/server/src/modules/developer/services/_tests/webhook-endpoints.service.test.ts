import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { WebhookEndpoint } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { API_PLANS, WEBHOOK_EVENT_TO_DB } from '../../config';
import { DeveloperPlanService } from '../developer-plan.service';
import { WebhookEndpointsService } from '../webhook-endpoints.service';

const endpoint = (overrides: Partial<WebhookEndpoint> = {}): WebhookEndpoint => ({
  id: '00000000-0000-4000-8000-000000000001',
  userId: 'user',
  url: 'https://hooks.example.com/bronevik',
  secret: 'whsec',
  events: ['moeGained'],
  filter: { accountIds: [1] },
  isActive: true,
  failureCount: 0,
  disabledAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const plans = mock<DeveloperPlanService>();

  plans.planFor.mockResolvedValue('free');

  return { service: new WebhookEndpointsService(prisma, plans), prisma };
};

const input = { userId: 'user', url: 'https://hooks.example.com/bronevik', events: ['mark.gained' as const], filter: { accountIds: [1] } };

describe('WebhookEndpointsService.create', () => {
  it('stores the events under their database names and returns the secret once', async () => {
    const { service, prisma } = createService();

    prisma.webhookEndpoint.count.mockResolvedValue(0);
    prisma.webhookEndpoint.create.mockResolvedValue(endpoint());

    const created = await service.create(input);

    expect(prisma.webhookEndpoint.create.mock.calls[0]?.[0].data.events).toEqual([WEBHOOK_EVENT_TO_DB['mark.gained']]);
    expect(created.secret).toBe(prisma.webhookEndpoint.create.mock.calls[0]?.[0].data.secret);
    expect(created.endpoint.events).toEqual(['mark.gained']);
  });

  it('refuses an endpoint over the plan limit', async () => {
    const { service, prisma } = createService();

    prisma.webhookEndpoint.count.mockResolvedValue(API_PLANS.free.webhooks);

    await expect(service.create(input)).rejects.toMatchObject({ response: { code: 'PLAN_LIMIT_REACHED' } });
  });

  it('refuses an address inside a private network', async () => {
    const { service, prisma } = createService();

    await expect(service.create({ ...input, url: 'https://192.168.1.1/hook' })).rejects.toMatchObject({ response: { code: 'VALIDATION_FAILED' } });
    expect(prisma.webhookEndpoint.create).not.toHaveBeenCalled();
  });
});

describe('WebhookEndpointsService.update', () => {
  it('clears the failure streak when an endpoint is switched back on', async () => {
    const { service, prisma } = createService();

    prisma.webhookEndpoint.findFirst.mockResolvedValue(endpoint());
    prisma.webhookEndpoint.update.mockResolvedValue(endpoint());

    await service.update({ userId: 'user', id: 'id', isActive: true });

    expect(prisma.webhookEndpoint.update.mock.calls[0]?.[0].data).toMatchObject({ isActive: true, failureCount: 0, disabledAt: null });
  });

  it('answers 404 for somebody else’s endpoint', async () => {
    const { service, prisma } = createService();

    prisma.webhookEndpoint.findFirst.mockResolvedValue(null);

    await expect(service.update({ userId: 'user', id: 'id', isActive: false })).rejects.toMatchObject({ response: { code: 'NOT_FOUND' } });
  });
});
