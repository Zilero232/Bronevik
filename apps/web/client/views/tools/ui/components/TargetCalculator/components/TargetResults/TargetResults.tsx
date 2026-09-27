'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState, LineChart } from '@/ui-kit';

import type { TargetResultsProps } from '../../TargetCalculator.types';

import { TOOLS_LAYOUT } from '../../../../../config';
import { useTargetResults } from '../../../../../model/hooks';
import { ResultFigure } from '../../../ResultFigure';

export const TargetResults = ({ values }: TargetResultsProps) => {
  const t = useTranslations('tools.target');
  const format = useFormatter();
  const { input, outcome, curve, formatValue } = useTargetResults(values);

  return match(outcome)
    .with({ kind: 'done' }, () => <EmptyState isCompact title={t('done')} />)
    .with({ kind: 'impossible' }, () => <EmptyState isCompact title={t('impossible', { target: formatValue(input.target) })} />)
    .with({ kind: 'battles' }, ({ battles }) => (
      <>
        <ResultFigure
          hint={t('battlesHint', { from: formatValue(input.current), to: formatValue(input.target) })}
          label={t('battles')}
          value={battles}
        />
        <LineChart
          series={[
            { id: 'value', label: t(`metrics.${values.metric}`), values: curve.map(({ value }) => value), tone: 'accent' },
            { id: 'target', label: t('targetLine'), values: curve.map(() => input.target), tone: 'steel' }
          ]}
          ariaLabel={t('curveAria')}
          formatValue={formatValue}
          height={TOOLS_LAYOUT.chartHeight}
          labels={curve.map(({ battle }) => format.number(battle))}
        />
      </>
    ))
    .exhaustive();
};
