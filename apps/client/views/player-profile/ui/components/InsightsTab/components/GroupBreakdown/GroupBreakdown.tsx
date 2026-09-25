'use client';

import type { VehicleType } from '@bronevik/schemas';

import { TANK_CLASS_ICONS, TANK_CLASSES, TIERS, toRoman } from '@bronevik/icons';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { signed } from '@/entities/player/stats';
import { EASE_OUT, percentText } from '@/shared/lib';

import type { GroupBreakdownProps } from './GroupBreakdown.types';

import s from './GroupBreakdown.module.scss';

const SCALE_PP = 8;

const CLASS_KEYS = new Set<string>(TANK_CLASSES);

const isClass = (key: string): key is VehicleType => CLASS_KEYS.has(key);

export const GroupBreakdown = ({ kind, groups }: GroupBreakdownProps) => {
  const t = useTranslations('profile.insights');
  const tGame = useTranslations('game.classes');
  const format = useFormatter();

  const label = (key: string) => {
    if (isClass(key)) {
      const Icon = TANK_CLASS_ICONS[key];

      return (
        <>
          <Icon size={15} />
          {tGame(key)}
        </>
      );
    }

    const tier = TIERS.find((value) => String(value) === key);

    return tier ? t('tierLabel', { tier: toRoman(tier) }) : key;
  };

  return (
    <section className={s.root}>
      <h4 className={s.heading}>{t(kind === 'class' ? 'byClass' : 'byTier')}</h4>
      <ul className={s.list}>
        {groups.map(({ key, battles, winRate, winRateDelta }) => {
          const delta = winRateDelta ?? 0;
          const width = `${Math.min(Math.abs(delta) / SCALE_PP, 1) * 50}%`;

          return (
            <li key={key} className={s.row}>
              <span className={s.label}>{label(key)}</span>
              <span aria-hidden className={s.bar}>
                <motion.span
                  animate={{ width }}
                  className={s.fill}
                  data-side={delta >= 0 ? 'up' : 'down'}
                  initial={{ width: 0 }}
                  transition={{ duration: 0.7, ease: EASE_OUT }}
                />
              </span>
              <span className={s.value} data-side={delta >= 0 ? 'up' : 'down'}>
                {signed({ value: delta, digits: 1 })}
              </span>
              <span className={s.meta}>
                {percentText({ format, value: winRate })} · {t('battles', { count: battles })}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
