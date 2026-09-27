import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { DISCORD_QUEUE } from '../config';
import { DiscordRemindersService, DiscordReportService, DiscordRolesService } from '../services';

@Processor(DISCORD_QUEUE.name, { concurrency: 1 })
export class DiscordProcessor extends WorkerHost {
  constructor(
    private readonly reminders: DiscordRemindersService,
    private readonly roles: DiscordRolesService,
    private readonly reports: DiscordReportService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<unknown> {
    const now = new Date();

    return match(job.name)
      .with(DISCORD_QUEUE.jobs.reminders, () => this.reminders.send(now))
      .with(DISCORD_QUEUE.jobs.roles, () => this.roles.syncAll())
      .with(DISCORD_QUEUE.jobs.weeklyReport, () => this.reports.sendWeekly(now))
      .otherwise(() => null);
  }
}
