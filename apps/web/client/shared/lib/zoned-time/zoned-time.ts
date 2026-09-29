import { tz, TZDate } from '@date-fns/tz';
import { addMinutes, format, getHours, getMinutes, isValid, parse, parseISO, startOfDay } from 'date-fns';

import { TIME_ZONE } from '@/shared/i18n';

import type { ComposeZonedInput, RoundedZonedInput, ZonedInputParts, ZonedTimeInput } from './zoned-time.types';

import { ZONED_TIME } from './zoned-time.constants';

export const zonedInputToIso = ({ value, timeZone = TIME_ZONE }: ZonedTimeInput): string | undefined => {
  if (!value) {
    return undefined;
  }

  const zone = tz(timeZone);
  const date = ZONED_TIME.inputFormats.map((pattern) => parse(value, pattern, zone(0), { in: zone })).find((parsed) => isValid(parsed));

  return date ? new Date(date.getTime()).toISOString() : undefined;
};

export const isoToZonedInput = ({ value, timeZone = TIME_ZONE }: ZonedTimeInput): string => {
  if (!value) {
    return '';
  }

  const zone = tz(timeZone);
  const date = parseISO(value, { in: zone });

  return isValid(date) ? format(date, ZONED_TIME.outputFormat, { in: zone }) : '';
};

export const zonedInputParts = ({ value, timeZone = TIME_ZONE }: ZonedTimeInput): ZonedInputParts | null => {
  const iso = zonedInputToIso({ value, timeZone });

  if (!iso) {
    return null;
  }

  const date = new TZDate(iso, timeZone);

  return { day: startOfDay(date), hours: getHours(date), minutes: getMinutes(date) };
};

export const composeZonedInput = ({ day, hours, minutes, timeZone = TIME_ZONE }: ComposeZonedInput): string => {
  const zone = tz(timeZone);

  return `${format(day, ZONED_TIME.dayFormat, { in: zone })}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const roundedZonedInput = ({ now, stepMinutes, timeZone = TIME_ZONE }: RoundedZonedInput): string => {
  const date = new TZDate(+now, timeZone);
  const overshoot = getMinutes(date) % stepMinutes;
  const rounded = overshoot === 0 ? date : addMinutes(date, stepMinutes - overshoot);

  return composeZonedInput({ day: rounded, hours: getHours(rounded), minutes: getMinutes(rounded), timeZone });
};
