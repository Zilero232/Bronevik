import type { RegisterJobSchedulesInput } from './job-schedules.types';

export const registerJobSchedules = async ({ schedules, queueOf, timezone }: RegisterJobSchedulesInput): Promise<number> => {
  let registered = 0;

  for (const schedule of schedules) {
    const queue = queueOf(schedule.queue);

    if (schedule.enabled === false) {
      await queue.removeJobScheduler(schedule.id);

      continue;
    }

    const repeat = 'pattern' in schedule.repeat ? { pattern: schedule.repeat.pattern, tz: timezone } : { every: schedule.repeat.every };

    await queue.upsertJobScheduler(schedule.id, repeat, { name: schedule.name, data: schedule.data ?? {} });
    registered += 1;
  }

  return registered;
};
