import type { CountdownClockInput } from './countdown.types';

export const countdownClock = ({ hours, minutes, seconds }: CountdownClockInput) =>
  [hours, minutes, seconds].map((part) => String(Math.max(part, 0)).padStart(2, '0')).join(':');
