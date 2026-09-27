import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { WORKER_CONCURRENCY } from '../../config';
import { accountBatchPayloadSchema, JOB, QUEUE } from '../../contracts';
import { MetricsService } from '../../metrics';
import { DispatchService, PollPipelineService } from '../services';

@Processor(QUEUE.poll, { concurrency: WORKER_CONCURRENCY.poll })
export class PollProcessor extends WorkerHost {
  constructor(
    private readonly pipeline: PollPipelineService,
    private readonly dispatch: DispatchService,
    private readonly metrics: MetricsService
  ) {
    super();
  }

  async process(job: Job) {
    return this.metrics.track({
      job,
      run: async () => {
        if (job.name === JOB.poll.dispatch) {
          return { dispatched: await this.dispatch.dispatchActive() };
        }

        const { accountIds } = accountBatchPayloadSchema.parse(job.data);

        return this.pipeline.run({ accountIds, lane: 'priority', tier: 'active' });
      }
    });
  }
}
