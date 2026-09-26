import { Injectable, Logger } from '@nestjs/common';
import { addMilliseconds } from 'date-fns';
import { HTTPError } from 'ky';

import type { DeliverInput, FailDeliveryInput } from '../developer.types';

import { errorMessage } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { http } from '../../../lib/http';
import { WEBHOOK_DELIVERY } from '../config';
import { errorBody, resolvesPublicly, webhookEventFromDb, webhookHeaders } from '../lib';

@Injectable()
export class WebhookDeliveryService {
  private readonly logger = new Logger(WebhookDeliveryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async deliver({ deliveryId, attempt, isFinal }: DeliverInput): Promise<'delivered' | 'skipped'> {
    const delivery = await this.prisma.webhookDelivery.findUnique({ where: { id: deliveryId }, include: { endpoint: true } });
    const event = delivery ? webhookEventFromDb(delivery.event) : null;

    if (!delivery || !event || delivery.status === 'succeeded' || !delivery.endpoint.isActive) {
      return 'skipped';
    }

    const body = JSON.stringify(delivery.payload);

    if (!(await resolvesPublicly({ url: delivery.endpoint.url }))) {
      await this.fail({
        deliveryId,
        endpointId: delivery.endpointId,
        attempt,
        responseStatus: null,
        responseBody: WEBHOOK_DELIVERY.blockedResponse,
        isFinal
      });

      throw new Error(`${WEBHOOK_DELIVERY.blockedResponse}: ${delivery.endpoint.url}`);
    }

    try {
      const response = await http.post(delivery.endpoint.url, {
        body,
        headers: webhookHeaders({ secret: delivery.endpoint.secret, body, event, deliveryId, sentAt: new Date() }),
        timeout: WEBHOOK_DELIVERY.timeoutMs,
        redirect: 'manual'
      });

      await this.prisma.$transaction([
        this.prisma.webhookDelivery.update({
          where: { id: deliveryId },
          data: {
            status: 'succeeded',
            attempt,
            responseStatus: response.status,
            responseBody: (await response.text()).slice(0, WEBHOOK_DELIVERY.responseBodyMaxLength),
            deliveredAt: new Date(),
            nextAttemptAt: null
          }
        }),
        this.prisma.webhookEndpoint.update({ where: { id: delivery.endpointId }, data: { failureCount: 0 } })
      ]);

      return 'delivered';
    } catch (error) {
      const responseStatus = error instanceof HTTPError ? error.response.status : null;
      const responseBody = error instanceof HTTPError ? errorBody(error.data) : errorMessage(error);

      await this.fail({ deliveryId, endpointId: delivery.endpointId, attempt, responseStatus, responseBody, isFinal });

      throw error;
    }
  }

  private async fail({ deliveryId, endpointId, attempt, responseStatus, responseBody, isFinal }: FailDeliveryInput): Promise<void> {
    await this.prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        status: isFinal ? 'failed' : 'pending',
        attempt,
        responseStatus,
        responseBody: responseBody?.slice(0, WEBHOOK_DELIVERY.responseBodyMaxLength) ?? null,
        nextAttemptAt: isFinal ? null : addMilliseconds(new Date(), WEBHOOK_DELIVERY.backoffMs * 2 ** (attempt - 1))
      }
    });

    if (!isFinal) {
      return;
    }

    const endpoint = await this.prisma.webhookEndpoint.update({ where: { id: endpointId }, data: { failureCount: { increment: 1 } } });

    if (endpoint.failureCount >= WEBHOOK_DELIVERY.disableAfterFailures) {
      await this.prisma.webhookEndpoint.update({ where: { id: endpointId }, data: { isActive: false, disabledAt: new Date() } });
      this.logger.warn(`webhook endpoint ${endpointId} disabled after ${endpoint.failureCount} failed deliveries`);
    }
  }
}
