import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { STREAMERS_QUEUE } from '../config';
import { ChallengeFeedService } from '../services';

@Processor(STREAMERS_QUEUE.name, { concurrency: 1 })
export class StreamersProcessor extends WorkerHost {
  constructor(private readonly feed: ChallengeFeedService) {
    super();
  }

  async process(job: Job): Promise<number> {
    return match(job.name)
      .with(STREAMERS_QUEUE.jobs.battleFeed, () => this.feed.run())
      .with(STREAMERS_QUEUE.jobs.expireChallenges, () => this.feed.expire())
      .otherwise(() => 0);
  }
}
