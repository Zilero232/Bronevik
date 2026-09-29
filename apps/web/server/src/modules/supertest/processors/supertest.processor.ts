import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService, TrackedWorkerHost } from '../../collector/metrics';
import { SUPERTEST_QUEUE } from '../config';
import { SupertestScrapeService } from '../services';

@Processor(SUPERTEST_QUEUE.name, { concurrency: 1 })
export class SupertestProcessor extends TrackedWorkerHost {
  constructor(
    private readonly scraper: SupertestScrapeService,
    metrics: MetricsService
  ) {
    super(metrics);
  }

  protected async handle(job: Job): Promise<unknown> {
    return match(job.name)
      .with(SUPERTEST_QUEUE.jobs.scrape, () => this.scraper.run(new Date()))
      .otherwise(() => null);
  }
}
