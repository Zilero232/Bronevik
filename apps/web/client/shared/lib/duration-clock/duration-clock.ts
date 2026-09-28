import { secondsToHours, secondsToMinutes } from 'date-fns';
import { minutesInHour, secondsInDay, secondsInMinute } from 'date-fns/constants';

import type { DurationParts } from './duration-clock.types';

const wholeSeconds = (totalSeconds: number) => Math.max(0, Math.round(totalSeconds));

const twoDigits = (value: number) => String(value).padStart(2, '0');

export const durationParts = (totalSeconds: number): DurationParts => {
  const seconds = wholeSeconds(totalSeconds);

  return {
    days: Math.floor(seconds / secondsInDay),
    hours: secondsToHours(seconds % secondsInDay),
    minutes: secondsToMinutes(seconds) % minutesInHour,
    seconds: seconds % secondsInMinute
  };
};

export const minutesClock = (totalSeconds: number): string => {
  const seconds = wholeSeconds(totalSeconds);

  return `${secondsToMinutes(seconds)}:${twoDigits(seconds % secondsInMinute)}`;
};

export const hoursClock = (totalSeconds: number): string => {
  const seconds = wholeSeconds(totalSeconds);

  return [secondsToHours(seconds), secondsToMinutes(seconds) % minutesInHour, seconds % secondsInMinute].map(twoDigits).join(':');
};
