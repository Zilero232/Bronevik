import type { JobSchedule } from '../../modules/notifications';

export type JobSchedulesServiceInput = {
  queue: string;
  schedules: readonly JobSchedule[];
  label: string;
};
