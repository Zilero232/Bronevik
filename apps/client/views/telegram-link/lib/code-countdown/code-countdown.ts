import type { Countdown, CountdownInput } from './code-countdown.types';

const MS_IN_SECOND = 1_000;
const SECONDS_IN_MINUTE = 60;

export const formatCountdown = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds));

  return `${Math.floor(safe / SECONDS_IN_MINUTE)}:${String(safe % SECONDS_IN_MINUTE).padStart(2, '0')}`;
};

export const countdown = ({ expiresAt, issuedAt, now }: CountdownInput): Countdown => {
  const deadline = new Date(expiresAt).getTime();
  const left = Math.max(0, Math.ceil((deadline - now) / MS_IN_SECOND));
  const total = Math.max(1, Math.ceil((deadline - Math.min(issuedAt, now)) / MS_IN_SECOND));

  return { left, ratio: Math.min(1, left / total), label: formatCountdown(left), isExpired: left === 0 };
};
