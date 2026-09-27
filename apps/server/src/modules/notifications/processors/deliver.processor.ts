import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { deliverPayloadSchema, digestPayloadSchema, NOTIFICATION_DELIVERY, NOTIFICATIONS_JOB, NOTIFICATIONS_QUEUE } from '../config';
import { DeliveryService } from '../services';

@Processor(NOTIFICATIONS_QUEUE.deliver, { concurrency: NOTIFICATION_DELIVERY.concurrency })
export class DeliverProcessor extends WorkerHost {
  constructor(
    private readonly delivery: DeliveryService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<number> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<number> {
    return match(job.name)
      .with(NOTIFICATIONS_JOB.deliver.digest, () => this.delivery.deliverDigest(digestPayloadSchema.parse(job.data)))
      .otherwise(() => this.delivery.deliver(deliverPayloadSchema.parse(job.data)));
  }
}
