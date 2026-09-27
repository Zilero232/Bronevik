'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, KeyFigure, KeyFigures } from '@/ui-kit';

import type { AccuracyCardProps } from './AccuracyCard.types';

import { MY_BATTLE } from '../../../../../config';

import s from './AccuracyCard.module.scss';

export const AccuracyCard = ({ accuracy, rolls }: AccuracyCardProps) => {
  const t = useTranslations('analytics.battle');
  const format = useFormatter();

  return (
    <Card padding='none'>
      <CardHeader title={t('accuracy.title')} />
      <KeyFigures isFramed={false}>
        <KeyFigure label={t('accuracy.shots')} tone='steel' value={accuracy.shotsFired} />
        <KeyFigure format={{ maximumFractionDigits: 1 }} label={t('accuracy.hitRate')} suffix='%' value={accuracy.hitRate} />
        <KeyFigure format={{ maximumFractionDigits: 1 }} label={t('accuracy.penRate')} suffix='%' value={accuracy.penRate} />
      </KeyFigures>
      {rolls.length > 0 ? (
        <ol className={s.rolls}>
          {rolls.map((roll) => (
            <li key={roll.index} className={s.roll} data-sign={Math.sign(roll.deviation)}>
              <span className={s.damage}>{format.number(roll.damage, 'integer')}</span>
              <span className={s.nominal}>{t('rolls.nominal', { nominal: format.number(roll.nominal, 'integer') })}</span>
              <span className={s.deviation}>{format.number(roll.deviation / MY_BATTLE.percentScale, 'signedPercent')}</span>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState isCompact title={t('rolls.empty')} />
      )}
    </Card>
  );
};
