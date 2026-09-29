'use client';

import type { StatsMode } from '@otmetki/schemas';

import { serverPeriodSchema, skillCohortSchema, statsModeSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { SegmentedControl, Select, Tabs } from '@/ui-kit';

import { TANKS_VIEWS } from '../../../config';
import { useTanksState } from '../../../model/hooks';

import s from './StatsControls.module.scss';

export const StatsControls = () => {
  const t = useTranslations('tanks.controls');
  const tPeriods = useTranslations('periods');
  const [{ period, cohort, mode, view }, setState] = useTanksState();

  return (
    <Tabs
      aside={
        <div className={s.row}>
          {view !== 'economy' && (
            <Select<StatsMode>
              aria-label={t('mode')}
              className={s.mode}
              items={statsModeSchema.options.map((value) => ({ value, label: t(`modes.${value}`) }))}
              value={mode}
              onValueChange={(next) => setState({ mode: next === 'all' ? null : next })}
            />
          )}
          <SegmentedControl
            aria-label={t('period')}
            options={serverPeriodSchema.options.map((value) => ({ value, label: tPeriods(value) }))}
            value={period}
            onChange={(next) => setState({ period: next })}
          />
          {view === 'table' && (
            <SegmentedControl
              aria-label={t('cohort')}
              options={skillCohortSchema.options.map((value) => ({ value, label: t(`cohorts.${value}`) }))}
              value={cohort}
              onChange={(next) => setState({ cohort: next })}
            />
          )}
        </div>
      }
      className={s.root}
      items={TANKS_VIEWS.map((value) => ({ value, label: t(`views.${value}`) }))}
      value={view}
      variant='strip'
      onValueChange={(next) => setState({ view: next })}
    />
  );
};
