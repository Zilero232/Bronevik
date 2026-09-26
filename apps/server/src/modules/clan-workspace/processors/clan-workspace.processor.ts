import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { CLAN_WORKSPACE_QUEUE } from '../config';
import { ClanEventAttendanceService, ClanEventRemindersService, OfficerReportService } from '../services';

@Processor(CLAN_WORKSPACE_QUEUE.name, { concurrency: 1 })
export class ClanWorkspaceProcessor extends WorkerHost {
  constructor(
    private readonly reminders: ClanEventRemindersService,
    private readonly attendance: ClanEventAttendanceService,
    private readonly reports: OfficerReportService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    const now = new Date();

    return match(job.name)
      .with(CLAN_WORKSPACE_QUEUE.jobs.reminders, () => this.reminders.sendReminders(now))
      .with(CLAN_WORKSPACE_QUEUE.jobs.attendance, () => this.attendance.syncFinished(now))
      .with(CLAN_WORKSPACE_QUEUE.jobs.weeklyReport, () => this.reports.sendWeekly(now))
      .otherwise(() => null);
  }
}
