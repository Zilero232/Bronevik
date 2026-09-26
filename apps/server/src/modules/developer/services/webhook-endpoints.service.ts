import type { CreatedWebhookEndpoint, WebhookDelivery, WebhookEndpoint } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';

import type { CreateEndpointInput, OwnedKeyInput, UpdateEndpointInput } from '../developer.types';

import { AppBadRequestException, AppConflictException, AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { API_PLANS, WEBHOOK_DELIVERY, WEBHOOK_EVENT_TO_DB } from '../config';
import { generateWebhookSecret, resolvesPublicly, toWebhookDelivery, toWebhookEndpoint } from '../lib';
import { DeveloperPlanService } from './developer-plan.service';

@Injectable()
export class WebhookEndpointsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly plans: DeveloperPlanService
  ) {}

  async list(userId: string): Promise<WebhookEndpoint[]> {
    const rows = await this.prisma.webhookEndpoint.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

    return rows.map(toWebhookEndpoint);
  }

  async create({ userId, url, events, filter }: CreateEndpointInput): Promise<CreatedWebhookEndpoint> {
    await this.assertPublic(url);

    const [plan, existing] = await Promise.all([this.plans.planFor(userId), this.prisma.webhookEndpoint.count({ where: { userId } })]);
    const limit = API_PLANS[plan].webhooks;

    if (existing >= limit) {
      throw new AppConflictException('PLAN_LIMIT_REACHED', `The ${plan} plan allows ${limit} webhook endpoint(s)`);
    }

    const secret = generateWebhookSecret();

    const row = await this.prisma.webhookEndpoint.create({
      data: { userId, url, secret, events: events.map((event) => WEBHOOK_EVENT_TO_DB[event]), filter }
    });

    return { endpoint: toWebhookEndpoint(row), secret };
  }

  async update({ userId, id, url, events, filter, isActive }: UpdateEndpointInput): Promise<WebhookEndpoint> {
    await this.owned({ userId, id });

    if (url !== undefined) {
      await this.assertPublic(url);
    }

    const row = await this.prisma.webhookEndpoint.update({
      where: { id },
      data: {
        ...(url === undefined ? {} : { url }),
        ...(events === undefined ? {} : { events: events.map((event) => WEBHOOK_EVENT_TO_DB[event]) }),
        ...(filter === undefined ? {} : { filter }),
        ...(isActive === undefined ? {} : { isActive, ...(isActive ? { failureCount: 0, disabledAt: null } : {}) })
      }
    });

    return toWebhookEndpoint(row);
  }

  async remove({ userId, id }: OwnedKeyInput): Promise<void> {
    await this.owned({ userId, id });
    await this.prisma.webhookEndpoint.delete({ where: { id } });
  }

  async deliveries({ userId, id }: OwnedKeyInput): Promise<WebhookDelivery[]> {
    await this.owned({ userId, id });

    const rows = await this.prisma.webhookDelivery.findMany({
      where: { endpointId: id },
      orderBy: { createdAt: 'desc' },
      take: WEBHOOK_DELIVERY.deliveriesShown
    });

    return rows.flatMap(toWebhookDelivery);
  }

  private async assertPublic(url: string): Promise<void> {
    if (!(await resolvesPublicly({ url }))) {
      throw new AppBadRequestException('VALIDATION_FAILED', 'A webhook must point to a public https address');
    }
  }

  private async owned({ userId, id }: OwnedKeyInput) {
    const row = await this.prisma.webhookEndpoint.findFirst({ where: { id, userId }, select: { id: true } });

    if (!row) {
      throw new AppNotFoundException('NOT_FOUND', 'Webhook endpoint not found');
    }

    return row;
  }
}
