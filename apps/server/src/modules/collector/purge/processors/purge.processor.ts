import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { WORKER_CONCURRENCY } from '../../config';
import { JOB, purgeAccountPayloadSchema, QUEUE } from '../../contracts';
import { MetricsService } from '../../metrics';
import { PurgeService } from '../services';

@Processor(QUEUE.purge, { concurrency: WORKER_CONCURRENCY.purge })
export class PurgeProcessor extends WorkerHost {
  constructor(
    private readonly purge: PurgeService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job) {
    return this.metrics.track({
      job,
      run: async () => {
        if (job.name === JOB.purge.dispatch) {
          return { dispatched: await this.purge.dispatch() };
        }

        await this.purge.purgeAccount(purgeAccountPayloadSchema.parse(job.data));

        return { purged: true };
      }
    });
  }
}
