import type { JobSchedule } from '../../../common/lib';
import type { QueueName } from '../contracts';

export type ScheduleDefinition = JobSchedule & {
  queue: QueueName;
};
