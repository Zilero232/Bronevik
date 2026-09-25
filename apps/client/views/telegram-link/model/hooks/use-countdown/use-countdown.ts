'use client';

import { useInterval } from '@siberiacancode/reactuse';
import { useState } from 'react';

import type { UseCountdownInput } from './use-countdown.types';

import { TELEGRAM_LINK } from '../../../config';
import { countdown } from '../../../lib/code-countdown';

export const useCountdown = ({ expiresAt, issuedAt }: UseCountdownInput) => {
  const [now, setNow] = useState(() => Date.now());

  useInterval(() => setNow(Date.now()), TELEGRAM_LINK.tickMs);

  return countdown({ expiresAt, issuedAt, now });
};
