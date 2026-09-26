'use client';

import { toRoman } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { percentText } from '@/shared/lib';
import { ClassIcon, NationLabel } from '@/ui-kit';

import type { GuessRowProps } from './GuessRow.types';

import { GUESS_CELLS, GUESS_VIEW } from '../../../config';
import { GuessCell } from '../GuessCell';

import s from './GuessRow.module.scss';

export const GuessRow = ({ entry }: GuessRowProps) => {
  const t = useTranslations('play.grid');
  const tGame = useTranslations('game');
  const format = useFormatter();

  const { subject, feedback } = entry;
  const { vehicle, avgDamage, winRate } = subject;
  const winRateText = percentText({ format, value: winRate });
  const premiumText = t(vehicle.isPremium ? 'premium' : 'regular');

  const display = {
    tier: { text: toRoman(vehicle.tier), content: toRoman(vehicle.tier) },
    type: { text: tGame(`classes.${vehicle.type}`), content: <ClassIcon size={18} tankClass={vehicle.type} /> },
    nation: { text: vehicle.nation, content: <NationLabel nation={vehicle.nation} size={20} withName={false} /> },
    premium: { text: premiumText, content: vehicle.isPremium ? premiumText : GUESS_VIEW.noValue },
    damage: {
      text: avgDamage === null ? GUESS_VIEW.noValue : format.number(avgDamage, 'integer'),
      content: avgDamage === null ? GUESS_VIEW.noValue : format.number(avgDamage, 'compact')
    },
    winRate: { text: winRateText, content: winRateText }
  };

  return (
    <li className={s.root} data-correct={feedback.isCorrect}>
      <TankIdentity className={s.name} image='small' tank={vehicleIdentity(vehicle)} />
      {GUESS_CELLS.map((key) => (
        <GuessCell key={key} hint={feedback.cells[key]} label={t(`columns.${key}`)} text={display[key].text}>
          {display[key].content}
        </GuessCell>
      ))}
    </li>
  );
};
