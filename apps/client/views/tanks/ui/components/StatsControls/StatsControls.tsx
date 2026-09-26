'use client';

import { serverPeriodSchema, skillCohortSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { SegmentedControl } from '@/ui-kit';

import { TANKS_VIEWS } from '../../../config';
import { useTanksState } from '../../../model/hooks';

import s from './StatsControls.module.scss';

export const StatsControls = () => {
  const t = useTranslations('tanks.controls');
  const [{ period, cohort, view }, setState] = useTanksState();

  return (
    <div className={s.root}>
      <div className={s.row}>
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
        <SegmentedControl
          aria-label={t('view')}
          className={s.view}
          options={TANKS_VIEWS.map((value) => ({ value, label: t(`views.${value}`) }))}
          size='sm'
          value={view}
          onChange={(next) => setState({ view: next })}
        />
      </div>
      <VehicleFilters />
    </div>
  );
};
