import { minutesToMilliseconds } from 'date-fns';

export const AUTH_SESSION = {
  staleMs: minutesToMilliseconds(5)
} as const;
