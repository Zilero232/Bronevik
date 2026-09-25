'use client';

import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import type { TargetMetric } from '../../../config';
import type { TargetValues } from './TargetCalculator.types';

import { TARGET, TARGET_METRICS } from '../../../config';
import { useCalcState } from '../../../model/hooks';
import { CalcShell, FieldGrid } from '../CalcKit';
import { TargetResults } from './components';

const initialValues = (metric: TargetMetric): TargetValues => ({ metric, battles: TARGET.defaults.battles, ...TARGET.metrics[metric].defaults });

export const TargetCalculator = () => {
  const t = useTranslations('tools.target');
  const { values, field, replace } = useCalcState<TargetValues>(initialValues(TARGET.defaults.metric));

  const { metric } = values;
  const { min, max, step, suffix } = TARGET.metrics[metric];
  const valueFields = (['current', 'expected', 'target'] as const).map((key) => ({ key, label: t(`fields.${key}`), min, max, step, suffix }));

  return (
    <CalcShell
      inputs={
        <>
          <SegmentedControl<TargetMetric>
            aria-label={t('metric')}
            options={TARGET_METRICS.map((value) => ({ value, label: t(`metrics.${value}`) }))}
            value={metric}
            onChange={(next) => replace(initialValues(next))}
          />
          <FieldGrid
            fields={[{ key: 'battles', label: t('fields.battles'), ...TARGET.battlesRange }, ...valueFields]}
            values={values}
            onChange={({ key, value }) => field(key)(value)}
          />
        </>
      }
      description={t('description')}
      footer={t(`footer.${metric}`)}
      results={<TargetResults values={values} />}
      title={t('title')}
    />
  );
};
