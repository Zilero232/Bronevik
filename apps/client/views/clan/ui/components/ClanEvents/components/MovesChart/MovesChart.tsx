'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { sumBy } from 'remeda';

import { BarChart, Card, CardBody, CardHeader, Skeleton } from '@/ui-kit';

import type { MovesChartProps } from './MovesChart.types';

import { useClanMoves } from '../../../../../model/hooks';

import s from './MovesChart.module.scss';

export const MovesChart = ({ clanId, now }: MovesChartProps) => {
  const t = useTranslations('clans.events.chart');
  const format = useFormatter();
  const { moves, isPending } = useClanMoves({ clanId, now });

  const joined = sumBy(moves, (week) => week.joined);
  const left = sumBy(moves, (week) => week.left);
  const net = joined - left;

  return (
    <Card padding='md' variant='plate'>
      <CardHeader eyebrow={t('eyebrow')} title={t('title')} />
      <CardBody className={s.body}>
        <dl className={s.totals}>
          <div data-tone='good'>
            <dt>{t('joined')}</dt>
            <dd>{format.number(joined)}</dd>
          </div>
          <div data-tone='bad'>
            <dt>{t('left')}</dt>
            <dd>{format.number(left)}</dd>
          </div>
          <div data-tone={net >= 0 ? 'good' : 'bad'}>
            <dt>{t('net')}</dt>
            <dd>{format.number(net, { signDisplay: 'exceptZero' })}</dd>
          </div>
        </dl>
        {isPending ? (
          <Skeleton height={200} shape='block' />
        ) : (
          <BarChart
            series={[
              { id: 'joined', label: t('joined'), values: moves.map((week) => week.joined), tone: 'good' },
              { id: 'left', label: t('left'), values: moves.map((week) => week.left), tone: 'bad' }
            ]}
            ariaLabel={t('ariaLabel')}
            height={200}
            labels={moves.map(({ week }) => format.dateTime(new Date(`${week}T12:00:00`), { day: 'numeric', month: 'short' }))}
          />
        )}
      </CardBody>
    </Card>
  );
};
