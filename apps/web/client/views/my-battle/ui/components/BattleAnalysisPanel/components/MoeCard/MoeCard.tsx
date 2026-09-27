'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, KeyFigure, KeyFigures } from '@/ui-kit';

import type { MoeCardProps } from './MoeCard.types';

import s from './MoeCard.module.scss';

export const MoeCard = ({ moe }: MoeCardProps) => {
  const t = useTranslations('analytics.battle.moe');

  return (
    <Card padding='none'>
      <CardHeader title={t('title')} />
      <KeyFigures isFramed={false}>
        <KeyFigure format={{ maximumFractionDigits: 0 }} label={t('combined')} value={moe.combined} />
        <KeyFigure format={{ maximumFractionDigits: 0 }} label={t('movingAverage')} tone='steel' value={moe.movingAverage} />
        <KeyFigure
          format={{ maximumFractionDigits: 0 }}
          label={t('shortfall')}
          tone={moe.shortfall && moe.shortfall > 0 ? 'below' : 'good'}
          value={moe.shortfall}
        />
        <KeyFigure format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} label={t('percent')} suffix='%' tone='steel' value={moe.percent} />
      </KeyFigures>
      <p className={s.note}>{t('note')}</p>
    </Card>
  );
};
