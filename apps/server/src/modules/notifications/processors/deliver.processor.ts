import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { NOTIFICATION_DELIVERY } from '../config';
import { deliverPayloadSchema, digestPayloadSchema, NOTIFICATIONS_JOB, NOTIFICATIONS_QUEUE } from '../contracts';
import { DeliveryService } from '../services';

@Processor(NOTIFICATIONS_QUEUE.deliver, { concurrency: NOTIFICATION_DELIVERY.concurrency })
export class DeliverProcessor extends WorkerHost {
  constructor(private readonly delivery: DeliveryService) {
    super();
  }

  async process(job: Job): Promise<number> {
    return match(job.name)
      .with(NOTIFICATIONS_JOB.deliver.digest, () => this.delivery.deliverDigest(digestPayloadSchema.parse(job.data)))
      .otherwise(() => this.delivery.deliver(deliverPayloadSchema.parse(job.data)));
  }
}
