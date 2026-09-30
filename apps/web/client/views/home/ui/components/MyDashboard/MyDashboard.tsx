'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { EmptyState, ErrorState } from '@/ui-kit';

import { HOME } from '../../../config';
import { useMyDashboard } from '../../../model/hooks';
import { DashboardAsk, DashboardReady, DashboardSkeleton, DashboardSwitch } from './components';

import s from './MyDashboard.module.scss';

export const MyDashboard = () => {
  const t = useTranslations('home.dashboard');
  const titleId = useId();
  const { state, nickname, profile, week, session, marks, isRetrying, retry, forget } = useMyDashboard();

  return (
    <section aria-busy={state === 'pending' || state === 'loading'} aria-labelledby={titleId} className={s.root} id={HOME.dashboard.anchor}>
      <h2 className={s.srTitle} id={titleId}>
        {t('label')}
      </h2>
      <div className={s.frame} data-state={state}>
        {(state === 'pending' || state === 'loading') && (
          <div className={s.body}>
            <DashboardSkeleton />
          </div>
        )}
        {state === 'ask' && (
          <>
            <div className={clsx(s.body, s.ghost)}>
              <DashboardSkeleton />
            </div>
            <DashboardAsk className={s.ask} />
          </>
        )}
        {state === 'missing' && (
          <EmptyState
            action={<DashboardSwitch onForget={forget} />}
            className={s.notice}
            description={t('missing.description')}
            role='alert'
            title={t('missing.title', { nickname })}
            titleAs='h3'
          />
        )}
        {state === 'error' && (
          <div className={s.notice}>
            <ErrorState description={t('error.description')} isRetrying={isRetrying} title={t('error.title')} onRetry={retry} />
            <DashboardSwitch onForget={forget} />
          </div>
        )}
        {state === 'ready' && profile && (
          <div className={s.body}>
            <DashboardReady marks={marks} nickname={nickname} profile={profile} session={session} week={week} onForget={forget} />
          </div>
        )}
      </div>
    </section>
  );
};
