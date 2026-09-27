'use client';

import { useTranslations } from 'next-intl';

import { TankShowcaseCard, WinRateCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Card, CardHeader, DataTable, EmptyState, QueryState, SectionHeader } from '@/ui-kit';

import type { MissionTanksProps } from './MissionTanks.types';

import { useMissionTanks } from '../../../model/hooks';
import { MetricCell } from './components';

import s from './MissionTanks.module.scss';

export const MissionTanks = ({ questId, metric }: MissionTanksProps) => {
  const t = useTranslations('missions');
  const { columns, garageColumns, tanks, showcase, garage, garageNotice, garageTanks } = useMissionTanks({ questId, metric });

  return (
    <div className={s.root}>
      {showcase.length > 0 && (
        <section className={s.showcase}>
          <SectionHeader as='h3' title={t('tanks.showcaseTitle')} variant='display' />
          <ul className={s.cards}>
            {showcase.map((row) => (
              <li key={row.vehicle.tankId}>
                <TankShowcaseCard
                  figures={[
                    { id: 'metric', label: t(`metric.${metric}`), value: <MetricCell metric={metric} value={row.value} /> },
                    { id: 'winRate', label: t('tanks.winRate'), value: <WinRateCell value={row.winRate} /> }
                  ]}
                  vehicle={row.vehicle}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
      <Card padding='none'>
        <CardHeader
          meta={
            tanks.data &&
            t('tanks.description', {
              metric: t(`metric.${tanks.data.metric}`),
              cohort: t(`tanks.cohort.${tanks.data.cohort}`),
              period: t(`periods.${tanks.data.period}`)
            })
          }
          title={t('tanks.title')}
        />
        <QueryState
          isCompact
          errorTitle={t('tanks.errorTitle')}
          query={tanks}
          skeleton={<DataTable isLoading columns={columns} data={[]} density='compact' />}
        >
          {({ tanks: rows }) => (
            <DataTable
              columns={columns}
              data={rows}
              density='compact'
              emptyState={<EmptyState isCompact description={t('tanks.emptyDescription')} title={t('tanks.emptyTitle')} />}
              getRowId={(row) => String(row.vehicle.tankId)}
              getRowLink={({ vehicle }) => ({ href: ROUTES.tanks.detail(vehicle.slug), label: vehicle.name })}
            />
          )}
        </QueryState>
      </Card>
      <Card padding='none'>
        <CardHeader title={t('tanks.garageTitle')} />
        {garageNotice && <p className={s.note}>{t(`tanks.${garageNotice}`)}</p>}
        {!garageNotice && (
          <QueryState isCompact query={garage} skeleton={<DataTable isLoading columns={garageColumns} data={[]} density='compact' />}>
            <DataTable
              columns={garageColumns}
              data={garageTanks}
              density='compact'
              emptyState={<EmptyState isCompact title={t('tanks.garageEmpty')} />}
              getRowId={(row) => String(row.vehicle.tankId)}
              getRowLink={({ vehicle }) => ({ href: ROUTES.tanks.detail(vehicle.slug), label: vehicle.name })}
            />
          </QueryState>
        )}
      </Card>
    </div>
  );
};
