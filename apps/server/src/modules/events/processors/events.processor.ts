import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { EVENTS_QUEUE } from '../config';
import { DropsService, EventCalendarService } from '../services';

@Processor(EVENTS_QUEUE.name, { concurrency: 1 })
export class EventsProcessor extends WorkerHost {
  constructor(
    private readonly calendar: EventCalendarService,
    private readonly drops: DropsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return match(job.name)
      .with(EVENTS_QUEUE.jobs.calendar, () => this.calendar.run(new Date()))
      .with(EVENTS_QUEUE.jobs.drops, () => this.drops.run(new Date()))
      .otherwise(() => null);
  }
}
