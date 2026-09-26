import { secondsInDay, secondsInHour, secondsInMinute } from 'date-fns/constants';

import type { CountdownParts } from './countdown-parts.types';

export const countdownParts = (left: number): CountdownParts => {
  const total = Math.max(0, Math.floor(left));

  return {
    days: Math.floor(total / secondsInDay),
    hours: Math.floor((total % secondsInDay) / secondsInHour),
    minutes: Math.floor((total % secondsInHour) / secondsInMinute)
  };
};
