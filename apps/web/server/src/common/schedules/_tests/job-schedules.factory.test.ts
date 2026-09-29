import type { ModuleRef } from '@nestjs/core';
import type { Queue } from 'bullmq';

import { describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { AppConfigService, Env } from '../../../config';
import type { JobSchedule } from '../../lib';

import { TIME } from '../../../config';
import { createJobSchedules } from '../job-schedules.factory';

const schedules: JobSchedule[] = [
  { id: 'nightly', queue: 'billing', name: 'renew', repeat: { pattern: '0 3 * * *' } },
  { id: 'retired', queue: 'billing', name: 'old', repeat: { every: 60_000 }, enabled: false },
  { id: 'lesta', queue: 'collector', name: 'poll', repeat: { every: 60_000 }, needsLesta: true },
  { id: 'encyclopedia', queue: 'collector', name: 'sync', repeat: { every: 60_000 }, needsLesta: true }
];

const createSchedules = (env: Pick<Env, 'LESTA_APPLICATION_ID' | 'NODE_ENV'>) => {
  const config = mock<AppConfigService>();
  const moduleRef = mock<ModuleRef>();
  const queue = mock<Queue>();

  queue.getJobSchedulers.mockResolvedValue([]);
  const Schedules = createJobSchedules({ schedules, label: 'test' });

  moduleRef.get.mockReturnValue(queue);
  config.get.calledWith('NODE_ENV').mockReturnValue(env.NODE_ENV);
  config.get.calledWith('LESTA_APPLICATION_ID').mockReturnValue(env.LESTA_APPLICATION_ID);

  return { queue, service: new Schedules(moduleRef, config) };
};

const registered = (queue: Queue) => vi.mocked(queue.upsertJobScheduler).mock.calls.map(([id]) => id);

describe('createJobSchedules', () => {
  it('registers nothing under the test environment', async () => {
    const { queue, service } = createSchedules({ NODE_ENV: 'test', LESTA_APPLICATION_ID: 'app' });

    await service.onApplicationBootstrap();

    expect(queue.upsertJobScheduler).not.toHaveBeenCalled();
    expect(queue.removeJobScheduler).not.toHaveBeenCalled();
  });

  it('upserts active schedules in the Moscow timezone and removes disabled ones', async () => {
    const { queue, service } = createSchedules({ NODE_ENV: 'production', LESTA_APPLICATION_ID: 'app' });

    await service.onApplicationBootstrap();

    expect(queue.upsertJobScheduler).toHaveBeenCalledWith(
      'nightly',
      { pattern: '0 3 * * *', tz: TIME.zone },
      expect.objectContaining({ name: 'renew' })
    );

    expect(queue.removeJobScheduler).toHaveBeenCalledWith('retired');
    expect(registered(queue)).toEqual(['nightly', 'lesta', 'encyclopedia']);
  });

  it('drops the Lesta schedules without an application id', async () => {
    const { queue, service } = createSchedules({ NODE_ENV: 'production', LESTA_APPLICATION_ID: '' });

    await service.onApplicationBootstrap();

    expect(registered(queue)).toEqual(['nightly']);
    expect(queue.removeJobScheduler).toHaveBeenCalledWith('lesta');
    expect(queue.removeJobScheduler).toHaveBeenCalledWith('encyclopedia');
  });
});
