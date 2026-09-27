'use client';

import { match } from 'ts-pattern';

import type { MiniAppPageProps } from './MiniAppPage.types';

import { useMiniAppPage } from '../model/hooks';
import { MiniDashboard, MiniSkeleton, OutsideTelegram, OutsideVk, PreviewBanner, SignInFailed } from './components';

import s from './MiniAppPage.module.scss';

export const MiniAppPage = ({ platform }: MiniAppPageProps) => {
  const { mode, isRetrying, retry } = useMiniAppPage(platform);
  const isVk = platform === 'vk';

  return (
    <div className={s.root}>
      {match(mode)
        .with('loading', () => <MiniSkeleton />)
        .with('failed', () => <SignInFailed isRetrying={isRetrying} platform={platform} onRetry={retry} />)
        .with('outside', () => (isVk ? <OutsideVk /> : <OutsideTelegram />))
        .with('preview', () => (
          <>
            {!isVk && <PreviewBanner />}
            <MiniDashboard />
          </>
        ))
        .with('dashboard', () => <MiniDashboard />)
        .exhaustive()}
    </div>
  );
};
