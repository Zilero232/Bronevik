import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { WORKER_CONCURRENCY } from '../../config';
import { accountBatchPayloadSchema, clanDispatchPayloadSchema, clanRefreshPayloadSchema, JOB, QUEUE } from '../../contracts';
import { MetricsService } from '../../metrics';
import { ClanDispatchService, ClanHistoryService, ClanSyncService } from '../services';

@Processor(QUEUE.clans, { concurrency: WORKER_CONCURRENCY.clans })
export class ClansProcessor extends WorkerHost {
  constructor(
    private readonly dispatcher: ClanDispatchService,
    private readonly sync: ClanSyncService,
    private readonly history: ClanHistoryService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job) {
    return this.metrics.track({
      job,
      run: () =>
        match<string, Promise<unknown>>(job.name)
          .with(JOB.clans.dispatch, async () => ({ dispatched: await this.dispatcher.dispatch(clanDispatchPayloadSchema.parse(job.data)) }))
          .with(JOB.clans.history, () => this.history.history(accountBatchPayloadSchema.parse(job.data)))
          .otherwise(() => this.sync.refresh(clanRefreshPayloadSchema.parse(job.data)))
    });
  }
}
