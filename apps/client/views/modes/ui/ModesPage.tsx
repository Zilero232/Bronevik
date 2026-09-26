'use client';

import { useTranslations } from 'next-intl';

import { ModeSourceNote } from '@/entities/mode/mode';
import { ErrorState, PageHeader, Skeleton } from '@/ui-kit';

import { MODES_HUB } from '../config';
import { useModesHub } from '../model/hooks';
import { ModePanel } from './components';

import s from './ModesPage.module.scss';

export const ModesPage = () => {
  const t = useTranslations('modes.hub');
  const { panels, windowDays, computedAt, isPending, isError, isRetrying, onRetry } = useModesHub();

  return (
    <div className={s.root}>
      <PageHeader description={t('description')} title={t('title')} />
      {isError && <ErrorState description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={onRetry} />}
      {isPending && <Skeleton height={MODES_HUB.skeletonHeight} shape='block' />}
      {panels.length > 0 && (
        <div className={s.grid}>
          {panels.map((panel) => (
            <ModePanel key={panel.mode} panel={panel} />
          ))}
        </div>
      )}
      {windowDays !== null && <ModeSourceNote computedAt={computedAt} windowDays={windowDays} />}
    </div>
  );
};
