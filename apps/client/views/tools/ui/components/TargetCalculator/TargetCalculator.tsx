'use client';

import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import type { TargetMetric } from '../../../config';
import type { TargetValues } from '../../../lib/calc-defaults';

import { TARGET, TARGET_METRICS } from '../../../config';
import { targetDefaults } from '../../../lib/calc-defaults';
import { useCalcState } from '../../../model/hooks';
import { CalcShell } from '../CalcShell';
import { FieldGrid } from '../FieldGrid';
import { TargetResults } from './components';

export const TargetCalculator = () => {
  const t = useTranslations('tools.target');
  const { values, field, replace } = useCalcState<TargetValues>(targetDefaults(TARGET.defaults.metric));

  const { min, max, step, suffix } = TARGET.metrics[values.metric];

  return (
    <CalcShell
      inputs={
        <>
          <SegmentedControl<TargetMetric>
            aria-label={t('metric')}
            options={TARGET_METRICS.map((value) => ({ value, label: t(`metrics.${value}`) }))}
            value={values.metric}
            onChange={(next) => replace(targetDefaults(next))}
          />
          <FieldGrid
            fields={[
              { key: 'battles', label: t('fields.battles'), ...TARGET.battlesRange },
              ...TARGET.valueFields.map((key) => ({ key, label: t(`fields.${key}`), min, max, step, suffix }))
            ]}
            values={values}
            onChange={({ key, value }) => field(key)(value)}
          />
        </>
      }
      description={t('description')}
      footer={t(`footer.${values.metric}`)}
      results={<TargetResults values={values} />}
      title={t('title')}
    />
  );
};
