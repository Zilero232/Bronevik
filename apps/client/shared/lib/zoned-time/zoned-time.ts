import { tz } from '@date-fns/tz';
import { format, isValid, parse, parseISO } from 'date-fns';

import { TIME_ZONE } from '@/shared/i18n';

import type { ZonedTimeInput } from './zoned-time.types';

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
