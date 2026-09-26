import type { JobSchedule } from '../../modules/notifications';

export type CreateJobSchedulesInput = {
  queue: string;
  schedules: readonly JobSchedule[];
  label: string;
};
