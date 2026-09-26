'use client';

import { serverPeriodSchema, skillCohortSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { SegmentedControl, Tabs } from '@/ui-kit';

import { TANKS_VIEWS } from '../../../config';
import { useTanksState } from '../../../model/hooks';
import { TraitFilters } from './components';

import s from './StatsControls.module.scss';

export const StatsControls = () => {
  const t = useTranslations('tanks.controls');
  const [{ period, cohort, view }, setState] = useTanksState();

  return (
    <div className={s.root}>
      <Tabs
        aside={
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
          </div>
        }
        items={TANKS_VIEWS.map((value) => ({ value, label: t(`views.${value}`) }))}
        value={view}
        variant='strip'
        onValueChange={(next) => setState({ view: next })}
      />
      <TraitFilters />
    </div>
  );
};
