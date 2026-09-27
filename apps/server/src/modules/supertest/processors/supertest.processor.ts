import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { SUPERTEST_QUEUE } from '../config';
import { SupertestScrapeService } from '../services';

@Processor(SUPERTEST_QUEUE.name, { concurrency: 1 })
export class SupertestProcessor extends WorkerHost {
  constructor(
    private readonly scraper: SupertestScrapeService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<unknown> {
    return match(job.name)
      .with(SUPERTEST_QUEUE.jobs.scrape, () => this.scraper.run(new Date()))
      .otherwise(() => null);
  }
}
