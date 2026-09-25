import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { COMMUNITY_QUEUE } from '../config';
import { CoachingService, PlatoonService, RecruitingService } from '../services';

@Processor(COMMUNITY_QUEUE.name, { concurrency: 1 })
export class CommunityProcessor extends WorkerHost {
  constructor(
    private readonly platoons: PlatoonService,
    private readonly recruiting: RecruitingService,
    private readonly coaching: CoachingService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    const now = new Date();

    return match(job.name)
      .with(COMMUNITY_QUEUE.jobs.expirePosts, async () => ({
        platoon: await this.platoons.expire(now),
        recruiting: await this.recruiting.expire(now)
      }))
      .with(COMMUNITY_QUEUE.jobs.settleCoaching, () => this.coaching.settlePending(now))
      .otherwise(() => null);
  }
}
