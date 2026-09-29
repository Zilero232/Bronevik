import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { ACHIEVEMENTS_RARITY_QUEUE } from '../config';
import { AchievementsFetchService, RarityAggregateService } from '../services';

@Processor(ACHIEVEMENTS_RARITY_QUEUE.name, { concurrency: 1 })
export class AchievementsRarityProcessor extends WorkerHost {
  constructor(
    private readonly fetcher: AchievementsFetchService,
    private readonly aggregates: RarityAggregateService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return match(job.name)
      .with(ACHIEVEMENTS_RARITY_QUEUE.jobs.fetch, () => this.metrics.track({ job, run: () => this.fetcher.fetch() }))
      .with(ACHIEVEMENTS_RARITY_QUEUE.jobs.aggregate, () => this.metrics.track({ job, run: () => this.aggregates.compute() }))
      .otherwise(() => null);
  }
}
