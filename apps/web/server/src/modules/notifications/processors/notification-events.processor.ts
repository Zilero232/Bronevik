import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { NOTIFICATIONS_JOB, NOTIFICATIONS_QUEUE } from '../config';
import { FirstWinRemindersService, MarksWatchService, SessionReportsService, ThresholdDropsService, WeeklyDigestService } from '../services';

@Processor(NOTIFICATIONS_QUEUE.events, { concurrency: 1 })
export class NotificationEventsProcessor extends WorkerHost {
  constructor(
    private readonly marks: MarksWatchService,
    private readonly sessions: SessionReportsService,
    private readonly thresholds: ThresholdDropsService,
    private readonly digest: WeeklyDigestService,
    private readonly firstWin: FirstWinRemindersService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<number> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<number> {
    return match(job.name)
      .with(NOTIFICATIONS_JOB.events.marksWatch, () => this.marks.run())
      .with(NOTIFICATIONS_JOB.events.sessionReports, () => this.sessions.run())
      .with(NOTIFICATIONS_JOB.events.thresholdDrops, () => this.thresholds.run())
      .with(NOTIFICATIONS_JOB.events.weeklyDigest, () => this.digest.run())
      .with(NOTIFICATIONS_JOB.events.firstWinReminders, () => this.firstWin.run())
      .otherwise(() => 0);
  }
}
