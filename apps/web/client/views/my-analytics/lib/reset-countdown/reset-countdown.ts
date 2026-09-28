import { millisecondsInSecond } from 'date-fns/constants';

import type { SecondsUntilInput } from './reset-countdown.types';

export const secondsUntil = ({ at, now }: SecondsUntilInput): number => Math.max(0, Math.floor((Date.parse(at) - now) / millisecondsInSecond));
