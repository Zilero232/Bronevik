'use client';

import { useAuthSession } from '@/entities/auth/session';

import { resolveMiniAppMode } from '../../../lib/mini-app-mode';
import { useMiniAppSignIn } from '../use-mini-app-sign-in';
import { useTelegramEnv } from '../use-telegram-env';
import { useTelegramSdk } from '../use-telegram-sdk';

export const useMiniAppPage = () => {
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const launch = useTelegramEnv();
  const signIn = useMiniAppSignIn(launch);

  useTelegramSdk(launch.env === 'telegram');

  return {
    mode: resolveMiniAppMode({ env: launch.env, signInStatus: signIn.status, hasSession: Boolean(session), isSessionPending }),
    isRetrying: signIn.isPending,
    retry: () => signIn.mutate(launch.initData ?? '')
  };
};
