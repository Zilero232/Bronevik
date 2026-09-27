'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { GoldValues } from './use-gold-calculator.types';

import { GOLD } from '../../../config';
import { creditsToGold, freeXpToGold, goldToCredits, goldToFreeXp } from '../../../lib/gold-conversion';
import { useCalcState } from '../use-calc-state';

export const useGoldCalculator = () => {
  const t = useTranslations('tools.gold');
  const format = useFormatter();
  const { values, field } = useCalcState<GoldValues>({ ...GOLD.defaults });

  const gold = values.gold ?? 0;
  const credits = values.credits ?? 0;
  const xp = values.xp ?? 0;

  return {
    values,
    field,
    credits: goldToCredits(gold),
    creditsHint: t('goldToCreditsHint', { gold: format.number(gold) }),
    conversions: [
      { key: 'goldToXp', label: t('goldToXp'), value: format.number(goldToFreeXp(gold)) },
      { key: 'creditsToGold', label: t('creditsToGold', { credits: format.number(credits) }), value: format.number(creditsToGold(credits)) },
      { key: 'xpToGold', label: t('xpToGold', { xp: format.number(xp) }), value: format.number(freeXpToGold(xp)) }
    ]
  };
};
