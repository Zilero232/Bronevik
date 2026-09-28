import { hoursToMilliseconds } from 'date-fns';

export const VEHICLE_CATALOG = {
  staleMs: hoursToMilliseconds(1)
} as const;
