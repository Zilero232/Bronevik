'use client';

import { CrosshairIcon } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Badge, DataSourceNote, EmptyState, KeyFigure, PageHero, QueryState, SectionHeader, Skeleton } from '@/ui-kit';

import { useMissionsHub } from '../model/hooks';
import { OperationCard } from './components';

import s from './MissionsPage.module.scss';

export const MissionsPage = () => {
  const t = useTranslations('missions.hub');
  const { campaigns, operationsCount, progressOf } = useMissionsHub();

  return (
    <div className={s.root}>
      <PageHero
        art={{ kind: 'emblem', glyph: <CrosshairIcon size={480} /> }}
        breadcrumbs={[{ label: t('home'), href: ROUTES.home }, { label: t('title') }]}
        eyebrow={campaigns.data?.gameVersion && <Badge tone='steel'>{t('gameVersion', { version: campaigns.data.gameVersion })}</Badge>}
        figures={operationsCount !== null && <KeyFigure label={t('operationsFigure')} value={operationsCount} variant='compact' />}
        lead={t('description')}
        title={t('title')}
      />
      <div className={s.body}>
        <QueryState
          empty={<EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />}
          errorDescription={t('errorDescription')}
          errorTitle={t('errorTitle')}
          isEmpty={(data) => data.campaigns.length === 0}
          query={campaigns}
          skeleton={<Skeleton height={320} shape='block' />}
        >
          {(data) =>
            data.campaigns.map((campaign) => (
              <section key={campaign.campaignId} className={s.campaign}>
                <SectionHeader description={campaign.description} title={campaign.name ?? t('campaign', { id: campaign.campaignId })} />
                <div className={s.grid}>
                  {campaign.operations.map((operation) => (
                    <OperationCard key={operation.operationId} operation={operation} progress={progressOf(operation.questIds)} />
                  ))}
                </div>
              </section>
            ))
          }
        </QueryState>
        <DataSourceNote />
      </div>
    </div>
  );
};
