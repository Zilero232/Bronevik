import { TZDate, tzOffset } from '@date-fns/tz';
import { getHours, getMinutes, hoursToMinutes, minutesToMilliseconds } from 'date-fns';

import type { IsInsideInput, QuietDelayInput } from './quiet-hours.types';

import { TIME } from '../../../../config';
import { QUIET_HOURS } from './quiet-hours.constants';

const isValidTimeZone = ({ now, timeZone }: Pick<QuietDelayInput, 'now' | 'timeZone'>): boolean => !Number.isNaN(tzOffset(timeZone, now));

const isInside = ({ quietHours: { start, end }, hour }: IsInsideInput): boolean =>
  start < end ? hour >= start && hour < end : hour >= start || hour < end;

export const quietDelayMs = ({ quietHours, now, timeZone }: QuietDelayInput): number => {
  if (!quietHours || quietHours.start === quietHours.end) {
    return 0;
  }

  const clock = new TZDate(now, isValidTimeZone({ now, timeZone }) ? timeZone : TIME.zone);
  const hour = getHours(clock);

  if (!isInside({ quietHours, hour })) {
    return 0;
  }

  const hoursLeft = (quietHours.end - hour + QUIET_HOURS.hoursInDay) % QUIET_HOURS.hoursInDay;

  return minutesToMilliseconds(hoursToMinutes(hoursLeft) - getMinutes(clock));
};
