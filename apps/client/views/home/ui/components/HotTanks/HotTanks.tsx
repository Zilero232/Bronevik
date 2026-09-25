'use client';

import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { TankCard } from '@/entities/tank/tank';
import { REVEAL_VIEWPORT, STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { MOCK_SERVER, MOCK_TANKS } from '@/shared/mocks';
import { AreaChart, Badge, Card, CardHeader, SectionHeader } from '@/ui-kit';

import s from './HotTanks.module.scss';

const HOT = [...MOCK_TANKS]
  .filter((tank) => tank.tier === 10)
  .sort((a, b) => b.winRate - a.winRate)
  .slice(0, 4);

export const HotTanks = () => {
  const t = useTranslations('home.hotTanks');
  const format = useFormatter();

  const labels = MOCK_SERVER.winRateSeries.map((point) => t('day', { day: point.day + 1 }));
  const series = [
    { id: 'winRate', label: t('serverWinRate'), values: MOCK_SERVER.winRateSeries.map((point) => point.value), tone: 'steel' as const }
  ];

  return (
    <section>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// 03' title={t('title')} />
      <div className={s.layout}>
        <motion.div className={s.grid} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
          {HOT.map((tank) => (
            <motion.div key={tank.id} variants={STAGGER_ITEM}>
              <TankCard tank={tank} />
            </motion.div>
          ))}
        </motion.div>
        <Card className={s.chart} padding='lg'>
          <CardHeader action={<Badge tone='steel'>{t('window')}</Badge>} eyebrow={t('chartEyebrow')} title={t('chartTitle')} />
          <AreaChart
            ariaLabel={t('chartTitle')}
            formatValue={(value) => `${format.number(value, { maximumFractionDigits: 1 })}%`}
            height={280}
            labels={labels}
            series={series}
          />
        </Card>
      </div>
    </section>
  );
};
