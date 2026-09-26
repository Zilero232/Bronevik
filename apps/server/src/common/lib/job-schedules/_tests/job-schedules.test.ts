import type { Queue } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { registerJobSchedules } from '../job-schedules';

describe('registerJobSchedules', () => {
  it('upserts active schedules with the timezone for cron patterns only', async () => {
    const queue = mock<Queue>();

    const registered = await registerJobSchedules({
      schedules: [
        { id: 'cron', queue: 'q', name: 'job', repeat: { pattern: '0 10 * * 1' } },
        { id: 'every', queue: 'q', name: 'job', repeat: { every: 1000 } }
      ],
      queueOf: () => queue,
      timezone: 'Europe/Moscow'
    });

    expect(registered).toBe(2);
    expect(queue.upsertJobScheduler).toHaveBeenCalledWith('cron', { pattern: '0 10 * * 1', tz: 'Europe/Moscow' }, { name: 'job', data: {} });
    expect(queue.upsertJobScheduler).toHaveBeenCalledWith('every', { every: 1000 }, { name: 'job', data: {} });
  });

  it('removes a disabled schedule instead of registering it', async () => {
    const queue = mock<Queue>();

    const registered = await registerJobSchedules({
      schedules: [{ id: 'off', queue: 'q', name: 'job', repeat: { every: 1000 }, enabled: false }],
      queueOf: () => queue,
      timezone: 'UTC'
    });

    expect(registered).toBe(0);
    expect(queue.removeJobScheduler).toHaveBeenCalledWith('off');
    expect(queue.upsertJobScheduler).not.toHaveBeenCalled();
  });
});
