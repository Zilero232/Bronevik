import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService, TrackedWorkerHost } from '../../collector/metrics';
import { STREAMERS_QUEUE } from '../config';
import { predictionJobSchema } from '../lib';
import { ChallengeFeedService, LiveStatusService, SettingsAggregateService, TwitchPredictionsService } from '../services';

@Processor(STREAMERS_QUEUE.name, { concurrency: 1 })
export class StreamersProcessor extends TrackedWorkerHost<number> {
  constructor(
    private readonly feed: ChallengeFeedService,
    private readonly live: LiveStatusService,
    private readonly aggregates: SettingsAggregateService,
    private readonly predictions: TwitchPredictionsService,
    metrics: MetricsService
  ) {
    super(metrics);
  }

  protected async handle(job: Job): Promise<number> {
    return match(job.name)
      .with(STREAMERS_QUEUE.jobs.battleFeed, async () => (await this.feed.run()) + (await this.predictions.settleAll()))
      .with(STREAMERS_QUEUE.jobs.predictionOpen, () => this.predictions.openFromJob(predictionJobSchema.parse(job.data)))
      .with(STREAMERS_QUEUE.jobs.expireChallenges, () => this.feed.expire())
      .with(STREAMERS_QUEUE.jobs.livePoll, () => this.live.poll())
      .with(STREAMERS_QUEUE.jobs.settingsAggregate, () => this.aggregates.compute())
      .otherwise(() => 0);
  }
}
