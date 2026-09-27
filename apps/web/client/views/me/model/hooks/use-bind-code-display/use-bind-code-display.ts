'use client';

import type { BindCode } from '@otmetki/schemas';

import { useCopy } from '@siberiacancode/reactuse';
import { differenceInSeconds } from 'date-fns';

import { useClientNow } from '@/shared/lib';

import { BIND_CODE } from '../../../config';
import { formatCountdown } from '../../../lib/countdown';

export const useBindCodeDisplay = (code: BindCode) => {
  const { copied, copy } = useCopy();
  const now = useClientNow({ updateInterval: BIND_CODE.tickMs });

  const left = now ? Math.max(0, differenceInSeconds(new Date(code.expiresAt), now, { roundingMethod: 'round' })) : null;

  return {
    chars: [...code.code].map((char, position) => ({ char, position })),
    clock: formatCountdown(left ?? 0),
    isExpired: left === 0,
    copied,
    onCopy: () => copy(code.code)
  };
};
