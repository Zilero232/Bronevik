'use client';

import { useTimer } from '@siberiacancode/reactuse';
import { useState } from 'react';

import type { UseCodeCountdownInput } from './use-code-countdown.types';

import { codeLifetime, formatCountdown } from '../../../lib/code-countdown';

export const useCodeCountdown = ({ expiresAt, issuedAt }: UseCodeCountdownInput) => {
  const [lifetime] = useState(() => codeLifetime({ expiresAt, issuedAt, now: Date.now() }));
  const { count } = useTimer(lifetime.left);

  return { label: formatCountdown(count), ratio: count / lifetime.total, isExpired: count === 0 };
};
