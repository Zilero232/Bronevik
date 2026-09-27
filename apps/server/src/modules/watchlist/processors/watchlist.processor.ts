import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { WATCHLIST_QUEUE } from '../config';
import { WatchlistDigestService } from '../services';

@Processor(WATCHLIST_QUEUE.name, { concurrency: 1 })
export class WatchlistProcessor extends WorkerHost {
  constructor(
    private readonly digests: WatchlistDigestService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<unknown> {
    return match(job.name)
      .with(WATCHLIST_QUEUE.jobs.digest, () => this.digests.run(new Date()))
      .otherwise(() => null);
  }
}
