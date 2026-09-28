import { millisecondsInDay } from 'date-fns/constants';

export const USAGE_DEVICE = {
  cookie: 'otmetki_device',
  maxAgeMs: 400 * millisecondsInDay,
  idLength: 21,
  signingContext: 'usage-device:',
  ipContext: 'usage-ip:',
  ipHashLength: 24,
  separator: '.'
} as const;
