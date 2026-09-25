'use client';

import { parseISO } from 'date-fns';
import { useFormatter, useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { Card, CardHeader, LineChart, Skeleton } from '@/ui-kit';

import { moeSeries } from '../../../../../lib';
import { useMoeHistory } from '../../../../../model/hooks';
import { SectionNotice } from '../../../SectionNotice';
import { MOE_SERIES_TONES } from './MoeHistory.constants';

import s from './MoeHistory.module.scss';

const CHART_HEIGHT = 300;

export const MoeHistory = () => {
  const t = useTranslations('tank.marks');
  const format = useFormatter();
  const { data: history, isPending, isError } = useMoeHistory();

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader eyebrow={t('historyEyebrow')} title={t('historyTitle')} />
      {match({ points: history ?? [], isPending, isError })
        .with({ isPending: true }, () => <Skeleton height={CHART_HEIGHT} shape='block' width='100%' />)
        .with({ isError: true }, () => <SectionNotice kind='error' />)
        .with({ points: P.union([], [P._]) }, () => <SectionNotice kind='empty' />)
        .otherwise(({ points }) => {
          const { labels, series } = moeSeries(points);

          return (
            <LineChart
              ariaLabel={t('historyTitle')}
              formatValue={(value) => format.number(value, { maximumFractionDigits: 0 })}
              height={CHART_HEIGHT}
              labels={labels.map((date) => format.dateTime(parseISO(date), { day: 'numeric', month: 'short' }))}
              series={series.map(({ key, values }) => ({ id: key, label: t(`plates.${key}`), values, tone: MOE_SERIES_TONES[key] }))}
            />
          );
        })}
    </Card>
  );
};
