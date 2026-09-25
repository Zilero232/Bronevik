'use client';

import { TANK_CLASS_ICONS } from '@bronevik/icons';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter } from 'next-intl';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { STAGGER_ITEM } from '@/shared/lib';

import type { TierCardProps } from './TierCard.types';

import s from './TierCard.module.scss';

export const TierCard = ({ entry }: TierCardProps) => {
  const format = useFormatter();

  const { vehicle, winRateDiff, trend } = entry;
  const ClassIcon = TANK_CLASS_ICONS[vehicle.type];

  return (
    <motion.li layout className={s.root} variants={STAGGER_ITEM}>
      <Link className={s.link} data-premium={vehicle.isPremium} href={ROUTES.tank(vehicle.slug)}>
        <ClassIcon aria-hidden className={s.icon} size={22} strokeWidth={1.6} />
        <span className={s.name}>{vehicle.shortName}</span>
        <span className={s.diff} data-sign={winRateDiff >= 0 ? 'plus' : 'minus'}>
          {format.number(winRateDiff, { maximumFractionDigits: 1, signDisplay: 'exceptZero' })}
        </span>
        <span aria-hidden className={s.trend} data-trend={trend ?? 'flat'}>
          {match(trend)
            .with('up', () => <ArrowUpRight size={14} />)
            .with('down', () => <ArrowDownRight size={14} />)
            .otherwise(() => (
              <ArrowRight size={14} />
            ))}
        </span>
      </Link>
    </motion.li>
  );
};
