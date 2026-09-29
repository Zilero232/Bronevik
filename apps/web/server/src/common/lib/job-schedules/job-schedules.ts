import { unique } from 'remeda';

import type { IsScheduleActiveInput, RegisterJobSchedulesInput } from './job-schedules.types';

import { TIME } from '../../../config';

export const isScheduleActive = ({ schedule, hasLesta }: IsScheduleActiveInput): boolean =>
  (schedule.enabled ?? true) && (hasLesta || !schedule.needsLesta);

export const registerJobSchedules = async ({ schedules, queueOf, environment }: RegisterJobSchedulesInput): Promise<number> => {
  const configured = new Set(schedules.map((schedule) => schedule.id));
  let registered = 0;

  for (const schedule of schedules) {
    const queue = queueOf(schedule.queue);

    if (!isScheduleActive({ schedule, ...environment })) {
      await queue.removeJobScheduler(schedule.id);

      continue;
    }

    const repeat = 'pattern' in schedule.repeat ? { pattern: schedule.repeat.pattern, tz: TIME.zone } : { every: schedule.repeat.every };

    await queue.upsertJobScheduler(schedule.id, repeat, { name: schedule.name, data: schedule.data ?? {} });
    registered += 1;
  }

  for (const name of unique(schedules.map((schedule) => schedule.queue))) {
    const queue = queueOf(name);

    for (const { key } of await queue.getJobSchedulers()) {
      if (!configured.has(key)) {
        await queue.removeJobScheduler(key);
      }
    }
  }

  return registered;
};
