'use client';

import { match } from 'ts-pattern';

import { useAuthSession } from '@/entities/auth/session';
import { env } from '@/shared/config';

import { resolveMiniAppMode } from '../lib/mini-app-mode';
import { useMiniAppSignIn, useTelegramEnv, useTelegramSdk } from '../model/hooks';
import { MiniDashboard, MiniSkeleton, OutsideTelegram, PreviewBanner, SignInFailed } from './components';

import s from './MiniAppPage.module.scss';

export const MiniAppPage = () => {
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const launch = useTelegramEnv();
  const signIn = useMiniAppSignIn(launch);

  useTelegramSdk(launch.env === 'telegram');

  const mode = resolveMiniAppMode({
    env: launch.env,
    signInStatus: signIn.status,
    hasSession: Boolean(session),
    isSessionPending,
    isMock: env.NEXT_PUBLIC_USE_MOCKS
  });

  return (
    <div className={s.root}>
      {match(mode)
        .with('loading', () => <MiniSkeleton />)
        .with('failed', () => <SignInFailed isRetrying={signIn.isPending} onRetry={() => signIn.mutate(launch.initData ?? '')} />)
        .with('outside', () => <OutsideTelegram />)
        .with('preview', () => (
          <>
            <PreviewBanner />
            <MiniDashboard />
          </>
        ))
        .with('dashboard', () => <MiniDashboard />)
        .exhaustive()}
    </div>
  );
};
