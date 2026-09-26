'use client';

import { isTMA } from '@tma.js/sdk-react';
import { useMemo } from 'react';

import { useHydrated } from '@/shared/lib';

import type { TelegramLaunch } from '../../../lib/mini-app-mode';

import { readInitData } from '../../../lib/init-data';

export const useTelegramEnv = (): TelegramLaunch => {
  const isHydrated = useHydrated();

  return useMemo<TelegramLaunch>(() => {
    if (!isHydrated) {
      return { env: 'detecting', initData: null };
    }

    return isTMA() ? { env: 'telegram', initData: readInitData() } : { env: 'browser', initData: null };
  }, [isHydrated]);
};
