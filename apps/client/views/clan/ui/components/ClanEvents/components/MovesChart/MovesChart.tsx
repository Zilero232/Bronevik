'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { BarChart, Card, CardBody, CardHeader, ErrorState, KeyFigure, KeyFigures, Skeleton } from '@/ui-kit';

import type { MovesChartProps } from './MovesChart.types';

import { useClanMoves } from '../../../../../model/hooks';

import s from './MovesChart.module.scss';

export const MovesChart = ({ clanId, now }: MovesChartProps) => {
  const t = useTranslations('clans.events.chart');
  const tEvents = useTranslations('clans.events');
  const format = useFormatter();
  const { moves, totals, isPending, isError, isRetrying, refetch } = useClanMoves({ clanId, now });

  return (
    <Card padding='none'>
      <CardHeader meta={t('period')} title={t('title')} />
      <CardBody className={s.body}>
        <KeyFigures isFramed={false}>
          <KeyFigure label={t('joined')} tone='good' value={totals.joined} />
          <KeyFigure label={t('left')} tone='bad' value={totals.left} />
          <KeyFigure format={{ signDisplay: 'exceptZero' }} label={t('net')} tone={totals.net >= 0 ? 'good' : 'bad'} value={totals.net} />
        </KeyFigures>
        {match({ isPending, isError })
          .with({ isPending: true }, () => <Skeleton height={200} shape='block' />)
          .with({ isError: true }, () => <ErrorState isCompact isRetrying={isRetrying} title={tEvents('error')} onRetry={() => void refetch()} />)
          .otherwise(() => (
            <BarChart
              series={[
                { id: 'joined', label: t('joined'), values: moves.map((week) => week.joined), tone: 'good' },
                { id: 'left', label: t('left'), values: moves.map((week) => week.left), tone: 'bad' }
              ]}
              ariaLabel={t('ariaLabel')}
              height={200}
              labels={moves.map(({ week }) => format.dateTime(new Date(`${week}T12:00:00`), { day: 'numeric', month: 'short' }))}
            />
          ))}
      </CardBody>
    </Card>
  );
};
