import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { WORKER_CONCURRENCY } from '../../config';
import { JOB, purgeAccountPayloadSchema, QUEUE } from '../../contracts';
import { MetricsService } from '../../metrics';
import { PurgeService, RetentionService } from '../services';

@Processor(QUEUE.purge, { concurrency: WORKER_CONCURRENCY.purge })
export class PurgeProcessor extends WorkerHost {
  constructor(
    private readonly purge: PurgeService,
    private readonly retention: RetentionService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job) {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job) {
    return match<string, Promise<unknown>>(job.name)
      .with(JOB.purge.dispatch, async () => ({ dispatched: await this.purge.dispatch() }))
      .with(JOB.purge.retention, async () => ({ deleted: await this.retention.purgeExpired() }))
      .otherwise(async () => {
        await this.purge.purgeAccount(purgeAccountPayloadSchema.parse(job.data));

        return { purged: true };
      });
  }
}
