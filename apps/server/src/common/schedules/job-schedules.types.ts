import type { JobSchedule } from '../lib';

export type CreateJobSchedulesInput = {
  queue: string;
  schedules: readonly JobSchedule[];
  label: string;
};
