import type { CodeLifetime, CodeLifetimeInput } from './code-countdown.types';

import { CODE_COUNTDOWN } from '../../config/code-countdown.constants';

export const formatCountdown = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds));

  return `${Math.floor(safe / CODE_COUNTDOWN.secondsInMinute)}:${String(safe % CODE_COUNTDOWN.secondsInMinute).padStart(2, '0')}`;
};

export const codeLifetime = ({ expiresAt, issuedAt, now }: CodeLifetimeInput): CodeLifetime => {
  const deadline = new Date(expiresAt).getTime();

  return {
    left: Math.max(0, Math.ceil((deadline - now) / CODE_COUNTDOWN.msInSecond)),
    total: Math.max(1, Math.ceil((deadline - Math.min(issuedAt, now)) / CODE_COUNTDOWN.msInSecond))
  };
};
