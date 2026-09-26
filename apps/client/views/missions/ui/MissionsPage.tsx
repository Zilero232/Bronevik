'use client';

import { useTranslations } from 'next-intl';

import { Badge, DataSourceNote, EmptyState, ErrorState, PageHeader, SectionHeader, Skeleton } from '@/ui-kit';

import { useMissionsHub } from '../model/hooks';
import { OperationCard } from './components';

import s from './MissionsPage.module.scss';

export const MissionsPage = () => {
  const t = useTranslations('missions.hub');
  const { data, isPending, isError, isRetrying, retry, progressOf } = useMissionsHub();

  return (
    <div className={s.root}>
      <PageHeader
        description={t('description')}
        meta={data?.gameVersion && <Badge tone='steel'>{t('gameVersion', { version: data.gameVersion })}</Badge>}
        title={t('title')}
      />
      {isError && <ErrorState description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />}
      {isPending && <Skeleton height={320} shape='block' />}
      {data?.campaigns.length === 0 && <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />}
      {data?.campaigns.map((campaign) => (
        <section key={campaign.campaignId} className={s.campaign}>
          <SectionHeader description={campaign.description} title={campaign.name ?? t('campaign', { id: campaign.campaignId })} />
          <div className={s.grid}>
            {campaign.operations.map((operation) => (
              <OperationCard key={operation.operationId} operation={operation} progress={progressOf(operation.questIds)} />
            ))}
          </div>
        </section>
      ))}
      <DataSourceNote />
    </div>
  );
};
