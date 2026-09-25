import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { WORKER_CONCURRENCY } from '../../config';
import { enrolPayloadSchema, QUEUE } from '../../contracts';
import { MetricsService } from '../../metrics';
import { EnrolService } from '../services';

@Processor(QUEUE.enrol, { concurrency: WORKER_CONCURRENCY.enrol })
export class EnrolProcessor extends WorkerHost {
  constructor(
    private readonly enrolment: EnrolService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job) {
    return this.metrics.track({ job, run: () => this.enrolment.enrol(enrolPayloadSchema.parse(job.data)) });
  }
}
