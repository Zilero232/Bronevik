import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';

import { MetricsService } from '../../collector/metrics';
import { PULSE_QUEUE } from '../config';
import { PulseService } from '../services';

@Processor(PULSE_QUEUE.name, { concurrency: 1 })
export class PulseProcessor extends WorkerHost {
  constructor(
    private readonly pulse: PulseService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    return this.metrics.track({ job, run: () => this.handle(job) });
  }

  private async handle(job: Job): Promise<unknown> {
    return match(job.name)
      .with(PULSE_QUEUE.jobs.sample, () => this.pulse.sample(new Date()))
      .otherwise(() => null);
  }
}
