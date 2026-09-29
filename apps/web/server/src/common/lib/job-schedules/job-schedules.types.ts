import type { Queue } from 'bullmq';

type JobRepeat = { every: number } | { pattern: string };

export type JobSchedule = {
  id: string;
  queue: string;
  name: string;
  repeat: JobRepeat;
  data?: Record<string, unknown>;
  enabled?: boolean;
  needsLesta?: boolean;
};

export type ScheduleEnvironment = {
  hasLesta: boolean;
};

export type IsScheduleActiveInput = ScheduleEnvironment & {
  schedule: JobSchedule;
};

export type RegisterJobSchedulesInput = {
  schedules: readonly JobSchedule[];
  queueOf: (name: string) => Queue;
  environment: ScheduleEnvironment;
};
