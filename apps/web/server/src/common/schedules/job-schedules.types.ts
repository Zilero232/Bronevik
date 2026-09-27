import type { JobSchedule } from '../lib';

export type CreateJobSchedulesInput = {
  schedules: readonly JobSchedule[];
  label: string;
};
