'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { MOCK_PLAYERS, MOCK_SERVER } from '@/shared/mocks';
import { AreaChart, BarChart, LineChart } from '@/ui-kit';

import { DesignBlock } from '../DesignBlock';

import s from './ChartsSection.module.scss';

const [LEADER, CHALLENGER] = MOCK_PLAYERS;

export const ChartsSection = () => {
  const t = useTranslations('design.charts');
  const format = useFormatter();

  const days = LEADER.trend.map((_, index) => t('day', { day: index + 1 }));
  const serverDays = MOCK_SERVER.winRateSeries.map((point) => t('day', { day: point.day + 1 }));
  const battleDays = MOCK_SERVER.battlesSeries.map((point) => t('day', { day: point.day + 1 }));

  return (
    <DesignBlock eyebrow='07' id='charts' title={t('title')}>
      <div className={s.grid}>
        <figure className={s.figure}>
          <figcaption className={s.caption}>{t('line')}</figcaption>
          <LineChart
            series={[
              { id: 'leader', label: LEADER.nickname, values: LEADER.trend, tone: 'unicum' },
              { id: 'challenger', label: CHALLENGER.nickname, values: CHALLENGER.trend, tone: 'great' }
            ]}
            ariaLabel={t('line')}
            labels={days}
          />
        </figure>
        <figure className={s.figure}>
          <figcaption className={s.caption}>{t('area')}</figcaption>
          <AreaChart
            ariaLabel={t('area')}
            formatValue={(value) => `${format.number(value, { maximumFractionDigits: 1 })}%`}
            labels={serverDays}
            series={[{ id: 'server', label: t('server'), values: MOCK_SERVER.winRateSeries.map((point) => point.value) }]}
          />
        </figure>
        <figure className={s.figureWide}>
          <figcaption className={s.caption}>{t('bar')}</figcaption>
          <BarChart
            ariaLabel={t('bar')}
            labels={battleDays}
            series={[{ id: 'battles', label: t('battles'), values: MOCK_SERVER.battlesSeries.map((point) => point.value), tone: 'steel' }]}
          />
        </figure>
      </div>
    </DesignBlock>
  );
};
