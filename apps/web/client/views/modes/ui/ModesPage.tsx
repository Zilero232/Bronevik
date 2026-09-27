'use client';

import { useTranslations } from 'next-intl';

import { ModeSourceNote } from '@/entities/mode/mode';
import { PageHeader, QueryState, Skeleton } from '@/ui-kit';

import { MODES_HUB } from '../config';
import { useModesHub } from '../model/hooks';
import { ModePanel } from './components';

import s from './ModesPage.module.scss';

export const ModesPage = () => {
  const t = useTranslations('modes.hub');
  const query = useModesHub();

  return (
    <div className={s.root}>
      <PageHeader description={t('description')} title={t('title')} />
      <QueryState
        errorDescription={t('errorDescription')}
        errorTitle={t('errorTitle')}
        query={query}
        skeleton={<Skeleton height={MODES_HUB.skeletonHeight} shape='block' />}
      >
        {({ panels, windowDays, computedAt }) => (
          <>
            <div className={s.grid}>
              {panels.map((panel) => (
                <ModePanel key={panel.mode} panel={panel} />
              ))}
            </div>
            <ModeSourceNote computedAt={computedAt} windowDays={windowDays} />
          </>
        )}
      </QueryState>
    </div>
  );
};
