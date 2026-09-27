import { Job } from 'bullmq';
import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { MetricsService } from '../../../metrics';
import type { JobMetricRetentionService, PurgeService } from '../../services';

import { JOB } from '../../../contracts';
import { PurgeProcessor } from '../purge.processor';

const requestId = '00000000-0000-4000-8000-000000000001';

const createProcessor = () => {
  const purge = mock<PurgeService>();
  const jobMetrics = mock<JobMetricRetentionService>();
  const metrics = mock<MetricsService>();

  metrics.track.mockImplementation(({ run }) => run());

  return { purge, jobMetrics, processor: new PurgeProcessor(purge, jobMetrics, metrics) };
};

describe('PurgeProcessor', () => {
  it('reports how many purges were dispatched', async () => {
    const { purge, processor } = createProcessor();

    purge.dispatch.mockResolvedValue(3);

    expect(await processor.process(mock<Job>({ name: JOB.purge.dispatch, data: {} }))).toEqual({ dispatched: 3 });
    expect(purge.purgeAccount).not.toHaveBeenCalled();
  });

  it('purges expired job metrics on the retention job', async () => {
    const { purge, jobMetrics, processor } = createProcessor();

    jobMetrics.purgeExpired.mockResolvedValue(42);

    expect(await processor.process(mock<Job>({ name: JOB.purge.jobMetrics, data: {} }))).toEqual({ deleted: 42 });
    expect(purge.purgeAccount).not.toHaveBeenCalled();
  });

  it('purges the account from the payload', async () => {
    const { purge, processor } = createProcessor();

    expect(await processor.process(mock<Job>({ name: JOB.purge.account, data: { accountId: 5, requestId } }))).toEqual({ purged: true });
    expect(purge.purgeAccount).toHaveBeenCalledWith({ accountId: 5, requestId });
  });

  it('fails the job without purging on a malformed payload', async () => {
    const { purge, processor } = createProcessor();

    await expect(processor.process(mock<Job>({ name: JOB.purge.account, data: { accountId: 'five', requestId } }))).rejects.toThrow();
    expect(purge.purgeAccount).not.toHaveBeenCalled();
  });

  it('lets a failed purge fail the job so it is retried', async () => {
    const { purge, processor } = createProcessor();

    purge.purgeAccount.mockRejectedValue(new Error('lock timeout'));

    await expect(processor.process(mock<Job>({ name: JOB.purge.account, data: { accountId: 5, requestId } }))).rejects.toThrow('lock timeout');
  });
});
