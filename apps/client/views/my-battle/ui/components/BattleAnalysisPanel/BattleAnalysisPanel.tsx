'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { PlusTeaser } from '@/features/plus/plus-gate';
import { Card, CardHeader, EmptyState, ErrorState, KeyFigure, KeyFigures, ProgressBar, Skeleton } from '@/ui-kit';

import type { BattleAnalysisPanelProps } from './BattleAnalysisPanel.types';

import { MY_BATTLE } from '../../../config';
import { useBattleAnalysis } from '../../../model/hooks';

import s from './BattleAnalysisPanel.module.scss';

export const BattleAnalysisPanel = ({ id }: BattleAnalysisPanelProps) => {
  const t = useTranslations('analytics.battle');
  const format = useFormatter();
  const { data, needsPlus, isError, isRetrying, retry, efficiency, breakdown, rolls, mistakes } = useBattleAnalysis(id);

  if (needsPlus) {
    return <PlusTeaser feature='battleAnalysis' />;
  }

  if (isError) {
    return <ErrorState isRetrying={isRetrying} onRetry={retry} />;
  }

  if (!data) {
    return <Skeleton height={MY_BATTLE.analysisSkeletonHeight} shape='block' />;
  }

  return (
    <div className={s.root}>
      <Card padding='none'>
        <CardHeader
          meta={data.reference ? t('reference.meta', { count: data.reference.battles }) : t('reference.none')}
          title={t('reference.title')}
        />
        <KeyFigures isFramed={false}>
          {efficiency.map(({ key, value, tone }) => (
            <KeyFigure
              key={key}
              format={{ style: 'percent', maximumFractionDigits: 0 }}
              label={t(`efficiency.${key}`)}
              tone={tone ?? 'steel'}
              value={value}
            />
          ))}
        </KeyFigures>
      </Card>
      <div className={s.grid}>
        <Card padding='none'>
          <CardHeader title={t('breakdown.title')} />
          <ul className={s.bars}>
            {breakdown.map(({ key, value, share }) => (
              <li key={key}>
                <ProgressBar
                  label={t(`breakdown.${key}`)}
                  size='sm'
                  tone={key === 'blocked' ? 'steel' : 'accent'}
                  value={share}
                  valueLabel={format.number(value, 'integer')}
                />
              </li>
            ))}
          </ul>
        </Card>
        <Card padding='none'>
          <CardHeader title={t('moe.title')} />
          <KeyFigures isFramed={false}>
            <KeyFigure format={{ maximumFractionDigits: 0 }} label={t('moe.combined')} value={data.moe.combined} />
            <KeyFigure format={{ maximumFractionDigits: 0 }} label={t('moe.movingAverage')} tone='steel' value={data.moe.movingAverage} />
            <KeyFigure
              format={{ maximumFractionDigits: 0 }}
              label={t('moe.shortfall')}
              tone={data.moe.shortfall && data.moe.shortfall > 0 ? 'below' : 'good'}
              value={data.moe.shortfall}
            />
            <KeyFigure
              format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              label={t('moe.percent')}
              suffix='%'
              tone='steel'
              value={data.moe.percent}
            />
          </KeyFigures>
          <p className={s.note}>{t('moe.note')}</p>
        </Card>
      </div>
      <div className={s.grid}>
        <Card padding='none'>
          <CardHeader title={t('accuracy.title')} />
          <KeyFigures isFramed={false}>
            <KeyFigure label={t('accuracy.shots')} tone='steel' value={data.accuracy.shotsFired} />
            <KeyFigure format={{ maximumFractionDigits: 1 }} label={t('accuracy.hitRate')} suffix='%' value={data.accuracy.hitRate} />
            <KeyFigure format={{ maximumFractionDigits: 1 }} label={t('accuracy.penRate')} suffix='%' value={data.accuracy.penRate} />
          </KeyFigures>
          {rolls.length > 0 ? (
            <ol className={s.rolls}>
              {rolls.map((roll) => (
                <li key={roll.index} className={s.roll} data-sign={Math.sign(roll.deviation)}>
                  <span className={s.rollDamage}>{format.number(roll.damage, 'integer')}</span>
                  <span className={s.rollNominal}>{t('rolls.nominal', { nominal: format.number(roll.nominal, 'integer') })}</span>
                  <span className={s.rollDeviation}>{format.number(roll.deviation / MY_BATTLE.percentScale, 'signedPercent')}</span>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState isCompact title={t('rolls.empty')} />
          )}
        </Card>
        <Card padding='none'>
          <CardHeader title={t('mistakesTitle')} />
          {mistakes.length > 0 ? (
            <ul className={s.mistakes}>
              {mistakes.map((mistake) => (
                <li key={mistake.code} className={s.mistake}>
                  {mistake.text}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState isCompact title={t('noMistakes')} />
          )}
        </Card>
      </div>
    </div>
  );
};
