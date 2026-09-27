import { hoursToMilliseconds } from 'date-fns';

export const TANK_PICKER = {
  limit: 60,
  catalogStaleMs: hoursToMilliseconds(1)
} as const;
