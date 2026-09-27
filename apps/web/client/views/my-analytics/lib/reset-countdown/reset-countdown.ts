import { millisecondsInSecond } from 'date-fns/constants';

import type { ResetClockInput, SecondsUntilInput } from './reset-countdown.types';

export const secondsUntil = ({ at, now }: SecondsUntilInput): number => Math.max(0, Math.floor((Date.parse(at) - now) / millisecondsInSecond));

export const resetClock = ({ hours, minutes, seconds }: ResetClockInput): string =>
  [hours, minutes, seconds].map((part) => String(Math.max(part, 0)).padStart(2, '0')).join(':');
