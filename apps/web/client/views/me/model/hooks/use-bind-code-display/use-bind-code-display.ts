'use client';

import type { BindCode } from '@otmetki/schemas';

import { useCopy } from '@siberiacancode/reactuse';
import { differenceInSeconds } from 'date-fns';

import { minutesClock, useClientNow } from '@/shared/lib';

import { BIND_CODE } from '../../../config';

export const useBindCodeDisplay = (code: BindCode) => {
  const { copied, copy } = useCopy();
  const now = useClientNow({ updateInterval: BIND_CODE.tickMs });

  const left = now ? Math.max(0, differenceInSeconds(new Date(code.expiresAt), now, { roundingMethod: 'round' })) : null;

  return {
    chars: [...code.code].map((char, position) => ({ char, position })),
    clock: minutesClock(left ?? 0),
    isExpired: left === 0,
    copied,
    onCopy: () => copy(code.code)
  };
};
