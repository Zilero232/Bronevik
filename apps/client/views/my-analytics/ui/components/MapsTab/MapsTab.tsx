'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataTable, EmptyState } from '@/ui-kit';

import { useAnalyticsMaps } from '../../../model/hooks';
import { AnalyticsState } from '../AnalyticsState';
import { ModEmptyState } from '../ModEmptyState';

import s from './MapsTab.module.scss';

export const MapsTab = () => {
  const t = useTranslations('analytics.maps');
  const maps = useAnalyticsMaps();

  return (
    <AnalyticsState data={maps.data} feature='mapAdvisor' isRetrying={maps.isRetrying} status={maps.status} onRetry={maps.retry}>
      {(data) =>
        maps.isEmpty ? (
          <ModEmptyState />
        ) : (
          <div className={s.root}>
            <div className={s.callouts}>
              <Card className={s.callout} data-kind='weak'>
                <span className={s.calloutTitle}>
                  <TrendingDown aria-hidden size={16} />
                  {t('weakTitle')}
                </span>
                <p className={s.calloutText}>{maps.listText(maps.weakMaps)}</p>
              </Card>
              <Card className={s.callout} data-kind='strong'>
                <span className={s.calloutTitle}>
                  <TrendingUp aria-hidden size={16} />
                  {t('strongTitle')}
                </span>
                <p className={s.calloutText}>{maps.listText(maps.strongMaps)}</p>
              </Card>
            </div>
            <Card padding='none'>
              <CardHeader meta={t('description')} title={t('title')} />
              <DataTable
                caption={t('title')}
                columns={maps.mapsColumns}
                data={data.maps}
                density='compact'
                emptyState={<EmptyState isCompact title={t('empty')} />}
                getRowId={(row) => row.arenaId}
                initialSorting={[{ id: 'battles', desc: true }]}
              />
            </Card>
            <Card padding='none'>
              <CardHeader meta={t('rowsDescription')} title={t('rowsTitle')} />
              <DataTable
                caption={t('rowsTitle')}
                columns={maps.rowsColumns}
                data={maps.rows}
                density='compact'
                emptyState={<EmptyState isCompact title={t('empty')} />}
                getRowId={(row) => `${row.arenaId}:${row.vehicleClass ?? ''}:${row.team ?? ''}`}
                initialSorting={[{ id: 'battles', desc: true }]}
              />
            </Card>
          </div>
        )
      }
    </AnalyticsState>
  );
};
