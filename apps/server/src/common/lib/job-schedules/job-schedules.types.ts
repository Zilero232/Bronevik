import type { Queue } from 'bullmq';

type JobRepeat = { every: number } | { pattern: string };

export type JobSchedule = {
  id: string;
  queue: string;
  name: string;
  repeat: JobRepeat;
  data?: Record<string, unknown>;
  enabled?: boolean;
};

export type RegisterJobSchedulesInput = {
  schedules: readonly JobSchedule[];
  queueOf: (name: string) => Queue;
  timezone: string;
};
