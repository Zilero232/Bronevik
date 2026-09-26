import type { Queue } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { AppConfigService } from '../../../config';
import type { JobSchedule } from '../../lib';

import { JOB_SCHEDULES } from '../../lib';
import { createJobSchedules } from '../job-schedules.factory';

const schedules: JobSchedule[] = [
  { id: 'nightly', queue: 'billing', name: 'renew', repeat: { pattern: '0 3 * * *' } },
  { id: 'retired', queue: 'billing', name: 'old', repeat: { every: 60_000 }, enabled: false }
];

const createSchedules = (env: string) => {
  const config = mock<AppConfigService>();
  const queue = mock<Queue>();
  const Schedules = createJobSchedules({ queue: 'billing', schedules, label: 'billing' });

  config.get.mockReturnValue(env);

  return { queue, service: new Schedules(config, queue) };
};

describe('createJobSchedules', () => {
  it('registers nothing under the test environment', async () => {
    const { queue, service } = createSchedules('test');

    await service.onApplicationBootstrap();

    expect(queue.upsertJobScheduler).not.toHaveBeenCalled();
    expect(queue.removeJobScheduler).not.toHaveBeenCalled();
  });

  it('upserts enabled schedules in the Moscow timezone and removes disabled ones', async () => {
    const { queue, service } = createSchedules('production');

    await service.onApplicationBootstrap();

    expect(queue.upsertJobScheduler).toHaveBeenCalledWith(
      'nightly',
      { pattern: '0 3 * * *', tz: JOB_SCHEDULES.timezone },
      expect.objectContaining({ name: 'renew' })
    );

    expect(queue.removeJobScheduler).toHaveBeenCalledWith('retired');
  });
});
