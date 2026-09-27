'use client';

import { toRoman } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { percentText } from '@/shared/lib';

import type { GuessEntry } from '../../context';

import { GUESS_VIEW } from '../../../config';

export const useGuessRow = ({ subject }: Pick<GuessEntry, 'subject'>) => {
  const t = useTranslations('play.grid');
  const tGame = useTranslations('game');
  const format = useFormatter();

  const { vehicle, avgDamage, winRate } = subject;
  const tier = toRoman(vehicle.tier);
  const winRateText = percentText({ format, value: winRate });
  const premiumText = t(vehicle.isPremium ? 'premium' : 'regular');

  return {
    vehicle,
    text: {
      tier,
      type: tGame(`classes.${vehicle.type}`),
      nation: vehicle.nation,
      premium: premiumText,
      damage: avgDamage === null ? GUESS_VIEW.noValue : format.number(avgDamage, 'integer'),
      winRate: winRateText
    },
    short: {
      tier,
      premium: vehicle.isPremium ? premiumText : GUESS_VIEW.noValue,
      damage: avgDamage === null ? GUESS_VIEW.noValue : format.number(avgDamage, 'compact'),
      winRate: winRateText
    }
  };
};
