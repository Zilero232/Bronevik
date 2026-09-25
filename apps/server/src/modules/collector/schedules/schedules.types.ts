import type { QueueName } from '../contracts';

type ScheduleRepeat = { every: number } | { pattern: string };

export type ScheduleDefinition = {
  id: string;
  queue: QueueName;
  name: string;
  repeat: ScheduleRepeat;
  data?: Record<string, unknown>;
  enabled?: boolean;
  needsLesta?: boolean;
};

export type IsScheduleActiveInput = {
  schedule: ScheduleDefinition;
  hasLesta: boolean;
};
