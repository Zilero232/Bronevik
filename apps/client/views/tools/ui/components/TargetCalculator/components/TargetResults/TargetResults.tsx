'use client';

import { Ban, Trophy } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState, LineChart } from '@/ui-kit';

import type { TargetResultsProps } from '../../TargetCalculator.types';

import { TARGET, TOOLS_LAYOUT } from '../../../../../config';
import { averageCurve, battlesToAverage } from '../../../../../lib/battles-to-target';
import { ResultFigure } from '../../../CalcKit';

export const TargetResults = ({ values }: TargetResultsProps) => {
  const t = useTranslations('tools.target');
  const format = useFormatter();

  const { metric } = values;
  const { digits, suffix } = TARGET.metrics[metric];
  const input = { battles: values.battles ?? 0, current: values.current ?? 0, expected: values.expected ?? 0, target: values.target ?? 0 };
  const outcome = battlesToAverage(input);
  const formatValue = (value: number) => `${format.number(value, { maximumFractionDigits: digits })}${suffix}`;

  return match(outcome)
    .with({ kind: 'done' }, () => <EmptyState description={t('doneHint')} icon={<Trophy size={28} />} title={t('done')} />)
    .with({ kind: 'impossible' }, () => (
      <EmptyState description={t('impossibleHint', { target: formatValue(input.target) })} icon={<Ban size={28} />} title={t('impossible')} />
    ))
    .with({ kind: 'battles' }, ({ battles }) => {
      const curve = averageCurve({ ...input, horizon: Math.ceil(battles * TARGET.curveOvershoot), points: TARGET.curvePoints });

      return (
        <>
          <ResultFigure
            hint={t('battlesHint', { from: formatValue(input.current), to: formatValue(input.target) })}
            label={t('battles')}
            value={battles}
          />
          <LineChart
            withArea
            series={[
              { id: 'value', label: t(`metrics.${metric}`), values: curve.map(({ value }) => value), tone: 'accent' },
              { id: 'target', label: t('targetLine'), values: curve.map(() => input.target), tone: 'steel' }
            ]}
            ariaLabel={t('curveAria')}
            formatValue={formatValue}
            height={TOOLS_LAYOUT.chartHeight}
            labels={curve.map(({ battle }) => format.number(battle))}
          />
        </>
      );
    })
    .exhaustive();
};
