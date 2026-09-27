'use client';

import { useClientNow, useCountdown } from '@/shared/lib';

import type { UseCodeCountdownInput } from './use-code-countdown.types';

import { codeLifetime, formatCountdown } from '../../../lib/code-countdown';

export const useCodeCountdown = ({ expiresAt, issuedAt }: UseCodeCountdownInput) => {
  const now = useClientNow();
  const { left, isExpired } = useCountdown({ seconds: (at) => codeLifetime({ expiresAt, issuedAt, now: at.getTime() }).left });

  const lifetime = now ? codeLifetime({ expiresAt, issuedAt, now: now.getTime() }) : null;

  return { label: formatCountdown(left), ratio: lifetime ? left / lifetime.total : 0, isExpired };
};
