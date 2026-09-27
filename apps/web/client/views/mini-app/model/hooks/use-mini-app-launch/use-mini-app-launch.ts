'use client';

import { isTMA } from '@tma.js/sdk-react';
import { useMemo } from 'react';
import { match } from 'ts-pattern';

import { useHydrated } from '@/shared/lib';

import type { MiniAppLaunch, MiniAppPlatform } from '../../../lib/mini-app-mode';

import { readInitData } from '../../../lib/init-data';
import { readVkLaunchParams } from '../../../lib/vk-launch';

export const useMiniAppLaunch = (platform: MiniAppPlatform): MiniAppLaunch => {
  const isHydrated = useHydrated();

  return useMemo<MiniAppLaunch>(() => {
    if (!isHydrated) {
      return { env: 'detecting', payload: null };
    }

    const payload = match(platform)
      .with('telegram', () => (isTMA() ? (readInitData() ?? '') : null))
      .with('vk', () => readVkLaunchParams(window.location.search))
      .exhaustive();

    return payload === null ? { env: 'browser', payload: null } : { env: 'inside', payload };
  }, [isHydrated, platform]);
};
