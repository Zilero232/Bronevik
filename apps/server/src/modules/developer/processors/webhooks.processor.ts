import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { JOB, MetricsService, QUEUE, webhookDeliverPayloadSchema, WORKER_CONCURRENCY } from '../../collector';
import { SessionCloseService, WebhookDeliveryService, WebhookRedriveService } from '../services';

@Processor(QUEUE.developerWebhooks, { concurrency: WORKER_CONCURRENCY.developerWebhooks })
export class WebhooksProcessor extends WorkerHost {
  constructor(
    private readonly deliveries: WebhookDeliveryService,
    private readonly sessions: SessionCloseService,
    private readonly redrive: WebhookRedriveService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job) {
    return this.metrics.track({
      job,
      run: async () => {
        if (job.name === JOB.developerWebhooks.closeSessions) {
          return { closed: await this.sessions.closeIdle() };
        }

        if (job.name === JOB.developerWebhooks.redrive) {
          return { requeued: await this.redrive.redrive() };
        }

        const { deliveryId } = webhookDeliverPayloadSchema.parse(job.data);
        const attempt = job.attemptsMade + 1;

        return { result: await this.deliveries.deliver({ deliveryId, attempt, isFinal: attempt >= (job.opts.attempts ?? 1) }) };
      }
    });
  }
}
