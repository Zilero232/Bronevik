'use client';

import { Check, Lock } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ProgressBar } from '@/ui-kit';

import type { FrontlineResultsProps } from '../../FrontlineCalculator.types';

import { useFrontlinePlan } from '../../../../../model/hooks';
import { ResultFigure } from '../../../ResultFigure';
import { ResultList } from '../../../ResultList';

import s from './FrontlineResults.module.scss';

export const FrontlineResults = ({ values }: FrontlineResultsProps) => {
  const t = useTranslations('tools.frontline');
  const format = useFormatter();
  const { plan, items, reserves, progress, maxLevel } = useFrontlinePlan(values);

  return (
    <>
      <ResultFigure fallback={t('noPace')} hint={t('toMaxHint', { level: maxLevel })} label={t('toMax')} value={plan.battlesToMax} />
      <ProgressBar
        label={t('levelLabel', { level: plan.level, max: maxLevel })}
        tone='accent'
        value={progress * 100}
        valueLabel={format.number(progress, { style: 'percent', maximumFractionDigits: 0 })}
      />
      <ResultList items={items} />
      <div className={s.reserves}>
        <h3 className={s.title}>{t('reservesTitle')}</h3>
        <ul className={s.list}>
          {reserves.map(({ reserve, level, isUnlocked }) => (
            <li key={reserve} className={s.item} data-unlocked={isUnlocked}>
              {isUnlocked ? <Check aria-hidden size={14} /> : <Lock aria-hidden size={14} />}
              <span className={s.name}>{t(`reserves.${reserve}`)}</span>
              <span className={s.level}>{t('reserveLevel', { level })}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
