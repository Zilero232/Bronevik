import type { CodeLifetime, CodeLifetimeInput } from './code-countdown.types';

import { CODE_COUNTDOWN } from '../../config/code-countdown.constants';

export const codeLifetime = ({ expiresAt, issuedAt, now }: CodeLifetimeInput): CodeLifetime => {
  const deadline = new Date(expiresAt).getTime();

  return {
    left: Math.max(0, Math.ceil((deadline - now) / CODE_COUNTDOWN.msInSecond)),
    total: Math.max(1, Math.ceil((deadline - Math.min(issuedAt, now)) / CODE_COUNTDOWN.msInSecond))
  };
};
