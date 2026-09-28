import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { MetricsService } from '../../collector/metrics';
import { SESSION_SHARE_QUEUE, sessionSharePayloadSchema } from '../config';
import { SessionShareDeliveryService } from '../services';

@Processor(SESSION_SHARE_QUEUE.name, { concurrency: SESSION_SHARE_QUEUE.concurrency })
export class SessionShareProcessor extends WorkerHost {
  constructor(
    private readonly delivery: SessionShareDeliveryService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<boolean> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private handle(job: Job): Promise<boolean> {
    return this.delivery.deliver(sessionSharePayloadSchema.parse(job.data));
  }
}
