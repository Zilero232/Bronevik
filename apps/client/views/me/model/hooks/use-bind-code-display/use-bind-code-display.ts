'use client';

import type { BindCode } from '@otmetki/schemas';

import { useCopy, useInterval } from '@siberiacancode/reactuse';
import { differenceInSeconds } from 'date-fns';
import { useState } from 'react';

import { BIND_CODE } from '../../../config';
import { formatCountdown } from '../../../lib/countdown';

export const useBindCodeDisplay = (code: BindCode) => {
  const { copied, copy } = useCopy();
  const [now, setNow] = useState(() => Date.now());

  useInterval(() => setNow(Date.now()), BIND_CODE.tickMs);

  const left = Math.max(0, differenceInSeconds(new Date(code.expiresAt), now, { roundingMethod: 'round' }));

  return {
    chars: [...code.code].map((char, position) => ({ char, position })),
    clock: formatCountdown(left),
    isExpired: left === 0,
    copied,
    onCopy: () => copy(code.code)
  };
};
