'use client';

import { match } from 'ts-pattern';

import { useMiniAppPage } from '../model/hooks';
import { MiniDashboard, MiniSkeleton, OutsideTelegram, PreviewBanner, SignInFailed } from './components';

import s from './MiniAppPage.module.scss';

export const MiniAppPage = () => {
  const { mode, isRetrying, retry } = useMiniAppPage();

  return (
    <div className={s.root}>
      {match(mode)
        .with('loading', () => <MiniSkeleton />)
        .with('failed', () => <SignInFailed isRetrying={isRetrying} onRetry={retry} />)
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
