import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { STREAMERS_QUEUE } from '../config';
import { predictionJobSchema } from '../lib';
import { ChallengeFeedService, LiveStatusService, SettingsAggregateService, TwitchPredictionsService } from '../services';

@Processor(STREAMERS_QUEUE.name, { concurrency: 1 })
export class StreamersProcessor extends WorkerHost {
  constructor(
    private readonly feed: ChallengeFeedService,
    private readonly live: LiveStatusService,
    private readonly aggregates: SettingsAggregateService,
    private readonly predictions: TwitchPredictionsService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<number> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<number> {
    return match(job.name)
      .with(STREAMERS_QUEUE.jobs.battleFeed, async () => (await this.feed.run()) + (await this.predictions.settleAll()))
      .with(STREAMERS_QUEUE.jobs.predictionOpen, () => this.predictions.openFromJob(predictionJobSchema.parse(job.data)))
      .with(STREAMERS_QUEUE.jobs.expireChallenges, () => this.feed.expire())
      .with(STREAMERS_QUEUE.jobs.livePoll, () => this.live.poll())
      .with(STREAMERS_QUEUE.jobs.settingsAggregate, () => this.aggregates.compute())
      .otherwise(() => 0);
  }
}
