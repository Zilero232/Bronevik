import { minutesToMilliseconds } from 'date-fns';

export const TIME_AGO = {
  updateIntervalMs: minutesToMilliseconds(1)
} as const;
