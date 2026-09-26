import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { STREAMERS_QUEUE } from '../config';
import { predictionJobSchema } from '../lib';
import { ChallengeFeedService, LiveStatusService, SettingsAggregateService, TwitchPredictionsService } from '../services';

@Processor(STREAMERS_QUEUE.name, { concurrency: 1 })
export class StreamersProcessor extends WorkerHost {
  constructor(
    private readonly feed: ChallengeFeedService,
    private readonly live: LiveStatusService,
    private readonly aggregates: SettingsAggregateService,
    private readonly predictions: TwitchPredictionsService
  ) {
    super();
  }

  async process(job: Job): Promise<number> {
    return match(job.name)
      .with(STREAMERS_QUEUE.jobs.battleFeed, async () => (await this.feed.run()) + (await this.predictions.settleAll()))
      .with(STREAMERS_QUEUE.jobs.predictionOpen, () => this.predictions.openFromJob(predictionJobSchema.parse(job.data)))
      .with(STREAMERS_QUEUE.jobs.expireChallenges, () => this.feed.expire())
      .with(STREAMERS_QUEUE.jobs.livePoll, () => this.live.poll())
      .with(STREAMERS_QUEUE.jobs.settingsAggregate, () => this.aggregates.compute())
      .otherwise(() => 0);
  }
}
