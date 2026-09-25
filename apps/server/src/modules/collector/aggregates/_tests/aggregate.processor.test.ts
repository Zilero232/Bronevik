import type { Job } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { MetricsService } from '../../metrics';
import type { AccountRatingsService, ServerStatsService, TankPercentilesService, TierMaintenanceService } from '../services';

import { JOB } from '../../contracts';
import { AggregateProcessor } from '../processors/aggregate.processor';

const createProcessor = () => {
  const accountRatings = mock<AccountRatingsService>();
  const serverStats = mock<ServerStatsService>();
  const percentiles = mock<TankPercentilesService>();
  const maintenance = mock<TierMaintenanceService>();
  const metrics = mock<MetricsService>();

  metrics.track.mockImplementation(({ run }) => run());

  return {
    accountRatings,
    serverStats,
    metrics,
    processor: new AggregateProcessor(accountRatings, serverStats, percentiles, maintenance, metrics)
  };
};

describe('AggregateProcessor', () => {
  it('routes a job to the service named by the job and wraps it in metrics', async () => {
    const { serverStats, metrics, processor } = createProcessor();
    const job = mock<Job>({ name: JOB.aggregate.serverStats, data: {} });

    serverStats.compute.mockResolvedValue({ rows: 3 });

    expect(await processor.process(job)).toEqual({ rows: 3 });
    expect(metrics.track).toHaveBeenCalledOnce();
  });

  it('validates the account ratings payload before computing', async () => {
    const { accountRatings, processor } = createProcessor();

    await expect(processor.process(mock<Job>({ name: JOB.aggregate.accountRatings, data: { accountId: -1 } }))).rejects.toThrow();
    expect(accountRatings.compute).not.toHaveBeenCalled();
  });

  it('ignores a job name it does not know', async () => {
    const { processor } = createProcessor();

    expect(await processor.process(mock<Job>({ name: 'unknown', data: {} }))).toEqual({ ignored: 'unknown' });
  });
});
