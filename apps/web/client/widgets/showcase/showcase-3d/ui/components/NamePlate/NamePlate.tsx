'use client';

import { TANK_CLASS_ICONS, toRoman } from '@otmetki/icons';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { NamePlateProps } from './NamePlate.types';

import { PLATE_MOTION } from './NamePlate.motion';

import s from './NamePlate.module.scss';

export const NamePlate = ({ tanks, index, onSelect }: NamePlateProps) => {
  const t = useTranslations('showcase');
  const tGame = useTranslations('game');
  const tank = tanks[index];
  const ClassIcon = TANK_CLASS_ICONS[tank.type];

  return (
    <div className={s.root}>
      <AnimatePresence initial={false} mode='wait'>
        <motion.div key={tank.slug} animate='visible' exit='exit' initial='hidden' variants={PLATE_MOTION}>
          <Link className={s.plate} href={ROUTES.tanks.detail(tank.slug)}>
            <span className={s.tier}>{toRoman(tank.tier)}</span>
            <ClassIcon aria-label={tGame(`classes.${tank.type}`)} size={16} variant={tank.isPremium ? 'premium' : 'regular'} />
            <span className={s.name}>{tank.name}</span>
          </Link>
        </motion.div>
      </AnimatePresence>
      <div aria-label={t('rotation')} className={s.dots} role='group'>
        {tanks.map((item, position) => (
          <button
            key={item.slug}
            aria-label={t('select', { name: item.name })}
            aria-pressed={position === index}
            className={s.dot}
            type='button'
            onClick={() => onSelect(position)}
          />
        ))}
      </div>
    </div>
  );
};
