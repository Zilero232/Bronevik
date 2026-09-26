import type { WebhookPayload } from '@bronevik/schemas';

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { randomUUID } from 'node:crypto';

import type { EmitWebhookInput, WebhookEmitter } from '../../../core';

import { errorMessage, toJsonValue } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { JOB, QUEUE } from '../../collector';
import { WEBHOOK_DELIVERY, WEBHOOK_EVENT_TO_DB } from '../config';
import { matchesSubject } from '../lib';

@Injectable()
export class WebhookEmitterService implements WebhookEmitter {
  private readonly logger = new Logger(WebhookEmitterService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUE.developerWebhooks) private readonly queue: Queue
  ) {}

  async emit({ event, subject, data }: EmitWebhookInput): Promise<number> {
    try {
      const endpoints = await this.prisma.webhookEndpoint.findMany({
        where: { isActive: true, events: { has: WEBHOOK_EVENT_TO_DB[event] } },
        select: { id: true, filter: true }
      });

      const matched = endpoints.filter((endpoint) => matchesSubject({ filter: endpoint.filter, subject }));

      for (const endpoint of matched) {
        const id = randomUUID();
        const payload: WebhookPayload = { id, event, createdAt: new Date().toISOString(), data };

        await this.prisma.webhookDelivery.create({
          data: { id, endpointId: endpoint.id, event: WEBHOOK_EVENT_TO_DB[event], payload: toJsonValue(payload) }
        });

        await this.queue.add(
          JOB.developerWebhooks.deliver,
          { deliveryId: id },
          { jobId: id, attempts: WEBHOOK_DELIVERY.maxAttempts, backoff: { type: 'exponential', delay: WEBHOOK_DELIVERY.backoffMs } }
        );
      }

      return matched.length;
    } catch (error) {
      this.logger.warn(`${event} webhooks not queued: ${errorMessage(error)}`);

      return 0;
    }
  }
}
