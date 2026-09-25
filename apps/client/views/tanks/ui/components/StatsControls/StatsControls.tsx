'use client';

import { serverPeriodSchema, skillCohortSchema } from '@bronevik/schemas';
import { LayoutGrid, Table2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { Card, SegmentedControl } from '@/ui-kit';

import { TANKS_VIEWS } from '../../../config';
import { useTanksState } from '../../../model/hooks';

import s from './StatsControls.module.scss';

const VIEW_ICONS = { table: <Table2 size={15} />, tierlist: <LayoutGrid size={15} /> } as const;

export const StatsControls = () => {
  const t = useTranslations('tanks.controls');
  const [{ period, cohort, view }, setState] = useTanksState();

  return (
    <Card className={s.root} padding='md' variant='flat'>
      <div className={s.bar}>
        <SegmentedControl
          aria-label={t('view')}
          options={TANKS_VIEWS.map((value) => ({ value, label: t(`views.${value}`), icon: VIEW_ICONS[value] }))}
          value={view}
          onChange={(next) => setState({ view: next })}
        />
        <SegmentedControl
          aria-label={t('period')}
          options={serverPeriodSchema.options.map((value) => ({ value, label: t(`periods.${value}`) }))}
          size='sm'
          value={period}
          onChange={(next) => setState({ period: next })}
        />
        {view === 'table' && (
          <SegmentedControl
            aria-label={t('cohort')}
            options={skillCohortSchema.options.map((value) => ({ value, label: t(`cohorts.${value}`) }))}
            size='sm'
            value={cohort}
            onChange={(next) => setState({ cohort: next })}
          />
        )}
      </div>
      <VehicleFilters />
    </Card>
  );
};
