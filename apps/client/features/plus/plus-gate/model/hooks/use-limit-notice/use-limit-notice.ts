'use client';

import { plusLimit } from '@otmetki/schemas';

import type { UseLimitNoticeInput } from './use-limit-notice.types';

import { usePlus } from '../use-plus';

export const useLimitNotice = ({ limitKey, used }: UseLimitNoticeInput) => {
  const { isPlus, isSignedIn, limits } = usePlus();

  const limit = limits[limitKey];

  return {
    isVisible: isSignedIn && used >= limit,
    isPlus,
    limit,
    plusLimit: plusLimit({ key: limitKey, isPlus: true })
  };
};
