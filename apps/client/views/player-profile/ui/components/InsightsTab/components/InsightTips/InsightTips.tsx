'use client';

import { TANK_CLASSES } from '@bronevik/icons';
import { AlertTriangle, CheckCircle2, Crosshair, Hourglass, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';

import type { InsightTipsProps } from './InsightTips.types';

import { tipValues } from '../../../../../lib/insight-tip';

import s from './InsightTips.module.scss';

const ICONS = {
  low_damage_tank: Crosshair,
  no_weak_spots: CheckCircle2,
  not_enough_battles: Hourglass,
  weak_class: AlertTriangle,
  weak_tier: Layers
} as const;

export const InsightTips = ({ insights }: InsightTipsProps) => {
  const t = useTranslations('profile.insights.tips');
  const tGame = useTranslations('game.classes');

  return (
    <motion.ul animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      {insights.tips.map((tip) => {
        const Icon = ICONS[tip.code];
        const values = tipValues({ tip, insights });
        const type = TANK_CLASSES.find((value) => value === tip.params.type);

        return (
          <motion.li key={`${tip.code}-${JSON.stringify(tip.params)}`} className={s.tip} data-code={tip.code} variants={STAGGER_ITEM}>
            <span aria-hidden className={s.icon}>
              <Icon size={18} />
            </span>
            <div className={s.text}>
              <strong className={s.title}>{t(`${tip.code}.title`)}</strong>
              <p className={s.body}>
                {t(`${tip.code}.body`, {
                  ...values,
                  type: type ? tGame(type) : String(tip.params.type ?? '')
                })}
              </p>
            </div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};
