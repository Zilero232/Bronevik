'use client';

import { isNation, NATION_ICONS, TANK_CLASS_ICONS, toRoman } from '@bronevik/icons';
import { Crown, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { percentText, SLIDE_UP } from '@/shared/lib';

import type { GuessRowProps } from './GuessRow.types';

import { GUESS_CELLS } from '../../../config';
import { GuessCell } from '../GuessCell';

import s from './GuessRow.module.scss';

const NO_VALUE = '—';

export const GuessRow = ({ entry }: GuessRowProps) => {
  const t = useTranslations('play.grid');
  const tGame = useTranslations('game');
  const format = useFormatter();

  const { subject, feedback } = entry;
  const { vehicle, avgDamage, winRate } = subject;
  const ClassIcon = TANK_CLASS_ICONS[vehicle.type];
  const NationIcon = isNation(vehicle.nation) ? NATION_ICONS[vehicle.nation] : null;
  const nationName = isNation(vehicle.nation) ? tGame(`nations.${vehicle.nation}`) : vehicle.nation;
  const winRateText = percentText({ format, value: winRate });

  const display = {
    tier: { text: toRoman(vehicle.tier), content: toRoman(vehicle.tier) },
    type: { text: tGame(`classes.${vehicle.type}`), content: <ClassIcon size={20} /> },
    nation: { text: nationName, content: NationIcon ? <NationIcon palette='color' size={24} /> : nationName },
    premium: { text: t(vehicle.isPremium ? 'premium' : 'regular'), content: vehicle.isPremium ? <Crown size={20} /> : <Minus size={20} /> },
    damage: {
      text: avgDamage === null ? NO_VALUE : format.number(avgDamage),
      content: avgDamage === null ? NO_VALUE : format.number(avgDamage, { notation: 'compact', maximumFractionDigits: 1 })
    },
    winRate: { text: winRateText, content: winRateText }
  };

  return (
    <motion.li animate='visible' className={s.root} data-correct={feedback.isCorrect} initial='hidden' variants={SLIDE_UP}>
      <TankIdentity className={s.name} image='contour' tank={vehicleIdentity(vehicle)} />
      <div className={s.cells}>
        {GUESS_CELLS.map((key, index) => (
          <GuessCell key={key} hint={feedback.cells[key]} index={index} label={t(`columns.${key}`)} text={display[key].text}>
            {display[key].content}
          </GuessCell>
        ))}
      </div>
    </motion.li>
  );
};
