import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { WORKER_CONCURRENCY } from '../../config';
import { QUEUE } from '../../contracts';
import { MetricsService } from '../../metrics';
import { NewsSyncService } from '../services';

@Processor(QUEUE.news, { concurrency: WORKER_CONCURRENCY.news })
export class NewsProcessor extends WorkerHost {
  constructor(
    private readonly news: NewsSyncService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job) {
    return this.metrics.track({ job, run: () => this.handle() });
  }

  private async handle() {
    return this.news.sync();
  }
}
