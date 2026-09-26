import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { CoachingPaymentService } from '../../coaching';
import { PlatoonService } from '../../platoons';
import { RecruitingService } from '../../recruiting';
import { COMMUNITY_QUEUE } from '../config';

@Processor(COMMUNITY_QUEUE.name, { concurrency: 1 })
export class CommunityProcessor extends WorkerHost {
  constructor(
    private readonly platoons: PlatoonService,
    private readonly recruiting: RecruitingService,
    private readonly coachingPayments: CoachingPaymentService
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
      .with(COMMUNITY_QUEUE.jobs.settleCoaching, () => this.coachingPayments.settlePending(now))
      .otherwise(() => null);
  }
}
