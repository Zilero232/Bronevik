'use client';

import { useAuthSession } from '@/entities/auth/session';

import type { MiniAppPlatform } from '../../../lib/mini-app-mode';

import { resolveMiniAppMode } from '../../../lib/mini-app-mode';
import { useMiniAppLaunch } from '../use-mini-app-launch';
import { useMiniAppSignIn } from '../use-mini-app-sign-in';
import { useTelegramSdk } from '../use-telegram-sdk';
import { useVkBridge } from '../use-vk-bridge';

export const useMiniAppPage = (platform: MiniAppPlatform) => {
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const launch = useMiniAppLaunch(platform);
  const signIn = useMiniAppSignIn({ launch, platform });
  const isInside = launch.env === 'inside';

  useTelegramSdk(isInside && platform === 'telegram');
  useVkBridge(isInside && platform === 'vk');

  return {
    mode: resolveMiniAppMode({ env: launch.env, signInStatus: signIn.status, hasSession: Boolean(session), isSessionPending }),
    isRetrying: signIn.isPending,
    retry: () => signIn.mutate(launch.payload ?? '')
  };
};
