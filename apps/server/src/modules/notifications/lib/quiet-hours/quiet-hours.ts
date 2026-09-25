import type { IsInsideInput, QuietDelayInput } from './quiet-hours.types';

import { QUIET_HOURS } from './quiet-hours.constants';

const clockIn = ({ now, timeZone }: Pick<QuietDelayInput, 'now' | 'timeZone'>): { hour: number; minute: number } => {
  const format = (zone: string) =>
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', hourCycle: 'h23', timeZone: zone }).formatToParts(now);

  let parts: Intl.DateTimeFormatPart[];

  try {
    parts = format(timeZone);
  } catch {
    parts = format(QUIET_HOURS.fallbackTimeZone);
  }

  const read = (type: 'hour' | 'minute') => Number(parts.find((part) => part.type === type)?.value ?? 0);

  return { hour: read('hour'), minute: read('minute') };
};

const isInside = ({ quietHours: { start, end }, hour }: IsInsideInput): boolean =>
  start < end ? hour >= start && hour < end : hour >= start || hour < end;

export const quietDelayMs = ({ quietHours, now, timeZone }: QuietDelayInput): number => {
  if (!quietHours || quietHours.start === quietHours.end) {
    return 0;
  }

  const { hour, minute } = clockIn({ now, timeZone });

  if (!isInside({ quietHours, hour })) {
    return 0;
  }

  const hoursLeft = (quietHours.end - hour + QUIET_HOURS.hoursInDay) % QUIET_HOURS.hoursInDay;

  return (hoursLeft * QUIET_HOURS.minutesInHour - minute) * QUIET_HOURS.msInMinute;
};
