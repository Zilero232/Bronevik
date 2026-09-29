import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService, TrackedWorkerHost } from '../../collector/metrics';
import { ACHIEVEMENTS_RARITY_QUEUE } from '../config';
import { AchievementsFetchService, RarityAggregateService } from '../services';

@Processor(ACHIEVEMENTS_RARITY_QUEUE.name, { concurrency: 1 })
export class AchievementsRarityProcessor extends TrackedWorkerHost {
  constructor(
    private readonly fetcher: AchievementsFetchService,
    private readonly aggregates: RarityAggregateService,
    metrics: MetricsService
  ) {
    super(metrics);
  }

  protected async handle(job: Job): Promise<unknown> {
    return match(job.name)
      .with(ACHIEVEMENTS_RARITY_QUEUE.jobs.fetch, () => this.fetcher.fetch())
      .with(ACHIEVEMENTS_RARITY_QUEUE.jobs.aggregate, () => this.aggregates.compute())
      .otherwise(() => null);
  }
}
