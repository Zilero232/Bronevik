'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataTable, EmptyState, ErrorState } from '@/ui-kit';

import type { MissionTanksProps } from './MissionTanks.types';

import { useMissionTanks } from '../../../model/hooks';

import s from './MissionTanks.module.scss';

export const MissionTanks = ({ questId, metric }: MissionTanksProps) => {
  const t = useTranslations('missions');
  const { columns, garageColumns, tanks, isPending, isError, isRetrying, retry, garageNotice, isGarageLoading, garageTanks } = useMissionTanks({
    questId,
    metric
  });

  return (
    <div className={s.root}>
      <Card padding='none'>
        <CardHeader
          meta={
            tanks &&
            t('tanks.description', {
              metric: t(`metric.${tanks.metric}`),
              cohort: t(`tanks.cohort.${tanks.cohort}`),
              period: t(`periods.${tanks.period}`)
            })
          }
          title={t('tanks.title')}
        />
        {isError ? (
          <ErrorState isCompact isRetrying={isRetrying} title={t('tanks.errorTitle')} onRetry={retry} />
        ) : (
          <DataTable
            columns={columns}
            data={tanks?.tanks ?? []}
            density='compact'
            emptyState={<EmptyState isCompact description={t('tanks.emptyDescription')} title={t('tanks.emptyTitle')} />}
            getRowId={(row) => String(row.vehicle.tankId)}
            isLoading={isPending}
          />
        )}
      </Card>
      <Card padding='none'>
        <CardHeader title={t('tanks.garageTitle')} />
        {garageNotice ? (
          <p className={s.note}>{t(`tanks.${garageNotice}`)}</p>
        ) : (
          <DataTable
            columns={garageColumns}
            data={garageTanks}
            density='compact'
            emptyState={<EmptyState isCompact title={t('tanks.garageEmpty')} />}
            getRowId={(row) => String(row.vehicle.tankId)}
            isLoading={isGarageLoading}
          />
        )}
      </Card>
    </div>
  );
};
