'use client';

import { useTranslations } from 'next-intl';

import type { LastBattlePlateProps } from './LastBattlePlate.types';

import { OverlayValue } from '../OverlayValue';
import { Plate } from '../Plate';

import s from './LastBattlePlate.module.scss';

export const LastBattlePlate = ({ battle, animate, showTank }: LastBattlePlateProps) => {
  const t = useTranslations('overlay');
  const { tankName, result, damage } = battle;

  return (
    <Plate label={t('metric.lastBattle')}>
      <span className={s.line} data-result={result}>
        <span className={s.result}>{t(`result.${result}`)}</span>
        <OverlayValue animate={animate} kind='count' value={damage} />
      </span>
      {showTank && <span className={s.tank}>{tankName}</span>}
    </Plate>
  );
};
