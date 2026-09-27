import type { Queue } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { TIME } from '../../../../config';
import { isScheduleActive, registerJobSchedules } from '../job-schedules';

const environment = { hasLesta: true, lestaMock: false };

describe('registerJobSchedules', () => {
  it('upserts active schedules with the Moscow timezone for cron patterns only', async () => {
    const queue = mock<Queue>();

    queue.getJobSchedulers.mockResolvedValue([]);

    const registered = await registerJobSchedules({
      schedules: [
        { id: 'cron', queue: 'q', name: 'job', repeat: { pattern: '0 10 * * 1' } },
        { id: 'every', queue: 'q', name: 'job', repeat: { every: 1000 } }
      ],
      queueOf: () => queue,
      environment
    });

    expect(registered).toBe(2);
    expect(queue.upsertJobScheduler).toHaveBeenCalledWith('cron', { pattern: '0 10 * * 1', tz: TIME.zone }, { name: 'job', data: {} });
    expect(queue.upsertJobScheduler).toHaveBeenCalledWith('every', { every: 1000 }, { name: 'job', data: {} });
  });

  it('removes a disabled schedule instead of registering it', async () => {
    const queue = mock<Queue>();

    queue.getJobSchedulers.mockResolvedValue([]);

    const registered = await registerJobSchedules({
      schedules: [{ id: 'off', queue: 'q', name: 'job', repeat: { every: 1000 }, enabled: false }],
      queueOf: () => queue,
      environment
    });

    expect(registered).toBe(0);
    expect(queue.removeJobScheduler).toHaveBeenCalledWith('off');
    expect(queue.upsertJobScheduler).not.toHaveBeenCalled();
  });
});

describe('registerJobSchedules orphans', () => {
  it('removes a scheduler that is no longer configured on the queue', async () => {
    const queue = mock<Queue>();

    queue.getJobSchedulers.mockResolvedValue([
      { key: 'kept', name: 'job' },
      { key: 'renamed-away', name: 'job' }
    ]);

    await registerJobSchedules({ schedules: [{ id: 'kept', queue: 'q', name: 'job', repeat: { every: 1000 } }], queueOf: () => queue, environment });

    expect(queue.removeJobScheduler.mock.calls).toEqual([['renamed-away']]);
  });
});

describe('isScheduleActive', () => {
  const schedule = { id: 'x', queue: 'q', name: 'job', repeat: { every: 1000 } };

  it('keeps a Lesta schedule off without Lesta', () => {
    expect(isScheduleActive({ schedule: { ...schedule, needsLesta: true }, hasLesta: false, lestaMock: false })).toBe(false);
  });

  it('keeps a real-Lesta-only schedule off under the mock', () => {
    expect(isScheduleActive({ schedule: { ...schedule, realLestaOnly: true }, hasLesta: true, lestaMock: true })).toBe(false);
  });

  it('runs a plain schedule everywhere', () => {
    expect(isScheduleActive({ schedule, hasLesta: false, lestaMock: true })).toBe(true);
  });
});
